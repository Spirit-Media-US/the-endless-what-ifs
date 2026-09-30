/**
 * POST /api/submit — receives a questionnaire submission.
 *
 * Dispatches to two places, independently:
 *   1. Email to the SMP team via Mailgun (notify.spiritmediapublishing.com)
 *   2. Contact upsert + note in GoHighLevel, so answers live on the contact record
 *
 * A failure in either is reported but does not lose the submission: as long as
 * ONE channel succeeds we return ok, and we always log the full payload.
 *
 * Env (set as Pages secrets):
 *   MAILGUN_API_KEY, MAILGUN_NOTIFY_DOMAIN, NOTIFY_TO
 *   GHL_API_TOKEN, GHL_LOCATION_ID   (optional — skipped if absent)
 */

const MAX_BYTES = 256 * 1024;

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BYTES) return json({ ok: false, error: "submission too large" }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "could not read submission" }, 400);
  }

  const answers = body.answers || {};

  // Honeypot — a bot fills every field it sees.
  if (answers._hp) return json({ ok: true, skipped: true });
  delete answers._hp;

  const clientName = String(answers.client_name || body.clientName || body.client || "Unknown").slice(0, 120);
  const email = String(answers.email || "").slice(0, 160);
  const phone = String(answers.phone || "").slice(0, 60);
  const title = String(body.title || "Questionnaire").slice(0, 160);
  const slug = String(body.slug || "form").replace(/[^a-z0-9-]/gi, "").slice(0, 60);

  const submittedAt = new Date().toISOString();
  const text = renderText({ title, clientName, email, phone, slug, submittedAt, answers, page: body.page });
  const html = renderHtml({ title, clientName, email, phone, slug, submittedAt, answers, page: body.page });

  const results = await Promise.allSettled([
    sendEmail(env, { title, clientName, text, html, answers, slug, submittedAt }),
    pushToGhl(env, { clientName, email, phone, title, text, slug }),
  ]);

  const emailOk = results[0].status === "fulfilled" && results[0].value === true;
  const ghlOk = results[1].status === "fulfilled" && results[1].value === true;

  // Always log — this is the last line of defence if both channels fail.
  console.log(JSON.stringify({
    event: "questionnaire_submission", slug, clientName, email,
    emailOk, ghlOk, submittedAt,
    emailErr: results[0].status === "rejected" ? String(results[0].reason) : null,
    ghlErr: results[1].status === "rejected" ? String(results[1].reason) : null,
    answers,
  }));

  if (!emailOk && !ghlOk) {
    return json({ ok: false, error: "we could not deliver your answers" }, 502);
  }
  return json({ ok: true, emailOk, ghlOk });
}

export async function onRequestGet() {
  return json({ ok: true, service: "smp-forms", accepts: "POST" });
}

/* ------------------------------------------------------------------ email */

async function sendEmail(env, { title, clientName, text, html, answers, slug, submittedAt }) {
  const key = env.MAILGUN_API_KEY;
  const domain = env.MAILGUN_NOTIFY_DOMAIN;
  const to = env.NOTIFY_TO;
  if (!key || !domain || !to) throw new Error("mailgun not configured");

  const form = new FormData();
  form.append("from", `SMP Forms <forms@${domain}>`);
  to.split(",").forEach((addr) => form.append("to", addr.trim()));
  form.append("subject", `${title} — ${clientName}`);
  form.append("text", text);
  form.append("html", html);
  if (answers.email) form.append("h:Reply-To", String(answers.email));
  form.append("attachment", new Blob([JSON.stringify({ slug, clientName, submittedAt, answers }, null, 2)],
    { type: "application/json" }), `${slug}-${slugify(clientName)}.json`);

  const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: "POST",
    headers: { Authorization: "Basic " + btoa("api:" + key) },
    body: form,
  });
  if (!res.ok) throw new Error(`mailgun ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return true;
}

/* -------------------------------------------------------------------- ghl */

/**
 * Attach the submission to a GHL contact.
 *
 * Deliberately NOT /contacts/upsert. That endpoint de-duplicates on phone as well
 * as email, so a client entering a shared office number silently matches — and
 * overwrites — an unrelated existing contact. That happened in testing on
 * 2026-08-14: the SMP main number matched a 2022 contact and replaced its name.
 *
 * Identity here is the EMAIL ADDRESS ONLY. On an existing contact we are strictly
 * additive: add a tag and a note, never touch name, phone, source or existing tags.
 */
async function pushToGhl(env, { clientName, email, phone, title, text, slug }) {
  const token = env.GHL_API_TOKEN;
  const locationId = env.GHL_LOCATION_ID;
  if (!token || !locationId) throw new Error("ghl not configured");
  if (!email) throw new Error("no email address to attach the contact to");

  const headers = {
    Authorization: `Bearer ${token}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };
  const wanted = email.trim().toLowerCase();

  // 1. Look the contact up by email, and accept only an exact email match.
  let contactId = null;
  const lookup = await fetch(
    "https://services.leadconnectorhq.com/contacts/?" +
      new URLSearchParams({ locationId, query: wanted, limit: "20" }),
    { headers }
  );
  if (lookup.ok) {
    const found = await lookup.json();
    const hit = (found.contacts || []).find(
      (c) => String(c.email || "").trim().toLowerCase() === wanted
    );
    if (hit) contactId = hit.id;
  }

  if (contactId) {
    // Existing contact — additive only. Tags endpoint appends; it does not replace.
    const tagRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
      method: "POST",
      headers,
      body: JSON.stringify({ tags: [slug, "questionnaire-received"] }),
    });
    if (!tagRes.ok) throw new Error(`ghl tag ${tagRes.status}: ${(await tagRes.text()).slice(0, 200)}`);
  } else {
    // No contact with this email — safe to create one.
    const parts = clientName.trim().split(/\s+/);
    const create = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers,
      body: JSON.stringify({
        locationId,
        email: wanted,
        phone: phone || undefined,
        firstName: parts[0] || clientName,
        lastName: parts.slice(1).join(" ") || undefined,
        tags: [slug, "questionnaire-received"],
        source: "Website Questionnaire",
      }),
    });
    if (create.ok) {
      const made = await create.json();
      contactId = made?.contact?.id || made?.id;
    } else {
      // GHL refuses the create because the PHONE collides with some other contact.
      // We must never attach this person's answers to that contact — it is a
      // different human. Retry without the phone so the email is the only identity.
      const firstErr = (await create.text()).slice(0, 200);
      const retry = await fetch("https://services.leadconnectorhq.com/contacts/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          locationId,
          email: wanted,
          firstName: parts[0] || clientName,
          lastName: parts.slice(1).join(" ") || undefined,
          tags: [slug, "questionnaire-received", "phone-collision-review"],
          source: "Website Questionnaire",
        }),
      });
      if (!retry.ok) {
        throw new Error(`ghl create ${create.status}: ${firstErr} | retry ${retry.status}: ${(await retry.text()).slice(0, 200)}`);
      }
      const made = await retry.json();
      contactId = made?.contact?.id || made?.id;
    }
  }
  if (!contactId) throw new Error("ghl returned no contact id");

  const note = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
    method: "POST",
    headers,
    body: JSON.stringify({ body: `${title}\n\n${text}`.slice(0, 15000) }),
  });
  if (!note.ok) throw new Error(`ghl note ${note.status}: ${(await note.text()).slice(0, 200)}`);
  return true;
}

/* ---------------------------------------------------------------- render */

function label(key) {
  if (key.includes("::")) return key.split("::")[1];
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function grouped(answers) {
  const matrices = {};
  const plain = [];
  Object.keys(answers).forEach((k) => {
    const v = answers[k];
    if (v === "" || v == null || (Array.isArray(v) && !v.length)) return;
    if (k.includes("::")) {
      const [group, row] = k.split("::");
      (matrices[group] = matrices[group] || []).push([row, v]);
    } else {
      plain.push([k, v]);
    }
  });
  return { matrices, plain };
}

function renderText({ title, clientName, email, phone, slug, submittedAt, answers, page }) {
  const { matrices, plain } = grouped(answers);
  const L = [
    title, "=".repeat(title.length), "",
    `Client:    ${clientName}`,
    `Email:     ${email || "—"}`,
    `Phone:     ${phone || "—"}`,
    `Form:      ${slug}`,
    `Submitted: ${submittedAt}`,
    page ? `Page:      ${page}` : "",
    "", "-".repeat(60), "",
  ];
  plain.forEach(([k, v]) => {
    L.push(label(k) + ":");
    L.push("  " + (Array.isArray(v) ? v.join(", ") : String(v)).replace(/\n/g, "\n  "));
    L.push("");
  });
  Object.keys(matrices).forEach((g) => {
    L.push(label(g) + ":");
    matrices[g].forEach(([row, val]) => L.push(`  [${val}] ${row}`));
    L.push("");
  });
  return L.filter((x) => x !== undefined).join("\n");
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function renderHtml({ title, clientName, email, phone, slug, submittedAt, answers, page }) {
  const { matrices, plain } = grouped(answers);
  let h = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;max-width:720px">
  <h2 style="font-family:Georgia,serif;margin:0 0 4px">${esc(title)}</h2>
  <p style="margin:0 0 16px;color:#666;font-size:13px">
    <b>${esc(clientName)}</b> &middot; ${esc(email || "—")} &middot; ${esc(phone || "—")}<br>
    Form <code>${esc(slug)}</code> &middot; ${esc(submittedAt)}${page ? " &middot; " + esc(page) : ""}
  </p>
  <table style="width:100%;border-collapse:collapse">`;
  plain.forEach(([k, v]) => {
    const val = Array.isArray(v) ? v.join("<br>") : esc(v).replace(/\n/g, "<br>");
    h += `<tr>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font-weight:bold;width:34%;vertical-align:top">${esc(label(k))}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;vertical-align:top">${val}</td></tr>`;
  });
  h += `</table>`;
  Object.keys(matrices).forEach((g) => {
    h += `<h3 style="margin:22px 0 6px;font-size:15px">${esc(label(g))}</h3>
      <table style="width:100%;border-collapse:collapse">`;
    matrices[g].forEach(([row, val]) => {
      h += `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${esc(row)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:bold;width:120px">${esc(val)}</td></tr>`;
    });
    h += `</table>`;
  });
  h += `</div>`;
  return h;
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "client";
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

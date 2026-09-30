# [SITE NAME] — Project Status & Knowledge Base
> Last updated: YYYY-MM-DD
> **Claude: Read this file before making any statements about project state or touching any code.**

---

## Stack
- **Framework:** Astro v5 + Tailwind CSS
- **CMS:** Sanity (projectId: `REPLACE_PROJECT_ID`, dataset: `production`)
- **Hosting:** Netlify (free plan, public repo)
- **DNS/Proxy:** Cloudflare (proxy status: PENDING — confirm after domain connect)
- **Email/CRM:** GoHighLevel (GHL)
- **Media:** Sanity CDN for images. YouTube for video. R2 for audio (if needed).
- **Repo:** `Spirit-Media-US/REPLACE_REPO_NAME`
- **Studio:** https://REPLACE_STUDIO_HOST.sanity.studio

---

## Sanity Document Counts
| Type | Count | Notes |
|---|---|---|
| siteSettings | 0 | Not yet populated |
| testimonial | 0 | |
| teamMember | 0 | |
| blogPost | 0 | |
| book | 0 | |

> Update counts by running:
> `node -e "const {createClient}=require('@sanity/client');const c=createClient({projectId:'REPLACE_PROJECT_ID',dataset:'production',useCdn:false,apiVersion:'2024-01-01'});['siteSettings','testimonial','teamMember','blogPost'].forEach(async t=>console.log(t,await c.fetch('count(*[_type==\"'+t+'\"])')))"` 

---

## Pages — Sanity Integration Status
| Page | Fetches from Sanity | Still hardcoded |
|---|---|---|
| index.astro | — | Everything (not started) |
| about.astro | — | Everything (not started) |
| contact.astro | — | Everything (not started) |

---

## Components — Sanity Integration Status
| Component | Fetches from Sanity | Notes |
|---|---|---|
| Footer.astro | — | phone, email, socials not yet wired |
| Navbar.astro | — | Logo hardcoded intentionally |

---

## public/ Directory — What's There & Why
- `favicon.svg` — correct, stays here
- `robots.txt` — correct, stays here
- `googleXXXXXXXX.html` — Google verification, stays here (add when verified)

---

## Remaining Tasks
| Task | Priority | Notes |
|---|---|---|
| Sanity → Netlify webhook | HIGH | Netlify build hook URL → Sanity API webhook. No code needed. |
| Populate siteSettings in Sanity | HIGH | phone, email, socials |
| Connect custom domain | HIGH | Netlify → Domains → add domain |
| Cloudflare proxy | HIGH | Enable after domain connected and SSL verified |
| .env.example — document all vars | MEDIUM | |
| DMARC record | MEDIUM | Add after email sending domain confirmed |
| UptimeRobot monitoring | MEDIUM | Add after site is live |

---

## Completed & Confirmed
- [ ] Repo created under Spirit-Media-US org
- [ ] Netlify site created and deploying
- [ ] Sanity project created and studio deployed
- [ ] Custom domain connected
- [ ] Cloudflare proxy active
- [ ] siteSettings populated in Sanity
- [ ] Footer socials wired from Sanity
- [ ] Sanity → Netlify webhook active
- [ ] UptimeRobot monitoring active
- [ ] DMARC record added

---

## Key Rules (always apply to all Spirit Media sites)
- Never store video/audio in Git or public/ — YouTube for video, R2 for audio
- Never run pixel manipulation on images without committing originals to Git first
- Cloudflare CNAME records for mail subdomains must be DNS-only (grey cloud), not proxied
- Netlify import always defaults to personal account — switch to Spirit-Media-US org manually
- Use `astro:page-load` not `pageshow` for post-navigation scripts (ClientRouter intercepts)
- IntersectionObserver threshold must be low (0.04) with fallback timeout
- One session = one push = one Netlify build credit
- Always `npm run dev` and preview locally before pushing
- Update this file at the end of every session before the final push

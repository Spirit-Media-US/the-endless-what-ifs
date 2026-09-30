# The Endless What Ifs — Claire Rose Goodwin

> **CLAUDE.md belongs in version control — NEVER add it to .gitignore.**

This site: The Endless What Ifs | Repo: github.com/Spirit-Media-US/the-endless-what-ifs | Domain: TBD (recommended theendlesswhatifs.com) | Sanity ID: yu45ypx3 | CF Pages: the-endless-what-ifs

**Build protocol:** /home/deploy/bin/tools-api/pipelines/newsite/CLAUDE.md (registry id 342feaf8)
**Project doc:** "The Endless What Ifs — Author Site Build" (Google Doc 1LrVowZFa1BgTx91fta6GMMhv1r55nYVnhU5eqY1f5Cg)
**Design source of truth:** the approved mood board — assets.spiritmediapublishing.com/_preview/the-endless-what-ifs.html

## What the site is (Kevin, 2026-09-30)
The whole site is about Claire. It (1) shares Claire's story, (2) showcases Haley's book, (3) shares suicide-prevention resources.

## Dev Commands
- `npm run dev` — local preview
- `npm run build` — Studio + production build to dist/
- `git pushd origin dev` — push + upload dist to CF Pages (dev.the-endless-what-ifs.pages.dev)

## Architecture
| Route | Template | Content |
|---|---|---|
| `/` | Home = Claire's story | `home` singleton (hero, handwritten sign-off, story chapters, featured performance) |
| `/work/` | Her work index | programmes + performances, stages, photographs |
| `/work/<programme>/` | Programme (recital) | `programme` + its performances in order |
| `/work/<performance>/` | Performance | `performance` (YouTube facade, sung text + translation, prev/next in programme) |
| `/work/stages/` | Timeline | `stage` |
| `/work/photographs/` | Gallery | `photo` grouped by set |
| `/journals/`, `/journals/<slug>/` | Journal index / entry (paper surface) | `journalEntry` (transcription + scanned pages) |
| `/book/` | Book | `book` singleton — buy buttons render only for formats with retailer links |
| `/help/` | Resources | `resource` grouped by audience |
| `/your-story/`, `/haley/` | Forms | POST `/api/submit` (functions/api/submit.js, copied from smp-forms) → Mailgun + GHL tag |
| `/privacy/`, `/thank-you/` | Utility | `page` |

## House rules — design
- Palette/typography tokens live in `src/styles/global.css` and were MEASURED from Claire's photographs. Don't add colors.
- **Italic means Claire is speaking.** Use italic only for her own words (journals, her quotes). Haley's words are upright with a gold rule.
- Journals are the one light (paper) surface. Everything else is the warm near-black ground.
- 988 band is sticky on every page (`CareBand.astro`). Never remove it; it is a HARD row on the score sheet.
- Safe messaging: no method detail anywhere. Journal entries after August 2024 stay OFF the site (Nov 22 page describes self-harm).
- Video: YouTube only, via the click-to-load facade in `Video.astro`. No `<video>` tags.

## Sanity Content Audit
| Page | Block | Where |
|---|---|---|
| All | Crisis band headline/text, footer dedication, site title/description, share image | Sanity `siteSettings` |
| All | Nav, footer link structure, copyright bar | Static (structural) |
| Home | Hero photo + Haley's caption, name, dates, line | Sanity `home` |
| Home | Handwritten sign-off image | Sanity `home.signoff` |
| Home | Story chapters (eyebrow, heading, body, image, Claire quote) | Sanity `home.chapters[]` |
| Home | Featured performance | Sanity `home.featuredPerformance` |
| Home | Four "doors" | Static (structural navigation) |
| Work | Programmes, performances, order, texts, translations, YouTube IDs, posters, visibility | Sanity `programme`, `performance` |
| Work | Stages timeline | Sanity `stage` (ordered by `order`) |
| Work | Photographs | Sanity `photo` |
| Work | Page intro | Static |
| Journals | Entries: date, kind, series, transcription, scans, excerpt | Sanity `journalEntry` |
| Journals | Index intro | Static |
| Book | Title, subtitle, cover, tagline, description, Haley's why, excerpt, release, formats/ISBN/retailers | Sanity `book` |
| Haley | Name, headshot, bios, speaking topics, press downloads | Sanity `author` |
| Help | Resources (name, audience, call/text/url, order) | Sanity `resource` |
| Help | 988 call/text/chat buttons, page intro | Static (duty-of-care, must not be editable away) |
| Utility | Privacy, thank-you | Sanity `page` |
| Tributes | FSU students' notes, service remembrances | Sanity `tribute` — schema ready, NOT yet loaded or rendered (names to blur first) |

Initial content load: `/home/deploy/projects/endless-what-ifs-site/load/load_content.py` (fixed _ids, createOrReplace). **Never re-run it once Haley is editing** — it overwrites her changes.

## Status — as of 2026-09-30
### Done
- Infrastructure (repo, Sanity yu45ypx3, CF Pages), fonts self-hosted on R2
- All templates built from the mood board; 26 pages; content model + Studio structure
- Real content loaded: story (from memorial program), 7 recital performances with poster frames, 8 stages, 8 photos, 6 sample journal entries with scans, book, Haley, 9 resources

### Pending
- YouTube uploads for the 7 recital videos (whose channel?) → set `youtubeId`
- Sung texts + translations (only Zdes khorosho translation is loaded; source from public-domain texts)
- Composer for Villanelle and Come Down Angels; confirm programme order and pianist credit
- Duet (IMG_1629) + masterclass (IMG_7482): venue/date from Haley; not loaded
- Tributes: blur student names on the sticky-note photos, then add a "How she's remembered" section
- Haley to pick the public journal entries (May–Aug 2024 only)
- Book: ISBNs, formats, retailer links, description, excerpt (not Chapter 1)
- Forms: set MAILGUN_* / NOTIFY_TO / GHL_* env on the CF Pages project, test a real submission
- Sanity → CF deploy hook webhook; CORS for the live domain; domain + CF zone settings

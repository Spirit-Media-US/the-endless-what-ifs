# Spirit Media Site Template

> **Claude:** Always read `PROJECT-STATUS.md` at the start of every session before touching any code or making any claims about project state.

Astro + Tailwind + Sanity CMS starter for all Spirit Media Network sites.

## New Site Checklist

### 1. Repo setup
- [ ] Duplicate this repo under `Spirit-Media-US` org
- [ ] Rename to `site-name` (e.g. `artsbyjustin`, `the-kohler-group`)
- [ ] Add `SANITY_AUTH_TOKEN` secret in GitHub repo settings

### 2. Sanity
- [ ] Create new Sanity project at sanity.io/manage
- [ ] Update `src/lib/sanity.ts` → replace `REPLACE_PROJECT_ID`
- [ ] Update `sanity.config.ts` → replace project ID and studio hostname
- [ ] Define schemas in `schemaTypes/`

### 3. Netlify
- [ ] Import repo in Netlify → assign to `Spirit-Media-US` org
- [ ] Set build command: `npm run build`, publish dir: `dist`
- [ ] Enable Deploy Previews and Branch deploys in site settings
- [ ] Add custom domain + enable Cloudflare proxy
- [ ] Add Sanity build hook (Sanity → API → Webhooks → POST to Netlify build hook URL)

### 4. Code
- [ ] Update `astro.config.mjs` → replace `REPLACE_WITH_DOMAIN`
- [ ] Update `netlify.toml` → replace `REPLACE_DOMAIN`
- [ ] Replace design tokens in `src/styles/global.css`
- [ ] Build out pages using Sanity data via `src/lib/sanity.ts`

## Stack
- **Astro** + Vite
- **Tailwind CSS** v4 (via `@tailwindcss/vite`)
- **Sanity** CMS (content), studio auto-deploys on push
- **Netlify** hosting (branch previews enabled)
- **Cloudflare** DNS + proxy

## Dev
```bash
npm install
npm run dev        # localhost:4321
npm run build      # production build to dist/
```

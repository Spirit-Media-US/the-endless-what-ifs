# Spirit Media Template

> **CLAUDE.md belongs in version control — NEVER add it to .gitignore. This file is the shared source of truth for all developers and all Claude Code sessions.**

This site: Spirit Media Template | Repo: github.com/Spirit-Media-US/spirit-media-template | Domain: TBD | Sanity ID: TBD

**Migration protocol:** /home/deploy/bin/tools-api/pipelines/migration/CLAUDE.md

## Dev Commands

- `npm run dev` -- local preview
- `npm run build` -- production build to dist/

## Mandatory -- Before Starting Work
Always start Claude sessions from inside this directory:
```
cd /srv/sites/spirit-media-template && claude
```
Running Claude from ~/ or ~/Sites/ bypasses this project's CLAUDE.md. A pre-edit hook enforces this, but following the workflow prevents warnings and ensures all project rules are loaded.

Then run: `git checkout dev && git pull origin dev`

## Stack

- Astro 5 + Tailwind CSS v4
- Sanity Studio (to be configured per new site)

## Purpose

This is the **template repo** used as the starting point for all new SMP client sites. It contains the standard Astro + Tailwind + Sanity scaffold with Lefthook hooks, Biome config, and .gitignore pre-configured.

When creating a new site, clone this template and customize the CLAUDE.md with the site-specific details (domain, Sanity ID, port, etc.).

## Status -- as of 2026-04-08

### Completed
- Astro 5 + Tailwind v4 scaffold
- Lefthook hooks (block-main-push, large-file blocker, secret scanner)
- Biome config
- Standard .gitignore (blocks media, .env, node_modules)
- Template CLAUDE.md ready for customization

### Still Pending
- None -- this is a template, not a live site

## Rules

- All work goes to the **dev** branch -- never push directly to main
- Only merge dev to main when Kevin says "push to main"
- Every site cloned from this template must have a customized CLAUDE.md
- public/_headers must include CSP and security headers
- 404 page should have noindex meta tag

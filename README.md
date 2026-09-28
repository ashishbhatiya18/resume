# Ashish Bhatiya — Resume

Resume content lives in [`resume.json`](resume.json), following the [JSON Resume](https://jsonresume.org) schema. A small local theme (`theme/`) renders it as a single-column, ATS-friendly PDF matching the original CV's color/typography (red accent, IBM Plex Serif).

**Latest PDF (always up to date):** https://github.com/ashishbhatiya18/resume/releases/download/latest/Ashish_Bhatiya-Resume.pdf

## Edit the resume

Open `resume.json` and edit the content directly — no need to touch HTML/CSS. Sections map to the [JSON Resume schema](https://jsonresume.org/schema/): `basics`, `work`, `projects`, `education`, `skills`, `certificates`.

## Build locally

```bash
npm install
npm run build        # writes resume.html and resume.pdf
```

Or individually:

```bash
npm run build:html   # resume.json -> resume.html
npm run build:pdf    # resume.html -> resume.pdf (via headless Chrome)
```

## CI

`.github/workflows/build.yml` runs on every push/PR: it validates `resume.json` against the JSON Resume schema and builds `resume.pdf`, then renames it to `Ashish_Bhatiya-Resume.pdf`. On every push to `main`, it also republishes that file to the permanent [`latest` GitHub Release](https://github.com/ashishbhatiya18/resume/releases/tag/latest) — a stable, public, no-login-required link. It's also uploaded as a workflow artifact named **Ashish_Bhatiya-Resume** on every run (PRs included), though that copy expires after 90 days and requires GitHub login to download.

## Repo layout

- `resume.json` — the single source of truth for content
- `theme/` — minimal local JSON Resume theme (plain HTML/CSS, no external deps)
- `scripts/html-to-pdf.js` — Puppeteer script that prints the themed HTML to PDF
- `.github/workflows/build.yml` — CI pipeline producing the `resume.pdf` artifact and release

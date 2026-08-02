# personal-cv

Static Astro + UnoCSS portfolio site. Built and deployed to GitHub Pages.

## Architecture

The Portfolio is a single-page static site. Astro renders content collections (experience, titles, projects, skills) into HTML at build time. UnoCSS provides utility classes and web fonts. There is no client-side JavaScript or hydration — every page is fully static.

## Tech Stack

- **Astro** — static site generator and content collections
- **UnoCSS** — atomic CSS engine with Wind CSS preset and web fonts
- **TypeScript** — strict mode, Astro-aware checking

## Commands

| Command        | Action                                      |
| :------------- | :------------------------------------------ |
| `pnpm install` | Install dependencies                        |
| `pnpm dev`     | Start local dev server                      |
| `pnpm build`   | Build production site to `./dist/`          |
| `pnpm preview` | Preview built site locally                  |
| `pnpm check`   | Run Astro-aware type and content validation |
| `pnpm lint`    | Run ESLint with auto-fix                    |

## Content

Experience, titles, projects, and skills are stored as JSON and Markdown in `src/content/`. Edit those files to update the CV. The content schemas are defined in `src/content.config.ts`.

## Deployment

Pushes to `main` trigger a GitHub Pages build via `.github/workflows/deploy.yml`. The site is served from `dist/`.

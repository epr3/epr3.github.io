# epr3.github.io

Domain language and decisions for this personal CV website.

## Language

- **Portfolio** — The public one-page CV site at `https://epr3.github.io`. It is static-first, built with Astro and deployed to GitHub Pages.
- **Experience** — The primary section of the portfolio. A list of roles grouped by company, with each role's dates and the projects worked on while in that role.
- **Project** — A piece of work within an experience entry. Contains a Markdown description and a tech stack.
- **Tech stack** — The technologies used on a project. Displayed as a small inline `Tech stack: ...` line under the project description.
- **Skill** — A single technology or tool (e.g., `react`, `nuxt`, `docker`). Stored as JSON and referenced by projects.
- **Reference design** — The static HTML/CSS implementation (`design-reference.html`) that serves as the canonical visual target for the portfolio.
- **Dark palette** — The reference color system: `background` `#000000`, `surface` `#101415`, `on-surface` `#e0e3e5`, `primary` `#1d4ed8`, `secondary` `#bec6e0`, and the related surface/primary/secondary tokens.
- **JetBrains Mono** — The single font used across the portfolio, matching the reference design.

## Decisions

- `docs/adr/2025-06-10-terminal-cobalt-design.md` — Apply the reference design's visual direction while keeping the Astro + UnoCSS build.

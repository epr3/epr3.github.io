# epr3.github.io

Domain language and decisions for this personal CV website.

## Language

- **Portfolio** — The public one-page CV site at `https://epr3.github.io`, built with static Astro + UnoCSS and deployed to GitHub Pages; it has no client-rendered features.
- **Experience** — The primary Portfolio section: Companies, their roles, and their Projects listed in descending recency/order.
- **Company** — An employer grouping one or more Roles and all Projects completed for that employer in the Portfolio.
- **Role** — A named position held at one Company for a recorded date range.
  _Avoid_: Title.
- **Experience projection** — The typed, ordered Portfolio-ready view of Experience, its Companies, roles, Projects, and their Tech stacks.
- **Project** — A piece of work for one Company in Experience, rather than for an individual role; it has a Tech stack and may include a description and named Responsibility sections.
- **Responsibility section** — A titled group of bullet points that records work performed on a Project.
- **Tech stack** — The technologies used on a project, displayed as an inline `Tech stack:` label followed by individual bracketed Skill tokens.
- **Section marker** — A cobalt, numbered, uppercase bracketed label that introduces a major Portfolio section.
- **Skill** — A single technology or tool (e.g., `react`, `nuxt`, `docker`). Stored as JSON and referenced by projects.
- **Reference design** — The static HTML/CSS implementation (`design-reference.html`) that serves as the canonical visual target for the portfolio.
- **Dark palette** — The reference color system: `background` `#000000`, `surface` `#101415`, `on-surface` `#e0e3e5`, `primary` `#1d4ed8`, `secondary` `#bec6e0`, and the related surface/primary/secondary tokens.
- **JetBrains Mono** — The single font used across the portfolio, matching the reference design.

## Relationships

- A **Company** groups one or more **Roles**.
- A **Company** owns zero or more **Projects**.
- A **Project** has zero or more **Skills** in its **Tech stack**.

## Decisions

- `docs/adr/2025-06-10-terminal-cobalt-design.md` — Apply the reference design's visual direction while keeping the Astro + UnoCSS build.

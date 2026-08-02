# Adopt reference portfolio design

The portfolio redesign (handover bundle) calls for a high-fidelity, TUI-inspired, minimalist personal site. The reference static implementation (`design-reference.html`) provides the exact color palette, typography, and layout. We apply that reference design to the existing Astro + UnoCSS build rather than switching to the handover's HTML/Tailwind example. The resulting site uses a dark Material-style palette (`background` `#000000`, `surface` `#101415`, `primary` `#1d4ed8`, `on-surface` `#e0e3e5`, `secondary` `#bec6e0`), JetBrains Mono, a compact hero, a single Experience list, inline "Tech stack: ..." lines, and a footer with contact links.

## Considered options

- **Switch to HTML/Tailwind** as the handover suggests. Rejected: the existing Astro content pipeline (experience JSON, project Markdown, skills JSON) is working and the change is primarily visual.
- **Keep the current yellow-accent + Inter/Passion One/Inconsolata look**. Rejected: the handover's reference design is the explicit visual target.
- **Apply only the color palette while keeping the current layout**. Rejected: the reference layout (compact hero, inline tech stack lines, footer links) is part of the design brief.

## Consequences

- UnoCSS config must add JetBrains Mono and the full reference color palette.
- Current yellow #FFF500 accent, `cta.svg`, circular icon buttons, and shadow cards are removed.
- Project skills move from Frontend/Backend/DevOps card groups to a small inline "Tech stack: ..." text line.
- Hero is reduced to a compact header with title "Senior Frontend Engineer." and GitHub/LinkedIn/Resume as inline text links.
- A footer is added with Email, LinkedIn, Bluesky, and GitHub links.
- Experience keeps all existing companies (FlowX.AI, Cognizant Softvision, Team Extension, Elsaco, Internship).
- The reference file is saved at `.scratch/terminal-cobalt-design/design-reference.html`.

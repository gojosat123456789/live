# Umair Akbar Portfolio

A responsive, multi-page portfolio built with Vite, TypeScript, and CSS.

## Run locally

1. Install Node.js if it is not already installed.
2. In this folder, run `npm install`.
3. Start the development server with `npm run dev`.
4. Open the local URL printed by Vite. The home page and all seven linked pages are available.
5. Run `npm run build` to type-check and create the production site in `dist`.

## Pages

- `index.html` — Home and featured sections
- `about.html` — About and approach
- `skills.html` — Editable technology list
- `projects.html` — Filterable concept gallery and keyboard-accessible detail dialog
- `services.html` — Service overview
- `experience.html` — Experience and education placeholders
- `contact.html` — Validated form with WhatsApp contact details
- `resume.html` — Resume overview and optional CV download

## Personal details and assets

- The supplied portrait is `public/umair-akbar.jpg`.
- A mouse/touch-reactive Vanta Birds background loads Three.js r134 and Vanta Birds from their CDNs. A dark gradient stays in place if the CDNs are unavailable; the animated effect is skipped when reduced motion is requested.
- The owner's phone number and WhatsApp number are configured near the top of `src/main.ts`.
- Confirm the suggested skill list in `src/main.ts` before publishing; remove skills that do not reflect your experience.
- Education, professional history, social profiles, and client work remain unfilled until verified details are provided.
- Projects currently shown are visual concepts, not completed client projects. Replace their entries and artwork in `src/main.ts` with real work and URLs when available.
- To enable the CV download, add the owner's real PDF at `public/assets/documents/umair-akbar-cv.pdf`.

## Contact form

The contact form validates fields in the browser but has no backend or email provider configured. It does not claim to send or store form submissions. Use the WhatsApp and phone links, or configure a trusted service before enabling email delivery.

## Implementation notes

The existing Vite/TypeScript setup is retained. `vite.config.ts` includes all eight HTML pages in the production build. Styling and shared page content are in `src/style.css` and `src/main.ts`.

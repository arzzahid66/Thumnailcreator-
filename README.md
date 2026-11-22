# Thumb Studio — Free Thumbnail Creator

A professional, browser-based thumbnail creator. Users pick a template, edit
text / shapes / photos on a canvas, and download a PNG or JPG — **100% free,
no watermark, no sign-up**. All editing happens client-side; designs never
leave the user's browser.

Built with **Vite + React** (plain JavaScript, no heavy UI libraries).

## Features

- 8 templates: Gaming, Tutorial, Vlog, Tech Review, Podcast, Fitness, Finance, Minimal
- Canvas sizes: YouTube 1280×720, Full HD 1920×1080, Square 1080×1080, Portrait 1080×1350
- Drag-to-move layers, click-to-select, layers panel with reorder
- Text: Anton / Bebas Neue / Montserrat / Inter fonts, color, outline (stroke), shadow
- Shapes (rect / circle / triangle), badges, emoji stickers
- Backgrounds: gradients (angle + 2 colors), solid colors, uploaded photo as background
- Photo upload as a layer, duplicate / delete / rotate / opacity
- Undo / redo, one-click PNG & JPG download at full resolution

## Setup & development

```bash
npm install     # install dependencies
npm run dev     # local dev server (http://localhost:5173)
npm run build   # production build -> dist/
npm run preview # preview the production build locally
```

Requires Node.js 18+ (20 LTS recommended).

## Project structure

```
src/
  main.jsx                 entry point
  App.jsx                  editor state, history, layout
  components/
    TopBar.jsx             brand, size picker, undo/redo, download
    TemplatesPanel.jsx     template grid
    Toolbar.jsx            add elements + background controls
    CanvasEditor.jsx       canvas, selection, drag-to-move
    PropertiesPanel.jsx    per-layer editing controls
    LayersPanel.jsx        layer list / reorder / set-as-background
    AdSlot.jsx             monetization placeholder (renders nothing when off)
  data/templates.js        8 templates, size presets, fonts, stickers
  lib/render.js            canvas drawing + export (single source of truth)
  lib/history.js           undo/redo snapshots
  config/monetization.js   AdSense + premium flags (placeholders only)
  styles/app.css
.github/workflows/deploy.yml   GitHub Pages deploy on push to main
```

## Deploy free on GitHub Pages

1. Create a new GitHub repository and push this project to the `main` branch:
   ```bash
   git init && git add . && git commit -m "Thumb Studio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` now builds and deploys automatically via
   `.github/workflows/deploy.yml`. Your site goes live at
   `https://<your-username>.github.io/<repo>/`.

`vite.config.js` uses `base: './'`, so the build also works on Netlify,
Vercel, Cloudflare Pages, or any static host — just run `npm run build`
and publish the `dist/` folder.

## Monetization roadmap (not implemented yet)

The structure is ready; no payments or real ads are wired up.

1. **Ads first (lowest friction):** apply for Google AdSense, then in
   `src/config/monetization.js` set `adsEnabled: true`, fill
   `adsenseClientId` + slot IDs, add the AdSense script to `index.html`,
   and implement the `<ins>` unit inside `src/components/AdSlot.jsx`
   (slots already placed: header, sidebar, footer).
2. **Premium tier later:** `monetization.premiumEnabled` flag + planned
   features (4K export, premium templates, cloud saves, brand kits) are
   stubbed in the same config. Payments must go through a hosted checkout
   (e.g. Stripe Payment Links / Lemon Squeezy) or a small backend —
   never put secret keys in this client bundle.
3. **Keep the free tier genuinely free** (editor + full-res export, no
   watermark) — that is the growth engine; monetize extras, not basics.

## License

MIT — free to use and modify.

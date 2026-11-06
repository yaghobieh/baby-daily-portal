# BabyDaily Portal & Web Landing

> Official web portal and landing page for **BabyDaily** (Daily routine, feeding, sleep, and diaper tracker for babies).

Built with **React 18**, **Vite**, **BearUI** (`@forgedevstack/bear`), **Synapse** (`@forgedevstack/synapse`), **Tailwind CSS**, and **DeepSeek AI Assistant**.

---

## Features

- **Store Downloads**: Direct Google Play Store Android install link and iOS App Store badge (Coming Soon).
- **Interactive DeepSeek AI Assistant**: Built-in chat assistant specialized exclusively in BabyDaily routine tracking, feeding guidance, sleep timers, and caregiver synchronization.
- **Material 3 Pastel Aesthetic**: Soft coral (`#FF7A7A`), mint (`#48C78E`), lavender (`#8C7AE6`), and sunny amber (`#FFAA00`).
- **High Performance**: Sub-second load times, lightweight client-side routing, and zero tracking scripts.
- **Vercel Optimized**: Ready out-of-the-box for custom domain (`babydailt.app`) deployment with rewrite rules.

---

## Project Structure

Following the Forge & BearUI architectural standard:

```
src/
├── assets/          # Logo, brand assets, and mobile screenshots
├── components/      # Reusable UI widgets (Navbar, Footer, StoreButtons, ChatWidget)
├── config/          # BearUI theme overrides and pastel color variants
├── constants/       # Constants: numbers (0-1000), generals (EMPTY_STRING), routes, strings, api
├── hooks/           # useApiCall hook
├── pages/           # Pages (Name/Name.tsx, Name.types.ts, Name.utils.ts, Name.consts.ts, index.ts)
│   ├── Home/
│   ├── Privacy/
│   └── Terms/
├── shims/           # Lightweight shims for anvil & vue
├── store/           # Synapse state management
│   └── modules/     # chat.reducers.ts, chat.apis.ts, chat.utils.ts, chat.consts.ts
├── styles/          # Tailwind and global styles
└── utils/           # Helper functions (cn, date formatting)
```

---

## Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Compile TypeScript and build for production
npm run build
```

---

## Deployment (Vercel)

Target domain: `babydailt.app`

Vercel configuration is defined in `vercel.json` with automatic SPA rewrites to `/index.html`.

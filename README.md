# StangaNetLib Documentation

Official static documentation site for the **[StangaNet](https://github.com/StangaNet)** suite of .NET libraries.

Published at **[https://stanganet.github.io](https://stanganet.github.io)** (`base: '/'`).

## About the project

- **Libraries** in the suite are written **entirely by hand** — design, implementation, and packaging — by [Enrico Stangherlin](https://github.com/stangherlin-enrico/).
- **This documentation website** was built partly independently and partly with the assistance of various AI tools (layout and implementation helpers).
- **API documentation content and updates** are produced **via AI** that inspects the public GitHub repositories and aligns the structured docs data with the source.

Author portfolio: [https://stangherlin-enrico.github.io/](https://stangherlin-enrico.github.io/)

## Features

- Homepage, About, and structured API reference (`/docs`)
- Light / dark theme (`localStorage`)
- **i18n**: English (`/en/...`) and Italian (`/it/...`) for UI and documentation prose; code identifiers stay English
- Copyable code snippets with lightweight C# / XML highlighting
- SPA-friendly `404.html` for GitHub Pages

## Tech stack

- React 18 + TypeScript + Vite
- React Router
- Tailwind CSS v4 (`@tailwindcss/vite`)
- lucide-react

## Getting started

```bash
npm install
npm run dev
```

App: `http://localhost:5173` → redirects to `/en` or `/it` from browser/storage preference.

```bash
npm run build
```

Output: `dist/`.

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirect to `/en` or `/it` |
| `/:lang` | Homepage |
| `/:lang/about` | About |
| `/:lang/docs` | Library index |
| `/:lang/docs/:library` | Library overview |
| `/:lang/docs/:library/:type` | Type documentation |

Legacy paths (`/docs`, `/about`, `/core`) redirect under the detected locale.

## Project structure

```text
src/
  components/docs/     # primitives, member-lists
  components/layout/   # DocsLayout
  components/ui/
  data/docs/           # core, contentflow, types (API source of truth)
  data/docs.ts         # barrel
  i18n/                # locales, messages (en, it), provider
  pages/
  styles/
  theme/
  utils/
  App.tsx
  main.tsx
```

## Internationalization

- UI strings: `src/i18n/messages/en.ts` and `it.ts`
- Locale in the URL prefix; preference also stored as `stanganet-locale`
- Translated: UI + API prose (summary, remarks, descriptions).
- **Not** translated: C# type/method names, signatures, parameter names, and code samples

## Adding documentation

Edit `src/data/docs/core.ts` or `contentflow.ts` (schema in `types.ts`). Register libraries in `src/data/docs.ts`.


## GitHub Pages

This repository is intended as **`StangaNet/stanganet.github.io`** (site root, `base: '/'`).

1. **Settings → Pages → Build and deployment → Source**: *GitHub Actions*
2. Push to `main` (or run the **Deploy GitHub Pages** workflow manually)
3. Site URL: `https://stanganet.github.io`

Workflows live under `.github/workflows/`:
- `ci.yml` — typecheck and production build on push/PR
- `deploy.yml` — build `dist` and publish to GitHub Pages

## License

See [LICENSE](./LICENSE).

- **Site structure** (layout, components, i18n scaffolding, build config): permissive **MIT**-style grant; largely AI-assisted.
- **Documentation content** about the libraries: subject to each library’s own LICENSE under [StangaNet](https://github.com/StangaNet), or the organization defaults if a package has none.

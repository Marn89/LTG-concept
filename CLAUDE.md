# LTG Concept — Claude Code Guide

## Project overview
Role-based internal tool for LTG. Currently a React + Vite + MUI + TypeScript SPA.
The login screen lets a user select their role (Tech darbuotojas / Tech vadovas) before entering the app.

## Tech stack
- **React 18** with **Vite**
- **MUI v7** (`@mui/material`) for UI components
- **TypeScript** — new files should be `.ts` / `.tsx`; existing `App.jsx` can be migrated when touched
- **Tailwind CSS** — present but being phased out in favour of MUI; avoid adding new Tailwind classes
- **Emotion** — bundled with MUI, do not use it directly

## Project structure
```
src/
  theme/
    tokens.ts       # raw design values — edit here to change brand tokens
    typography.ts   # MUI typography shape built from tokens
    components.ts   # global MUI component overrides
    index.ts        # createTheme() assembly, exports `theme`
  App.jsx           # root component (login screen)
  main.tsx          # entry — ThemeProvider + CssBaseline wrap <App />
  index.css         # Tailwind base directives only
```

## Key conventions
- **Design tokens live only in `src/theme/tokens.ts`** — never hard-code hex values or spacing numbers elsewhere.
- All new components go under `src/components/` or a feature folder under `src/features/`.
- Prefer MUI `sx` prop or `styled()` for component-level styles; avoid inline `style={{}}`.
- Use `ThemeOptions` types from `@mui/material/styles` when extending the theme.
- `CssBaseline` is already mounted in `main.tsx` — do not add it again.

## Coding Style
- No inline comments unless asked
- No preamble or postamble in responses
- Show diffs not full files when editing existing code — only rewrite full file if change affects >40% of it
- One task per response — if multiple tasks asked, do highest priority and list rest as queue
- Skip error handling in early prototype unless explicitly asked
- No placeholder pages or speculative scaffolding
- Reuse existing code before writing new — check codebase first
- No explanations for obvious decisions — explanations are on-demand only

## UI Components
- Use MUI v6 components from `@mui/material`
- Never use raw HTML elements for UI (no `<button>`, `<input>`, `<select>` etc.)
- Use `@mui/icons-material` for all icons
- Theme is in `src/theme/index.ts`
- Tokens are in `src/theme/tokens.ts`
- Always use `theme.spacing()` for spacing, never hardcoded px values
- App is wrapped with ThemeProvider in `main.tsx`

## Theme Setup
- All colors must come from `tokens.ts`
- Font definitions in `src/theme/typography.ts`
- Component overrides in `src/theme/components.ts`
- Never hardcode hex values or font names outside of `tokens.ts`

## Styleguide
- Storybook is the living styleguide
- Every new custom component needs a story in `/stories`

## Target device
Samsung Galaxy XCover 7 — all screens are built for this viewport.

| Property | Value |
|---|---|
| CSS viewport | 360 × 780 px |
| Device pixel ratio | 3 |
| Physical resolution | 1080 × 2340 px |

**Chrome DevTools setup** — add as a custom device:
1. DevTools → ⋮ → Settings → Devices → Add custom device
2. Name: `Galaxy XCover 7`
3. Width: `360`, Height: `780`, DPR: `3`
4. User agent type: `Mobile`

## Running the project
```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview production build locally
```

## Pending / known gaps
- `App.jsx` role selection buttons are Tailwind-based; will be migrated to MUI when the design is finalised.
- Brand tokens in `src/theme/tokens.ts` are placeholders — all `TODO` comments mark values to replace.
- Navigation / routing not yet set up; `handleSelect` in `App.jsx` is a stub.

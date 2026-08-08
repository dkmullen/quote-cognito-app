# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build (Vite)
- `npm run preview` — preview a production build locally
- `npm run lint` — ESLint (`.vue,.js,.jsx,.cjs,.mjs`) with `--fix`
- `npm run format` — Prettier write over `src/`

There is no test suite and no typecheck script in this repo (no TypeScript, no Vitest/Jest/Cypress config despite `.gitignore` referencing Cypress artifacts). Do not assume `npm test` or `npm run typecheck` exist.

Code style is enforced by `.prettierrc.json`: no semicolons, single quotes, 2-space indent, no trailing commas, 100-char width. Match this in new code.

## Architecture

Vue 3 (`<script setup>` SFCs) + Vite, Vuetify 4 for UI, Pinia for state, vue-router 4 for routing. Plain JavaScript, not TypeScript (`jsconfig.json`, not `tsconfig.json`). Path alias `@` → `./src` (defined in both `vite.config.js` and `jsconfig.json`).

### Layers
- `src/views/` — route-level pages (`HomeView`, `LoginView`, `QuotesList`, `CarsList`, `MessageList`).
- `src/components/` — feature components (`QuoteForm`, `CarForm`, `MessageForm`, `TableView`, `ToolBar`), plus `dialogs/` (`FormDialog`, `ConfirmDialog`) and `base-components/` (currently just `BaseInput.vue`).
- `src/router/index.js` — single router file; `beforeEach` guard calls `getUser()` from `authAmplify.js` to gate routes.
- `src/stores/index.js` — single Pinia store `useAppStore` (`loading`, `loginErrorMessage`, `currentUser`, global error handler). `App.vue` persists the whole store to `localStorage['piniaState']` on change and drives a global loading overlay off `state.loading`.
- `src/services/` — data/auth layer: `apiService.js` (REST calls to the Lambda API), `authAmplify.js` (see Auth section below).
- `src/plugins/vuetify.js` + `src/icons.js` — Vuetify theme/icon setup. Icons are NOT the full mdi font; each icon must be added to the `icons` map in `src/icons.js` before it can be used as an `mdi-*` name anywhere, or it silently renders nothing.
- `src/globals.js` — auto-registers every component in `src/components/base-components/` as a global PascalCase component via `import.meta.glob`. No import needed to use them.

### Backend
No Supabase. Backend is AWS: Cognito for auth, DynamoDB for data, accessed through separate Lambda handlers **not** built by Vite:
- `api/index.mjs` — current generic CRUD handler (GET/POST/PUT/DELETE), table name from `process.env.TABLE_NAME`, reused for quotes/cars/messages.
- `apiLambda.mjs` (repo root) — older, simpler variant hardcoded to the `Quotes` table, GET/POST only.

The frontend talks to these through `src/services/apiService.js` (`post`, `retrieve`, `deleteItem`, `getArticle`), which hits `import.meta.env.VITE_APP_API_URL + <path>` (`/quotes`, `/cars`, `/messages`), attaches `Authorization: Bearer <idToken>` from `authAmplify.js`, and toggles the global Pinia loading flag around every call. Errors are caught and returned as `{ type: 'error', text }` rather than thrown.

### Auth
Auth is managed through `src/services/authAmplify.js`, which wraps `aws-amplify/auth` and is configured in `src/main.js` with pool/client IDs from `VITE_APP_USERPOOL_ID` / `VITE_APP_CLIENT_ID` env vars. The service exports:
- `doLogIn(payload)` — handles login on the form submit, manages `store.loading` and `store.loginErrorMessage`, and redirects to home on success.
- `getUser()` — called by `src/router/index.js` in the `beforeEach` guard to check session state; returns the current user or `null`.
- `getIdToken()` — called by `apiService.js` to fetch the ID token for API request auth headers.
- `signOutUser()` — called by `ToolBar.vue` to sign out and redirect to login.

`ToolBar.vue` also calls `getUser()` in `onMounted` to display the signed-in username.

### Component conventions
- CRUD forms (`QuoteForm.vue`, `CarForm.vue`, `MessageForm.vue`) share one shape: per-field `ref()`s in a `formData` object, `sendForm()` posting a plain payload via `apiService.js`, `onMounted` pre-fill via `retrieve()` when editing, `clearForm()`, and an inline `errorMessage` ref. No shared validation library — ad hoc truthy checks or `v-form :rules`.
- List views fetch via `retrieve()` in `onMounted` and render through the shared `TableView.vue` (`v-data-table` wrapper); edit opens `FormDialog.vue` (switches between the three forms via a `formName` prop), delete goes through `ConfirmDialog.vue` first.
- `FormDialog.vue` / `ConfirmDialog.vue` are controlled imperatively via `defineExpose` (e.g. `formDialog.value.dialog = true`), not `v-model` from the parent.

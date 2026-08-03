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
- `src/router/index.js` — single router file; `beforeEach` guard calls `getUser()` from `authService.js` to gate routes.
- `src/stores/index.js` — single Pinia store `useAppStore` (`loading`, `loginErrorMessage`, `currentUser`, global error handler). `App.vue` persists the whole store to `localStorage['piniaState']` on change and drives a global loading overlay off `state.loading`.
- `src/services/` — data/auth layer: `apiService.js` (REST calls to the Lambda API), `authService.js`, `authAmplify.js` (see Auth section below).
- `src/plugins/vuetify.js` + `src/icons.js` — Vuetify theme/icon setup. Icons are NOT the full mdi font; each icon must be added to the `icons` map in `src/icons.js` before it can be used as an `mdi-*` name anywhere, or it silently renders nothing.
- `src/globals.js` — auto-registers every component in `src/components/base-components/` as a global PascalCase component via `import.meta.glob`. No import needed to use them.

### Backend
No Supabase. Backend is AWS: Cognito for auth, DynamoDB for data, accessed through separate Lambda handlers **not** built by Vite:
- `api/index.mjs` — current generic CRUD handler (GET/POST/PUT/DELETE), table name from `process.env.TABLE_NAME`, reused for quotes/cars/messages.
- `apiLambda.mjs` (repo root) — older, simpler variant hardcoded to the `Quotes` table, GET/POST only.

The frontend talks to these through `src/services/apiService.js` (`post`, `retrieve`, `deleteItem`, `getArticle`), which hits `import.meta.env.VITE_APP_API_URL + <path>` (`/quotes`, `/cars`, `/messages`), attaches `Authorization: Bearer <idToken>` from `authService.js`, and toggles the global Pinia loading flag around every call. Errors are caught and returned as `{ type: 'error', text }` rather than thrown.

### Auth — two parallel implementations, know which is live
There are two Cognito integrations in this codebase and they do not share a session store:
- `src/services/authService.js` — uses raw `amazon-cognito-identity-js` directly, reads `VITE_APP_USERPOOL_ID` / `VITE_APP_CLIENT_ID` from env. This is what `src/router/index.js` (route guard) and `src/services/apiService.js` (`getIdToken` for API auth) actually depend on.
- `src/services/authAmplify.js` — uses `aws-amplify/auth`, configured in `src/main.js` with hardcoded pool/client IDs (not env-driven). Exports a working `doLogIn()` and a broken `doSignIn()` (references `AuthenticationDetails`, `CognitoUser`, `getUserPool()`, `useAppStore`, `router` without importing any of them).
- `src/views/LoginView.vue` currently calls `doLogIn` from `authAmplify.js` for the login button, while the `authService.js` import is commented out there. Meanwhile the router guard and API client still check `authService.js`'s `amazon-cognito-identity-js` session — a session Amplify's `signIn()` never populates.
- `src/components/ToolBar.vue` reads the signed-in username from a third source: the raw Amplify localStorage key `` `CognitoIdentityServiceProvider.${VITE_APP_CLIENT_ID}.LastAuthUser` ``.

If you're touching sign-in/sign-out, treat this mismatch as the likely root cause of auth bugs rather than a one-off — fix login, route-guard, and API-auth together, on one Cognito path, instead of patching one file in isolation.

### Component conventions
- CRUD forms (`QuoteForm.vue`, `CarForm.vue`, `MessageForm.vue`) share one shape: per-field `ref()`s in a `formData` object, `sendForm()` posting a plain payload via `apiService.js`, `onMounted` pre-fill via `retrieve()` when editing, `clearForm()`, and an inline `errorMessage` ref. No shared validation library — ad hoc truthy checks or `v-form :rules`.
- List views fetch via `retrieve()` in `onMounted` and render through the shared `TableView.vue` (`v-data-table` wrapper); edit opens `FormDialog.vue` (switches between the three forms via a `formName` prop), delete goes through `ConfirmDialog.vue` first.
- `FormDialog.vue` / `ConfirmDialog.vue` are controlled imperatively via `defineExpose` (e.g. `formDialog.value.dialog = true`), not `v-model` from the parent.

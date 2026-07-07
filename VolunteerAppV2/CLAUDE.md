# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Expo Router (React Native) app for volunteer management — onboarding/registration, an events dashboard, shift/hours tracking, announcements, and profile. Backend is Salesforce (see DTO field names below). The screen set in `app/` is close to the final scope for v1; expect a handful of additional modals later rather than new top-level sections.

## Commands

```bash
npm run start          # expo start (dev server, scan QR or press i/a/w)
npm run ios            # expo run:ios (native build)
npm run android         # expo run:android
npm run web             # expo start --web
npm run lint            # expo lint (ESLint flat config, eslint-config-expo)
```

There is no test runner configured (no Jest, no test files, no `test` script) and no `tsc` script — TypeScript is checked via the editor/`expo lint` only. If you add tests or a typecheck command, wire the script into `package.json` rather than assuming one exists.

## Architecture

### Routing vs. features

`app/` holds only thin Expo Router route files. A route file's entire job is to import and re-export (or render) a screen component that actually lives under `src/features/<feature>/screens/`. Example: `app/(onboarding)/about-you.tsx` just re-exports `src/features/onboarding/screens/about-you.tsx`. When changing screen behavior/UI, edit the file in `src/features/**/screens`, not the route file in `app/`.

Route groups:
- `app/(onboarding)/` — pre-auth flow: intro → create-account → about-you → interests → availability → signature-review → registration-complete.
- `app/(tabs)/` — post-auth tab bar (custom tab bar component, not the default Expo Tabs UI): Dashboard (`index`), Shifts, Announcements (titled "News"), Profile. Tab bar rendering is `src/shared/components/CustomTabBar.tsx`.
- `app/event/[id].tsx` — event detail, pushed outside the tab stack.
- `app/index.tsx` currently always redirects to `(onboarding)`; it does not branch on session status.

### Feature module layout

Each feature under `src/features/<name>/` follows the same internal shape (not every feature has every layer yet):

```
api/          raw API/mock response shape + a hand-written mock dataset
dto/          wire-format types (mirrors backend field names exactly)
schemas/      zod schemas that validate/parse raw responses
mappers/      dto/api -> domain object transforms
models/       domain types used by the rest of the app (some features instead
              keep shared domain models in src/core/models/, e.g. Volunteer,
              Registration — check both locations before adding a new model)
repositories/ interface + Mock*/Api* implementations, wired via that
              feature's repositories/index.ts
hooks/        data-fetching hooks screens actually call
screens/      the real screen implementation rendered by the app/ route
components/   feature-scoped presentational components
index.ts      the feature's public surface — prefer importing from here
              (e.g. `@features/events`) rather than reaching into internal
              files from outside the feature
```

### Repository pattern / mock-vs-real data switch

Every feature repository is defined as an interface (e.g. `EventsRepository`) with a `Mock*Repository` implementation (in-memory fixture data) and, for events, a stubbed `ApiEventsRepository` (currently empty — not implemented). Each feature's `repositories/index.ts` is the single switch point that decides which implementation gets instantiated and exported (currently all features export the Mock implementation). `src/repositories/index.ts` re-exports all feature repositories as one central switchboard. To move a feature from mock to real API data, implement/finish its `Api*Repository` and change that one export line — call sites (hooks) never construct repositories themselves.

### Data fetching: two competing patterns coexist

- `useLoginMutation` (auth) uses TanStack Query (`@tanstack/react-query`) — the `QueryClient` is set up in `app/_layout.tsx` and wraps the whole tree.
- Every other data hook (`useEvents`, `useEvent`, `useVolunteer`, `useVolunteerHours`, `useVolunteerHoursSummary`, `useRegistrations`) instead hand-rolls `useState`/`useEffect`/`useCallback` for data/isLoading/error, calling a repository directly with no caching or query-key sharing.

Since React Query is already installed and initialized, prefer migrating hand-rolled hooks onto `useQuery` rather than adding more manual fetch hooks, when doing related work.

### Auth / session state

Three pieces work together and are edited independently — read all three before changing auth flow:
- `src/core/network/httpClient.ts` — single Axios instance. Request interceptor attaches the JWT (from `runtimeTokenCache`, falling back to `secureTokenStore`/Expo SecureStore) and rejects client-side if the token is expired/malformed. Response interceptor normalizes every error into `{ status, message, isNetworkError, isTimeout }` and auto-clears the session on 401 (403 is passed through without logout). Token writes are serialized through a promise chain to avoid rotated-token races.
- `src/core/auth/sessionStore.tsx` — React Context holding `status: 'bootstrapping' | 'authenticated' | 'unauthenticated'`, also listens for the `auth:failure` event (from `authEvents`, an `mitt` emitter) emitted by the httpClient on 401.
- `src/core/auth/useBootstrapSession.ts` — runs once at app start (invoked from `app/_layout.tsx`), validates any stored token against `/volunteers/me`, and sets initial session status.

Session status can currently be changed from the httpClient (401), the bootstrap hook, and `useLoginMutation` independently — there's no single owner of transitions, so trace all three call sites when debugging auth state.

### DTOs mirror Salesforce field names

Backend responses use Salesforce-style API names (`Email__c`, `First_Name__c`, `Volunteer__c`, `Shift_Date__c`, `Approval_Status__c`, etc.). DTO types and zod schemas intentionally keep these raw names; mappers (`mappers/*.ts`) are the only place that translates them into camelCase domain models. Don't "clean up" field names in the DTO/schema layer — that mismatch with the wire format is expected.

### Path aliases

Both `tsconfig.json` and `babel.config.js` (via `babel-plugin-module-resolver`) define the same aliases — keep them in sync if you add one:

```
@/*          -> ./*
@src/*       -> src/*
@features/*  -> src/features/*
@core/*      -> src/core/*
@shared/*    -> src/shared/*
@hooks/*     -> src/shared/hooks/*
@components/*-> src/shared/components/*
@constants/* -> src/shared/constants/*
@types/*     -> src/shared/types/*
```

### Config

`API_BASE_URL` comes from `expo-constants` (`Constants.expoConfig.extra.API_BASE_URL`), sourced from `.env` — not `process.env` directly.

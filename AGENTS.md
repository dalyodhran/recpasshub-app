# Rec Pass Hub app — working agreement

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

This project is on Expo SDK 57 / React Native 0.86 / React 19.2. Do not rely on remembered Expo APIs — check the versioned docs for the API you are about to use.

## Committing and landing work

Approved by the repo owner on 2026-10-10. You do **not** need to ask again per commit.

- **Small, self-contained changes go straight to `main`.** Commit in logical commits as you go and push to `origin/main`. No PR, no waiting for approval.
- **Large or risky changes get a branch and a PR.** Branch when the change touches many files at once, alters a security control, changes an API contract other work depends on, or you are not confident it is right. Say why you branched.
- **Never commit broken code to `main`.** `npx tsc --noEmit` must be clean for the files you touched before you push. If you cannot verify a change, branch it instead.
- One-line commit messages saying what changed and why. Name the task identifier (`REC-n`).
- Report the SHAs you pushed in your task comment. That comment is how the owner knows what landed.
- Stage by path. Never `git add -A` — there is usually unrelated work in progress in this tree, and it is not yours to commit or revert.

## Repo conventions

- **Routing** is `expo-router` file-based, under `src/app/`. Route groups: `(tabs)` for the attendee journey, `(organizer)` for the organizer journey.
- **Styling** is one `StyleSheet` module per screen or component in `src/styles/`, imported by name. Keep this pattern; do not add a styling library.
- **Design tokens** live in `src/constants/`. Colours and spacing belong there, never as literals in a screen. See `DESIGN.md` once it exists.
- **API calls** go through `src/services/GenericAxiosService.ts`, wrapped in a typed module under `src/api/<domain>/`. Paths come from `src/enums/endpoints.enum.ts`, never inline strings.
- **Auth** is `src/auth/AuthContext.tsx` with the `IAuthService` provider pattern (`src/auth/providers/KeycloakProvider.ts`). There is exactly one auth context — do not add a second.
- **Verify before you claim done.** `npx tsc --noEmit` for types, `npm run lint`, `npm test` for the touched area. State which platform you ran the app on (iOS / Android / web) and what you could not verify.

## Never do

- Never commit secrets, tokens, client secrets, realm exports with credentials, or captured JWTs.
- Never log full tokens. Log claim names, not claim values.
- Never weaken a security control to make a flow pass.
- Never change Keycloak realm config, the Docker compose stack, or the `service` backend repo from here. Raise those as separate issues.

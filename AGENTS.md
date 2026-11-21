# Cevexa-Docs — agent instructions

This repository is the Mintlify source of **docs.cevexa.xyz** — the **public,
user-facing** documentation of Cevexa. Everything here is written for product
users, not engineers.

## Ownership

- Owns: user documentation — getting started, sign-in, creating Servers and
  Departments, connecting Discord, members and roles, settings, FAQ and
  troubleshooting, in plain language.
- Does **not** own: the domain model contract, the API contract, or any
  internal engineering documentation. Those live in the private
  `Cevexa-Internal-Docs` repository — reference it by name only and never
  copy internal details into this repo.

## Before editing

- Use the skill `.agents/skills/cevexa-documentation-maintenance/SKILL.md`.
- Verify every claim against what the product UI actually does
  (`Cevexa-Website/Frontend` pages and locale files); document implemented
  behavior only and mark planned features as "not available yet" or omit them.

## Rules

- English and Russian pages change together, with identical structure;
  navigation in both `en.json` and `ru.json` must mirror (parity check
  enforces this).
- User language only — no internal endpoints, database/storage terms,
  auth/signing internals, infrastructure, developer error-code tables or
  agent instructions. `scripts/check-public-content.mjs` fails the build on
  internal terms; move such detail to Cevexa-Internal-Docs.
- No secrets or production identifiers in examples.
- The file paths `en/platform/domain-model.mdx` and
  `en/platform/discord-integration.mdx` (and `ru/` mirrors) are stable —
  other repositories link to them; do not rename.

## Verification

- `npx -y mint broken-links` — no broken links.
- `node scripts/check-locale-parity.mjs` — EN/RU mirror check.
- `node scripts/check-public-content.mjs` — internal-leak guard.
- CI (`.github/workflows/pr-checks.yml`) runs **automatically on pull
  requests** (public repo — the only Cevexa repo where this is allowed) and
  on pushes to `main`. It validates docs only; **it never publishes or
  deploys** — Mintlify publication is handled outside this workflow.

## Git commits (all Cevexa repositories)

- Use the `git-autocommit` skill for every commit, but **always write commit messages in English**, regardless of the language of older commits in `git log`.
- Format: Conventional Commits `<type>(<scope>): <summary>` in the imperative mood (`add`, `fix`, `update`, `remove`), followed by a full body that explains what changed and why (affected areas, migrations, breaking changes, verification run).
- Push only feature branches unless told otherwise; never commit `.env*` or secrets.
- GitHub (`github.com/Cevexa`) is the primary remote: `origin` fetches from GitHub and pushes to GitHub and the GitLab backup (`gitlab.com/Cevexa`) at once. Pull requests, Actions and GitHub Packages (`@cevexa/*`, registry `npm.pkg.github.com`) live on GitHub; GitLab is a backup mirror only.

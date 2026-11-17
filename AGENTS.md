# Cevexa-Docs — agent instructions

This repository is the Mintlify source of **docs.cevexa.xyz** and the **canonical home of the Cevexa platform domain model**.

## Ownership
- Owns: product documentation, the Server/Department domain model (`en|ru/platform/domain-model.mdx`), the Discord integration lifecycle (`en|ru/platform/discord-integration.mdx`) and the public API contract (`en|ru/api/servers.mdx`).
- Does not own behavior: the implementation lives in `Cevexa-API` (logic, authorization), `Cevexa-Database` (schema, constraints), `Cevexa-Bot` (Gateway events) and `Cevexa-Website` (UI). Docs must describe what those repos actually do.

## Before editing
- Use the skill `.agents/skills/cevexa-documentation-maintenance/SKILL.md`.
- Read the code you document (see the skill for paths).

## Rules
- English and Russian pages change together, with identical structure; navigation in both `en.json` and `ru.json`.
- Other repositories link to the platform pages instead of copying rules; when a domain rule changes, update it here and in the implementing repo in the same piece of work.
- No secrets or production identifiers in examples.

## Verification
`npx mint dev` renders, `npx mint broken-links` is clean, and every documented endpoint exists in `Cevexa-API/internal/api/v1`.

## Git commits (all Cevexa repositories)
- Use the `git-autocommit` skill for every commit, but **always write commit messages in English**, regardless of the language of older commits in `git log`.
- Format: Conventional Commits `<type>(<scope>): <summary>` in the imperative mood (`add`, `fix`, `update`, `remove`), followed by a full body that explains what changed and why (affected areas, migrations, breaking changes, verification run).
- Push only feature branches unless told otherwise; never commit `.env*` or secrets.

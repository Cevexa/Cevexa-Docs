---
name: cevexa-documentation-maintenance
description: Maintain the public Cevexa user documentation (docs.cevexa.xyz) in Cevexa-Docs. Use when adding or editing user-facing pages, updating navigation in en.json/ru.json, or keeping English and Russian pages aligned after a product change in Cevexa-Website or Cevexa-API.
---

# Cevexa documentation maintenance

This repository is **public** and holds **user-facing documentation only**.
Internal engineering documentation lives in the private `Cevexa-Internal-Docs`
repository — mention it by name only, never copy details from it.

## What lives here
- `docs.json` — Mintlify site config (theme, colours, languages via `$ref`).
- `en.json`, `ru.json` — navigation per language (tabs → groups → pages). Every page must be listed in both.
- `en/**.mdx`, `ru/**.mdx` — user pages. Same relative path in both languages.
- `scripts/check-locale-parity.mjs` — EN/RU file + navigation parity check.
- `scripts/check-public-content.mjs` — internal-leak guard; fails on internal terms in public files.

## User-only content rule
Document only what a user can do in the product UI (verify against
`Cevexa-Website/Frontend` pages/locales and user-visible behavior).

Forbidden in public pages: internal endpoints or paths, database/storage
details, caching internals, signing/auth mechanisms, infrastructure and
deployment, error-code tables for developers, developer or AI-agent
instructions. `scripts/check-public-content.mjs` enforces a denylist — if it
fails on your text, the detail belongs in Cevexa-Internal-Docs instead.

## Workflow
1. Check what the product actually lets the user do (dashboard pages and
   locale strings in Cevexa-Website). Document implemented behavior only;
   mark anything planned with an explicit "not available yet" note, or skip it.
2. Edit the English page, then the Russian page in the same change. Keep
   headings, tables and structure identical; translate prose, keep product
   identifiers (`Server`, `Department`, `owner`, `administrator`, `member`)
   untranslated where the UI keeps them in English.
3. Update `en.json` and `ru.json` when pages are added, moved or removed —
   the parity check requires the mirrored page sets and order.
4. When user-visible behavior changes in another repo, update the affected
   page here in the same piece of work.

## Terminology
| English | Russian |
|---|---|
| Server | Сервер |
| Department | Отдел |
| Parent Server | Родительский Сервер |
| Integration | Интеграция |
| Connect / Disconnect | Подключить / Отключить |
| Convert | Преобразовать |
| Pending connection | Ожидающее подключение |
| Owner / Administrator / Member | Владелец / Администратор / Участник |

A Discord guild is never called a "Server" in docs; it is a "Discord guild" /
"гильдия Discord".

## Rules and anti-patterns
- Mintlify MDX: frontmatter `title` + `description` on every page; internal
  links include the language prefix (`/en/...`, `/ru/...`).
- No secrets, tokens, internal hostnames or production IDs anywhere.
- Describe UI behavior in user language ("the page shows Bot removed"), not
  implementation ("the integration status flips").
- Don't describe future behavior as existing. Don't pad pages — if it isn't
  in the product, it isn't here.

## Verification
- `npx mint dev` renders without errors; `npx -y mint broken-links` reports none.
- `node scripts/check-locale-parity.mjs` — same mirrored page set in both languages.
- `node scripts/check-public-content.mjs` — no internal terms.
- CI runs automatically on pull requests and does not publish anything.

## Links
- Published: https://docs.cevexa.xyz
- Mintlify docs: https://mintlify.com/docs

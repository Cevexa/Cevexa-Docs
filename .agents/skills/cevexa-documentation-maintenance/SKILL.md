---
name: cevexa-documentation-maintenance
description: Maintain the Cevexa Mintlify documentation (docs.cevexa.xyz) in Cevexa-Docs. Use when adding or editing pages, documenting API endpoints or error codes, changing the Server/Department domain model, updating navigation in en.json/ru.json, or keeping English and Russian pages aligned after a change in Cevexa-API, Cevexa-Database, Cevexa-Bot or Cevexa-Website.
---

# Cevexa documentation maintenance

## What lives here
- `docs.json` — Mintlify site config (theme, colours, languages via `$ref`).
- `en.json`, `ru.json` — navigation per language (tabs → groups → pages). Every page must be listed in both.
- `en/**.mdx`, `ru/**.mdx` — pages. Same relative path in both languages.
- Canonical platform pages (the single source of truth other repos link to):
  - `*/platform/domain-model.mdx` — Server, Department, parent relationship, ownership, roles, conversion, integrations.
  - `*/platform/discord-integration.mdx` — pending connections, bot install, permissions, signed bot events.
  - `*/api/servers.mdx` — HTTP contract, error codes, response envelopes.

## Workflow
1. Read the code that the page describes before writing (Cevexa-API `internal/platform`, `internal/api/v1`, `internal/server/server.go`; Cevexa-Database migrations; Cevexa-Bot `shared/utils/default/coreApi`). Document implemented behavior only; mark anything planned as "not available yet".
2. Edit the English page, then the Russian page in the same change. Keep headings, tables, code blocks and anchors structurally identical; translate prose, keep identifiers (`server`, `department`, `owner`, error codes, JSON keys) untranslated.
3. Update `en.json` and `ru.json` when pages are added, moved or removed.
4. If a domain rule changes, change it here first, then update the repo skills/AGENTS that link to it (they must not copy the rules).

## Terminology
| English | Russian |
|---|---|
| Server | Сервер |
| Department | Департамент |
| Parent Server | Родительский сервер |
| Integration | Интеграция |
| Connect / Disconnect | Подключить / Отключить |
| Convert | Конвертировать |
| Pending connection | Ожидающее подключение |
| Owner / Administrator / Member | Владелец / Администратор / Участник |

A Discord guild is never called a "Server" in docs; it is a "Discord guild" / "гильдия Discord".

## Rules and anti-patterns
- Mintlify MDX: frontmatter `title` + `description` on every page; internal links include the language prefix (`/en/...`, `/ru/...`).
- Error tables list status, `code` and condition; keep them in sync with `internal/platform/errors.go`.
- No secrets, real tokens, internal hostnames or production IDs in examples.
- Don't describe future behavior as existing. Don't duplicate the domain model on other pages; link to it.

## Verification
- `npx mint dev` (or `npx mintlify dev`) from the repo root renders without errors; `npx mint broken-links` reports none.
- Both `en.json` and `ru.json` list the same set of pages (modulo language prefix).
- Cross-check every endpoint in `api/servers.mdx` against `Cevexa-API/internal/api/v1/*.go` route registrations.

## Links
- Published: https://docs.cevexa.xyz
- Domain model: https://docs.cevexa.xyz/en/platform/domain-model
- Mintlify docs: https://mintlify.com/docs

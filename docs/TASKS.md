# PaperTrail MCP Tasks

## MVP acceptance

- [x] Preserve the original PRD in `docs/PRD.md`.
- [x] Define a local paper/result schema with provenance events.
- [x] Ship deterministic fixtures under `fixtures/sample`.
- [x] Load fixture directories and JSON files without network calls.
- [x] Search the local cache by query, tag, year, and limit.
- [x] Export citation/provenance Markdown.
- [x] Provide an MCP-friendly tool surface for search, retrieve, inspect, and export.
- [x] Provide a stdio JSON-RPC server mode for local MCP clients.
- [x] Add fixture-backed tests for parsing, search, Markdown, and MCP handlers.
- [x] Add a real CLI smoke script.
- [x] Document install, quickstart, safety boundaries, and attribution.
- [x] Include SECURITY, CONTRIBUTING, license, package metadata, and CI.

## Post-MVP backlog

- [ ] Add optional adapters for explicit user-supplied Crossref/arXiv exports.
- [ ] Add BibTeX import/export.
- [ ] Add richer duplicate detection across DOI, arXiv ID, title, and year.
- [ ] Publish MCP client configuration examples once real-world clients are tested.
- [ ] Consider a read-only SQLite index if JSON fixtures become too slow.

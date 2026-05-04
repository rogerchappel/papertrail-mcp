# PaperTrail MCP Orchestration

PaperTrail MCP is intentionally boring to operate: it reads local JSON, emits local JSON or Markdown, and never reaches out to the network unless a future adapter is explicitly added and invoked by a human.

## Local build loop

```bash
npm install
npm run check
npm test
npm run build
npm run smoke
bash scripts/validate.sh
```

## Agent workflow

1. Inspect the PRD and task list before changing behavior.
2. Use `fixtures/sample` or a new fixture directory for every behavior change.
3. Keep source adapters explicit. V1 fixtures are local-only; no hidden HTTP, scraping, telemetry, or credential lookup.
4. Run `npm run smoke` after touching CLI or MCP behavior.
5. Capture externally visible changes in README or docs.

## MCP operation

Start a local stdio server over a fixture/cache directory:

```bash
papertrail-mcp serve ./fixtures/sample
```

Available tools:

- `papertrail_search` — query local cache metadata.
- `papertrail_retrieve` — fetch one paper and provenance by ID.
- `papertrail_export_markdown` — render Markdown for all papers or a search result.
- `papertrail_inspect` — summarize cache contents.

## Release readiness

- Main branch stays protected best-effort through the repository protection script.
- Releases should only be cut after `npm run release:check` succeeds.
- npm publishing is not automated in V1.

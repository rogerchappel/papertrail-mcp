# PaperTrail MCP

**A little black box for research trails.** PaperTrail MCP keeps academic paper searches, citations, and retrieval provenance in a local cache that agents can inspect without guessing where a source came from.

It is intentionally local-first: no hidden network calls, no scraping, no telemetry, and no credential discovery. Bring JSON fixtures or exported metadata; PaperTrail gives you deterministic search, Markdown citations, and MCP-friendly tools.

## Why this exists

Agents are surprisingly good at finding papers and surprisingly bad at remembering the trail: the query used, the source that returned a result, the local PDF path, and whether a citation was fixture-backed or hand-entered. PaperTrail MCP is a tiny, reviewable provenance ledger for that workflow.

## Install

```bash
npm install
npm run build
```

For local development, run through Node:

```bash
node dist/cli.js --help
```

After publishing, the CLI will be available as:

```bash
npx papertrail-mcp inspect ./fixtures/sample
```

## Quickstart

Inspect a fixture cache:

```bash
papertrail-mcp inspect ./fixtures/sample --output ./.out/inspect
```

Search locally:

```bash
papertrail-mcp search ./fixtures/sample --query "retrieval generation" --limit 2
```

Export Markdown with citations and provenance:

```bash
papertrail-mcp export ./fixtures/sample --query "attention" --output papertrail.md
```

Run the stdio MCP-ish server for local clients:

```bash
papertrail-mcp serve ./fixtures/sample
```

Supported tools:

- `papertrail_search`
- `papertrail_retrieve`
- `papertrail_export_markdown`
- `papertrail_inspect`

## Fixture format

A fixture directory contains `papers.json`:

```json
{
  "papers": [
    {
      "id": "attention-is-all-you-need-2017",
      "title": "Attention Is All You Need",
      "authors": ["Ashish Vaswani"],
      "year": 2017,
      "source": "fixture",
      "query": "transformer attention architecture",
      "retrievedAt": "2026-05-04T08:30:00Z"
    }
  ],
  "provenance": [
    {
      "id": "evt-attention-search",
      "paperId": "attention-is-all-you-need-2017",
      "action": "searched",
      "source": "fixture/papers.json",
      "query": "transformer attention architecture",
      "at": "2026-05-04T08:30:00Z"
    }
  ]
}
```

## Safety boundaries

- Local files only in V1.
- No implicit HTTP requests.
- No telemetry.
- No credential lookup.
- No PDF downloading unless a future explicit command is added.
- Fixture-backed tests protect the deterministic behavior.

## Attribution

This is a fresh implementation inspired by the adjacent idea space around `paper-search-plus-mcp`. It does not copy that project name or implementation; the V1 scope is a deterministic local provenance cache for agent/developer workflows.

## Verify

```bash
npm run check
npm test
npm run build
npm run smoke
bash scripts/validate.sh
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Small, fixture-backed changes are preferred.

## Security

See [SECURITY.md](SECURITY.md). Please report vulnerabilities privately; do not open public issues for sensitive reports.

## License

MIT

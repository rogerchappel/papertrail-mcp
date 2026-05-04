# Contributing

Thanks for helping make PaperTrail MCP calmer and more useful for research agents.

## Principles

- Keep V1 local-first: no hidden network calls, scraping, telemetry, or credential discovery.
- Prefer deterministic fixtures over live services.
- Make provenance explicit whenever a paper enters the cache.
- Keep changes small enough to review in one sitting.

## Development

```bash
npm install
npm run check
npm test
npm run smoke
bash scripts/validate.sh
```

## Adding behavior

1. Add or update a fixture under `fixtures/`.
2. Add a test that proves the behavior against the fixture.
3. Update README/docs when CLI, MCP, schema, or safety behavior changes.
4. Run the verification commands before opening a PR.

## Commit style

Use short conventional-style subjects when practical, for example:

- `feat: add BibTeX export`
- `fix: reject invalid provenance events`
- `docs: clarify MCP client setup`

## Pull requests

Please include:

- What changed.
- Why it matters.
- Verification commands and results.
- Any security or compatibility notes.

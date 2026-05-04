#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN="$ROOT/dist/cli.js"
OUT="$ROOT/.out/smoke"
rm -rf "$OUT"
mkdir -p "$OUT"

node "$BIN" --help | grep -q "PaperTrail MCP"
node "$BIN" inspect "$ROOT/fixtures/sample" --output "$OUT" | grep -q '"paperCount": 3'
test -f "$OUT/summary.json"
node "$BIN" search "$ROOT/fixtures/sample" --query "attention" --limit 1 | grep -q "attention-is-all-you-need-2017"
node "$BIN" export "$ROOT/fixtures/sample" --query "retrieval" --output "$OUT/export.md"
grep -q "Retrieval-Augmented Generation" "$OUT/export.md"
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node "$BIN" serve "$ROOT/fixtures/sample" | grep -q "papertrail_search"

echo "smoke ok"

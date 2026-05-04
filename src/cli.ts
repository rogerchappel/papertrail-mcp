#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadDataset } from './loader.js';
import { renderMarkdownExport } from './markdown.js';
import { searchPapers } from './search.js';
import { runStdioServer } from './stdio-server.js';
import { summarizeDataset } from './summary.js';

const usage = `PaperTrail MCP — local-first paper provenance for agents

Usage:
  papertrail-mcp inspect <fixture-or-json> [--output <dir>]
  papertrail-mcp search <fixture-or-json> --query <text> [--limit <n>]
  papertrail-mcp export <fixture-or-json> [--query <text>] [--output <file>]
  papertrail-mcp serve <fixture-or-json>

No command makes network calls. Input is a local fixture directory or JSON file.`;

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const [command, inputPath] = argv;
  if (!command || command === '--help' || command === '-h') return print(usage);
  if (command === '--version' || command === '-v') return print('0.1.0');
  if (!inputPath) throw new Error(`Missing input path.\n\n${usage}`);
  const dataset = await loadDataset(inputPath);
  const options = parseOptions(argv.slice(2));

  if (command === 'inspect') {
    const summary = summarizeDataset(dataset);
    print(JSON.stringify(summary, null, 2));
    if (options.output) {
      await mkdir(options.output, { recursive: true });
      await writeFile(path.join(options.output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    }
    return;
  }

  if (command === 'search') {
    const query = requireOption(options, 'query');
    print(JSON.stringify({ papers: searchPapers(dataset.papers, { query, limit: options.limit ? Number(options.limit) : undefined }) }, null, 2));
    return;
  }

  if (command === 'export') {
    const papers = options.query ? searchPapers(dataset.papers, { query: options.query, limit: options.limit ? Number(options.limit) : undefined }) : dataset.papers;
    const markdown = renderMarkdownExport(dataset, papers);
    if (options.output) await writeFile(options.output, markdown, 'utf8');
    else print(markdown.trimEnd());
    return;
  }

  if (command === 'serve') {
    await runStdioServer(dataset);
    return;
  }

  throw new Error(`Unknown command: ${command}\n\n${usage}`);
}

function parseOptions(args: string[]): Record<string, string> {
  const options: Record<string, string> = {};
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token?.startsWith('--')) continue;
    const key = token.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith('--')) options[key] = 'true';
    else {
      options[key] = next;
      index += 1;
    }
  }
  return options;
}

function requireOption(options: Record<string, string>, key: string): string {
  const value = options[key];
  if (!value) throw new Error(`Missing required --${key}`);
  return value;
}

function print(value: string): void {
  process.stdout.write(`${value}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}

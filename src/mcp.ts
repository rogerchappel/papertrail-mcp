import { renderMarkdownExport } from './markdown.js';
import { searchPapers } from './search.js';
import { summarizeDataset } from './summary.js';
import type { PaperTrailDataset } from './types.js';

export type McpToolResult = { content: Array<{ type: 'text'; text: string }> };

export function listMcpTools() {
  return [
    {
      name: 'papertrail_search',
      description: 'Search the local paper cache. No network calls are made.',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' }, limit: { type: 'number' }, tag: { type: 'string' }, year: { type: 'number' } },
        required: ['query']
      }
    },
    {
      name: 'papertrail_retrieve',
      description: 'Retrieve one cached paper by ID with provenance.',
      inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }
    },
    {
      name: 'papertrail_export_markdown',
      description: 'Render selected or all cached papers as citation/provenance Markdown.',
      inputSchema: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'number' } } }
    },
    {
      name: 'papertrail_inspect',
      description: 'Summarize cache contents and provenance counts.',
      inputSchema: { type: 'object', properties: {} }
    }
  ];
}

export function callMcpTool(dataset: PaperTrailDataset, name: string, args: Record<string, unknown> = {}): McpToolResult {
  if (name === 'papertrail_search') {
    const query = String(args.query ?? '');
    const papers = searchPapers(dataset.papers, { query, limit: numberArg(args.limit), tag: stringArg(args.tag), year: numberArg(args.year) });
    return text(JSON.stringify({ papers }, null, 2));
  }
  if (name === 'papertrail_retrieve') {
    const id = String(args.id ?? '');
    const paper = dataset.papers.find((candidate) => candidate.id === id);
    const provenance = dataset.provenance.filter((event) => event.paperId === id);
    return text(JSON.stringify({ paper: paper ?? null, provenance }, null, 2));
  }
  if (name === 'papertrail_export_markdown') {
    const query = stringArg(args.query);
    const papers = query ? searchPapers(dataset.papers, { query, limit: numberArg(args.limit) }) : dataset.papers;
    return text(renderMarkdownExport(dataset, papers));
  }
  if (name === 'papertrail_inspect') return text(JSON.stringify(summarizeDataset(dataset), null, 2));
  throw new Error(`Unknown MCP tool: ${name}`);
}

function text(value: string): McpToolResult {
  return { content: [{ type: 'text', text: value }] };
}

function stringArg(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function numberArg(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

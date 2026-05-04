import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { callMcpTool, listMcpTools } from './mcp.js';
import type { PaperTrailDataset } from './types.js';

type JsonRpcRequest = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

export async function runStdioServer(dataset: PaperTrailDataset): Promise<void> {
  const rl = createInterface({ input, crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    const request = JSON.parse(line) as JsonRpcRequest;
    output.write(`${JSON.stringify(handleRequest(dataset, request))}\n`);
  }
}

export function handleRequest(dataset: PaperTrailDataset, request: JsonRpcRequest): Record<string, unknown> {
  try {
    if (request.method === 'initialize') {
      return ok(request.id, { protocolVersion: '2024-11-05', serverInfo: { name: 'papertrail-mcp', version: '0.1.0' }, capabilities: { tools: {} } });
    }
    if (request.method === 'tools/list') return ok(request.id, { tools: listMcpTools() });
    if (request.method === 'tools/call') {
      const params = request.params ?? {};
      const name = String(params.name ?? '');
      const args = (params.arguments && typeof params.arguments === 'object' ? params.arguments : {}) as Record<string, unknown>;
      return ok(request.id, callMcpTool(dataset, name, args));
    }
    if (request.method === 'notifications/initialized') return ok(request.id ?? null, {});
    return fail(request.id, -32601, `Method not found: ${request.method ?? '(missing)'}`);
  } catch (error) {
    return fail(request.id, -32000, error instanceof Error ? error.message : String(error));
  }
}

function ok(id: JsonRpcRequest['id'], result: unknown): Record<string, unknown> {
  return { jsonrpc: '2.0', id: id ?? null, result };
}

function fail(id: JsonRpcRequest['id'], code: number, message: string): Record<string, unknown> {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

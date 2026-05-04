import assert from 'node:assert/strict';
import test from 'node:test';
import { loadDataset } from './loader.js';
import { callMcpTool, listMcpTools } from './mcp.js';
import { handleRequest } from './stdio-server.js';

test('lists MCP tool descriptors', () => {
  assert.ok(listMcpTools().some((tool) => tool.name === 'papertrail_search'));
});

test('calls MCP search tool against fixture cache', async () => {
  const dataset = await loadDataset('fixtures/sample');
  const result = callMcpTool(dataset, 'papertrail_search', { query: 'attention' });
  assert.match(result.content[0].text, /attention-is-all-you-need-2017/);
});

test('handles JSON-RPC tools/list requests', async () => {
  const dataset = await loadDataset('fixtures/sample');
  const response = handleRequest(dataset, { id: 1, method: 'tools/list' });
  assert.equal(response.jsonrpc, '2.0');
  assert.equal(response.id, 1);
  assert.match(JSON.stringify(response), /papertrail_retrieve/);
});

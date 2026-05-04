import assert from 'node:assert/strict';
import test from 'node:test';
import { loadDataset } from './loader.js';
import { searchPapers } from './search.js';

test('search ranks title and tag matches from fixture data', async () => {
  const dataset = await loadDataset('fixtures/sample');
  const results = searchPapers(dataset.papers, { query: 'retrieval generation', limit: 2 });
  assert.equal(results[0]?.id, 'retrieval-augmented-generation-2020');
  assert.ok(results.length >= 1);
});

test('search filters by tag', async () => {
  const dataset = await loadDataset('fixtures/sample');
  const results = searchPapers(dataset.papers, { query: 'protocol', tag: 'mcp' });
  assert.deepEqual(results.map((paper) => paper.id), ['model-context-protocol-2024']);
});

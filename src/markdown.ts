import { citationFor } from './citation.js';
import type { PaperRecord, PaperTrailDataset } from './types.js';

export function renderMarkdownExport(dataset: PaperTrailDataset, papers: PaperRecord[] = dataset.papers): string {
  const ids = new Set(papers.map((paper) => paper.id));
  const events = dataset.provenance.filter((event) => ids.has(event.paperId));
  const lines = [
    '# PaperTrail Export',
    '',
    `Generated from ${papers.length} paper${papers.length === 1 ? '' : 's'} and ${events.length} provenance event${events.length === 1 ? '' : 's'}.`,
    '',
    '## Papers',
    ''
  ];
  for (const paper of papers) {
    lines.push(`### ${paper.title}`);
    lines.push('');
    lines.push(`- **ID:** \`${paper.id}\``);
    lines.push(`- **Citation:** ${citationFor(paper)}`);
    if (paper.tags?.length) lines.push(`- **Tags:** ${paper.tags.join(', ')}`);
    if (paper.url) lines.push(`- **URL:** ${paper.url}`);
    if (paper.pdfPath) lines.push(`- **Local PDF:** ${paper.pdfPath}`);
    if (paper.abstract) lines.push('', paper.abstract);
    const paperEvents = events.filter((event) => event.paperId === paper.id);
    if (paperEvents.length) {
      lines.push('', '#### Provenance', '');
      for (const event of paperEvents) {
        lines.push(`- ${event.at}: ${event.action} via ${event.source}${event.query ? ` for \`${event.query}\`` : ''}${event.note ? ` — ${event.note}` : ''}`);
      }
    }
    lines.push('');
  }
  return `${lines.join('\n').trim()}\n`;
}

export type PaperSource = 'fixture' | 'cache' | 'manual' | 'external-record';

export type PaperAuthor = {
  name: string;
  orcid?: string;
};

export type PaperLink = {
  label: string;
  url: string;
};

export type PaperRecord = {
  id: string;
  title: string;
  authors: PaperAuthor[];
  year?: number;
  venue?: string;
  abstract?: string;
  doi?: string;
  arxivId?: string;
  url?: string;
  pdfPath?: string;
  tags?: string[];
  citation?: string;
  source: PaperSource;
  query?: string;
  retrievedAt?: string;
  links?: PaperLink[];
};

export type ProvenanceEvent = {
  id: string;
  paperId: string;
  action: 'searched' | 'imported' | 'retrieved' | 'exported';
  source: string;
  query?: string;
  at: string;
  note?: string;
};

export type PaperTrailDataset = {
  papers: PaperRecord[];
  provenance: ProvenanceEvent[];
};

export type SearchOptions = {
  query: string;
  limit?: number;
  tag?: string;
  year?: number;
};

export type InspectSummary = {
  paperCount: number;
  provenanceCount: number;
  sources: Record<string, number>;
  years: Record<string, number>;
  tags: Record<string, number>;
};

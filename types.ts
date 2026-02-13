
export enum AnalysisDepth {
  BASIC = 'базовая',
  EXTENDED = 'расширенная',
  MAXIMUM = 'максимальная'
}

export interface ResearchParameters {
  rubric: string;
  subthemes: string;
  targetAudience: string;
  depth: AnalysisDepth;
}

export interface Comment {
  text: string;
}

export interface TopTheme {
  title: string;
  pain: string;
  query: string;
  frequency: string;
  score: number;
  comments: string[];
}

export interface Cluster {
  name: string;
  themes: TopTheme[];
}

export interface SummaryItem {
  title: string;
  cluster: string;
  painShort: string;
  score: number;
}

export interface ResearchResult {
  clusters: Cluster[];
  top15: SummaryItem[];
}

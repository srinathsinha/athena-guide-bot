export interface Expert {
  id: string;
  name: string;
  avatar: string;
  slackHandle: string;
  specialties: string[];
}

export interface KnowledgeGap {
  id: string;
  title: string;
  component: string;
  confidence: number;
  action: 'auto-pr' | 'ask-expert';
  expert: Expert;
  nominatedBy: Expert;
  incident?: string;
  patterns: {
    id: string;
    label: string;
    description: string;
    isRecommended: boolean;
  }[];
}

export interface KnowledgeGraphArea {
  name: string;
  component: string;
  score: number;
  status: 'verified' | 'unknown' | 'in-progress';
  expert?: Expert;
}

export interface AthenaDailyDigest {
  date: string;
  gaps: KnowledgeGap[];
  overallScore: number;
  graphAreas: KnowledgeGraphArea[];
}

export type Scenario = 'digest' | 'auto-pr' | 'qna';
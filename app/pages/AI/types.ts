export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  cost?: number;
  codeBlock?: string;
}

export interface ChatSession {
  id: string;
  sessionNumber: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  calls: number;
  cost: number;
  topics: string[];
  messages: ChatMessage[];
}

export interface UsageHistoryItem {
  id: string;
  sessionNumber: number;
  date: string;
  calls: number;
  cost: number;
  topics?: string[];
}

export interface AnalyticsData {
  date: string;
  calls: number;
}

export interface TopicData {
  topic: string;
  calls: number;
}

export interface CostBreakdown {
  thisWeek: {
    cost: number;
    calls: number;
    sessions: number;
  };
  thisMonth: {
    cost: number;
    calls: number;
    sessions: number;
  };
  avgCostPerSession: number;
  avgCallsPerDay: number;
}


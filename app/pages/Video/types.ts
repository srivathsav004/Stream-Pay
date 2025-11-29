export interface Video {
  id: string;
  title: string;
  duration: string;
  quality: string;
  thumbnail: string;
  streamPrice: number; // AVAX per second
  purchasePrice: number; // AVAX one-time
  description?: string;
}

export interface OwnedVideo extends Video {
  watchCount: number;
  lastWatched?: string;
}

export interface UsageHistoryItem {
  id: string;
  type: 'stream' | 'purchase';
  videoTitle: string;
  date: string;
  duration?: string;
  cost: number;
}

export interface StreamingSession {
  videoId: string;
  videoTitle: string;
  startTime: Date;
  duration: string;
  cost: number;
  rate: number;
  isPaused: boolean;
}

export interface AnalyticsData {
  date: string;
  streamingCost: number;
  purchaseCost: number;
}


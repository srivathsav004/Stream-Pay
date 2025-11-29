export interface StorageFile {
  id: string;
  name: string;
  size: number; // in MB
  type: 'file' | 'folder';
  fileType?: 'pdf' | 'image' | 'video' | 'spreadsheet' | 'archive' | 'audio' | 'code' | 'other';
  uploadedAt: string;
  duration?: number; // hours stored
  costPerHour: number;
  totalCost: number;
  ipfsCid?: string;
  txHash?: string;
  status: 'active' | 'deleted';
}

export interface UsageHistoryItem {
  id: string;
  action: 'upload' | 'delete';
  fileName: string;
  date: string;
  duration?: number; // hours
  cost: number;
  fileSize?: number;
  ipfsCid?: string;
  txHash?: string;
}

export interface AnalyticsData {
  date: string;
  storageGB: number;
}

export interface FileTypeData {
  type: string;
  storageGB: number;
  percentage: number;
  cost: number;
}

export interface CostBreakdown {
  thisWeek: {
    cost: number;
    avgStorage: number;
    filesAdded: number;
    filesDeleted: number;
  };
  thisMonth: {
    cost: number;
    avgStorage: number;
    filesAdded: number;
    filesDeleted: number;
  };
  mostExpensiveFile: {
    name: string;
    size: number;
    cost: number;
  };
  longestStoredFile: {
    name: string;
    size: number;
    hours: number;
  };
}


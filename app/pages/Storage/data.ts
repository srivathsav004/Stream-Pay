import { StorageFile, UsageHistoryItem, AnalyticsData, FileTypeData, CostBreakdown } from './types';

export const storageFiles: StorageFile[] = [
  {
    id: '1',
    name: 'document.pdf',
    size: 2.5,
    type: 'file',
    fileType: 'pdf',
    uploadedAt: '2 days ago',
    duration: 48,
    costPerHour: 0.000025,
    totalCost: 0.0012,
    ipfsCid: 'QmX7a2b4c8d...',
    txHash: '0x7a2b4c8d...',
    status: 'active',
  },
  {
    id: '2',
    name: 'image.png',
    size: 1.2,
    type: 'file',
    fileType: 'image',
    uploadedAt: '5 days ago',
    duration: 120,
    costPerHour: 0.000012,
    totalCost: 0.0014,
    ipfsCid: 'QmY8b3c5d9e...',
    txHash: '0x8b3c5d9e...',
    status: 'active',
  },
  {
    id: '3',
    name: 'data.csv',
    size: 5.0,
    type: 'file',
    fileType: 'spreadsheet',
    uploadedAt: '1 week ago',
    duration: 168,
    costPerHour: 0.00005,
    totalCost: 0.0084,
    ipfsCid: 'QmZ9c4d6e0f...',
    txHash: '0x9c4d6e0f...',
    status: 'active',
  },
  {
    id: '4',
    name: 'video.mp4',
    size: 25.0,
    type: 'file',
    fileType: 'video',
    uploadedAt: '2 weeks ago',
    duration: 336,
    costPerHour: 0.00025,
    totalCost: 0.084,
    ipfsCid: 'QmA0d5e7f1g...',
    txHash: '0xa0d5e7f1g...',
    status: 'active',
  },
  {
    id: '5',
    name: 'Documents',
    size: 0,
    type: 'folder',
    uploadedAt: '1 month ago',
    status: 'active',
    costPerHour: 0,
    totalCost: 0,
  },
];

export const usageHistory: UsageHistoryItem[] = [
  {
    id: '1',
    action: 'upload',
    fileName: 'document.pdf',
    date: '2 days ago',
    duration: 48,
    cost: 0.0012,
    fileSize: 2.5,
    ipfsCid: 'QmX7a2b4c8d...',
    txHash: '0x7a2b4c8d...',
  },
  {
    id: '2',
    action: 'delete',
    fileName: 'old-file.txt',
    date: '3 days ago',
    duration: 120,
    cost: 0.006,
    fileSize: 1.5,
  },
  {
    id: '3',
    action: 'upload',
    fileName: 'image.png',
    date: '5 days ago',
    duration: 120,
    cost: 0.0014,
    fileSize: 1.2,
    ipfsCid: 'QmY8b3c5d9e...',
    txHash: '0x8b3c5d9e...',
  },
  {
    id: '4',
    action: 'upload',
    fileName: 'data.csv',
    date: '1 week ago',
    duration: 168,
    cost: 0.0084,
    fileSize: 5.0,
    ipfsCid: 'QmZ9c4d6e0f...',
    txHash: '0x9c4d6e0f...',
  },
  {
    id: '5',
    action: 'delete',
    fileName: 'temp.zip',
    date: '2 weeks ago',
    duration: 24,
    cost: 0.024,
    fileSize: 10.0,
  },
];

export const analyticsData: AnalyticsData[] = [
  { date: 'Nov 1', storageGB: 0.8 },
  { date: 'Nov 5', storageGB: 1.0 },
  { date: 'Nov 10', storageGB: 1.2 },
  { date: 'Nov 15', storageGB: 1.1 },
  { date: 'Nov 20', storageGB: 1.3 },
  { date: 'Nov 25', storageGB: 1.2 },
  { date: 'Nov 27', storageGB: 1.2 },
];

export const fileTypeData: FileTypeData[] = [
  { type: 'Documents', storageGB: 0.48, percentage: 40, cost: 0.15 },
  { type: 'Images', storageGB: 0.36, percentage: 30, cost: 0.10 },
  { type: 'Videos', storageGB: 0.24, percentage: 20, cost: 0.45 },
  { type: 'Other', storageGB: 0.12, percentage: 10, cost: 0.04 },
];

export const costBreakdown: CostBreakdown = {
  thisWeek: {
    cost: 0.084,
    avgStorage: 1.1,
    filesAdded: 5,
    filesDeleted: 2,
  },
  thisMonth: {
    cost: 0.288,
    avgStorage: 1.0,
    filesAdded: 18,
    filesDeleted: 7,
  },
  mostExpensiveFile: {
    name: 'video.mp4',
    size: 25,
    cost: 0.084,
  },
  longestStoredFile: {
    name: 'data.csv',
    size: 5,
    hours: 168,
  },
};

export const storageStats = {
  totalSpent: 0.74,
  totalStored: 1.2,
  activeFiles: 47,
  storageTime: 240,
};

export const maxStorage = 10; // GB


import { ChatMessage, ChatSession, UsageHistoryItem, AnalyticsData, TopicData, CostBreakdown } from './types';

export const chatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'What is blockchain?',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Blockchain is a distributed ledger technology that records transactions across multiple computers. It\'s the foundation of cryptocurrencies like Bitcoin and Ethereum. Each block contains a cryptographic hash of the previous block, creating a chain that is extremely difficult to alter.',
    timestamp: '2 hours ago',
    cost: 0.001,
  },
  {
    id: '3',
    role: 'user',
    content: 'Explain smart contracts',
    timestamp: '2 hours ago',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Smart contracts are self-executing contracts with terms directly written into code. They automatically execute when predetermined conditions are met, eliminating the need for intermediaries. They run on blockchain networks like Ethereum and Avalanche.',
    timestamp: '2 hours ago',
    cost: 0.001,
  },
  {
    id: '5',
    role: 'user',
    content: 'Write a Python function to calculate fibonacci numbers',
    timestamp: '1 hour ago',
  },
  {
    id: '6',
    role: 'assistant',
    content: 'Here\'s a Python function to calculate Fibonacci numbers:',
    timestamp: '1 hour ago',
    cost: 0.001,
    codeBlock: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Example usage
print(fibonacci(10))  # Output: 55`,
  },
];

export const currentSession: ChatSession = {
  id: 'session-47',
  sessionNumber: 47,
  startTime: 'Nov 27, 2024 at 2:30 PM',
  calls: 5,
  cost: 0.005,
  topics: ['Blockchain', 'Smart Contracts', 'Python Code'],
  messages: chatMessages,
};

export const usageHistory: UsageHistoryItem[] = [
  {
    id: '1',
    sessionNumber: 47,
    date: '2 hours ago',
    calls: 5,
    cost: 0.005,
    topics: ['Blockchain', 'Smart Contracts', 'Python Code'],
  },
  {
    id: '2',
    sessionNumber: 46,
    date: '1 day ago',
    calls: 12,
    cost: 0.012,
    topics: ['Blockchain', 'Avalanche'],
  },
  {
    id: '3',
    sessionNumber: 45,
    date: '2 days ago',
    calls: 8,
    cost: 0.008,
    topics: ['Smart Contracts'],
  },
  {
    id: '4',
    sessionNumber: 44,
    date: '3 days ago',
    calls: 15,
    cost: 0.015,
    topics: ['Python Code', 'Blockchain'],
  },
  {
    id: '5',
    sessionNumber: 43,
    date: '5 days ago',
    calls: 6,
    cost: 0.006,
    topics: ['Avalanche'],
  },
];

export const analyticsData: AnalyticsData[] = [
  { date: 'Nov 1', calls: 8 },
  { date: 'Nov 5', calls: 12 },
  { date: 'Nov 10', calls: 6 },
  { date: 'Nov 15', calls: 15 },
  { date: 'Nov 20', calls: 10 },
  { date: 'Nov 25', calls: 18 },
  { date: 'Nov 27', calls: 5 },
];

export const topicData: TopicData[] = [
  { topic: 'Blockchain', calls: 45 },
  { topic: 'Smart Contracts', calls: 28 },
  { topic: 'Python Code', calls: 18 },
  { topic: 'Avalanche', calls: 12 },
  { topic: 'Others', calls: 8 },
];

export const costBreakdown: CostBreakdown = {
  thisWeek: {
    cost: 0.035,
    calls: 35,
    sessions: 12,
  },
  thisMonth: {
    cost: 0.247,
    calls: 247,
    sessions: 47,
  },
  avgCostPerSession: 0.005,
  avgCallsPerDay: 8.2,
};

export const aiStats = {
  totalSpent: 2.22,
  totalCalls: 247,
  avgPerCall: 0.009,
  thisMonth: 47,
};

export const suggestedPrompts = [
  'Explain blockchain technology',
  'What are smart contracts?',
  'How does Avalanche work?',
  'Write a Python function to...',
];


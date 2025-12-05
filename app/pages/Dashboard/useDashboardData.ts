import { useAccount } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { listTransactions, TxRow, ServiceType } from '@/app/shared/services/web2-services/transactions';
import { fetchUserStreamSessions } from '@/app/shared/services/web2-services/video';
import { getStats as getStorageStats } from '@/app/shared/services/web2-services/storage';
import { ActivityData, ServiceUsageData, SpendingData } from './types';

function isSpendingService(service: ServiceType) {
  return service === 'video_stream' || service === 'video_purchase' || service === 'api_session' || service === 'storage';
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export function useDashboardData() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txs, setTxs] = useState<TxRow[]>([]);
  const [storageStats, setStorageStats] = useState<{ totalStoredGB: number; activeFiles: number; storageTimeHours: number } | null>(null);
  const [videoSessionsMeta, setVideoSessionsMeta] = useState<{ count: number; totalSeconds: number } | null>(null);

  useEffect(() => {
    if (!address) {
      setTxs([]);
      return;
    }
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const [txRes, streamSessions, storage] = await Promise.all([
          listTransactions({ user_address: address, page: 1, page_size: 500, sort: 'recent' }),
          fetchUserStreamSessions(address).catch(() => []),
          getStorageStats(address).catch(() => null),
        ]);
        if (!cancelled) {
          setTxs(txRes.items || []);
          if (Array.isArray(streamSessions)) {
            const count = streamSessions.length;
            const totalSeconds = streamSessions.reduce((sum, s) => sum + (s.seconds_streamed || 0), 0);
            setVideoSessionsMeta({ count, totalSeconds });
          } else {
            setVideoSessionsMeta(null);
          }
          if (storage && typeof storage.totalStoredGB === 'number') {
            setStorageStats({
              totalStoredGB: storage.totalStoredGB,
              activeFiles: storage.activeFiles,
              storageTimeHours: storage.storageTimeHours,
            });
          } else {
            setStorageStats(null);
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load dashboard data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [address]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const spendingOverTime: SpendingData[] = useMemo(() => {
    const map = new Map<string, { amount: number; sessions: number }>();
    for (const tx of txs) {
      if (!isSpendingService(tx.service) || tx.amount_usdc == null) continue;
      const d = new Date(tx.created_at);
      if (Number.isNaN(d.getTime())) continue;
      const key = d.toISOString().slice(0, 10);
      const prev = map.get(key) || { amount: 0, sessions: 0 };
      map.set(key, { amount: prev.amount + tx.amount_usdc, sessions: prev.sessions + 1 });
    }
    const entries = Array.from(map.entries()).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return entries.map(([key, v]) => ({ date: formatDateLabel(key), amount: v.amount, sessions: v.sessions }));
  }, [txs]);

  const serviceUsage: ServiceUsageData[] = useMemo(() => {
    let videoTotal = 0;
    let apiTotal = 0;
    let storageTotal = 0;
    let videoSessions = 0;
    let apiSessions = 0;
    let storageSessions = 0;

    for (const tx of txs) {
      if (tx.amount_usdc == null) continue;
      if (tx.service === 'video_stream' || tx.service === 'video_purchase') {
        videoTotal += tx.amount_usdc;
        videoSessions += 1;
      } else if (tx.service === 'api_session') {
        apiTotal += tx.amount_usdc;
        apiSessions += 1;
      } else if (tx.service === 'storage') {
        storageTotal += tx.amount_usdc;
        storageSessions += 1;
      }
    }

    const grand = videoTotal + apiTotal + storageTotal;
    if (grand <= 0) return [];

    const mk = (service: string, amount: number, sessions: number, color: string): ServiceUsageData => ({
      service,
      amount,
      percentage: grand > 0 ? (amount / grand) * 100 : 0,
      sessions,
      color,
    });

    const data: ServiceUsageData[] = [];
    if (videoTotal > 0) data.push(mk('Video Streaming', videoTotal, videoSessions, '#3b82f6'));
    if (apiTotal > 0) data.push(mk('API Calls', apiTotal, apiSessions, '#8b5cf6'));
    if (storageTotal > 0) data.push(mk('Cloud Storage', storageTotal, storageSessions, '#06b6d4'));
    return data;
  }, [txs]);

  const activity: ActivityData[] = useMemo(() => {
    return txs
      .filter(tx => isSpendingService(tx.service))
      .map((tx, idx) => {
        let type: ActivityData['type'] = 'stream';
        let serviceLabel = 'Video Streaming';
        if (tx.service === 'api_session') {
          type = 'api';
          serviceLabel = 'API Session';
        } else if (tx.service === 'storage') {
          type = 'storage';
          serviceLabel = 'Storage';
        } else if (tx.service === 'video_purchase') {
          type = 'stream';
          serviceLabel = 'Video Purchase';
        }
        const created = new Date(tx.created_at);
        const timeLabel = Number.isNaN(created.getTime()) ? tx.created_at : created.toLocaleString();
        return {
          id: tx.id ?? idx,
          service: serviceLabel,
          time: timeLabel,
          cost: tx.amount_usdc || 0,
          type,
        } as ActivityData;
      });
  }, [txs]);

  const spentThisMonth = useMemo(() => {
    let total = 0;
    for (const tx of txs) {
      if (!isSpendingService(tx.service) || tx.amount_usdc == null) continue;
      const d = new Date(tx.created_at);
      if (Number.isNaN(d.getTime())) continue;
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        total += tx.amount_usdc;
      }
    }
    return total;
  }, [txs, currentMonth, currentYear]);

  const totalApiSessions = useMemo(() => txs.filter(tx => tx.service === 'api_session').length, [txs]);

  const totalStreams = useMemo(
    () => txs.filter(tx => tx.service === 'video_stream').length,
    [txs]
  );

  const videoTrend = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of txs) {
      if (tx.service !== 'video_stream' && tx.service !== 'video_purchase') continue;
      if (tx.amount_usdc == null) continue;
      const key = new Date(tx.created_at).toISOString().slice(0, 10);
      const prev = map.get(key) || 0;
      map.set(key, prev + tx.amount_usdc);
    }
    const entries = Array.from(map.entries()).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return entries.map(([key, value]) => ({ day: formatDayLabel(key), value }));
  }, [txs]);

  const videoSessionStats = useMemo(() => {
    const sessions = videoSessionsMeta?.count ?? serviceUsage.find(s => s.service === 'Video Streaming')?.sessions ?? 0;
    const totalSeconds = videoSessionsMeta?.totalSeconds ?? 0;
    const hoursWatched = totalSeconds / 3600;
    const videoUsage = serviceUsage.find(s => s.service === 'Video Streaming');
    const avgPerSession = sessions > 0 && videoUsage ? videoUsage.amount / sessions : 0;
    return { sessions, hoursWatched, avgPerSession };
  }, [videoSessionsMeta, serviceUsage]);

  const apiCallStats = useMemo(() => {
    const apiUsage = serviceUsage.find(s => s.service === 'API Calls');
    const totalCalls = apiUsage?.sessions ?? 0;
    const apiDates = new Set<string>();
    for (const tx of txs) {
      if (tx.service !== 'api_session') continue;
      const d = new Date(tx.created_at);
      if (Number.isNaN(d.getTime())) continue;
      apiDates.add(d.toISOString().slice(0, 10));
    }
    const activeApiDays = apiDates.size || 1;
    const callsPerDayAvg = totalCalls / activeApiDays;
    const avgPerCall = apiUsage && totalCalls > 0 ? apiUsage.amount / totalCalls : 0;
    return { totalCalls, callsPerDayAvg, avgPerCall };
  }, [serviceUsage, txs]);

  const storageUsageStats = useMemo(() => {
    if (!storageStats) {
      return { totalStoredGB: 0, activeFiles: 0, avgHoursPerFile: 0 };
    }
    const { totalStoredGB, activeFiles, storageTimeHours } = storageStats;
    const avgHoursPerFile = activeFiles > 0 ? storageTimeHours / activeFiles : 0;
    return { totalStoredGB, activeFiles, avgHoursPerFile };
  }, [storageStats]);

  const apiCallsTrend = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of txs) {
      if (tx.service !== 'api_session') continue;
      const key = new Date(tx.created_at).toISOString().slice(0, 10);
      const prev = map.get(key) || 0;
      map.set(key, prev + 1);
    }
    const entries = Array.from(map.entries()).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return entries.map(([key, calls]) => ({ day: formatDayLabel(key), calls }));
  }, [txs]);

  const storageTrend = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of txs) {
      if (tx.service !== 'storage' || tx.amount_usdc == null) continue;
      const key = new Date(tx.created_at).toISOString().slice(0, 10);
      const prev = map.get(key) || 0;
      map.set(key, prev + tx.amount_usdc);
    }
    const entries = Array.from(map.entries()).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return entries.map(([key, value]) => ({ day: formatDayLabel(key), value }));
  }, [txs]);

  return {
    loading,
    error,
    spendingOverTime,
    serviceUsage,
    activity,
    totals: {
      spentThisMonth,
      totalApiSessions,
      totalStreams,
    },
    serviceDetails: {
      video: {
        totalSpent: serviceUsage.find(s => s.service === 'Video Streaming')?.amount || 0,
        trend: videoTrend,
        stats: videoSessionStats,
      },
      api: {
        totalSpent: serviceUsage.find(s => s.service === 'API Calls')?.amount || 0,
        data: apiCallsTrend,
        stats: apiCallStats,
      },
      storage: {
        totalSpent: serviceUsage.find(s => s.service === 'Cloud Storage')?.amount || 0,
        data: storageTrend,
        stats: storageUsageStats,
      },
    },
  };
}

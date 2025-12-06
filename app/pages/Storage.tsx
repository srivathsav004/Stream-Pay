import React, { useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { StorageFile } from './Storage/types';
import StorageHeader from './Storage/StorageHeader';
import PricingBanner from './Storage/PricingBanner';
import StorageStats from './Storage/StorageStats';
import StorageOverview from './Storage/StorageOverview';
import FileManager from './Storage/FileManager';
import UploadArea from './Storage/UploadArea';
import UsageHistory from './Storage/UsageHistory';
import Analytics from './Storage/Analytics';
import StorageOptimizationTips from './Storage/StorageOptimizationTips';
import { useAccount } from 'wagmi';
import { uploadFile as apiUploadFile, listFiles as apiListFiles, getStats as apiGetStats, getUsage as apiGetUsage, getDownloadUrl as apiGetDownloadUrl } from '@/app/shared/services/web2-services/storage';
import { useToast } from '@/components/ui/use-toast';

const Storage: React.FC = () => {
  const [balance] = useState(0);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [stats, setStats] = useState({ totalSpentUSDC: 0, totalStoredGB: 0, activeFiles: 0, storageTimeHours: 0 });
  const [deletedMinutes, setDeletedMinutes] = React.useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [fileTypeData, setFileTypeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { address } = (useAccount as any)() || { address: undefined };

  const mapRowToStorageFile = (row: any): StorageFile => {
    const sizeMB = Number(row.size_bytes || 0) / (1024 * 1024);
    const ct = String(row.content_type || '').toLowerCase();
    const fileType = ct.includes('pdf') ? 'pdf'
      : ct.includes('image') ? 'image'
      : ct.includes('video') ? 'video'
      : ct.includes('audio') ? 'audio'
      : ct.includes('zip') || ct.includes('tar') ? 'archive'
      : ct.includes('sheet') || ct.includes('excel') || ct.includes('csv') ? 'spreadsheet'
      : 'other';
    const ratePerMBPerHour = 0.0001;
    return {
      id: String(row.id),
      name: row.filename,
      size: Number(sizeMB.toFixed(2)),
      type: 'file',
      fileType: fileType as any,
      uploadedAt: new Date(row.uploaded_at).toISOString(),
      duration: undefined,
      costPerHour: Number((sizeMB * ratePerMBPerHour).toFixed(6)),
      totalCost: Number((Number(row.amount_usdc || 0)).toFixed(6)),
      ipfsCid: row.file_cid || undefined,
      txHash: row.tx_hash || undefined,
      status: row.deleted_at ? 'deleted' : 'active',
    };
  };

  const refreshingRef = React.useRef(false);
  const loadedForAddrRef = React.useRef<string | null>(null);

  const refreshAll = async () => {
    if (!address) return;
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    try {
      const [filesJson, statsJson, usageJson] = await Promise.all([
        apiListFiles(address, true),
        apiGetStats(address),
        apiGetUsage(address),
      ]);
      setFiles((filesJson.files || []).map(mapRowToStorageFile));
      setStats(statsJson);
      setHistory(usageJson.history || []);

      const now = Date.now();
      const rows = filesJson.files || [];
      const deletedSumMin = rows
        .filter((r: any) => !!r.deleted_at)
        .reduce((s: number, r: any) => s + Number(r.storage_min || 0), 0);
      setDeletedMinutes(Math.max(0, Math.round(deletedSumMin)));

      // Basic analytics from files list
      const nowDate = new Date();
      const last7 = [...Array(7)].map((_, i) => {
        const d = new Date(nowDate.getTime() - (6 - i) * 24 * 3600 * 1000);
        const day = d.toISOString().slice(0, 10);
        const totalGB = (filesJson.files || [])
          .filter((f: any) => (!f.deleted_at) && new Date(f.uploaded_at).toISOString().slice(0, 10) <= day)
          .reduce((s: number, f: any) => s + Number(f.size_bytes || 0), 0) / (1024 ** 3);
        return { date: day, storageGB: Number(totalGB.toFixed(3)) };
      });
      setAnalyticsData(last7);
      const byType: Record<string, { size: number }> = {};
      (filesJson.files || []).forEach((f: any) => {
        const ct = String(f.content_type || '').toLowerCase();
        let key = ct.split('/')[0] || 'other';
        // Group all application/* types under Documents for display
        if (ct.startsWith('application/')) {
          key = 'Documents';
        }
        byType[key] = byType[key] || { size: 0 };
        byType[key].size += Number(f.size_bytes || 0);
      });
      const total = Object.values(byType).reduce((s, v) => s + v.size, 0) || 1;
      const ftypes = Object.entries(byType).map(([k, v]) => ({ type: k, storageGB: v.size / (1024 ** 3), percentage: Math.round((v.size / total) * 100), cost: (v.size / (1024 * 1024)) * 0.0001 }));
      setFileTypeData(ftypes);
    } catch (e) {
      // noop
    } finally {
      refreshingRef.current = false;
    }
  };

  React.useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }
    if (loadedForAddrRef.current === address) return; // guard React StrictMode double-invoke
    loadedForAddrRef.current = address;
    setIsLoading(true);
    refreshAll().finally(() => setIsLoading(false));
  }, [address]);

  // Calculate current costs
  const totalSizeMB = files
    .filter(f => f.type === 'file' && f.status === 'active')
    .reduce((sum, f) => sum + f.size, 0);
  const totalSizeGB = totalSizeMB / 1024;
  const ratePerMBPerHour = 0.0001;
  const hourlyCost = totalSizeMB * ratePerMBPerHour;
  const dailyCost = hourlyCost * 24;
  const monthlyCost = hourlyCost * 24 * 30;

  const MAX_STORAGE_GB = 1; // Maximum storage limit set to 1 GB
  const emptyCostBreakdown = {
    thisWeek: { cost: 0, avgStorage: 0, filesAdded: 0, filesDeleted: 0 },
    thisMonth: { cost: 0, avgStorage: 0, filesAdded: 0, filesDeleted: 0 },
    mostExpensiveFile: { name: '-', size: 0, cost: 0 },
    longestStoredFile: { name: '-', size: 0, hours: 0 },
  };

  const handleUpload = async (_file: File) => {
    // Upload is handled inside UploadArea with progress; this just refreshes after completion.
    try {
      setShowUpload(false);
      // Refresh in background without showing loading
      refreshAll().catch(console.error);
      toast({
        title: "File uploaded",
        description: "File uploaded successfully",
      });
    } catch (e: any) {
      toast({
        title: "Upload failed",
        description: e?.message || 'Failed to upload file',
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      // Optimistically remove file from list
      setFiles(files.filter(f => f.id !== fileId));
      toast({
        title: "File deleted",
        description: "File deleted and settled successfully",
      });
      // Refresh in background without showing loading
      refreshAll().catch(console.error);
    } catch (e: any) {
      toast({
        title: "Deletion failed",
        description: e?.message || 'Failed to delete file',
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (fileId: string) => {
    const f = files.find(x => x.id === fileId);
    if (!f?.ipfsCid) return;
    try {
      const j = await apiGetDownloadUrl(f.ipfsCid);
      if (j.url) window.open(j.url, '_blank');
    } catch {}
  };

  const handleRead = async (fileId: string) => {
    const f = files.find(x => x.id === fileId);
    if (!f?.ipfsCid) return;
    try {
      const j = await apiGetDownloadUrl(f.ipfsCid);
      if (j.url) window.open(j.url, '_blank');
    } catch {}
  };

  const handleViewDetails = (file: StorageFile) => {
    console.log('Viewing details for:', file.name);
    // In a real app, this would open a modal with file details
  };

  const handleNewFolder = () => {
    const newFolder: StorageFile = {
      id: `folder-${Date.now()}`,
      name: 'New Folder',
      size: 0,
      type: 'folder',
      uploadedAt: 'Just now',
      status: 'active',
      costPerHour: 0,
      totalCost: 0,
    };
    setFiles([...files, newFolder]);
  };

  const handleDeposit = () => {
    console.log('Opening deposit modal...');
  };

  const activeMinutesLiveBaseline = React.useMemo(() => {
    const now = Date.now();
    return files
      .filter(f => f.status === 'active' && f.type === 'file')
      .reduce((s, f) => {
        const t = new Date(f.uploadedAt).getTime();
        return s + (Number.isFinite(t) ? Math.max(0, (now - t) / 60000) : 0);
      }, 0);
  }, [files]);

  return (
    <DashboardLayout>
      <StorageHeader />
      {/* <PricingBanner balance={balance} /> */}
      <StorageStats
        totalSpent={Number(stats.totalSpentUSDC ?? 0)}
        totalStored={Number(((stats.totalStoredGB ?? 0) * 1024).toFixed(2))}
        activeFiles={stats.activeFiles || files.filter(f=>f.status==='active').length}
        storageTime={Math.round(deletedMinutes + activeMinutesLiveBaseline)}
      />
      <StorageOverview
        usedGB={totalSizeGB}
        maxGB={MAX_STORAGE_GB}
        hourlyCost={hourlyCost}
        dailyCost={dailyCost}
        monthlyCost={monthlyCost}
        balance={balance}
        onDeposit={handleDeposit}
      />
      
      {showUpload ? (
        <UploadArea onUpload={handleUpload} balance={balance} />
      ) : (
        <FileManager
          files={files.filter(f => f.status === 'active')}
          onUpload={() => setShowUpload(true)}
          onNewFolder={handleNewFolder}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onRead={handleRead}
          onViewDetails={handleViewDetails}
        />
      )}

      <UsageHistory history={history as any} />
      <Analytics
        storageData={analyticsData}
        fileTypeData={fileTypeData}
        costBreakdown={emptyCostBreakdown as any}
      />
      {/* <StorageOptimizationTips /> */}
    </DashboardLayout>
  );
};

export default Storage;

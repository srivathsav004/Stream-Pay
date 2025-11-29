import React, { useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import {
  storageFiles,
  usageHistory,
  analyticsData,
  fileTypeData,
  costBreakdown,
  storageStats,
  maxStorage,
} from './Storage/data';
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

const Storage: React.FC = () => {
  const [balance] = useState(2.47);
  const [files, setFiles] = useState<StorageFile[]>(storageFiles);
  const [showUpload, setShowUpload] = useState(false);

  // Calculate current costs
  const totalSizeMB = files
    .filter(f => f.type === 'file' && f.status === 'active')
    .reduce((sum, f) => sum + f.size, 0);
  const totalSizeGB = totalSizeMB / 1024;
  const ratePerMBPerHour = 0.00001;
  const hourlyCost = totalSizeMB * ratePerMBPerHour;
  const dailyCost = hourlyCost * 24;
  const monthlyCost = hourlyCost * 24 * 30;

  const handleUpload = (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    const newFile: StorageFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: fileSizeMB,
      type: 'file',
      fileType: 'other',
      uploadedAt: 'Just now',
      duration: 0,
      costPerHour: fileSizeMB * ratePerMBPerHour,
      totalCost: 0,
      status: 'active',
    };
    setFiles([...files, newFile]);
    setShowUpload(false);
  };

  const handleDelete = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const handleDownload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      console.log('Downloading file:', file.name);
      // In a real app, this would download from IPFS
    }
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

  return (
    <DashboardLayout>
      <StorageHeader />
      <PricingBanner balance={balance} />
      <StorageStats
        totalSpent={storageStats.totalSpent}
        totalStored={storageStats.totalStored}
        activeFiles={storageStats.activeFiles}
        storageTime={storageStats.storageTime}
      />
      <StorageOverview
        usedGB={totalSizeGB}
        maxGB={maxStorage}
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
          files={files}
          onUpload={() => setShowUpload(true)}
          onNewFolder={handleNewFolder}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onViewDetails={handleViewDetails}
        />
      )}

      <UsageHistory history={usageHistory} />
      <Analytics
        storageData={analyticsData}
        fileTypeData={fileTypeData}
        costBreakdown={costBreakdown}
      />
      {/* <StorageOptimizationTips /> */}
    </DashboardLayout>
  );
};

export default Storage;

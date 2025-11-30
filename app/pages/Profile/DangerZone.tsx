import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface DangerZoneProps {
  onExportData: () => void;
  onClearHistory: () => void;
  onDeleteAccount: () => void;
}

const DangerZone: React.FC<DangerZoneProps> = ({
  onExportData,
  onClearHistory,
  onDeleteAccount,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClearHistory = () => {
    if (showClearConfirm) {
      onClearHistory();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      onDeleteAccount();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <Card className="p-6 border-red-600/50">
      <h2 className="text-lg font-semibold text-white mb-6">Danger Zone</h2>
      <div className="space-y-4">
        {/* Export Data */}
        <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Export All Data</h3>
              <p className="text-xs text-[#a1a1a1]">Download all your data in JSON format</p>
            </div>
            <Button variant="outline" size="sm" onClick={onExportData}>
              Export Data
            </Button>
          </div>
        </Card>

        {/* Clear History */}
        <Card className="p-4 bg-[#0a0a0a] border-red-600/30">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Clear All History</h3>
              <p className="text-xs text-[#a1a1a1]">
                {showClearConfirm
                  ? 'Are you sure? This action cannot be undone.'
                  : 'Permanently delete all usage history (cannot be undone)'}
              </p>
            </div>
            <Button
              variant={showClearConfirm ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleClearHistory}
              className={showClearConfirm ? 'bg-red-600 hover:bg-red-500' : ''}
            >
              {showClearConfirm ? 'Confirm Clear' : 'Clear History'}
            </Button>
          </div>
        </Card>

        {/* Delete Account */}
        <Card className="p-4 bg-[#0a0a0a] border-red-600/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Delete Account</h3>
              <p className="text-xs text-[#a1a1a1]">
                {showDeleteConfirm
                  ? 'This will permanently delete your account and all data. This action cannot be undone.'
                  : 'Permanently delete your account and all data'}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDeleteAccount}
              className={showDeleteConfirm ? 'bg-red-600 hover:bg-red-500' : 'bg-red-600/20 hover:bg-red-600/30 border-red-600/50'}
            >
              {showDeleteConfirm ? 'Confirm Delete' : 'Delete Account'}
            </Button>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default DangerZone;


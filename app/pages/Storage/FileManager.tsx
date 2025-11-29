import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { StorageFile } from './types';

interface FileManagerProps {
  files: StorageFile[];
  onUpload: () => void;
  onNewFolder: () => void;
  onDelete: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  onViewDetails: (file: StorageFile) => void;
}

const getFileIcon = (file: StorageFile) => {
  if (file.type === 'folder') return '📁';
  switch (file.fileType) {
    case 'pdf': return '📄';
    case 'image': return '🖼️';
    case 'video': return '📹';
    case 'spreadsheet': return '📊';
    case 'archive': return '📦';
    case 'audio': return '🎵';
    case 'code': return '📝';
    default: return '📄';
  }
};

const FileManager: React.FC<FileManagerProps> = ({
  files,
  onUpload,
  onNewFolder,
  onDelete,
  onDownload,
  onViewDetails,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkDelete = () => {
    selectedFiles.forEach(id => onDelete(id));
    setSelectedFiles([]);
  };

  const handleBulkDownload = () => {
    selectedFiles.forEach(id => onDownload(id));
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Your Files ({files.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}>
            {viewMode === 'table' ? 'Grid' : 'Table'}
          </Button>
          <Button variant="outline" size="sm" onClick={onNewFolder}>New Folder</Button>
          <Button variant="primary" size="sm" onClick={onUpload}>Upload File</Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2 text-sm text-white placeholder:text-[#a1a1a1] outline-none focus:border-blue-600"
        />
        <select className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2">
          <option>Filter: All</option>
        </select>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4 p-3 bg-blue-600/10 border border-blue-600/50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-white">{selectedFiles.length} file(s) selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkDownload}>Download Selected</Button>
            <Button variant="outline" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
          </div>
        </div>
      )}

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="text-left py-3 px-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[#262626]"
                  />
                </th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Name</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Size</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Uploaded</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Cost/Hour</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Total</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-[#262626] hover:bg-[#1a1a1a] cursor-pointer"
                  onClick={() => onViewDetails(file)}
                >
                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleSelectFile(file.id)}
                      className="rounded border-[#262626]"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span>{getFileIcon(file)}</span>
                      <span className="text-sm text-white">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">
                    {file.type === 'folder' ? '-' : `${file.size} MB`}
                  </td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">{file.uploadedAt}</td>
                  <td className="py-3 px-2 text-sm font-mono text-[#a1a1a1]">
                    {file.type === 'folder' ? '-' : `${file.costPerHour} AVAX`}
                  </td>
                  <td className="py-3 px-2 text-sm font-mono text-white">
                    {file.type === 'folder' ? '-' : `${file.totalCost} AVAX`}
                  </td>
                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      {file.type === 'file' && (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDownload(file.id)}>
                            ⬇
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete(file.id)}>
                            🗑️
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className="p-4 hover:border-blue-600 cursor-pointer"
              onClick={() => onViewDetails(file)}
            >
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{getFileIcon(file)}</div>
                <div className="text-xs text-white font-medium truncate">{file.name}</div>
              </div>
              {file.type === 'file' && (
                <>
                  <div className="text-xs text-[#a1a1a1] mb-1">{file.size} MB</div>
                  <div className="text-xs font-mono text-white mb-3">{file.totalCost} AVAX</div>
                </>
              )}
              <div className="flex gap-1 justify-center" onClick={(e) => e.stopPropagation()}>
                {file.type === 'file' && (
                  <>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDownload(file.id)}>
                      ⬇
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete(file.id)}>
                      🗑️
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default FileManager;


// web2-services/storage.ts
// Thin client wrappers around backend POST-only storage endpoints

const RAW_BASE = (import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';
const API = `${RAW_BASE}/api/web2`;

async function jsonPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed: ${path}`);
  return data as T;
}

export async function uploadFile(user_address: string, file: File) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('user_address', user_address);
  const res = await fetch(`${API}/storage/upload`, { method: 'POST', body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Upload failed');
  return data as { success: boolean; file: any; gateway_url?: string };
}

export function uploadFileWithProgress(params: {
  user_address: string;
  file: File;
  name?: string;
  onProgress?: (pct: number) => void;
}): Promise<{ success: boolean; file: any; gateway_url?: string; idempotent?: boolean }> {
  const { user_address, file, name, onProgress } = params;
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('user_address', user_address);
    if (name) fd.append('name', name);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API}/storage/upload`);
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300) resolve(json);
        else reject(new Error(json?.error || 'Upload failed'));
      } catch {
        reject(new Error('Upload failed'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.upload.onprogress = (evt) => {
      if (!onProgress || !evt.lengthComputable) return;
      const pct = Math.round((evt.loaded / evt.total) * 100);
      onProgress(pct);
    };
    xhr.send(fd);
  });
}

export async function listFiles(user_address: string, include_deleted = false) {
  return jsonPost<{ files: any[] }>(`/storage/files`, { user_address, include_deleted });
}

export async function getStats(user_address: string) {
  return jsonPost<{ totalSpentUSDC: number; totalStoredGB: number; activeFiles: number; storageTimeHours: number }>(`/storage/stats`, { user_address });
}

export async function getUsage(user_address: string) {
  return jsonPost<{ history: any[] }>(`/storage/usage`, { user_address });
}

export async function getDownloadUrl(file_cid: string) {
  return jsonPost<{ url: string }>(`/storage/download-url`, { file_cid });
}

export async function deleteFile(params: { id: number | string; user_address: string; amount_usdc?: number; tx_hash?: string }) {
  return jsonPost<{ success: boolean; file: any }>(`/storage/delete`, params);
}

export async function updateFile(params: { id: number | string; user_address: string } & Record<string, any>) {
  return jsonPost<{ success: boolean; file: any }>(`/storage/update`, params);
}

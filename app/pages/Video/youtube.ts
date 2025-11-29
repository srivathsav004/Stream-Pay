export const getYouTubeId = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return id;
      const parts = u.pathname.split('/');
      const idx = parts.indexOf('embed');
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {}
  return null;
};

export type OEmbed = { title: string; thumbnail_url: string; author_name?: string };

export const fetchOEmbed = async (url: string): Promise<OEmbed | null> => {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (!res.ok) return null;
    return (await res.json()) as OEmbed;
  } catch {
    return null;
  }
};

// Parse ISO 8601 duration like PT1H2M10S to mm:ss (or hh:mm:ss if >=1h)
export const parseISODuration = (iso: string): string => {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  if (!match) return '';
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

let ytApiLoading: Promise<void> | null = null;
const ensureWindow = () => typeof window !== 'undefined' ? window as any : undefined;

export const loadYouTubeIframeAPI = async (): Promise<void> => {
  const w = ensureWindow();
  if (!w) return; // SSR safeguard
  if (w.YT && w.YT.Player) return; // already loaded
  if (ytApiLoading) return ytApiLoading;
  ytApiLoading = new Promise<void>((resolve) => {
    const existing = document.getElementById('youtube-iframe-api');
    if (!existing) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    (w as any).onYouTubeIframeAPIReady = () => resolve();
  });
  return ytApiLoading;
};

const formatSeconds = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const fetchDurationViaIframe = async (videoId: string): Promise<string | null> => {
  const w = ensureWindow();
  if (!w) return null;
  await loadYouTubeIframeAPI();
  return new Promise<string | null>((resolve) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-99999px';
    container.style.top = '-99999px';
    document.body.appendChild(container);
    const player = new (w as any).YT.Player(container, {
      height: '0',
      width: '0',
      videoId,
      events: {
        onReady: () => {
          try {
            // give it a tick to populate metadata
            setTimeout(() => {
              const secs = player.getDuration?.();
              const val = typeof secs === 'number' && secs > 0 ? formatSeconds(secs) : null;
              player.destroy?.();
              container.remove();
              resolve(val);
            }, 150);
          } catch {
            player.destroy?.();
            container.remove();
            resolve(null);
          }
        },
        onError: () => {
          try { player.destroy?.(); container.remove(); } catch {}
          resolve(null);
        },
      },
      playerVars: { controls: 0, disablekb: 1, modestbranding: 1 }
    });
  });
};

export const fetchYouTubeDuration = async (videoId: string): Promise<string | null> => {
  const key = (import.meta as any).env?.VITE_YT_API_KEY as string | undefined;
  if (key) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${key}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const iso = data?.items?.[0]?.contentDetails?.duration as string | undefined;
        if (iso) return parseISODuration(iso);
      }
    } catch {}
  }
  // Fallback: use iframe API in browser
  return fetchDurationViaIframe(videoId);
};

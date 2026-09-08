'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Camera, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { getBackendUrl } from '@/lib/mode';

interface LiveCameraPlayerProps {
  cameraId: string;
  status: string; // STARTING, LIVE, DEGRADED, OFFLINE, RECONNECTING, ERROR
}

export function LiveCameraPlayer({ cameraId, status }: LiveCameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only attempt to load HLS if the status is LIVE or DEGRADED
    if (status !== 'LIVE' && status !== 'DEGRADED') {
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const streamUrl = `${getBackendUrl()}/hls/${cameraId}/index.m3u8`;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        // Optimize for low latency live streaming
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.warn('Auto-play prevented', e));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              setError('Stream playback failed');
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.warn('Auto-play prevented', e));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [cameraId, status]);

  // Fallback UI rendering based on status
  if (status === 'STARTING' || status === 'RECONNECTING') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0f18] text-white">
        <RefreshCw size={24} className="animate-spin text-blue-500 mb-2 opacity-70" />
        <span className="text-xs font-bold tracking-widest text-blue-500">{status}</span>
        <span className="text-[10px] text-gray-500 mt-1 font-mono">{cameraId}</span>
      </div>
    );
  }

  if (status === 'OFFLINE' || status === 'ERROR') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0f18] text-white relative">
        {/* Background static simulation for offline cameras */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
        
        <WifiOff size={24} className="text-red-500 mb-2 opacity-70" />
        <span className="text-xs font-bold tracking-widest text-red-500">{status}</span>
        <span className="text-[10px] text-gray-500 mt-1 font-mono">{cameraId}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
          <AlertTriangle size={24} className="text-yellow-500 mb-2" />
          <span className="text-xs text-yellow-500 font-bold">{error}</span>
        </div>
      )}
    </div>
  );
}

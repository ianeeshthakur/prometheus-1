'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Maximize2, ExternalLink, Search } from 'lucide-react';
import { LiveCameraPlayer } from '@/components/cameras/LiveCameraPlayer';
import { StreamHealthBadge } from '@/components/cameras/StreamHealthBadge';
import { getBackendUrl } from '@/lib/mode';

interface LiveStreamStatus {
  camera_id: string;
  status: string;
  fps: number;
  latency_ms: number;
}

interface CameraCardProps {
  cam: any;
  index: number;
  isLive?: boolean;
  isFocused?: boolean;
  isDimmed?: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
}

export function CameraCard({ cam, index, isLive, isFocused, isDimmed, onClick, onDoubleClick }: CameraCardProps) {
  const [streamStatus, setStreamStatus] = useState<LiveStreamStatus | null>(null);

  useEffect(() => {
    if (isLive && cam.id) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${getBackendUrl()}/api/streams/${cam.id}/status`);
          if (res.ok) {
            const data = await res.json();
            setStreamStatus(data);
          }
        } catch (e) {
          console.error("Failed to fetch stream status", e);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLive, cam.id]);

  const hasAnpr = cam.aiCapabilities?.includes('ANPR') || false;
  const hasPerson = cam.aiCapabilities?.includes('Person Detection') || false;

  const detections = [
    hasAnpr ? [
      { type: 'vehicle', x: '15%', y: '35%', w: '40%', h: '28%', label: 'VEHICLE · 96%', color: 'var(--accent-cyan)' },
      { type: 'plate', x: '22%', y: '52%', w: '18%', h: '7%', label: 'PLATE · 94%', color: 'var(--status-warning)' },
    ] : [],
    hasPerson ? [
      { type: 'person', x: '70%', y: '40%', w: '10%', h: '45%', label: 'PERSON · 88%', color: '#10b981' }
    ] : []
  ].flat();

  return (
    <div 
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`
        relative flex flex-col bg-[#0a0f18] rounded-xl overflow-hidden cursor-pointer
        border transition-all duration-300 ease-out group
        ${isFocused ? 'border-[var(--accent-blue)] shadow-[0_0_20px_rgba(14,165,233,0.15)] ring-1 ring-[var(--accent-blue)]' : 'border-white/10 hover:border-[var(--accent-cyan)]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]'}
        ${isDimmed ? 'opacity-40 grayscale-[50%]' : 'opacity-100 grayscale-0'}
        ${!isFocused && !isDimmed && 'hover:-translate-y-1'}
      `}
      style={{ height: '280px' }}
    >
      {/* Video Area (80%) */}
      <div className="relative flex-1 bg-[#05080c] overflow-hidden">
        {isLive && streamStatus ? (
          <LiveCameraPlayer cameraId={cam.id} status={streamStatus.status} />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
            {/* Subtle animated scan effect for AI */}
            {cam.status === 'ONLINE' && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="w-full h-1 bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan)] animate-[scan_4s_ease-in-out_infinite]" />
              </div>
            )}
          </>
        )}

        {/* AI Bounding Boxes */}
        {!isLive && cam.status === 'ONLINE' && detections.map((det, i) => (
          <div
            key={i}
            className="absolute border border-dashed transition-opacity duration-300 opacity-80"
            style={{
              left: det.x, top: det.y, width: det.w, height: det.h,
              borderColor: det.color,
            }}
          >
            <div 
              className="absolute -top-5 left-[-1px] px-1.5 py-0.5 text-[9px] font-bold text-black tracking-wider shadow-sm"
              style={{ backgroundColor: det.color }}
            >
              {det.label}
            </div>
          </div>
        ))}

        {/* Offline State */}
        {cam.status === 'OFFLINE' && !isLive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <WifiOff size={24} className="text-red-500/80 mb-2" />
            <span className="text-[10px] font-bold tracking-widest text-red-500/80">NO SIGNAL</span>
          </div>
        )}

        {/* Top Left Overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {isLive && streamStatus ? (
            <StreamHealthBadge status={streamStatus.status} fps={streamStatus.fps} latencyMs={streamStatus.latency_ms} />
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10">
              {cam.status === 'ONLINE' ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_6px_#10b981]" />
                  <span className="text-[9px] font-bold text-[#10b981] tracking-widest">LIVE</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[9px] font-bold text-red-400 tracking-widest">OFFLINE</span>
                </>
              )}
            </div>
          )}
          {cam.status === 'ONLINE' && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-[9px] font-bold text-[var(--accent-cyan)] tracking-widest">AI ACTIVE</span>
            </div>
          )}
        </div>

        {/* Top Right Overlays */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white tracking-wider">
            {cam.id}
          </div>
          <button 
            className="p-1.5 rounded bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-black/80 transition-colors backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation();
              if (onDoubleClick) onDoubleClick();
            }}
          >
            <Maximize2 size={12} />
          </button>
        </div>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--accent-blue)] text-white text-[11px] font-bold shadow-lg hover:bg-[var(--accent-blue-bright)] transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300">
            <ExternalLink size={12} /> VIEW
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white text-[11px] font-bold shadow-lg hover:bg-white/20 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75">
            <Search size={12} /> CASE
          </button>
        </div>
      </div>

      {/* Metadata Bottom Bar (20%) */}
      <div className="bg-[#0f172a] border-t border-white/5 p-3 flex flex-col justify-center h-[56px]">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[12px] font-bold text-white/90 truncate">
            {cam.location}
          </div>
          <div className="text-[10px] font-mono text-white/50 shrink-0 ml-2">
            {cam.fps || 25} FPS
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
          <span>{cam.source_type || cam.integration || 'RTSP'}</span>
          <span>·</span>
          <span>1080p</span>
          {cam.aiCapabilities && cam.aiCapabilities.length > 0 && (
            <>
              <span>·</span>
              <span className="text-[var(--accent-cyan)] font-semibold">{cam.aiCapabilities[0]}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

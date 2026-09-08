'use client';

import { useState, useEffect } from 'react';
import { CAMERAS } from '@/lib/mock-data';
import { Camera, WifiOff, Activity, Maximize2, ChevronDown } from 'lucide-react';
import { isLiveMode, getBackendUrl } from '@/lib/mode';
import { LiveCameraPlayer } from '@/components/cameras/LiveCameraPlayer';
import { StreamHealthBadge } from '@/components/cameras/StreamHealthBadge';

interface LiveStreamStatus {
  camera_id: string;
  status: string;
  fps: number;
  latency_ms: number;
}

function CameraFeedCard({ cam, index, isLive }: { cam: any; index: number; isLive?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [streamStatus, setStreamStatus] = useState<LiveStreamStatus | null>(null);

  // Fetch stream status if this is a live camera
  useEffect(() => {
    if (isLive && cam.id) {
      // Polling for health
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

  // Generate a stable-looking "live feed" using CSS patterns for DEMO mode
  const bgPatterns = [
    'linear-gradient(135deg, #0a1628 0%, #0d2240 40%, #050e1c 100%)',
    'linear-gradient(135deg, #0c1a10 0%, #0f2d14 40%, #050c08 100%)',
    'linear-gradient(135deg, #1a0c28 0%, #2d1440 40%, #0c0514 100%)',
    'linear-gradient(135deg, #1a1000 0%, #2d1e00 40%, #0a0800 100%)',
    'linear-gradient(135deg, #0a0d1a 0%, #0e1530 40%, #050810 100%)',
    'linear-gradient(135deg, #1a0808 0%, #2d0e0e 40%, #100404 100%)',
  ];

  const hasAnpr = cam.aiCapabilities?.includes('ANPR') || false;
  const hasPerson = cam.aiCapabilities?.includes('Person Detection') || false;

  const detections = [
    hasAnpr ? [
      { type: 'vehicle', x: '15%', y: '35%', w: '40%', h: '28%', label: 'VEHICLE · 96%', id: 'V-' + (100 + index) },
      { type: 'plate', x: '22%', y: '52%', w: '18%', h: '7%', label: 'PLATE · 94%', id: 'GJ' + (Math.floor(Math.random() * 99)).toString().padStart(2, '0') + 'AB' + Math.floor(1000 + Math.random() * 8999) },
    ] : [],
    hasPerson ? [
      { type: 'person', x: '70%', y: '40%', w: '10%', h: '45%', label: 'PERSON · 88%', id: 'P-' + (200 + index) }
    ] : []
  ].flat();

  return (
    <div className={`flex flex-col bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm hover:shadow-[var(--shadow-elevated)] transition-all duration-300 ${expanded ? 'fixed inset-4 z-50 bg-[var(--bg-panel)] shadow-2xl' : 'relative group'}`}>
      {expanded && <div className="absolute inset-0 bg-black/60 z-[-1]" onClick={() => setExpanded(false)} />}
      
      {/* Video Area */}
      <div 
        className={`${expanded ? 'flex-1 relative z-10' : 'h-48 relative'}`}
        style={{ background: '#000' }}
      >
        {isLive && streamStatus ? (
          <LiveCameraPlayer cameraId={cam.id} status={streamStatus.status} />
        ) : (
          /* Simulated camera effects for DEMO mode */
          <>
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
          </>
        )}

        {/* Overlays (Clean bounding boxes only) */}
        {!isLive && cam.status === 'ONLINE' && detections.map(det => (
          <div
            key={det.id}
            className="absolute border"
            style={{
              left: det.x, top: det.y, width: det.w, height: det.h,
              borderColor: det.type === 'vehicle' ? 'var(--accent-cyan)' : det.type === 'plate' ? 'var(--status-warning)' : '#10b981',
              backgroundColor: 'transparent',
            }}
          >
            <div className="absolute -top-5 left-[-1px] px-1 text-[9px] font-bold text-white tracking-wider" style={{ backgroundColor: det.type === 'vehicle' ? 'var(--accent-cyan)' : det.type === 'plate' ? 'var(--status-warning)' : '#10b981' }}>
              {det.label}
            </div>
          </div>
        ))}

        {cam.status === 'OFFLINE' && !isLive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <WifiOff size={24} className="text-red-500 mb-2 opacity-50" />
            <span className="text-[10px] font-bold tracking-widest text-red-500">NO SIGNAL</span>
          </div>
        )}

        {/* Live Status Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
          {isLive && streamStatus ? (
            <StreamHealthBadge status={streamStatus.status} fps={streamStatus.fps} latencyMs={streamStatus.latency_ms} />
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10">
              {cam.status === 'ONLINE' ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-green-400 tracking-wide">LIVE</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold text-red-400 tracking-wide">OFFLINE</span>
                </>
              )}
            </div>
          )}
          {cam.status === 'ONLINE' && (
            <div className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10">
               <span className="text-[10px] font-bold text-[var(--accent-cyan)] tracking-wide">AI ACTIVE</span>
            </div>
          )}
        </div>

        <button 
          className="absolute top-3 right-3 p-1.5 rounded bg-black/50 text-white hover:text-[var(--accent-cyan)] hover:bg-black/70 transition-colors z-20 backdrop-blur-md"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Camera metadata footer */}
      <div className={`p-4 ${expanded ? 'bg-[var(--bg-panel)] relative z-10' : 'bg-[var(--bg-surface)]'}`}>
        <div className="text-[13px] font-bold font-mono text-[var(--text-primary)] mb-0.5 tracking-tight">
          {cam.id}
        </div>
        <div className="text-[14px] font-medium text-[var(--text-secondary)] mb-3">
          {cam.location?.split(',')[0] || cam.location}
        </div>
        
        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
          <span>{cam.source_type || cam.integration || 'RTSP'}</span>
          <span>·</span>
          <span>{cam.fps || 25} FPS</span>
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

export default function CamerasPage() {
  const [layout, setLayout] = useState(3); // 2x2, 3x3, 4x4
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [liveCameras, setLiveCameras] = useState<any[]>([]);

  useEffect(() => {
    if (isLiveMode()) {
      fetch(`${getBackendUrl()}/api/cameras`)
        .then(res => res.json())
        .then(data => {
          if (data.cameras) {
            setLiveCameras(data.cameras);
          }
        })
        .catch(console.error);
    }
  }, []);

  const camerasToDisplay = isLiveMode() 
    ? [...liveCameras, ...CAMERAS].filter((c, i, self) => i === self.findIndex((t) => t.id === c.id))
    : CAMERAS;

  const filteredCameras = camerasToDisplay.filter(cam => {
    if (statusFilter === 'ALL') return true;
    return cam.status === statusFilter || (statusFilter === 'ONLINE' && !cam.status); // Default online for live mode cameras without status
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0f18] flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Camera size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Live Monitoring</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Real-time video feeds and edge AI detections</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Filters */}
          <div className="flex items-center bg-[#111827] rounded border border-white/5 p-1">
            {['ALL', 'ONLINE', 'OFFLINE'].map(status => (
              <button
                key={status}
                className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-wider transition-colors ${statusFilter === status ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-white/10" />

          {/* Grid Size Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider">GRID:</span>
            <div className="flex items-center bg-[#111827] rounded border border-white/5 p-1">
              {[2, 3, 4].map(size => (
                <button
                  key={size}
                  className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-colors ${layout === size ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                  onClick={() => setLayout(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#050810]">
        <div 
          className="grid gap-4"
          style={{ 
            gridTemplateColumns: `repeat(${layout}, minmax(0, 1fr))`,
          }}
        >
          {filteredCameras.map((cam, i) => (
            <CameraFeedCard key={cam.id} cam={cam} index={i} isLive={isLiveMode() && liveCameras.find(c => c.id === cam.id)} />
          ))}
        </div>
        
        {filteredCameras.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Camera size={32} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">No cameras match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

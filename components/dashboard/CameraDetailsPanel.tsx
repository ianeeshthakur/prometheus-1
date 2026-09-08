import { X, Camera as CameraIcon, Activity, Wifi, Video, MapPin, Maximize2 } from 'lucide-react';
import { CAMERAS } from '@/lib/mock-data';

interface CameraDetailsPanelProps {
  cameraId: string;
  onClose: () => void;
  onTrace?: () => void;
}

export function CameraDetailsPanel({ cameraId, onClose, onTrace }: CameraDetailsPanelProps) {
  // Find camera from mock data or use fallback
  const camera = CAMERAS.find(c => c.id === cameraId) || {
    id: cameraId,
    location: 'Surat Ring Road Intersection',
    district: 'Surat',
    status: 'ONLINE',
    integration: 'SENTINEL',
    fps: 25,
    resolution: '1080p',
    aiCapabilities: ['ANPR', 'Vehicle Detection']
  };

  return (
    <div className="flex flex-col h-full w-[400px] border-l border-[var(--border)] bg-[var(--bg-panel)] flex-shrink-0 animate-slide-left z-10 absolute right-0 top-0 bottom-0 shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div>
          <div className="text-[14px] font-semibold tracking-wide text-[var(--text-primary)]">
            Camera Details
          </div>
          <div className="text-[12px] text-[var(--text-muted)] mt-0.5 font-mono">
            {camera.id}
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-[var(--bg-input)] rounded-md transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Live Feed Placeholder */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-[var(--border)] mb-5 group">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 group-hover:text-white/80 transition-colors">
            <CameraIcon size={32} className="mb-2 opacity-50" />
            <span className="text-xs font-mono tracking-widest font-bold">LIVE FEED</span>
          </div>
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-bold text-green-400 tracking-wide">LIVE</span>
          </div>
          <button className="absolute bottom-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-white/70 hover:text-white transition-colors">
            <Maximize2 size={12} />
          </button>
        </div>

        {/* Status Row */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-3 flex flex-col items-center justify-center gap-1">
            <Wifi size={14} className="text-[var(--status-online)]" />
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Status</span>
            <span className="text-xs font-bold text-[var(--status-online)]">ONLINE</span>
          </div>
          <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-3 flex flex-col items-center justify-center gap-1">
            <Video size={14} className="text-[var(--accent-cyan)]" />
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Quality</span>
            <span className="text-xs font-bold text-[var(--text-primary)]">{camera.resolution} · {camera.fps} FPS</span>
          </div>
        </div>

        {/* Info List */}
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1.5">LOCATION</div>
            <div className="flex items-start gap-2 text-[13px] text-[var(--text-primary)]">
              <MapPin size={14} className="text-[var(--text-muted)] mt-0.5 shrink-0" />
              <div>
                <div>{camera.location}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{camera.district} District</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1.5">AI CAPABILITIES</div>
            <div className="flex flex-wrap gap-2">
              {camera.aiCapabilities?.map(cap => (
                <span key={cap} className="px-2 py-1 bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20 rounded text-[10px] font-bold tracking-wide">
                  {cap}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1.5">NETWORK PATH</div>
            <div className="font-mono text-[11px] text-[var(--text-secondary)] bg-[var(--bg-input)] p-2 rounded border border-[var(--border)]">
              {camera.integration} RTSP GATEWAY
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-2">
          <button 
            onClick={onTrace}
            className="w-full py-2 bg-[var(--accent-cyan)]/10 hover:bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] rounded-lg text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            <Activity size={14} />
            VIEW ANALYTICS LOG
          </button>
        </div>
      </div>
    </div>
  );
}

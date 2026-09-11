'use client';

import { useState, useEffect } from 'react';
import { CAMERAS } from '@/lib/mock-data';
import { isLiveMode, getBackendUrl } from '@/lib/mode';
import { CameraCard } from '@/components/cameras/CameraCard';
import { CameraFilters } from '@/components/cameras/CameraFilters';
import { CameraDetailsPanel } from '@/components/cameras/CameraDetailsPanel';

export default function CamerasPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [liveCameras, setLiveCameras] = useState<any[]>([]);
  const [focusedCameraId, setFocusedCameraId] = useState<string | null>(null);

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
    return cam.status === statusFilter || (statusFilter === 'ONLINE' && !cam.status);
  });

  const focusedCamera = camerasToDisplay.find(c => c.id === focusedCameraId);

  return (
    <div className="flex h-full bg-[#05080c] overflow-hidden">
      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <CameraFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredCameras.map((cam, idx) => (
              <CameraCard 
                key={cam.id}
                cam={cam}
                index={idx}
                isLive={isLiveMode()}
                isFocused={focusedCameraId === cam.id}
                isDimmed={focusedCameraId !== null && focusedCameraId !== cam.id}
                onClick={() => setFocusedCameraId(cam.id === focusedCameraId ? null : cam.id)}
              />
            ))}
          </div>

          {filteredCameras.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
              <div className="text-[14px] font-bold tracking-wider">NO CAMERAS FOUND</div>
              <div className="text-[12px] mt-2">Adjust your filters to see active streams</div>
            </div>
          )}
        </div>

        {/* Bottom Strip: Recent Events */}
        {focusedCameraId && (
          <div className="h-[80px] bg-[#0a0f18] border-t border-white/10 shrink-0 flex items-center px-6 gap-4 overflow-x-auto hide-scrollbar">
            <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase shrink-0 mr-2">
              Live Feed
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col justify-center px-4 py-2 rounded border border-red-500/30 bg-red-500/10 min-w-[160px]">
                <div className="text-[10px] font-bold text-red-400 mb-0.5 uppercase tracking-wider">Stolen Vehicle</div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-mono text-white/90">GJ05XX7821</span>
                  <span className="text-[10px] text-white/40 font-mono">21:43:18</span>
                </div>
              </div>
              
              <div className="flex flex-col justify-center px-4 py-2 rounded border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5 min-w-[160px]">
                <div className="text-[10px] font-bold text-[var(--accent-cyan)] mb-0.5 uppercase tracking-wider">Vehicle Detected</div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-mono text-white/90">Truck</span>
                  <span className="text-[10px] text-white/40 font-mono">21:37:12</span>
                </div>
              </div>

              <div className="flex flex-col justify-center px-4 py-2 rounded border border-amber-500/30 bg-amber-500/10 min-w-[160px]">
                <div className="text-[10px] font-bold text-amber-400 mb-0.5 uppercase tracking-wider">ANPR Match</div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-mono text-white/90">GJ05XX7821</span>
                  <span className="text-[10px] text-white/40 font-mono">21:33:45</span>
                </div>
              </div>

              <div className="flex flex-col justify-center px-4 py-2 rounded border border-white/10 bg-white/5 min-w-[160px]">
                <div className="text-[10px] font-bold text-white/60 mb-0.5 uppercase tracking-wider">Suspicious Activity</div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-mono text-white/90">Person Loitering</span>
                  <span className="text-[10px] text-white/40 font-mono">21:22:17</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Intelligence Panel */}
      {focusedCameraId && focusedCamera && (
        <CameraDetailsPanel 
          cameraId={focusedCamera.id}
          location={focusedCamera.location}
          cluster={focusedCamera.cluster || 'SURAT-CENTRAL'}
          fps={focusedCamera.fps || 25}
          onClose={() => setFocusedCameraId(null)}
        />
      )}
    </div>
  );
}

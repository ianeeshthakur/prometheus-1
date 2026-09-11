import { useState } from 'react';
import { X, Navigation, Crosshair, ZoomIn, ZoomOut, Maximize, Target, Activity } from 'lucide-react';
import { EventCard, EventData } from './EventCard';

interface CameraDetailsPanelProps {
  cameraId: string;
  onClose: () => void;
  location: string;
  cluster: string;
  fps: number;
}

export function CameraDetailsPanel({ cameraId, onClose, location, cluster, fps }: CameraDetailsPanelProps) {
  // Mock recent events for the selected camera
  const MOCK_EVENTS: EventData[] = [
    {
      id: 'e1',
      type: 'Stolen Vehicle',
      severity: 'CRITICAL',
      description: 'Vehicle GJ05XX7821 matching stolen registry',
      timestamp: '21:43:18',
      evidenceImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=400&h=250',
      confidence: '98%'
    },
    {
      id: 'e2',
      type: 'ANPR Match',
      severity: 'WARNING',
      description: 'Vehicle GJ05XX7821 identified',
      timestamp: '21:33:45'
    },
    {
      id: 'e3',
      type: 'Suspicious Activity',
      severity: 'INFO',
      description: 'Person loitering near restricted perimeter',
      timestamp: '21:22:17'
    }
  ];

  return (
    <div className="w-[420px] bg-[#0a0f18] border-l border-white/10 h-full flex flex-col shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 translate-x-0 z-40">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d1421]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[10px] font-bold text-[#10b981] tracking-widest">LIVE</span>
          </div>
          <h2 className="text-[15px] font-bold text-white font-mono">{cameraId}</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Large Preview */}
        <div className="h-[200px] bg-black relative">
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Activity size={32} className="text-[var(--accent-cyan)] opacity-50" />
          </div>
        </div>

        {/* Metadata */}
        <div className="p-5 border-b border-white/10">
          <h3 className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-3">Telemetry & Status</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div>
              <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Location</div>
              <div className="text-[12px] font-medium text-white/90">{location}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Cluster</div>
              <div className="text-[12px] font-medium text-[var(--accent-cyan)]">{cluster}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Coordinates</div>
              <div className="text-[12px] font-mono text-white/70">21.1702° N, 72.8311° E</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Uptime</div>
              <div className="text-[12px] font-mono text-white/70">99.98% (42d)</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Stream</div>
              <div className="text-[12px] font-mono text-white/70">RTSP · 1080p · {fps} FPS</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Active AI Models</div>
              <div className="text-[12px] font-medium text-[var(--accent-cyan)]">ANPR, Vehicle, Person</div>
            </div>
          </div>
        </div>

        {/* PTZ Controls */}
        <div className="p-5 border-b border-white/10 bg-[#0d1421]">
          <h3 className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-4">PTZ Controls</h3>
          <div className="flex gap-6">
            {/* D-Pad */}
            <div className="relative w-24 h-24 bg-[#0a0f18] rounded-full border border-white/10 flex items-center justify-center shadow-inner">
              <button className="absolute top-1 p-1.5 text-white/50 hover:text-[var(--accent-cyan)] transition-colors"><Navigation size={16} className="transform rotate-0" /></button>
              <button className="absolute bottom-1 p-1.5 text-white/50 hover:text-[var(--accent-cyan)] transition-colors"><Navigation size={16} className="transform rotate-180" /></button>
              <button className="absolute left-1 p-1.5 text-white/50 hover:text-[var(--accent-cyan)] transition-colors"><Navigation size={16} className="transform -rotate-90" /></button>
              <button className="absolute right-1 p-1.5 text-white/50 hover:text-[var(--accent-cyan)] transition-colors"><Navigation size={16} className="transform rotate-90" /></button>
              <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-white/5" />
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-between flex-1">
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-[#0a0f18] border border-white/10 rounded-md flex justify-center items-center text-white/60 hover:text-white hover:bg-white/5 transition-all"><ZoomIn size={16} /></button>
                <button className="flex-1 py-2 bg-[#0a0f18] border border-white/10 rounded-md flex justify-center items-center text-white/60 hover:text-white hover:bg-white/5 transition-all"><ZoomOut size={16} /></button>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-[#0a0f18] border border-white/10 rounded-md flex justify-center items-center text-white/60 hover:text-white hover:bg-white/5 transition-all"><Crosshair size={16} /></button>
                <button className="flex-1 py-2 bg-[#0a0f18] border border-white/10 rounded-md flex justify-center items-center text-white/60 hover:text-white hover:bg-white/5 transition-all"><Target size={16} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="p-5">
          <h3 className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-4">Recent Events</h3>
          <div className="flex flex-col gap-3">
            {MOCK_EVENTS.map(event => (
              <EventCard 
                key={event.id}
                event={event}
                onView={() => console.log('View', event.id)}
                onCase={() => console.log('Case', event.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

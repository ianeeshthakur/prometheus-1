import { Camera, CheckCircle, AlertTriangle, XCircle, Activity, Crosshair, Users, MapPin, Box } from 'lucide-react';

export function LeftOperationalPanel() {
  return (
    <div className="w-[320px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-panel)] flex flex-col h-full overflow-y-auto">
      {/* Network Overview */}
      <div className="p-5 border-b border-[var(--border)]">
        <h2 className="text-xs font-bold text-[var(--text-muted)] tracking-wider mb-4">NETWORK OVERVIEW</h2>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-[var(--status-online)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">Online</span>
            </div>
            <span className="text-sm font-mono font-semibold text-[var(--text-primary)]">79,285</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-[var(--status-warning)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">Degraded</span>
            </div>
            <span className="text-sm font-mono font-semibold text-[var(--text-primary)]">158</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle size={14} className="text-[var(--status-critical)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">Offline</span>
            </div>
            <span className="text-sm font-mono font-semibold text-[var(--text-primary)]">98</span>
          </div>
        </div>
      </div>

      {/* Active Clusters */}
      <div className="p-5 border-b border-[var(--border)]">
        <h2 className="text-xs font-bold text-[var(--text-muted)] tracking-wider mb-4">ACTIVE CLUSTERS</h2>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Ahmedabad</span>
            <span className="text-sm font-mono font-semibold text-[var(--accent-cyan)]">12.4K</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Surat</span>
            <span className="text-sm font-mono font-semibold text-[var(--accent-cyan)]">9.8K</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Rajkot</span>
            <span className="text-sm font-mono font-semibold text-[var(--accent-cyan)]">5.2K</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Vadodara</span>
            <span className="text-sm font-mono font-semibold text-[var(--accent-cyan)]">4.6K</span>
          </div>
        </div>
      </div>

      {/* AI Analytics */}
      <div className="p-5 border-b border-[var(--border)]">
        <h2 className="text-xs font-bold text-[var(--text-muted)] tracking-wider mb-4">AI ANALYTICS</h2>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[var(--bg-input)] flex items-center justify-center">
              <Crosshair size={12} className="text-[var(--text-secondary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">Vehicle Detection</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[var(--bg-input)] flex items-center justify-center">
              <Activity size={12} className="text-[var(--text-secondary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">ANPR</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[var(--bg-input)] flex items-center justify-center">
              <Users size={12} className="text-[var(--text-secondary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">Person Detection</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[var(--bg-input)] flex items-center justify-center">
              <MapPin size={12} className="text-[var(--text-secondary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">Crowd Detection</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[var(--bg-input)] flex items-center justify-center">
              <Box size={12} className="text-[var(--text-secondary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">Object Detection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

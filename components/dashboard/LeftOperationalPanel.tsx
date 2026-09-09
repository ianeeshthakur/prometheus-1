import { Camera, CheckCircle, AlertTriangle, XCircle, Activity, Crosshair, Users, MapPin, Box, Server, ChevronRight } from 'lucide-react';

interface LeftOperationalPanelProps {
  onClusterClick?: (clusterName: string) => void;
}

export function LeftOperationalPanel({ onClusterClick }: LeftOperationalPanelProps) {
  const CLUSTERS = [
    { name: 'Ahmedabad', count: '12.4K' },
    { name: 'Surat', count: '9.8K' },
    { name: 'Rajkot', count: '5.2K' },
    { name: 'Vadodara', count: '4.6K' }
  ];

  const AI_MODELS = [
    { name: 'Vehicle Detection', icon: Crosshair },
    { name: 'ANPR', icon: Activity },
    { name: 'Person Detection', icon: Users },
    { name: 'Crowd Detection', icon: MapPin },
    { name: 'Object Detection', icon: Box }
  ];

  return (
    <div className="w-[300px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-panel)] flex flex-col h-full overflow-y-auto">
      {/* Network Overview */}
      <div className="p-5 border-b border-[var(--border)]">
        <h2 className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-4">NETWORK OVERVIEW</h2>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-[var(--status-online)]" />
              <span className="text-[13px] font-medium text-[var(--text-primary)]">Online</span>
            </div>
            <span className="text-[14px] font-mono font-bold text-[var(--text-primary)]">79,285</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} className="text-[var(--status-warning)]" />
              <span className="text-[13px] font-medium text-[var(--text-primary)]">Degraded</span>
            </div>
            <span className="text-[14px] font-mono font-bold text-[var(--text-primary)]">158</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3">
              <XCircle size={16} className="text-[var(--status-critical)]" />
              <span className="text-[13px] font-medium text-[var(--text-primary)]">Offline</span>
            </div>
            <span className="text-[14px] font-mono font-bold text-[var(--text-primary)]">98</span>
          </div>
        </div>
      </div>

      {/* Active Clusters */}
      <div className="p-5 border-b border-[var(--border)]">
        <h2 className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-4">ACTIVE CLUSTERS</h2>
        
        <div className="flex flex-col gap-1.5">
          {CLUSTERS.map((cluster) => (
            <button
              key={cluster.name}
              onClick={() => onClusterClick && onClusterClick(cluster.name)}
              className="group flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <Server size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] transition-colors" />
                <span className="text-[13px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {cluster.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono font-semibold text-[var(--accent-cyan)]">{cluster.count}</span>
                <ChevronRight size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Analytics */}
      <div className="p-5 border-b border-[var(--border)]">
        <h2 className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-4">AI ANALYTICS</h2>
        
        <div className="flex flex-col gap-2">
          {AI_MODELS.map((model, i) => {
            const Icon = model.icon;
            const isActive = i === 0 || i === 1; // Example active states for visual distinction
            return (
              <button
                key={model.name}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${isActive ? 'bg-[var(--accent-cyan)]/5 border-[var(--accent-cyan)]/30' : 'bg-[var(--bg-surface)] border-[var(--border)] hover:bg-[var(--bg-elevated)]'}`}
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center ${isActive ? 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]' : 'bg-[var(--bg-input)] text-[var(--text-secondary)]'}`}>
                  <Icon size={16} />
                </div>
                <span className={`text-[13px] font-medium ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {model.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

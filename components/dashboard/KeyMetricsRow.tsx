import { TrendingUp, Camera, AlertTriangle, Shield, Eye, Settings, Search } from 'lucide-react';
import { isLiveMode } from '@/lib/mode';

const METRICS = [
  { label: 'Cameras Connected', value: '79,842 / 80,000+', trend: '+124', status: 'healthy', icon: Camera },
  { label: 'AI Events / Min', value: '12,847', trend: '+12%', status: 'active', icon: Eye },
  { label: 'Critical Alerts', value: '2', trend: null, status: 'critical', icon: AlertTriangle },
  { label: 'Active Investigations', value: '14', trend: null, status: 'active', icon: Search },
  { label: 'Cameras Offline', value: '98', trend: '-12', status: 'warning', icon: Settings },
];

export function KeyMetricsRow() {
  return (
    <div className="flex gap-4 p-4 border-b border-[var(--border)] bg-[var(--bg-panel)] overflow-x-auto shrink-0">
      {METRICS.map((metric, i) => {
        const Icon = metric.icon;
        
        let valueColor = 'text-[var(--text-primary)]';
        let iconBg = 'bg-[var(--bg-input)]';
        let iconColor = 'text-[var(--text-muted)]';
        
        if (metric.status === 'critical') {
          valueColor = 'text-[var(--status-critical)]';
          iconBg = 'bg-[var(--status-critical)]/10';
          iconColor = 'text-[var(--status-critical)]';
        } else if (metric.status === 'warning') {
          valueColor = 'text-[var(--status-warning)]';
          iconBg = 'bg-[var(--status-warning)]/10';
          iconColor = 'text-[var(--status-warning)]';
        } else if (metric.status === 'healthy') {
          valueColor = 'text-[var(--status-online)]';
          iconBg = 'bg-[var(--status-online)]/10';
          iconColor = 'text-[var(--status-online)]';
        } else if (metric.status === 'active') {
          valueColor = 'text-[var(--accent-cyan)]';
          iconBg = 'bg-[var(--accent-cyan)]/10';
          iconColor = 'text-[var(--accent-cyan)]';
        }

        return (
          <div 
            key={i} 
            className="flex-1 min-w-[200px] flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconBg}`}>
              <Icon size={20} className={iconColor} />
            </div>
            
            <div>
              <div className="text-[12px] font-medium text-[var(--text-secondary)] mb-1">
                {metric.label}
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold font-mono tracking-tight ${valueColor}`}>
                  {isLiveMode() && metric.label === 'Cameras Connected' ? '1 / 80k' : metric.value}
                </span>
                {metric.trend && (
                  <span className="text-[10px] font-medium text-[var(--text-muted)] flex items-center gap-0.5">
                    <TrendingUp size={10} />
                    {metric.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

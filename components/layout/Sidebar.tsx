'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Camera, AlertTriangle, Crosshair, Brain, BarChart3,
  Search, Network, Activity, Shield, Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'command', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { id: 'cameras', icon: Camera, label: 'Live Cameras', path: '/cameras' },
  { id: 'alerts', icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
  { id: 'surveillance', icon: Crosshair, label: 'Surveillance', path: '/surveillance' },
  { id: 'analytics', icon: Brain, label: 'AI Analytics', path: '#' },
  { id: 'analytics_reports', icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { id: 'investigations', icon: Search, label: 'Investigations', path: '/investigations' },
  { id: 'network', icon: Network, label: 'Camera Network', path: '/network' },
  { id: 'health', icon: Activity, label: 'System Health', path: '/health' },
  { id: 'security', icon: Shield, label: 'Security', path: '/security' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  alertCount: number;
  onAnalyticsClick?: () => void;
}

export function Sidebar({ alertCount, onAnalyticsClick }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className="relative h-full flex flex-col w-[240px] shrink-0"
      style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] min-h-[60px]">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-lg"
          style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
            boxShadow: '0 0 16px rgba(14,165,233,0.3)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" fill="white" opacity="0.9" />
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <path d="M12 3 L12 1 M12 23 L12 21 M3 12 L1 12 M23 12 L21 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <path d="M5.6 5.6 L4.2 4.2 M19.8 4.2 L18.4 5.6 M5.6 18.4 L4.2 19.8 M18.4 18.4 L19.8 19.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          </svg>
        </div>
        <div className="overflow-hidden">
          <div style={{ fontSize: 14, fontWeight: 800, color: '#f0f4f8', letterSpacing: '0.05em', lineHeight: 1.2 }}>G-VISTA</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>Gujarat Police</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden px-4">
        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === '/' ? pathname === '/' : (item.path !== '#' && pathname.startsWith(item.path));
            const Icon = item.icon;
            const isAlerts = item.id === 'alerts';

            return (
              <button
                key={item.id}
                onClick={(e) => {
                  if (item.id === 'analytics' && onAnalyticsClick) {
                    e.preventDefault();
                    onAnalyticsClick();
                  } else if (item.path !== '#') {
                    router.push(item.path);
                  }
                }}
                className={`group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${isActive ? 'bg-[var(--accent-cyan)]/10 text-[var(--text-accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)]'}`}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={20} className={isActive ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors'} />
                  {isAlerts && alertCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-white font-bold border border-[var(--bg-secondary)]"
                      style={{ width: 16, height: 16, fontSize: 9, background: 'var(--status-critical)', lineHeight: 1 }}
                    >
                      {alertCount > 9 ? '9+' : alertCount}
                    </span>
                  )}
                </div>
                <span className="text-[13px] font-bold whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      
      <div className="p-4 border-t border-[var(--border)]">
        <div className="text-[10px] text-[var(--text-muted)] text-center font-mono">
          v2.4.1 • ENCRYPTED
        </div>
      </div>
    </aside>
  );
}

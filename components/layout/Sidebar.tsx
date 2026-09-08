'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Camera, AlertTriangle, Brain, Search,
  Shield, Network, BarChart3, Activity, Settings,
  Bell, ChevronRight, Wifi, WifiOff, Eye
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'command', icon: LayoutDashboard, label: 'Command Center', path: '/', shortcut: 'C' },
  { id: 'cameras', icon: Camera, label: 'Live Cameras', path: '/cameras', shortcut: 'V' },
  { id: 'alerts', icon: AlertTriangle, label: 'Incidents & Alerts', path: '/alerts', shortcut: 'A' },
  { id: 'intelligence', icon: Brain, label: 'Intelligence', path: '/intelligence', shortcut: 'I' },
  { id: 'investigations', icon: Search, label: 'Investigations', path: '/investigations', shortcut: 'N' },
  { id: 'watchlists', icon: Eye, label: 'Watchlists', path: '/watchlists', shortcut: 'W' },
  { id: 'network', icon: Network, label: 'Camera Network', path: '/network', shortcut: 'K' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics', shortcut: 'T' },
  { id: 'health', icon: Activity, label: 'System Health', path: '/health', shortcut: 'H' },
  { id: 'security', icon: Shield, label: 'Security', path: '/security', shortcut: 'S' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings', shortcut: null },
];

interface SidebarProps {
  alertCount: number;
}

export function Sidebar({ alertCount }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-200 ${expanded ? 'w-60' : 'w-[68px]'}`}
      style={{
        background: 'linear-gradient(180deg, #0d1219 0%, #080c12 100%)',
        borderRight: '1px solid var(--border)',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)', minHeight: '52px' }}>
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
        {expanded && (
          <div className="animate-fade-in overflow-hidden">
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f0f4f8', letterSpacing: '0.05em', lineHeight: 1.2 }}>G-VISTA</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>Gujarat Police</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
          const Icon = item.icon;
          const isAlerts = item.id === 'alerts';

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`sidebar-item w-full flex items-center gap-3 px-[14px] py-[10px] text-left transition-all duration-150 ${isActive ? 'active' : ''}`}
              style={{
                background: isActive ? 'rgba(14,165,233,0.08)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              }}
            >
              <div className="relative flex-shrink-0">
                <Icon size={18} />
                {isAlerts && alertCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-white font-bold"
                    style={{ width: 14, height: 14, fontSize: 8, background: 'var(--status-critical)', lineHeight: 1 }}
                  >
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </div>
              {expanded && (
                <span className="animate-fade-in text-xs font-medium whitespace-nowrap overflow-hidden" style={{ fontSize: 12 }}>
                  {item.label}
                </span>
              )}
              {expanded && isActive && (
                <ChevronRight size={12} className="ml-auto opacity-50 animate-fade-in" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Wifi size={15} style={{ color: 'var(--status-online)' }} />
          </div>
          {expanded && (
            <div className="animate-fade-in">
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--status-online)', letterSpacing: '0.04em' }}>SYSTEM ONLINE</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>99.1% health</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Camera, AlertTriangle, Brain, Search,
  Shield, Network, BarChart3, Activity, Settings,
  ChevronRight, Wifi, Eye, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'COMMAND CENTER',
    items: [
      { id: 'command', icon: LayoutDashboard, label: 'Overview', path: '/' },
      { id: 'cameras', icon: Camera, label: 'Live Cameras', path: '/cameras' },
      { id: 'alerts', icon: AlertTriangle, label: 'Incidents & Alerts', path: '/alerts' },
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'watchlists', icon: Eye, label: 'Watchlists', path: '/watchlists' },
      { id: 'intelligence', icon: Brain, label: 'Entity Search', path: '/intelligence' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    ]
  },
  {
    title: 'INVESTIGATION',
    items: [
      { id: 'investigations', icon: Search, label: 'Investigations', path: '/investigations' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'network', icon: Network, label: 'Camera Network', path: '/network' },
      { id: 'health', icon: Activity, label: 'System Health', path: '/health' },
      { id: 'security', icon: Shield, label: 'Audit Logs', path: '/security' },
      { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    ]
  }
];

interface SidebarProps {
  alertCount: number;
  expanded?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ alertCount, expanded = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`relative h-full flex flex-col transition-all duration-300 ease-in-out ${expanded ? 'w-[240px]' : 'w-[72px]'}`}
      style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
      }}
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
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-4">
            {expanded && (
              <div className="px-[14px] mb-1">
                <span className="text-[10px] font-bold tracking-[0.06em] text-[var(--text-muted)] animate-fade-in">
                  {group.title}
                </span>
              </div>
            )}
            
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
                const Icon = item.icon;
                const isAlerts = item.id === 'alerts';

                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.path)}
                    className={`sidebar-item w-full flex items-center gap-3 px-[14px] py-[8px] text-left transition-all duration-150 ${isActive ? 'active' : ''}`}
                    style={{
                      background: isActive ? 'var(--bg-input)' : 'transparent',
                      color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                      borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
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
                      <span className="animate-fade-in text-xs font-medium whitespace-nowrap overflow-hidden" style={{ fontSize: 13 }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="mt-auto flex flex-col" style={{ borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={onToggle}
          className="flex items-center justify-center p-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-colors"
          title={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {expanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>
    </aside>
  );
}

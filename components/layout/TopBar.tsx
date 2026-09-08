'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Bell, Search, ChevronDown, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Ensure theme is only rendered on client to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const getPageTitle = () => {
    if (pathname === '/') return 'Command Center';
    if (pathname.startsWith('/cameras')) return 'Live Cameras';
    if (pathname.startsWith('/alerts')) return 'Incidents & Alerts';
    if (pathname.startsWith('/investigations')) return 'Investigations';
    return 'G-VISTA';
  };

  return (
    <header
      className="flex items-center justify-between px-6"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {/* Left: Page Title */}
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-[var(--text-primary)]">
          {getPageTitle()}
        </span>
        <span className="text-[var(--text-muted)]">/</span>
        <span className="text-[13px] text-[var(--text-secondary)]">
          State Operations
        </span>
      </div>

      {/* Center: Operational Status */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--status-online-dim)]/10 border border-[var(--status-online)]/20">
        <span className="w-2 h-2 rounded-full bg-[var(--status-online)] animate-pulse" />
        <span className="text-[10px] font-bold tracking-wider text-[var(--status-online)] uppercase">
          Operational
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white font-bold bg-[var(--status-critical)]" style={{ width: 14, height: 14, fontSize: 8 }}>
            2
          </span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
          aria-label="Toggle Theme"
        >
          {mounted && (
            theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />
          )}
        </button>

        <div className="w-[1px] h-5 bg-[var(--border)] mx-1" />

        {/* User Profile */}
        <button className="flex items-center gap-2 hover:bg-[var(--bg-input)] px-2 py-1 rounded transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-blue-bright)] to-[var(--accent-blue)] text-white text-[10px] font-bold w-6 h-6">
            AO
          </div>
          <span className="text-[12px] font-medium text-[var(--text-primary)]">ACP Sharma</span>
          <ChevronDown size={14} className="text-[var(--text-muted)]" />
        </button>
      </div>
    </header>
  );
}

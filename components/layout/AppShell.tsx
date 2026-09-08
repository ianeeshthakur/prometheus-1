'use client';
import { AlertTriangle } from 'lucide-react';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
}

import { isLiveMode } from '@/lib/mode';

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar alertCount={2} />
      <div className="main-content">
        {/* Demo Banner */}
        <div className="demo-banner">
          {isLiveMode() ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-green-900/30 border border-green-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-green-400 tracking-wider">LIVE MODE · SENTINEL RTSP</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-900/30 border border-amber-500/30">
              <AlertTriangle size={12} className="text-amber-500" />
              <span className="text-[10px] font-bold text-amber-500 tracking-wider">DEMO MODE</span>
            </div>
          )}
        </div>
        <TopBar />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

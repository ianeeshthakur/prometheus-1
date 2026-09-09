'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AIAnalyticsDrawer } from '../dashboard/AIAnalyticsDrawer';
import { isLiveMode } from '@/lib/mode';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  return (
    <div className="app-shell flex h-screen overflow-hidden bg-[var(--bg-primary)] relative">
      <Sidebar alertCount={2} onAnalyticsClick={() => setIsAnalyticsOpen(true)} />
      <div 
        className="main-content flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out relative"
      >
        <AIAnalyticsDrawer isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />
        
        {/* Demo Banner */}
        <div className="demo-banner z-50 flex items-center justify-center h-5 text-[10px] font-bold tracking-wider border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          {isLiveMode() ? (
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded bg-green-900/10 border border-green-500/20 text-green-600 dark:bg-green-900/30 dark:border-green-500/30 dark:text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>LIVE MODE · SENTINEL RTSP</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded bg-amber-900/10 border border-amber-500/20 text-amber-600 dark:bg-amber-900/30 dark:border-amber-500/30 dark:text-amber-500">
              <AlertTriangle size={12} />
              <span>DEMO MODE</span>
            </div>
          )}
        </div>
        <TopBar />
        <main className="page-content flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}

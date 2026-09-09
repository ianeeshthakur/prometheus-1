'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_SCRIPT, INITIAL_DEMO_STATE, DemoState, DemoPhase, getDemoZoomTarget } from '@/lib/demo-engine';
import dynamic from 'next/dynamic';
import { isLiveMode } from '@/lib/mode';
import { Zap } from 'lucide-react';

import { KeyMetricsRow } from '@/components/dashboard/KeyMetricsRow';
import { IntelligenceDrawer } from '@/components/dashboard/IntelligenceDrawer';
import { LeftOperationalPanel } from '@/components/dashboard/LeftOperationalPanel';
import { CameraDetailsPanel } from '@/components/dashboard/CameraDetailsPanel';

const GujaratMap = dynamic(() => import('@/components/map/GujaratMap').then(m => ({ default: m.GujaratMap })), { ssr: false });

function DemoProcessLog({ logs, phase }: { logs: string[]; phase: DemoPhase }) {
  const phaseColors: Partial<Record<DemoPhase, string>> = {
    VEHICLE_DETECTED: 'var(--accent-cyan)',
    PLATE_RECOGNIZED: 'var(--accent-cyan)',
    WATCHLIST_QUERIED: 'var(--status-warning)',
    WATCHLIST_MATCHED: 'var(--status-critical)',
    ALERT_GENERATED: 'var(--status-critical)',
    COMPLETE: 'var(--status-online)',
  };
  
  if (phase === 'IDLE' || logs.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 z-[400] w-80 pointer-events-none">
      <div className="bg-[var(--bg-panel)]/90 backdrop-blur border border-[var(--border)] rounded-xl p-3 shadow-[var(--shadow-elevated)]">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-bold text-[var(--text-primary)] tracking-wider">SYSTEM LOG</div>
          <Zap size={12} className="text-[var(--status-warning)] animate-pulse" />
        </div>
        <div className="flex flex-col gap-1.5 font-mono text-[10px] max-h-[140px] overflow-y-auto">
          {logs.slice(-5).map((log, i) => (
            <div key={i} className="animate-fade-in" style={{ color: i === Math.min(logs.length, 5) - 1 ? phaseColors[phase] || 'var(--text-primary)' : 'var(--text-muted)' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CommandCenterPage() {
  const router = useRouter();
  const [demoState, setDemoState] = useState<DemoState>(INITIAL_DEMO_STATE);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);

  const updateDemo = useCallback((phase: DemoPhase, logMsg?: string, extra?: Partial<DemoState>) => {
    setDemoState(prev => {
      const logs = logMsg
        ? [...prev.processLog, logMsg]
        : prev.processLog;
      return { ...prev, phase, processLog: logs, mapZoomTarget: getDemoZoomTarget(phase) || prev.mapZoomTarget, ...extra };
    });
  }, []);

  useEffect(() => {
    if (isLiveMode()) return;

    let timers: NodeJS.Timeout[] = [];
    DEMO_SCRIPT.forEach(step => {
      const timer = setTimeout(() => {
        let extra: Partial<DemoState> = {};
        if (step.phase === 'ALERT_GENERATED') {
          extra.showAlertPanel = true;
          extra.activeAlertId = 'ALT-20260908-001';
          extra.mapZoomTarget = { lat: 21.2, lng: 72.8, zoom: 12 };
        }
        if (step.phase === 'ROUTE_ANIMATING') {
          extra.showTracePath = true;
        }
        if (step.phase === 'INVESTIGATION_OPEN') {
          extra.activeInvestigationId = 'INV-2026-00482';
          router.push('/investigations/INV-2026-00482');
        }
        updateDemo(step.phase, step.log, extra);
      }, step.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [updateDemo, router]);

  const handleTrace = () => {
    setDemoState(prev => ({
      ...prev,
      showTracePath: true,
      phase: 'ROUTE_ANIMATING',
      mapZoomTarget: { lat: 22.5, lng: 72.65, zoom: 8 },
    }));
  };

  const handleInvestigate = () => {
    router.push('/investigations/INV-2026-00482');
  };

  const handleAlertClick = useCallback((id: string) => {
    setDemoState(prev => ({ ...prev, activeAlertId: id }));
  }, []);

  const handleClusterClick = useCallback((clusterName: string) => {
    const clusterCoords: Record<string, { lat: number, lng: number }> = {
      'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'Surat': { lat: 21.1702, lng: 72.8311 },
      'Rajkot': { lat: 22.3039, lng: 70.8022 },
      'Vadodara': { lat: 22.3072, lng: 73.1812 }
    };
    
    if (clusterCoords[clusterName]) {
      setDemoState(prev => ({
        ...prev,
        mapZoomTarget: { lat: clusterCoords[clusterName].lat, lng: clusterCoords[clusterName].lng, zoom: 14 }
      }));
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] overflow-hidden">
      <KeyMetricsRow />
      
      <div className="flex flex-1 min-h-0 relative">
        <LeftOperationalPanel onClusterClick={handleClusterClick} />
        <div className="flex-1 relative min-w-0">
          <GujaratMap
            demoPhase={demoState.phase}
            showTracePath={demoState.showTracePath}
            mapZoomTarget={demoState.mapZoomTarget}
            onAlertClick={handleAlertClick}
            onCameraClick={(id) => {
              setActiveCameraId(id);
            }}
          />
          <DemoProcessLog logs={demoState.processLog} phase={demoState.phase} />
        </div>
        
        <div className="relative w-[320px] flex-shrink-0 flex flex-col h-full bg-[var(--bg-panel)] overflow-hidden">
          <IntelligenceDrawer 
            onAlertClick={handleAlertClick}
            onTrace={handleTrace}
            onInvestigate={handleInvestigate}
          />
          {activeCameraId && (
            <CameraDetailsPanel 
              cameraId={activeCameraId} 
              onClose={() => setActiveCameraId(null)}
              onTrace={handleTrace}
            />
          )}
        </div>
      </div>
    </div>
  );
}

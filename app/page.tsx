'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TELEMETRY_STATS, ALERT_FEED, NORMALIZED_EVENTS, DEMO_INVESTIGATION } from '@/lib/mock-data';
import {
  DEMO_SCRIPT, INITIAL_DEMO_STATE, DemoState, DemoPhase, DEMO_ALERT, DEMO_SIGHTINGS, getDemoZoomTarget
} from '@/lib/demo-engine';
import dynamic from 'next/dynamic';
import {
  AlertTriangle, Eye, Navigation, Search, X, ChevronRight, Zap, MapPin, Camera, Activity, TrendingUp
} from 'lucide-react';

const GujaratMap = dynamic(() => import('@/components/map/GujaratMap').then(m => ({ default: m.GujaratMap })), { ssr: false });

// ---------- TELEMETRY BAR ----------
function TelemetryBar() {
  const [counts, setCounts] = useState(TELEMETRY_STATS.map(s => typeof s.value === 'number' ? s.value : 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev => prev.map((_, i) => {
        const stat = TELEMETRY_STATS[i];
        if (!stat.animated) return 0;
        const base = parseInt(String(stat.value).replace(/,/g, ''));
        return base + Math.floor((Math.random() - 0.5) * base * 0.002);
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-stretch"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        height: 64,
        flexShrink: 0,
      }}
    >
      {TELEMETRY_STATS.map((stat, i) => {
        const colorMap: Record<string, string> = {
          NORMAL: 'var(--accent-cyan)',
          WARNING: 'var(--status-warning)',
          CRITICAL: 'var(--status-critical)',
        };
        const color = colorMap[stat.status || 'NORMAL'];
        const displayValue = stat.animated
          ? (stat.label.includes('Cameras') ? counts[i].toLocaleString() : counts[i].toLocaleString())
          : stat.value;

        return (
          <div
            key={stat.label}
            className="flex-1 flex flex-col justify-center px-4"
            style={{
              borderRight: i < TELEMETRY_STATS.length - 1 ? '1px solid var(--border)' : 'none',
              position: 'relative',
            }}
          >
            {stat.status === 'CRITICAL' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--status-critical)', opacity: 0.7 }} />
            )}
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
              {stat.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span
                className="telemetry-number"
                style={{ color, fontSize: 18, transition: 'all 0.5s ease' }}
              >
                {displayValue}
              </span>
              {stat.subtext && (
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{stat.subtext}</span>
              )}
            </div>
            {stat.trend === 'UP' && stat.status !== 'CRITICAL' && (
              <TrendingUp size={8} style={{ position: 'absolute', top: 8, right: 8, color: 'var(--status-online)', opacity: 0.6 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- ALERT FEED PANEL ----------
function AlertFeedPanel({ onAlertClick, activeAlertId }: { onAlertClick: (id: string) => void; activeAlertId: string | null }) {
  const [feedItems, setFeedItems] = useState(ALERT_FEED);

  useEffect(() => {
    // Simulate new events streaming in
    const interval = setInterval(() => {
      const newItem = {
        id: `NEW-${Date.now()}`,
        severity: 'INFO' as const,
        text: `AI Event: ${NORMALIZED_EVENTS[Math.floor(Math.random() * NORMALIZED_EVENTS.length)].type.replace(/_/g, ' ')} — ${['Surat', 'Ahmedabad', 'Rajkot', 'Vadodara'][Math.floor(Math.random() * 4)]}`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        district: ['Surat', 'Ahmedabad', 'Rajkot', 'Vadodara'][Math.floor(Math.random() * 4)],
      };
      setFeedItems(prev => [newItem, ...prev.slice(0, 15)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sevColor: Record<string, string> = {
    CRITICAL: 'var(--status-critical)',
    HIGH: 'var(--status-warning)',
    MEDIUM: 'var(--status-info)',
    LOW: 'var(--text-muted)',
    INFO: 'var(--accent-cyan)',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div>
          <div className="label-sm" style={{ color: 'var(--text-secondary)' }}>INTELLIGENCE FEED</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Live events & alerts</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="severity-dot severity-dot-critical" style={{ animation: 'blink 1s ease infinite' }} />
          <span style={{ fontSize: 10, color: 'var(--status-critical)', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      {/* Critical alert highlight */}
      <div
        className="mx-3 mt-3 p-3 rounded-lg cursor-pointer"
        onClick={() => onAlertClick('ALT-20260908-001')}
        style={{
          background: activeAlertId === 'ALT-20260908-001'
            ? 'rgba(239,68,68,0.15)'
            : 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.4)',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
      >
        <div className="flex items-start gap-2">
          <AlertTriangle size={14} style={{ color: 'var(--status-critical)', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--status-critical)', letterSpacing: '0.05em' }}>
              ◉ CRITICAL — STOLEN VEHICLE DETECTED
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
              GJ05XX7821 — White Honda City
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>
              Surat Ring Road · CAM-GJ-SRT-00421
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1, fontFamily: 'JetBrains Mono, monospace' }}>
              21:43:18 · Match: 97.4%
            </div>
          </div>
          <ChevronRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </div>
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
        {feedItems.map((item, i) => (
          <div
            key={item.id}
            className="flex items-start gap-2 px-2 py-2 rounded"
            style={{
              background: i === 0 && item.id.startsWith('NEW') ? 'rgba(14,165,233,0.06)' : 'transparent',
              animation: item.id.startsWith('NEW') && i === 0 ? 'slide-in-top 0.3s ease' : 'none',
              borderBottom: '1px solid transparent',
            }}
          >
            <div
              className="severity-dot flex-shrink-0 mt-1"
              style={{ background: sevColor[item.severity], boxShadow: item.severity === 'CRITICAL' ? `0 0 5px ${sevColor[item.severity]}` : 'none' }}
            />
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4, wordBreak: 'break-word' }}>
                {item.text}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                {item.time} · {item.district}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- ALERT DETAIL PANEL ----------
function AlertDetailPanel({ onClose, onTrace, onInvestigate }: {
  onClose: () => void;
  onTrace: () => void;
  onInvestigate: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col animate-slide-in-right"
      style={{ background: 'var(--bg-panel)', borderLeft: '1px solid var(--border-critical)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-critical)', background: 'rgba(239,68,68,0.05)' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--status-critical)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            ◉ CRITICAL ALERT
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 1 }}>
            STOLEN VEHICLE DETECTED
          </div>
        </div>
        <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Vehicle info */}
        <div className="glass-panel p-3">
          <div className="label-xs mb-2">DETECTED ENTITY</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>
            GJ05XX7821
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>White Honda City Sedan</div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['Match Type', 'STOLEN VEHICLE'],
              ['Confidence', '97.4%'],
              ['Source', 'Gujarat Police DB'],
              ['Risk Level', 'CRITICAL'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: k === 'Match Type' ? 'var(--status-critical)' : k === 'Risk Level' ? 'var(--status-critical)' : 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detection info */}
        <div className="glass-panel p-3">
          <div className="label-xs mb-2">DETECTION</div>
          {[
            ['Camera', 'CAM-GJ-SRT-00421'],
            ['Location', 'Surat Ring Road'],
            ['District', 'Surat'],
            ['Timestamp', '21:43:18 IST'],
            ['Direction', 'North-East'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Sightings summary */}
        <div className="glass-panel p-3">
          <div className="label-xs mb-2">CAMERA SIGHTINGS (5)</div>
          {DEMO_SIGHTINGS.map((s, i) => (
            <div key={s.sightingId} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: i === DEMO_SIGHTINGS.length - 1 ? 'rgba(239,68,68,0.2)' : 'rgba(14,165,233,0.1)', border: `1px solid ${i === DEMO_SIGHTINGS.length - 1 ? 'rgba(239,68,68,0.5)' : 'rgba(14,165,233,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: i === DEMO_SIGHTINGS.length - 1 ? 'var(--status-critical)' : 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.cameraLocation.split(',')[0]}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{new Date(s.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <button className="btn w-full justify-center" style={{ background: 'rgba(14,165,233,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(14,165,233,0.3)' }}>
            <Eye size={13} /> VIEW LIVE FEED
          </button>
          <button
            className="btn w-full justify-center btn-danger"
            onClick={onTrace}
          >
            <Navigation size={13} /> TRACE VEHICLE
          </button>
          <button
            className="btn btn-primary w-full justify-center"
            onClick={onInvestigate}
          >
            <Search size={13} /> OPEN INVESTIGATION
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- DEMO PROCESS LOG ----------
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
    <div
      className="absolute bottom-4 right-4 glass-panel p-3"
      style={{ zIndex: 1000, maxWidth: 320, minWidth: 260 }}
    >
      <div className="label-xs mb-2 flex items-center gap-2">
        <div className="severity-dot severity-dot-critical" style={{ animation: 'blink 1s ease infinite' }} />
        AI PROCESSING LOG
      </div>
      <div className="flex flex-col gap-1" style={{ maxHeight: 140, overflowY: 'auto' }}>
        {logs.slice(-5).map((log, i) => (
          <div key={i} style={{ fontSize: 10, color: i === logs.length - 1 ? phaseColors[phase] || 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.4 }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- PIPELINE STAGES ----------
function PipelineBanner() {
  const stages = ['DETECT', 'IDENTIFY', 'CORRELATE', 'TRACE', 'ALERT', 'INVESTIGATE'];
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(prev => (prev + 1) % stages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-center gap-0"
      style={{ height: 28, borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0, overflow: 'hidden' }}
    >
      {stages.map((stage, i) => (
        <div key={stage} className="flex items-center">
          <div
            style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: i === activeStage ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '0 10px',
              transition: 'color 0.3s ease',
            }}
          >
            {stage}
          </div>
          {i < stages.length - 1 && (
            <span style={{ color: 'var(--text-muted)', fontSize: 8, opacity: 0.4 }}>→</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------- MAIN COMMAND CENTER ----------
export default function CommandCenterPage() {
  const router = useRouter();
  const [demoState, setDemoState] = useState<DemoState>(INITIAL_DEMO_STATE);
  const [showAlertDetail, setShowAlertDetail] = useState(false);

  const updateDemo = useCallback((phase: DemoPhase, log: string, extra?: Partial<DemoState>) => {
    setDemoState(prev => ({
      ...prev,
      phase,
      processLog: [...prev.processLog, log],
      mapZoomTarget: getDemoZoomTarget(phase) || prev.mapZoomTarget,
      ...extra,
    }));
  }, []);

  // Auto-start demo
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    DEMO_SCRIPT.forEach((step) => {
      const timer = setTimeout(() => {
        const extra: Partial<DemoState> = {};
        if (step.phase === 'ALERT_GENERATED') {
          extra.activeAlertId = 'ALT-20260908-001';
          extra.showAlertPanel = true;
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

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)' }}>
      {/* Pipeline Banner */}
      <PipelineBanner />

      {/* Telemetry Bar */}
      <TelemetryBar />

      {/* Main 3-panel layout */}
      <div className="flex flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 relative">
          <GujaratMap
            demoPhase={demoState.phase}
            showTracePath={demoState.showTracePath}
            mapZoomTarget={demoState.mapZoomTarget}
            onAlertClick={(id) => {
              setDemoState(prev => ({ ...prev, activeAlertId: id, showAlertPanel: true }));
              setShowAlertDetail(true);
            }}
          />
          {/* Demo process log overlay */}
          <DemoProcessLog logs={demoState.processLog} phase={demoState.phase} />
        </div>

        {/* Right Panel */}
        <div
          className="relative flex flex-col overflow-hidden"
          style={{ width: 300, borderLeft: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg-panel)' }}
        >
          {showAlertDetail || demoState.showAlertPanel ? (
            <AlertDetailPanel
              onClose={() => { setShowAlertDetail(false); setDemoState(prev => ({ ...prev, showAlertPanel: false })); }}
              onTrace={handleTrace}
              onInvestigate={handleInvestigate}
            />
          ) : (
            <AlertFeedPanel
              onAlertClick={(id) => {
                setDemoState(prev => ({ ...prev, activeAlertId: id }));
                setShowAlertDetail(true);
              }}
              activeAlertId={demoState.activeAlertId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

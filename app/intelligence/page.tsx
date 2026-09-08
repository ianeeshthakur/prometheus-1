'use client';

import { useState } from 'react';
import { NORMALIZED_EVENTS, WATCHLIST_ENTRIES, DEMO_VEHICLE, CONNECTOR_TYPES } from '@/lib/mock-data';
import { Brain, ArrowDown, Database, Shield, Zap, Network, AlertTriangle } from 'lucide-react';

// ---- Normalized Event Card ----
function NormalizedEventCard({ event }: { event: typeof NORMALIZED_EVENTS[0] }) {
  const typeColors: Record<string, string> = {
    VEHICLE_DETECTED: 'var(--accent-cyan)',
    PLATE_RECOGNIZED: 'var(--status-online)',
    WATCHLIST_MATCH: 'var(--status-critical)',
    PERSON_DETECTED: 'var(--status-warning)',
    SUSPICIOUS_ACTIVITY: 'var(--status-warning)',
    CAMERA_OFFLINE: 'var(--status-offline)',
  };
  const color = typeColors[event.type] || 'var(--text-muted)';

  return (
    <div
      className="glass-panel p-3"
      style={{
        borderLeft: `3px solid ${color}`,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.06em' }}>{event.type}</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{new Date(event.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}</span>
      </div>
      {[
        ['event_id', event.eventId],
        ['camera_id', event.cameraId],
        ['object_id', event.objectId],
        ...(event.plate ? [['plate', event.plate]] : []),
        ['confidence', (event.confidence * 100).toFixed(1) + '%'],
        ['location', event.cameraLocation.split(',')[0]],
        ['district', event.district],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 1 }}>
          <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>{k}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: k === 'plate' || k === 'event_id' ? 600 : 400 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Pipeline Diagram ----
function IntelligencePipeline() {
  const stages = [
    { label: 'HETEROGENEOUS SOURCES', desc: 'RTSP · ONVIF · VMS API · Vendor SDK', color: 'var(--text-muted)', icon: Network },
    { label: 'INTEGRATION ADAPTERS', desc: 'Protocol normalization & auth', color: 'var(--status-info)', icon: Zap },
    { label: 'STREAM GATEWAY', desc: 'Frame extraction & pre-processing', color: 'var(--accent-cyan)', icon: ArrowDown },
    { label: 'AI PROCESSING ENGINE', desc: 'YOLO · PaddleOCR · ByteTrack', color: 'var(--status-online)', icon: Brain },
    { label: 'EVENT NORMALIZATION', desc: 'Structured NormalizedEvent objects', color: 'var(--accent-cyan)', icon: Database },
    { label: 'INTELLIGENCE CORRELATION', desc: 'Watchlist · GIS · Police DB', color: 'var(--status-warning)', icon: Shield },
    { label: 'ALERT ENGINE', desc: 'Priority scoring & dispatch', color: 'var(--status-critical)', icon: AlertTriangle },
    { label: 'INVESTIGATION PLATFORM', desc: 'Timeline · Graph · Evidence', color: 'var(--status-online)', icon: Database },
  ];

  return (
    <div className="flex flex-col gap-0 items-center w-full">
      {stages.map((stage, i) => {
        const Icon = stage.icon;
        return (
          <div key={stage.label} className="flex flex-col items-center w-full">
            <div
              className="glass-panel px-4 py-2.5 flex items-center gap-3 w-full max-w-sm"
              style={{ borderLeft: `3px solid ${stage.color}`, transition: 'all 0.2s ease' }}
            >
              <Icon size={14} style={{ color: stage.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{stage.label}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{stage.desc}</div>
              </div>
            </div>
            {i < stages.length - 1 && (
              <div style={{ width: 1, height: 12, background: `linear-gradient(to bottom, ${stage.color}, ${stages[i + 1].color})`, opacity: 0.5 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---- Entity Correlation Graph (SVG) ----
function CorrelationGraph() {
  const nodes = [
    { id: 'vehicle', label: 'GJ05XX7821', type: 'Vehicle', x: 200, y: 140, color: '#0ea5e9', r: 22 },
    { id: 'watchlist', label: 'STOLEN', type: 'Watchlist', x: 340, y: 60, color: '#ef4444', r: 16 },
    { id: 'cam1', label: 'CAM-AHM-017', type: 'Camera', x: 70, y: 80, color: '#8b5cf6', r: 14 },
    { id: 'cam2', label: 'CAM-KHD-031', type: 'Camera', x: 80, y: 180, color: '#8b5cf6', r: 14 },
    { id: 'cam3', label: 'CAM-SRT-421', type: 'Camera', x: 340, y: 180, color: '#8b5cf6', r: 14 },
    { id: 'person', label: 'PRS-3341', type: 'Person', x: 200, y: 260, color: '#f59e0b', r: 16 },
    { id: 'alert', label: 'ALT-001', type: 'Alert', x: 110, y: 280, color: '#ef4444', r: 14 },
  ];

  const edges = [
    { from: 'vehicle', to: 'watchlist', label: 'MATCHED WITH' },
    { from: 'cam1', to: 'vehicle', label: 'DETECTED' },
    { from: 'cam2', to: 'vehicle', label: 'DETECTED' },
    { from: 'cam3', to: 'vehicle', label: 'DETECTED' },
    { from: 'vehicle', to: 'person', label: 'SEEN WITH' },
    { from: 'vehicle', to: 'alert', label: 'TRIGGERED' },
  ];

  const getNode = (id: string) => nodes.find(n => n.id === id)!;

  return (
    <div className="glass-panel p-4" style={{ position: 'relative' }}>
      <div className="label-xs mb-3">INTELLIGENCE GRAPH — CROSS-CAMERA CORRELATION</div>
      <svg width="100%" viewBox="0 0 420 320" style={{ overflow: 'visible' }}>
        {/* Edges */}
        {edges.map(edge => {
          const from = getNode(edge.from);
          const to = getNode(edge.to);
          if (!from || !to) return null;
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} strokeDasharray="4 2" />
              <text x={mx} y={my - 4} fill="rgba(148,163,184,0.7)" fontSize={7} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={600}>{edge.label}</text>
            </g>
          );
        })}
        {/* Nodes */}
        {nodes.map(node => (
          <g key={node.id} className="entity-node">
            <circle cx={node.x} cy={node.y} r={node.r} fill={`${node.color}22`} stroke={node.color} strokeWidth={1.5} />
            <text x={node.x} y={node.y + 1} fill={node.color} fontSize={7} textAnchor="middle" dominantBaseline="middle" fontFamily="JetBrains Mono, monospace" fontWeight={700}>{node.type.toUpperCase()}</text>
            <text x={node.x} y={node.y + node.r + 10} fill="rgba(240,244,248,0.7)" fontSize={8} textAnchor="middle" fontFamily="JetBrains Mono, monospace">{node.label}</text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 flex-wrap">
        {[
          { label: 'Vehicle', color: '#0ea5e9' },
          { label: 'Camera', color: '#8b5cf6' },
          { label: 'Person', color: '#f59e0b' },
          { label: 'Watchlist', color: '#ef4444' },
          { label: 'Alert', color: '#ef4444' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, opacity: 0.7 }} />
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Database Connections ----
function DatabaseConnections() {
  const dbs = [
    { name: 'Stolen Vehicle Database', type: 'Gujarat Police', status: 'CONNECTED (SIMULATED)', icon: '🚗', color: 'var(--status-online)' },
    { name: 'Wanted Persons DB', type: 'eGujCop', status: 'CONNECTED (SIMULATED)', icon: '👤', color: 'var(--status-online)' },
    { name: 'Missing Persons DB', type: 'Gujarat Police', status: 'CONNECTED (SIMULATED)', icon: '🔍', color: 'var(--status-online)' },
    { name: 'VAHAN (Vehicle Reg.)', type: 'MoRTH', status: 'DEMO DATA', icon: '📋', color: 'var(--status-warning)' },
    { name: 'SARATHI (License)', type: 'MoRTH', status: 'DEMO DATA', icon: '🪪', color: 'var(--status-warning)' },
    { name: 'Vehicle Watchlist', type: 'CID Gujarat', status: 'CONNECTED (SIMULATED)', icon: '⚠️', color: 'var(--status-online)' },
  ];

  return (
    <div className="glass-panel p-4">
      <div className="label-xs mb-3">INTELLIGENCE DATA SOURCES</div>
      <div className="flex flex-col gap-2">
        {dbs.map(db => (
          <div key={db.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14 }}>{db.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{db.name}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{db.type}</div>
            </div>
            <span style={{ fontSize: 9, color: db.color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{db.status}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 4, fontSize: 9, color: 'var(--status-warning)' }}>
        ⚠ Note: This prototype uses simulated data. Production integration requires authorized API access from respective departments.
      </div>
    </div>
  );
}

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'events' | 'graph' | 'sources'>('events');

  const tabs = [
    { id: 'events', label: 'Normalized Events' },
    { id: 'pipeline', label: 'AI Pipeline' },
    { id: 'graph', label: 'Correlation Graph' },
    { id: 'sources', label: 'Data Sources' },
  ] as const;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Intelligence Engine</h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            AI event normalization · Watchlist correlation · Cross-camera intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
          <Brain size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-cyan)' }}>12,847 events/min</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-6" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-3"
            style={{
              fontSize: 11, fontWeight: 600,
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              cursor: 'pointer', background: 'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Normalized Events</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Structured AI events from heterogeneous camera sources</div>
              </div>
              <div className="badge badge-info">LIVE STREAM</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {NORMALIZED_EVENTS.map(evt => (
                <NormalizedEventCard key={evt.eventId} event={evt} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="flex gap-8">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>AI Intelligence Pipeline</div>
              <IntelligencePipeline />
            </div>
            <div style={{ width: 320, flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Integration Connectors</div>
              <div className="flex flex-col gap-3">
                {CONNECTOR_TYPES.map(ct => (
                  <div key={ct.id} className="glass-panel p-3">
                    <div className="flex items-center gap-3 mb-1">
                      <span style={{ fontSize: 16 }}>{ct.icon}</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: ct.color }}>{ct.name}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{ct.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Cameras using this connector</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: ct.color, fontFamily: 'JetBrains Mono, monospace' }}>{ct.cameras.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: 'var(--border)', marginTop: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(ct.cameras / 80000) * 100}%`, background: ct.color, borderRadius: 2, opacity: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Entity Correlation Graph</div>
            <div style={{ maxWidth: 700 }}>
              <CorrelationGraph />
            </div>
            <div className="glass-panel p-4 mt-4" style={{ maxWidth: 700 }}>
              <div className="label-xs mb-3">ACTIVE CORRELATION — INV-2026-00482</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { label: 'Camera Sightings', value: '5', color: 'var(--status-info)' },
                  { label: 'AI Events', value: '3', color: 'var(--accent-cyan)' },
                  { label: 'Watchlist Matches', value: '1', color: 'var(--status-critical)' },
                  { label: 'Related Persons', value: '1', color: 'var(--status-warning)' },
                  { label: 'Districts Crossed', value: '2', color: 'var(--text-secondary)' },
                  { label: 'Time Window', value: '12 min', color: 'var(--text-secondary)' },
                ].map(m => (
                  <div key={m.label} className="glass-panel-elevated p-3">
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace', marginTop: 3 }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Intelligence Data Sources</div>
            <DatabaseConnections />
          </div>
        )}
      </div>
    </div>
  );
}

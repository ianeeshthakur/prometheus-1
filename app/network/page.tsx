'use client';

import { CONNECTOR_TYPES, CAMERAS, SYSTEM_HEALTH, GUJARAT_REGIONS, DISTRICT_DATA } from '@/lib/mock-data';
import { Network, ArrowDown, ArrowRight, Zap, Database, Cpu, Activity } from 'lucide-react';

// ---- Architecture Flow ----
function ArchitectureFlow() {
  const layers = [
    {
      label: 'CAMERAS (80,000+)',
      desc: 'Heterogeneous camera fleet across Gujarat',
      items: ['Fixed CCTV', 'PTZ Cameras', 'ANPR Cameras', 'Body Cams'],
      color: '#8b5cf6',
    },
    {
      label: 'INTEGRATION ADAPTERS',
      desc: 'Protocol normalization layer',
      items: ['RTSP Connector', 'ONVIF Adapter', 'VMS API Bridge', 'Vendor SDK Wrapper'],
      color: '#0ea5e9',
    },
    {
      label: 'STREAM GATEWAY',
      desc: 'Frame extraction, buffering, pre-processing',
      items: ['Regional Ingestion Nodes', 'FFmpeg/GStreamer Pipeline', 'Frame Rate Control', 'Load Balancing'],
      color: '#06b6d4',
    },
    {
      label: 'AI PROCESSING POOL',
      desc: 'Distributed GPU-accelerated inference',
      items: ['YOLOv8 Object Detection', 'PaddleOCR (License Plate)', 'ByteTrack (Multi-Object)', 'Re-ID Engine'],
      color: '#10b981',
    },
    {
      label: 'EVENT BUS',
      desc: 'Normalized AI event streaming',
      items: ['NormalizedEvent Schema', 'Event Deduplication', 'Priority Routing', 'Kafka (production)'],
      color: '#f59e0b',
    },
    {
      label: 'CENTRAL INTELLIGENCE',
      desc: 'Correlation, watchlist, GIS',
      items: ['Watchlist Matching', 'Cross-Camera Correlation', 'GIS Integration', 'Alert Engine'],
      color: '#ef4444',
    },
    {
      label: 'INVESTIGATION PLATFORM',
      desc: 'G-VISTA frontend & investigation tools',
      items: ['Command Center', 'Investigation Workspace', 'Audit & Evidence', 'RBAC'],
      color: '#0ea5e9',
    },
  ];

  return (
    <div className="flex flex-col items-center gap-0 w-full max-w-lg">
      {layers.map((layer, i) => (
        <div key={layer.label} className="flex flex-col items-center w-full">
          <div
            className="glass-panel p-4 w-full"
            style={{ borderTop: `3px solid ${layer.color}` }}
          >
            <div style={{ fontSize: 10, fontWeight: 800, color: layer.color, letterSpacing: '0.07em', marginBottom: 3 }}>{layer.label}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 8 }}>{layer.desc}</div>
            <div className="flex items-center gap-2 flex-wrap">
              {layer.items.map(item => (
                <span key={item} style={{ fontSize: 8, padding: '1px 6px', background: `${layer.color}18`, color: layer.color, border: `1px solid ${layer.color}33`, borderRadius: 3, fontWeight: 600 }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          {i < layers.length - 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20, width: '100%' }}>
              <div style={{ width: 2, height: 20, background: `linear-gradient(to bottom, ${layer.color}, ${layers[i + 1].color})`, opacity: 0.5 }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---- Scalability Visualization ----
function ScalabilityViz() {
  const stages = [
    { cameras: '50', label: 'Hackathon Demo', component: 'Single Node', color: 'var(--text-muted)', width: '5%' },
    { cameras: '500', label: 'Pilot Deployment', component: 'Regional Node', color: 'var(--status-info)', width: '15%' },
    { cameras: '5,000', label: 'City Rollout', component: '3 Regional Nodes', color: 'var(--accent-cyan)', width: '35%' },
    { cameras: '25,000', label: 'Multi-District', component: 'Distributed Cluster', color: 'var(--status-warning)', width: '65%' },
    { cameras: '80,000+', label: 'State Scale', component: 'Full Production', color: 'var(--status-online)', width: '100%' },
  ];

  return (
    <div className="glass-panel p-6">
      <div className="label-xs mb-6">HORIZONTAL SCALABILITY — CAMERA FLEET GROWTH</div>
      <div className="flex flex-col gap-4">
        {stages.map((stage, i) => (
          <div key={stage.cameras} className="flex items-center gap-4">
            <div style={{ width: 70, fontSize: 13, fontWeight: 700, color: stage.color, fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
              {stage.cameras}
            </div>
            <div className="flex-1">
              <div style={{ width: stage.width, height: 6, background: stage.color, borderRadius: 3, transition: 'width 1s ease', opacity: 0.8 }} />
            </div>
            <div style={{ width: 160, flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: stage.color }}>{stage.label}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{stage.component}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.7 }}>
        Architecture scales <strong style={{ color: 'var(--text-secondary)' }}>horizontally</strong> by adding Regional Edge/Ingestion Nodes.
        Raw video is processed at the edge; only <strong style={{ color: 'var(--accent-cyan)' }}>structured events</strong> travel to the Central Intelligence Layer.
        This avoids sending 80,000 raw streams to a single central server.
      </div>
    </div>
  );
}

// ---- Regional Distribution ----
function RegionalMap() {
  return (
    <div className="glass-panel p-4">
      <div className="label-xs mb-4">REGIONAL EDGE NODES</div>
      <div className="flex flex-col gap-3">
        {GUJARAT_REGIONS.map(region => {
          const totalCams = region.districts.reduce((acc, d) => {
            const distData = DISTRICT_DATA[d];
            return acc + (distData ? distData.cameras : 0);
          }, 0);
          return (
            <div key={region.region} className="flex items-center gap-3">
              <div style={{ width: 120, fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>{region.region}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((totalCams / 20000) * 100, 100)}%`, background: 'var(--accent-cyan)', borderRadius: 3, opacity: 0.8 }} />
                </div>
              </div>
              <div style={{ width: 70, fontSize: 10, fontWeight: 600, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'right', flexShrink: 0 }}>
                {totalCams.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NetworkPage() {
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Camera Network</h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Federation architecture · Integration methods · Scalability model
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <Network size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-cyan)' }}>79,842 connected</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left: Architecture */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
              Intelligence Architecture
            </div>
            <ArchitectureFlow />
          </div>

          {/* Right: Connectors + Scalability */}
          <div className="flex flex-col gap-5">
            {/* Connector types */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
                Integration Methods
              </div>
              <div className="flex flex-col gap-3">
                {CONNECTOR_TYPES.map(ct => (
                  <div key={ct.id} className="glass-panel p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 18 }}>{ct.icon}</span>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: ct.color }}>{ct.name}</div>
                          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{ct.description}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: ct.color, fontFamily: 'JetBrains Mono, monospace' }}>{ct.cameras.toLocaleString()}</div>
                        <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>cameras</div>
                      </div>
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: 'var(--border)', marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(ct.cameras / 80000) * 100}%`, background: ct.color, borderRadius: 2, opacity: 0.7, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scalability */}
            <ScalabilityViz />

            {/* Regional */}
            <RegionalMap />
          </div>
        </div>
      </div>
    </div>
  );
}

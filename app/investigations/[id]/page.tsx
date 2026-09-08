'use client';

import { useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_INVESTIGATION, DEMO_VEHICLE, CAMERAS } from '@/lib/mock-data';
import dynamic from 'next/dynamic';
import {
  ArrowLeft, Camera, MapPin, Clock, AlertTriangle, FileText, Users,
  Shield, Download, CheckCircle, Activity, Navigation, Zap
} from 'lucide-react';
import type { TimelineEvent } from '@/lib/types';

const GujaratMap = dynamic(() => import('@/components/map/GujaratMap').then(m => ({ default: m.GujaratMap })), { ssr: false });

type InvTab = 'overview' | 'timeline' | 'map' | 'cameras' | 'events' | 'entities' | 'evidence';

function TimelinePanel({ events, onEventClick, selectedEvent }: {
  events: TimelineEvent[];
  onEventClick: (e: TimelineEvent) => void;
  selectedEvent: TimelineEvent | null;
}) {
  const typeColors: Record<string, string> = {
    VEHICLE_DETECTED: 'var(--accent-cyan)',
    PLATE_RECOGNIZED: 'var(--accent-cyan)',
    WATCHLIST_MATCH: 'var(--status-critical)',
    ALERT_GENERATED: 'var(--status-critical)',
    INVESTIGATION_OPENED: 'var(--status-online)',
    STATUS_UPDATE: 'var(--status-info)',
  };
  const typeIcons: Record<string, string> = {
    VEHICLE_DETECTED: '🎥',
    PLATE_RECOGNIZED: '🔍',
    WATCHLIST_MATCH: '⚠️',
    ALERT_GENERATED: '🚨',
    INVESTIGATION_OPENED: '📂',
    STATUS_UPDATE: '📋',
  };

  return (
    <div className="flex flex-col gap-0 py-4">
      {events.map((event, i) => {
        const color = typeColors[event.type] || 'var(--text-muted)';
        const isSelected = selectedEvent?.eventId === event.eventId;
        const time = new Date(event.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });

        return (
          <div
            key={event.eventId}
            className="timeline-item cursor-pointer pb-6"
            onClick={() => onEventClick(event)}
            style={{ transition: 'all 0.15s ease' }}
          >
            <div
              className="timeline-dot"
              style={{
                background: event.isKeyEvent ? color : 'var(--bg-elevated)',
                borderColor: color,
                border: `2px solid ${color}`,
                boxShadow: event.isKeyEvent ? `0 0 8px ${color}` : 'none',
              }}
            />
            <div
              className="glass-panel p-3"
              style={{
                borderLeft: isSelected ? `3px solid ${color}` : '3px solid transparent',
                background: isSelected ? `${color}10` : 'var(--bg-panel)',
                transition: 'all 0.15s ease',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{typeIcons[event.type] || '•'}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: event.isKeyEvent ? color : 'var(--text-primary)' }}>
                      {event.title}
                    </span>
                    {event.isKeyEvent && (
                      <span style={{ fontSize: 8, fontWeight: 700, color, letterSpacing: '0.05em', padding: '1px 5px', background: `${color}20`, border: `1px solid ${color}40`, borderRadius: 3 }}>KEY</span>
                    )}
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>{event.description}</p>
                  {event.cameraId && (
                    <div style={{ fontSize: 9, color: 'var(--accent-cyan)', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                      {event.cameraId} · {event.cameraLocation}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                  {time}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function InvestigationWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InvTab>('overview');
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(null);

  const inv = DEMO_INVESTIGATION; // In production, fetch by id
  const invCameras = CAMERAS.filter(c => inv.relatedCameras.includes(c.id));

  const tabs: { id: InvTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity size={12} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={12} /> },
    { id: 'map', label: 'Map', icon: <MapPin size={12} /> },
    { id: 'cameras', label: 'Cameras', icon: <Camera size={12} /> },
    { id: 'entities', label: 'Related Entities', icon: <Users size={12} /> },
    { id: 'evidence', label: 'Evidence', icon: <Shield size={12} /> },
  ];

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <button onClick={() => router.push('/investigations')} style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} />
        </button>
        <div className="divider-v" style={{ height: 24 }} />
        <div>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--accent-cyan)', fontWeight: 700 }}>{inv.investigationId}</span>
            <span className="badge badge-high" style={{ fontSize: 8 }}>{inv.priority}</span>
            <span className="badge badge-medium" style={{ fontSize: 8 }}>{inv.status.replace('_', ' ')}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{inv.title}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Assigned:</div>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{inv.assignedTo}</div>
          <button className="btn btn-ghost btn-sm ml-2"><Download size={12} /> Export</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-6" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-3"
            style={{
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="h-full overflow-y-auto p-6">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {/* Entity card */}
              <div className="glass-panel p-4" style={{ borderLeft: '3px solid var(--status-critical)' }}>
                <div className="label-xs mb-3">PRIMARY ENTITY</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>
                  {DEMO_VEHICLE.plate}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{DEMO_VEHICLE.type} · {DEMO_VEHICLE.color} · {DEMO_VEHICLE.make} {DEMO_VEHICLE.model}</div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="badge badge-critical">WATCHLIST MATCH</div>
                  <div style={{ fontSize: 10, color: 'var(--status-critical)', fontWeight: 600 }}>97.4% confidence</div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Camera Sightings', value: '5', color: 'var(--accent-cyan)' },
                  { label: 'Districts Crossed', value: '2', color: 'var(--text-secondary)' },
                  { label: 'Time Window', value: '12 min', color: 'var(--status-warning)' },
                  { label: 'Evidence Items', value: `${inv.evidence.length}`, color: 'var(--status-online)' },
                  { label: 'Watchlist Matches', value: '1', color: 'var(--status-critical)' },
                  { label: 'Related Entities', value: `${inv.relatedEntities.length}`, color: 'var(--status-info)' },
                ].map(m => (
                  <div key={m.label} className="glass-panel p-3">
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{m.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace', marginTop: 3 }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Movement summary */}
            <div className="glass-panel p-4 mb-4">
              <div className="label-xs mb-3">ROUTE SUMMARY</div>
              <div className="flex items-center gap-3 flex-wrap">
                {DEMO_VEHICLE.sightings.map((s, i) => (
                  <div key={s.sightingId} className="flex items-center gap-3">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {new Date(s.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1, maxWidth: 100, textAlign: 'center' }}>
                        {s.cameraLocation.split(',')[0]}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{s.district}</div>
                    </div>
                    {i < DEMO_VEHICLE.sightings.length - 1 && (
                      <div style={{ fontSize: 14, color: 'var(--text-muted)', opacity: 0.5 }}>→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Watchlist match */}
            {DEMO_VEHICLE.watchlistMatch && (
              <div className="glass-panel p-4" style={{ borderLeft: '3px solid var(--status-critical)', background: 'rgba(239,68,68,0.04)' }}>
                <div className="label-xs mb-3" style={{ color: 'var(--status-critical)' }}>WATCHLIST MATCH CONFIRMED</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    ['Match ID', DEMO_VEHICLE.watchlistMatch.matchId],
                    ['Category', DEMO_VEHICLE.watchlistMatch.category.replace('_', ' ')],
                    ['Confidence', `${DEMO_VEHICLE.watchlistMatch.confidence}%`],
                    ['Source', DEMO_VEHICLE.watchlistMatch.source],
                    ['Risk Level', DEMO_VEHICLE.watchlistMatch.riskLevel],
                    ['Detected At', new Date(DEMO_VEHICLE.watchlistMatch.detectedAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: k === 'Risk Level' || k === 'Category' ? 'var(--status-critical)' : 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="h-full flex gap-0">
            <div className="flex-1 overflow-y-auto px-6">
              <div style={{ paddingTop: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Investigation Timeline</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 16 }}>Click any event to view details</div>
                <TimelinePanel events={inv.timeline} onEventClick={setSelectedTimelineEvent} selectedEvent={selectedTimelineEvent} />
              </div>
            </div>
            {selectedTimelineEvent && (
              <div className="overflow-y-auto p-4 animate-slide-in-right" style={{ width: 300, borderLeft: '1px solid var(--border)', background: 'var(--bg-panel)', flexShrink: 0 }}>
                <div className="label-xs mb-3">EVENT DETAIL</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{selectedTimelineEvent.title}</div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{selectedTimelineEvent.description}</p>
                {selectedTimelineEvent.cameraId && (
                  <div className="glass-panel p-3">
                    <div className="label-xs mb-2">CAMERA</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{selectedTimelineEvent.cameraId}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{selectedTimelineEvent.cameraLocation}</div>
                  </div>
                )}
                {/* Simulated snapshot placeholder */}
                {selectedTimelineEvent.snapshotId && (
                  <div className="camera-feed mt-3 rounded flex items-center justify-center" style={{ height: 120 }}>
                    <div style={{ textAlign: 'center', zIndex: 3, position: 'relative' }}>
                      <Camera size={20} style={{ color: 'var(--accent-cyan)', opacity: 0.5, margin: '0 auto 4px' }} />
                      <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Frame Capture</div>
                      <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{selectedTimelineEvent.snapshotId}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MAP */}
        {activeTab === 'map' && (
          <div className="h-full">
            <GujaratMap
              demoPhase="ROUTE_ANIMATING"
              showTracePath={true}
              mapZoomTarget={{ lat: 22.5, lng: 72.65, zoom: 8 }}
            />
          </div>
        )}

        {/* CAMERAS */}
        {activeTab === 'cameras' && (
          <div className="h-full overflow-y-auto p-6">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Involved Cameras ({invCameras.length})</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {invCameras.map((cam, i) => {
                const sighting = DEMO_VEHICLE.sightings.find(s => s.cameraId === cam.id);
                return (
                  <div key={cam.id} className="glass-panel overflow-hidden">
                    <div className="camera-feed" style={{ height: 100, background: `linear-gradient(135deg, #0a1628 0%, #0d2240 40%, #050e1c 100%)` }}>
                      {sighting && (
                        <div className="absolute inset-0 flex items-end p-2 z-10" style={{ zIndex: 5 }}>
                          <span className="badge badge-critical" style={{ fontSize: 8 }}>SIGHTING #{i + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{cam.id}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginTop: 1 }}>{cam.location.split(',')[0]}</div>
                      {sighting && (
                        <div style={{ fontSize: 9, color: 'var(--status-warning)', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                          ◉ {new Date(sighting.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ENTITIES */}
        {activeTab === 'entities' && (
          <div className="h-full overflow-y-auto p-6">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Related Entities</div>
            <div className="flex flex-col gap-3">
              {inv.relatedEntities.map(ent => (
                <div key={ent.entityId} className="glass-panel p-4">
                  <div className="flex items-start gap-4">
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: ent.entityType === 'WATCHLIST_ENTRY' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${ent.entityType === 'WATCHLIST_ENTRY' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 18 }}>{ent.entityType === 'WATCHLIST_ENTRY' ? '⚠️' : '👤'}</span>
                    </div>
                    <div className="flex-1">
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{ent.description}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <span style={{ fontSize: 9, padding: '2px 6px', background: 'rgba(139,92,246,0.1)', color: 'var(--status-info)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 3, fontWeight: 600 }}>{ent.entityType.replace('_', ' ')}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Relationship: <span style={{ color: 'var(--text-secondary)' }}>{ent.relationship.replace('_', ' ')}</span></span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Confidence: <span style={{ color: ent.confidence > 90 ? 'var(--status-online)' : 'var(--status-warning)', fontWeight: 600 }}>{ent.confidence}%</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVIDENCE */}
        {activeTab === 'evidence' && (
          <div className="h-full overflow-y-auto p-6">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Evidence Items ({inv.evidence.length})</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {inv.evidence.map(ev => (
                <div key={ev.evidenceId} className="glass-panel p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div style={{ fontSize: 20 }}>
                      {ev.type === 'SNAPSHOT' ? '📸' : ev.type === 'PLATE_READ' ? '🔍' : ev.type === 'DETECTION_DATA' ? '🤖' : ev.type === 'EVENT_LOG' ? '📋' : '📄'}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{ev.title}</div>
                      <div style={{ fontSize: 9, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{ev.type.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>{ev.description}</p>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {new Date(ev.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}
                    </span>
                    {ev.confidence && (
                      <span style={{ fontSize: 9, color: 'var(--status-online)', fontWeight: 600 }}>OCR: {ev.confidence}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

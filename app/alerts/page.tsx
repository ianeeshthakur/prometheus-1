'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ALERTS } from '@/lib/mock-data';
import { AlertTriangle, Eye, Navigation, Search, CheckCircle, Clock, X, Filter } from 'lucide-react';
import type { Alert, AlertSeverity } from '@/lib/types';

function AlertRow({ alert, isSelected, onClick }: { alert: Alert; isSelected: boolean; onClick: () => void }) {
  const sevColors: Record<AlertSeverity, string> = {
    CRITICAL: 'var(--status-critical)',
    HIGH: 'var(--status-warning)',
    MEDIUM: 'var(--status-info)',
    LOW: 'var(--status-offline)',
    INFO: 'var(--accent-cyan)',
  };
  const color = sevColors[alert.severity];

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 cursor-pointer"
      style={{
        borderBottom: '1px solid var(--border)',
        background: isSelected ? 'rgba(14,165,233,0.06)' : 'transparent',
        borderLeft: isSelected ? '2px solid var(--accent-cyan)' : '2px solid transparent',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Severity */}
      <div style={{ width: 80, flexShrink: 0 }}>
        <span className={`badge badge-${alert.severity.toLowerCase()}`}>{alert.severity}</span>
      </div>

      {/* Alert title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{alert.title}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {alert.entityDescription}
        </div>
      </div>

      {/* Location */}
      <div style={{ width: 140, flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{alert.cameraLocation.split(',')[0]}</div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{alert.district}</div>
      </div>

      {/* Time */}
      <div style={{ width: 80, flexShrink: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-secondary)' }}>
        {new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}
      </div>

      {/* Status */}
      <div style={{ width: 100, flexShrink: 0 }}>
        <span className={`badge ${alert.status === 'ACTIVE' ? 'badge-critical' : alert.status === 'ACKNOWLEDGED' ? 'badge-medium' : 'badge-online'}`} style={{ fontSize: 8 }}>
          {alert.status === 'ACTIVE' && <div className="severity-dot severity-dot-critical" style={{ width: 5, height: 5 }} />}
          {alert.status}
        </span>
      </div>
    </div>
  );
}

function AlertDetail({ alert, onClose }: { alert: Alert; onClose: () => void }) {
  const router = useRouter();
  const sevColors: Record<AlertSeverity, string> = {
    CRITICAL: 'var(--status-critical)',
    HIGH: 'var(--status-warning)',
    MEDIUM: 'var(--status-info)',
    LOW: 'var(--status-offline)',
    INFO: 'var(--accent-cyan)',
  };
  const color = sevColors[alert.severity];

  return (
    <div className="flex flex-col h-full animate-slide-in-right">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div>
          <span className={`badge badge-${alert.severity.toLowerCase()}`}>{alert.severity}</span>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{alert.title}</div>
        </div>
        <button onClick={onClose}><X size={16} style={{ color: 'var(--text-muted)' }} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Alert ID & Time */}
        <div className="glass-panel p-3">
          <div className="label-xs mb-2">ALERT DETAILS</div>
          {[
            ['Alert ID', alert.alertId],
            ['Status', alert.status],
            ['Entity', alert.entityDescription],
            ['District', alert.district],
            ['Camera', alert.cameraId],
            ['Location', alert.cameraLocation],
            ['Time', new Date(alert.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, gap: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="glass-panel p-3">
          <div className="label-xs mb-2">DESCRIPTION</div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{alert.description}</p>
        </div>

        {/* Acknowledged by */}
        {alert.acknowledgedBy && (
          <div className="glass-panel p-3">
            <div className="label-xs mb-2">ACKNOWLEDGED BY</div>
            <div style={{ fontSize: 11, color: 'var(--status-online)' }}>{alert.acknowledgedBy}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {alert.actionButtons.includes('VIEW_LIVE') && (
            <button className="btn btn-ghost w-full justify-center"><Eye size={13} /> VIEW LIVE FEED</button>
          )}
          {alert.actionButtons.includes('TRACE_VEHICLE') && (
            <button
              className="btn btn-danger w-full justify-center"
              onClick={() => router.push('/investigations/INV-2026-00482')}
            >
              <Navigation size={13} /> TRACE VEHICLE
            </button>
          )}
          {alert.actionButtons.includes('TRACE_PERSON') && (
            <button className="btn btn-danger w-full justify-center"><Navigation size={13} /> TRACE PERSON</button>
          )}
          {alert.actionButtons.includes('OPEN_INVESTIGATION') && (
            <button
              className="btn btn-primary w-full justify-center"
              onClick={() => router.push('/investigations/INV-2026-00482')}
            >
              <Search size={13} /> OPEN INVESTIGATION
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(ALERTS[0]);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const severities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const filtered = ALERTS.filter(a => severityFilter === 'ALL' || a.severity === severityFilter);

  const criticalCount = ALERTS.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const highCount = ALERTS.filter(a => a.severity === 'HIGH' && a.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Incidents & Alerts</h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            AI-generated events, watchlist matches, and system alerts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="severity-dot severity-dot-critical" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-critical)' }}>{criticalCount} CRITICAL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="severity-dot severity-dot-high" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-warning)' }}>{highCount} HIGH</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-2.5" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <Filter size={12} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>SEVERITY:</span>
        {severities.map(s => (
          <button key={s} onClick={() => setSeverityFilter(s)} style={{ fontSize: 10, padding: '2px 10px', borderRadius: 4, background: severityFilter === s ? 'rgba(14,165,233,0.15)' : 'transparent', color: severityFilter === s ? 'var(--accent-cyan)' : 'var(--text-muted)', border: `1px solid ${severityFilter === s ? 'rgba(14,165,233,0.3)' : 'transparent'}`, cursor: 'pointer', fontWeight: 600 }}>
            {s}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>
          {filtered.length} alert{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table header */}
      <div className="flex items-center gap-4 px-4 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ width: 80, fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Severity</div>
        <div style={{ flex: 1, fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Alert</div>
        <div style={{ width: 140, fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Location</div>
        <div style={{ width: 80, fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Time</div>
        <div style={{ width: 100, fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Status</div>
      </div>

      {/* Content */}
      <div className="flex flex-1 min-h-0">
        {/* List */}
        <div className="flex-1 overflow-y-auto" style={{ borderRight: '1px solid var(--border)' }}>
          {filtered.map(a => (
            <AlertRow key={a.alertId} alert={a} isSelected={selectedAlert?.alertId === a.alertId} onClick={() => setSelectedAlert(a)} />
          ))}
        </div>

        {/* Detail pane */}
        <div style={{ width: 340, flexShrink: 0, background: 'var(--bg-panel)' }}>
          {selectedAlert ? (
            <AlertDetail alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
          ) : (
            <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              Select an alert to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

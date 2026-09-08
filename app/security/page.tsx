'use client';

import { useState } from 'react';
import { Shield, Lock, Eye, Users, Key, FileText, AlertTriangle } from 'lucide-react';

const ROLES = [
  { role: 'State Admin', permissions: ['Full System Access', 'User Management', 'All Investigations', 'System Configuration', 'Audit Logs', 'Watchlist Management'], count: 3, color: 'var(--status-critical)' },
  { role: 'Command Center Operator', permissions: ['Live Camera View', 'Alert Management', 'Alert Acknowledgement', 'Investigation View', 'Watchlist View'], count: 24, color: 'var(--status-warning)' },
  { role: 'District Officer', permissions: ['District Camera View', 'District Alerts', 'District Investigations', 'Watchlist View (Read)'], count: 66, color: 'var(--accent-cyan)' },
  { role: 'Investigator', permissions: ['Assigned Investigation Access', 'Evidence View', 'Timeline Access', 'Camera Sightings View'], count: 142, color: 'var(--status-info)' },
  { role: 'System Administrator', permissions: ['Camera Registry Management', 'Integration Configuration', 'Health Monitoring', 'Technical Audit Logs'], count: 8, color: 'var(--status-online)' },
];

const AUDIT_LOGS = [
  { id: 'AUD-001', user: 'ACP D.K. Sharma', action: 'ALERT_ACKNOWLEDGED', resource: 'ALT-20260908-002', time: '21:25:14', ip: '10.10.8.42' },
  { id: 'AUD-002', user: 'PI R.K. Patel', action: 'INVESTIGATION_OPENED', resource: 'INV-2026-00482', time: '21:44:02', ip: '10.10.9.18' },
  { id: 'AUD-003', user: 'SYSTEM', action: 'WATCHLIST_MATCH_GENERATED', resource: 'WM-20260908-001', time: '21:43:21', ip: 'INTERNAL' },
  { id: 'AUD-004', user: 'DSP Kumar', action: 'WATCHLIST_ENTRY_VIEWED', resource: 'WL-SV-00291', time: '21:45:00', ip: '10.10.7.33' },
  { id: 'AUD-005', user: 'CI Missing Persons', action: 'INVESTIGATION_VIEWED', resource: 'INV-2026-00479', time: '21:30:22', ip: '10.10.6.51' },
  { id: 'AUD-006', user: 'SI Tech Wing', action: 'CAMERA_REGISTRY_VIEWED', resource: 'CAM-GJ-VDB-00074', time: '21:00:12', ip: '10.10.10.5' },
  { id: 'AUD-007', user: 'SYSTEM', action: 'ALERT_AUTO_GENERATED', resource: 'ALT-20260908-001', time: '21:43:21', ip: 'INTERNAL' },
];

const SECURITY_FEATURES = [
  { icon: '🔐', title: 'RBAC (Role-Based Access Control)', desc: 'Granular permission matrix. No role has more access than required for their operational function.', status: 'ACTIVE' },
  { icon: '🔒', title: 'Encrypted Credential Store', desc: 'Camera credentials stored encrypted at rest. Never exposed in frontend or API responses.', status: 'ACTIVE' },
  { icon: '🔑', title: 'API Authentication (JWT)', desc: 'All API calls require signed JWT tokens. Service-to-service calls use mTLS in production.', status: 'ACTIVE' },
  { icon: '📋', title: 'Complete Audit Trail', desc: 'Every access, view, modification, and alert acknowledgement is logged with user and timestamp.', status: 'ACTIVE' },
  { icon: '🛡️', title: 'Investigation Access Logging', desc: 'Any access to an investigation workspace is logged. Sensitive sightings require explicit authorization.', status: 'ACTIVE' },
  { icon: '🌐', title: 'Environment Variable Secrets', desc: 'No credentials in source code. All secrets managed via environment variables or secrets manager.', status: 'ACTIVE' },
  { icon: '⚠️', title: 'Privacy-Aware Design', desc: '"Potential Match" and "Re-identification Candidate" terminology used. No biometric claims without verified integration.', status: 'ACTIVE' },
  { icon: '🏛️', title: 'Data Retention Policies', desc: 'Raw video not stored centrally. Only normalized AI events retained per authorized data retention policy.', status: 'DESIGN' },
];

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'audit' | 'features'>('features');

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Security & Access Control</h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>RBAC, audit logs, access policies, and privacy controls</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <Shield size={13} style={{ color: 'var(--status-online)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-online)' }}>Security: Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-6" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        {[
          { id: 'features', label: 'Security Features', icon: <Shield size={12} /> },
          { id: 'roles', label: 'RBAC Roles', icon: <Users size={12} /> },
          { id: 'audit', label: 'Audit Log', icon: <FileText size={12} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className="flex items-center gap-1.5 px-4 py-3"
            style={{
              fontSize: 11, fontWeight: 600, cursor: 'pointer', background: 'transparent',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {activeTab === 'features' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {SECURITY_FEATURES.map(f => (
              <div key={f.title} className="glass-panel p-4">
                <div className="flex items-start gap-3">
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{f.title}</div>
                      <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: f.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(14,165,233,0.1)', color: f.status === 'ACTIVE' ? 'var(--status-online)' : 'var(--accent-cyan)', border: `1px solid ${f.status === 'ACTIVE' ? 'rgba(16,185,129,0.3)' : 'rgba(14,165,233,0.2)'}` }}>
                        {f.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="flex flex-col gap-4">
            {ROLES.map(role => (
              <div key={role.role} className="glass-panel p-4" style={{ borderLeft: `3px solid ${role.color}` }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{role.role}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: role.color, fontFamily: 'JetBrains Mono, monospace' }}>{role.count}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>active users</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {role.permissions.map(perm => (
                    <span key={perm} style={{ fontSize: 9, padding: '2px 6px', background: `${role.color}18`, color: role.color, border: `1px solid ${role.color}33`, borderRadius: 3, fontWeight: 600 }}>
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Recent Audit Log</div>
            <div className="glass-panel overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                {['Log ID', 'User', 'Action', 'Resource', 'Time', 'IP'].map(h => (
                  <div key={h} style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', flex: h === 'Action' || h === 'Resource' ? 1 : 'none', width: h === 'Log ID' ? 80 : h === 'User' ? 140 : h === 'Time' ? 70 : h === 'IP' ? 100 : 'auto' }}>
                    {h}
                  </div>
                ))}
              </div>
              {AUDIT_LOGS.map((log, i) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 px-4 py-2.5"
                  style={{ borderBottom: i < AUDIT_LOGS.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <div style={{ width: 80, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>{log.id}</div>
                  <div style={{ width: 140, fontSize: 10, fontWeight: 600, color: log.user === 'SYSTEM' ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{log.user}</div>
                  <div style={{ flex: 1, fontSize: 9, fontWeight: 700, color: log.action.includes('ALERT') ? 'var(--status-critical)' : log.action.includes('WATCHLIST') ? 'var(--status-warning)' : 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{log.action}</div>
                  <div style={{ flex: 1, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{log.resource}</div>
                  <div style={{ width: 70, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>{log.time}</div>
                  <div style={{ width: 100, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>{log.ip}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

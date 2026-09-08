'use client';

import { useRouter } from 'next/navigation';
import { DEMO_INVESTIGATION } from '@/lib/mock-data';
import { ChevronRight } from 'lucide-react';

interface InvListItem {
  id: string;
  title: string;
  entity: string;
  entityType: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdAt: string;
}

const ALL_INVESTIGATIONS: InvListItem[] = [
  {
    id: 'INV-2026-00482',
    title: 'Stolen Vehicle Trace — GJ05XX7821',
    entity: 'GJ05XX7821 — White Honda City Sedan',
    entityType: 'VEHICLE',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    assignedTo: 'PI R.K. Patel, Surat City',
    createdAt: '2026-09-08T21:44:02+05:30',
  },
  { id: 'INV-2026-00481', title: 'Suspicious Vehicle — Rajkot Gondal Road', entity: 'GJ03KK4421', entityType: 'VEHICLE', status: 'IN_PROGRESS', priority: 'HIGH', assignedTo: 'PI M.K. Joshi, Rajkot', createdAt: '2026-09-08T21:18:44+05:30' },
  { id: 'INV-2026-00480', title: 'Potential Wanted Person Match — Ahmedabad Ring Road', entity: 'PRS-3341', entityType: 'PERSON', status: 'OPEN', priority: 'HIGH', assignedTo: 'PI D.K. Sharma, Ahmedabad West', createdAt: '2026-09-08T21:22:09+05:30' },
  { id: 'INV-2026-00479', title: 'Missing Child — Gandhinagar', entity: 'PRS-1122', entityType: 'PERSON', status: 'IN_PROGRESS', priority: 'CRITICAL', assignedTo: 'CI Missing Persons Unit', createdAt: '2026-09-06T10:15:00+05:30' },
  { id: 'INV-2026-00478', title: 'Drug Trafficking Vehicle Surveillance', entity: 'GJ09DD1188', entityType: 'VEHICLE', status: 'IN_PROGRESS', priority: 'HIGH', assignedTo: 'DSP CID Gujarat', createdAt: '2026-08-15T09:00:00+05:30' },
  { id: 'INV-2026-00475', title: 'Camera Vandalism — Vadodara', entity: 'CAM-GJ-VDB-00074', entityType: 'CAMERA', status: 'PENDING_REVIEW', priority: 'MEDIUM', assignedTo: 'SI Technical Wing', createdAt: '2026-09-07T14:30:00+05:30' },
  { id: 'INV-2026-00471', title: 'Stolen Vehicle Recovery — Surat', entity: 'GJ01HH3321', entityType: 'VEHICLE', status: 'CLOSED', priority: 'HIGH', assignedTo: 'PI R.K. Patel, Surat City', createdAt: '2026-09-03T16:42:00+05:30' },
];

function statusColor(status: string): string {
  const map: Record<string, string> = {
    OPEN: 'var(--accent-cyan)',
    IN_PROGRESS: 'var(--status-warning)',
    PENDING_REVIEW: 'var(--status-info)',
    CLOSED: 'var(--status-offline)',
  };
  return map[status] ?? 'var(--text-muted)';
}

function priorityColor(priority: string): string {
  const map: Record<string, string> = {
    CRITICAL: 'var(--status-critical)',
    HIGH: 'var(--status-warning)',
    MEDIUM: 'var(--status-info)',
    LOW: 'var(--text-muted)',
  };
  return map[priority] ?? 'var(--text-muted)';
}

export default function InvestigationsListPage() {
  const router = useRouter();

  const openCount = ALL_INVESTIGATIONS.filter(i => i.status === 'OPEN').length;
  const inProgressCount = ALL_INVESTIGATIONS.filter(i => i.status === 'IN_PROGRESS').length;
  const criticalCount = ALL_INVESTIGATIONS.filter(i => i.priority === 'CRITICAL').length;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Investigations</h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Active cases, timelines, and evidence workspaces</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="severity-dot severity-dot-critical" />
            <span style={{ fontSize: 11, color: 'var(--status-critical)', fontWeight: 700 }}>{criticalCount} CRITICAL</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--status-warning)' }} />
            <span style={{ fontSize: 11, color: 'var(--status-warning)', fontWeight: 700 }}>{inProgressCount} IN PROGRESS</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: 11, color: 'var(--accent-cyan)', fontWeight: 700 }}>{openCount} OPEN</span>
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center gap-4 px-6 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        {[
          { label: 'ID', width: 140 },
          { label: 'Investigation', flex: 1 },
          { label: 'Priority', width: 80 },
          { label: 'Status', width: 110 },
          { label: 'Assigned To', width: 180 },
          { label: 'Created', width: 80 },
          { label: '', width: 24 },
        ].map(h => (
          <div
            key={h.label}
            style={{
              fontSize: 9, fontWeight: 700, color: 'var(--text-muted)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              flex: h.flex || 'none',
              width: h.width,
            }}
          >
            {h.label}
          </div>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {ALL_INVESTIGATIONS.map((inv) => {
          const isDemo = inv.id === 'INV-2026-00482';
          return (
            <div
              key={inv.id}
              className="flex items-center gap-4 px-6 py-3 cursor-pointer"
              onClick={() => router.push(`/investigations/${inv.id}`)}
              style={{
                borderBottom: '1px solid var(--border)',
                background: isDemo ? 'rgba(14,165,233,0.04)' : 'transparent',
                borderLeft: isDemo ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                transition: 'background 0.15s ease',
              }}
            >
              <div style={{ width: 140, flexShrink: 0 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {inv.id}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{inv.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {inv.entity} · {inv.entityType}
                </div>
              </div>
              <div style={{ width: 80, flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: priorityColor(inv.priority), letterSpacing: '0.05em' }}>
                  {inv.priority}
                </span>
              </div>
              <div style={{ width: 110, flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: statusColor(inv.status), letterSpacing: '0.04em' }}>
                  {inv.status.replace('_', ' ')}
                </span>
              </div>
              <div style={{ width: 180, fontSize: 10, color: 'var(--text-secondary)', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {inv.assignedTo}
              </div>
              <div style={{ width: 80, fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata' })}
              </div>
              <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

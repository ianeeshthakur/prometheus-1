'use client';

import { useState } from 'react';
import { WATCHLIST_ENTRIES, ALERTS } from '@/lib/mock-data';
import { Shield, AlertTriangle, Search, Eye, Bell } from 'lucide-react';
import type { WatchlistEntry, WatchlistCategory } from '@/lib/types';

const CATEGORY_LABELS: Record<WatchlistCategory, { label: string; icon: string; color: string }> = {
  STOLEN_VEHICLE: { label: 'Stolen Vehicles', icon: '🚗', color: 'var(--status-critical)' },
  WANTED_PERSON: { label: 'Wanted Persons', icon: '👤', color: 'var(--status-critical)' },
  MISSING_PERSON: { label: 'Missing Persons', icon: '🔍', color: 'var(--status-warning)' },
  VEHICLE_WATCHLIST: { label: 'Vehicle Watchlist', icon: '👁', color: 'var(--status-info)' },
  CUSTOM: { label: 'Custom Watchlist', icon: '⚙️', color: 'var(--text-muted)' },
};

function WatchlistCard({ entry }: { entry: WatchlistEntry }) {
  const cat = CATEGORY_LABELS[entry.category];
  const riskColors: Record<string, string> = {
    CRITICAL: 'var(--status-critical)',
    HIGH: 'var(--status-warning)',
    MEDIUM: 'var(--status-info)',
    LOW: 'var(--text-muted)',
  };
  const riskColor = riskColors[entry.riskLevel];
  const hasMatch = entry.matchCount > 0;

  return (
    <div
      className="glass-panel p-4"
      style={{
        borderLeft: `3px solid ${hasMatch ? 'var(--status-critical)' : cat.color}`,
        background: hasMatch ? 'rgba(239,68,68,0.04)' : 'var(--bg-panel)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 20 }}>{cat.icon}</span>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: cat.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{cat.label}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.03em', marginTop: 2 }}>{entry.identifier}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`badge badge-${entry.riskLevel.toLowerCase()}`}>{entry.riskLevel}</span>
          {hasMatch && (
            <div className="badge badge-critical" style={{ fontSize: 8 }}>
              <div className="severity-dot severity-dot-critical" style={{ width: 5, height: 5 }} />
              {entry.matchCount} MATCH{entry.matchCount !== 1 ? 'ES' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>{entry.description}</p>

      {/* Meta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
        {[
          ['Source', entry.source],
          ['Added', entry.addedDate],
          ['By', entry.addedBy],
          ['Status', entry.active ? 'ACTIVE' : 'INACTIVE'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{k}</div>
            <div style={{ fontSize: 9, color: k === 'Status' ? (entry.active ? 'var(--status-online)' : 'var(--text-muted)') : 'var(--text-secondary)', fontWeight: k === 'Status' ? 700 : 400, marginTop: 1 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Active match alert */}
      {hasMatch && (
        <div
          className="flex items-center gap-2 p-2 rounded"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <AlertTriangle size={12} style={{ color: 'var(--status-critical)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--status-critical)' }}>ACTIVE MATCH DETECTED</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Surat Ring Road · CAM-GJ-SRT-00421 · 21:43:18</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WatchlistsPage() {
  const [activeCategory, setActiveCategory] = useState<WatchlistCategory | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const categories = ['ALL', ...Array.from(new Set(WATCHLIST_ENTRIES.map(e => e.category)))] as (WatchlistCategory | 'ALL')[];
  const filtered = WATCHLIST_ENTRIES.filter(e => {
    if (activeCategory !== 'ALL' && e.category !== activeCategory) return false;
    if (search && !e.identifier.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalActive = WATCHLIST_ENTRIES.filter(e => e.active).length;
  const totalMatches = WATCHLIST_ENTRIES.reduce((acc, e) => acc + e.matchCount, 0);
  const criticalEntries = WATCHLIST_ENTRIES.filter(e => e.riskLevel === 'CRITICAL').length;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Watchlists</h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Authorized police watchlists — stolen vehicles, wanted persons, missing persons</p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: 'ACTIVE ENTRIES', val: totalActive, color: 'var(--text-primary)' },
            { label: 'MATCHES TODAY', val: totalMatches, color: 'var(--status-critical)' },
            { label: 'CRITICAL', val: criticalEntries, color: 'var(--status-critical)' },
          ].map(m => (
            <div key={m.label} className="glass-panel px-4 py-2 text-center">
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace' }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active match banner */}
      <div className="flex items-center gap-3 px-6 py-2.5" style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.3)', flexShrink: 0 }}>
        <AlertTriangle size={14} style={{ color: 'var(--status-critical)' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-critical)' }}>ACTIVE WATCHLIST MATCH</span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Vehicle GJ05XX7821 matched STOLEN VEHICLE entry at Surat Ring Road · Confidence: 97.4%</span>
        <button className="ml-auto btn btn-danger btn-sm">VIEW ALERT</button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 px-6 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        {/* Category buttons */}
        <div className="flex items-center gap-2">
          {categories.map(cat => {
            const info = cat !== 'ALL' ? CATEGORY_LABELS[cat] : null;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: 10, padding: '3px 10px', borderRadius: 4,
                  background: activeCategory === cat ? 'rgba(14,165,233,0.15)' : 'transparent',
                  color: activeCategory === cat ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  border: `1px solid ${activeCategory === cat ? 'rgba(14,165,233,0.3)' : 'transparent'}`,
                  cursor: 'pointer', fontWeight: 600,
                }}
              >
                {info ? `${info.icon} ${info.label}` : 'ALL'}
              </button>
            );
          })}
        </div>
        {/* Search */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', width: 200 }}>
          <Search size={12} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 11, color: 'var(--text-primary)', flex: 1 }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filtered.map(entry => (
            <WatchlistCard key={entry.entryId} entry={entry} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            No watchlist entries match your filter
          </div>
        )}
      </div>
    </div>
  );
}

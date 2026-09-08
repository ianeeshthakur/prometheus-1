'use client';

import { useState, useEffect } from 'react';
import { Bell, Activity, User, AlertOctagon, ChevronDown } from 'lucide-react';

export function TopBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
      });
      const dateStr = now.toLocaleDateString('en-IN', {
        weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
        timeZone: 'Asia/Kolkata',
      });
      setTime(timeStr);
      setDate(dateStr);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-4"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {/* Left: Branding */}
      <div className="flex items-center gap-3" style={{ paddingLeft: '16px' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            Gujarat Police
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 8px' }}>·</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-cyan)', letterSpacing: '0.04em' }}>
            G-VISTA
          </span>
        </div>
        <div
          className="badge badge-online"
          style={{ fontSize: 9 }}
        >
          <span className="severity-dot severity-dot-critical" style={{ background: 'var(--status-online)', boxShadow: 'none', animation: 'pulse-soft 2s ease infinite' }} />
          OPERATIONAL
        </div>
      </div>

      {/* Center: Operational Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Cameras
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-online)', fontFamily: 'JetBrains Mono, monospace' }}>
            79,842 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ 80,000+</span>
          </div>
        </div>
        <div className="divider-v" style={{ height: 20 }} />
        <div className="flex items-center gap-2">
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            AI Events/min
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>
            12,847
          </div>
        </div>
        <div className="divider-v" style={{ height: 20 }} />
        <div className="flex items-center gap-2">
          <div className="severity-dot severity-dot-critical" />
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Critical
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-critical)', fontFamily: 'JetBrains Mono, monospace' }}>
            2
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="flex flex-col items-end">
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
            {time}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            {date} IST
          </div>
        </div>

        <div className="divider-v" style={{ height: 28 }} />

        {/* Alerts bell */}
        <button
          className="relative flex items-center justify-center rounded-lg"
          style={{ width: 32, height: 32, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <Bell size={14} style={{ color: 'var(--status-critical)' }} />
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white font-bold"
            style={{ width: 14, height: 14, fontSize: 8, background: 'var(--status-critical)' }}
          >
            2
          </span>
        </button>

        {/* Health */}
        <button
          className="flex items-center gap-1.5 rounded-lg px-3"
          style={{ height: 32, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <Activity size={12} style={{ color: 'var(--status-online)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-online)' }}>99.1%</span>
        </button>

        {/* User */}
        <button
          className="flex items-center gap-2 rounded-lg px-3"
          style={{ height: 32, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 20, height: 20, background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', fontSize: 9, color: 'white', fontWeight: 700 }}
          >
            AO
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>ACP Sharma</span>
          <ChevronDown size={10} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </header>
  );
}

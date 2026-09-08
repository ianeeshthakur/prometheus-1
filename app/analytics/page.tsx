'use client';

import { EVENTS_TIMESERIES } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-2" style={{ fontSize: 10 }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color, fontFamily: 'JetBrains Mono, monospace' }}>{p.name}: {p.value.toLocaleString()}</div>
        ))}
      </div>
    );
  }
  return null;
};

const DISTRICT_EVENTS = [
  { district: 'Ahmedabad', events: 42180, alerts: 3, matches: 2 },
  { district: 'Surat', events: 38240, alerts: 4, matches: 3 },
  { district: 'Vadodara', events: 18960, alerts: 1, matches: 0 },
  { district: 'Rajkot', events: 14520, alerts: 2, matches: 1 },
  { district: 'Gandhinagar', events: 11840, alerts: 0, matches: 0 },
  { district: 'Bhavnagar', events: 8620, alerts: 1, matches: 0 },
  { district: 'Kutch', events: 6240, alerts: 0, matches: 0 },
];

const DETECTION_TYPES = [
  { name: 'Vehicle', value: 68, color: '#0ea5e9' },
  { name: 'License Plate', value: 18, color: '#10b981' },
  { name: 'Person', value: 11, color: '#f59e0b' },
  { name: 'Suspicious Activity', value: 3, color: '#ef4444' },
];

const WATCHLIST_TREND = [
  { date: 'Sep 2', matches: 4 }, { date: 'Sep 3', matches: 7 }, { date: 'Sep 4', matches: 3 },
  { date: 'Sep 5', matches: 9 }, { date: 'Sep 6', matches: 5 }, { date: 'Sep 7', matches: 6 },
  { date: 'Sep 8', matches: 7 },
];

export default function AnalyticsPage() {
  const hourlyData = EVENTS_TIMESERIES.map(d => ({ ...d, hour: d.hour.slice(0, 5) }));
  const totalEvents = hourlyData.reduce((acc, d) => acc + d.vehicle + d.person + d.plate, 0);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Analytics</h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>AI event volumes, detection trends, watchlist performance</p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: 'Total Events Today', value: totalEvents.toLocaleString(), color: 'var(--accent-cyan)' },
            { label: 'Watchlist Matches', value: '7', color: 'var(--status-critical)' },
            { label: 'Unique Vehicles', value: '284,291', color: 'var(--text-primary)' },
          ].map(m => (
            <div key={m.label} className="glass-panel px-4 py-2">
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace' }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* AI event volume */}
          <div className="glass-panel p-4">
            <div className="label-xs mb-4">AI EVENTS — LAST 24 HOURS</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 8, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fontSize: 8, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="vehicle" stroke="#0ea5e9" strokeWidth={2} fill="url(#vGrad)" name="Vehicle" />
                <Area type="monotone" dataKey="person" stroke="#f59e0b" strokeWidth={1.5} fill="url(#pGrad)" name="Person" />
                <Area type="monotone" dataKey="plate" stroke="#10b981" strokeWidth={1.5} fill="none" name="Plate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Detection type breakdown */}
          <div className="glass-panel p-4">
            <div className="label-xs mb-4">DETECTION TYPE BREAKDOWN</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={DETECTION_TYPES} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={2}>
                  {DETECTION_TYPES.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.85} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-2">
              {DETECTION_TYPES.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: d.color, fontFamily: 'JetBrains Mono, monospace' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* District-wise events */}
          <div className="glass-panel p-4">
            <div className="label-xs mb-4">EVENTS BY DISTRICT (TODAY)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DISTRICT_EVENTS} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 8, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="district" width={70} tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="events" fill="#0ea5e9" opacity={0.75} name="Events" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Watchlist match trend */}
          <div className="glass-panel p-4">
            <div className="label-xs mb-4">WATCHLIST MATCH TREND (7 DAYS)</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={WATCHLIST_TREND}>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="matches" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} name="Matches" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              Average: <span style={{ color: 'var(--status-critical)', fontWeight: 600 }}>5.86 matches/day</span> · Total: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>41 this week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

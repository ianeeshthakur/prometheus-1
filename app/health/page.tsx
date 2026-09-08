'use client';

import { SYSTEM_HEALTH, EVENTS_TIMESERIES } from '@/lib/mock-data';
import { Activity, Wifi, WifiOff, AlertTriangle, TrendingUp, Cpu } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const REGION_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

function RegionHealthCard({ region }: { region: typeof SYSTEM_HEALTH.regions[0] }) {
  const healthColor = region.healthPercent > 99 ? 'var(--status-online)' : region.healthPercent > 98 ? 'var(--status-warning)' : 'var(--status-critical)';

  return (
    <div className="glass-panel p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{region.region}</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{region.cameras.toLocaleString()} cameras</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: healthColor, fontFamily: 'JetBrains Mono, monospace' }}>{region.healthPercent}%</div>
          <div style={{ fontSize: 8, color: healthColor, letterSpacing: '0.05em', textTransform: 'uppercase' }}>HEALTH</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: '100%', width: `${region.healthPercent}%`, background: healthColor, borderRadius: 2, transition: 'width 1s ease' }} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-online)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{region.online.toLocaleString()} online</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-critical)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{region.cameras - region.online} offline/degraded</span>
        </div>
        {region.alerts > 0 && (
          <div className="flex items-center gap-1">
            <AlertTriangle size={10} style={{ color: 'var(--status-critical)' }} />
            <span style={{ fontSize: 10, color: 'var(--status-critical)' }}>{region.alerts} alert{region.alerts !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}

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

export default function HealthPage() {
  const health = SYSTEM_HEALTH;
  const pieData = [
    { name: 'Online', value: health.online, color: '#10b981' },
    { name: 'Degraded', value: health.degraded, color: '#f59e0b' },
    { name: 'Offline', value: health.offline, color: '#6b7280' },
  ];

  const topStats = [
    { label: 'Total Cameras', value: health.totalCameras.toLocaleString(), color: 'var(--text-primary)', icon: '📹' },
    { label: 'Online', value: health.online.toLocaleString(), color: 'var(--status-online)', icon: '✅' },
    { label: 'Offline', value: health.offline, color: 'var(--status-critical)', icon: '❌' },
    { label: 'Degraded', value: health.degraded, color: 'var(--status-warning)', icon: '⚠️' },
    { label: 'AI Load', value: `${health.aiProcessingLoad}%`, color: 'var(--accent-cyan)', icon: '🤖' },
    { label: 'Avg Latency', value: `${health.avgStreamLatency}ms`, color: health.avgStreamLatency < 200 ? 'var(--status-online)' : 'var(--status-warning)', icon: '⚡' },
    { label: 'Dropped Frames', value: `${health.droppedFrameRate}%`, color: 'var(--status-online)', icon: '🎞️' },
    { label: 'Integration Errors', value: health.integrationErrors, color: health.integrationErrors > 0 ? 'var(--status-warning)' : 'var(--status-online)', icon: '🔌' },
  ];

  const hourlyData = EVENTS_TIMESERIES.filter((_, i) => i % 2 === 0).map(d => ({
    ...d,
    hour: d.hour.slice(0, 2) + 'h',
  }));

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>System Health</h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Camera fleet status · AI performance · Integration health</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="severity-dot" style={{ background: 'var(--status-online)', animation: 'pulse-soft 2s ease infinite' }} />
          <Activity size={13} style={{ color: 'var(--status-online)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-online)' }}>99.1% SYSTEM HEALTH</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Top stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10, marginBottom: 20 }}>
          {topStats.map(stat => (
            <div key={stat.label} className="glass-panel p-3 text-center">
              <div style={{ fontSize: 16, marginBottom: 3 }}>{stat.icon}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: stat.color, fontFamily: 'JetBrains Mono, monospace' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Camera status pie */}
          <div className="glass-panel p-4">
            <div className="label-xs mb-4">CAMERA FLEET STATUS</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, color: 'var(--text-muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* AI events area chart */}
          <div className="glass-panel p-4">
            <div className="label-xs mb-4">AI EVENT VOLUME (24H)</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="vehicleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="vehicle" stroke="#0ea5e9" strokeWidth={2} fill="url(#vehicleGrad)" name="Vehicle" />
                <Area type="monotone" dataKey="person" stroke="#f59e0b" strokeWidth={1.5} fill="none" name="Person" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional health */}
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Regional Health</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
          {health.regions.map(region => (
            <RegionHealthCard key={region.region} region={region} />
          ))}
        </div>

        {/* Detection events bar chart */}
        <div className="glass-panel p-4">
          <div className="label-xs mb-4">HOURLY DETECTION BREAKDOWN</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={hourlyData.slice(12)}>
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="vehicle" fill="#0ea5e9" opacity={0.8} name="Vehicle" radius={[2, 2, 0, 0]} />
              <Bar dataKey="person" fill="#f59e0b" opacity={0.8} name="Person" radius={[2, 2, 0, 0]} />
              <Bar dataKey="plate" fill="#10b981" opacity={0.8} name="Plate" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

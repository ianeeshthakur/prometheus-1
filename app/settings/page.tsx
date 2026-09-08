'use client';

export default function SettingsPage() {
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px - 20px)', background: 'var(--bg-primary)' }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Settings</h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Platform configuration and preferences</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="glass-panel p-6" style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Demo Environment</div>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Platform Mode', value: 'DEMO MODE (Simulated Data)' },
              { label: 'Platform Version', value: 'G-VISTA v1.0.0-prototype' },
              { label: 'Build', value: '2026-09-08-hackathon' },
              { label: 'Map Provider', value: 'CartoDB Dark (OpenStreetMap tiles)' },
              { label: 'AI Engine', value: 'Simulated (YOLOv8 + PaddleOCR architecture)' },
              { label: 'Data Source', value: 'SIMULATED DATA — Not connected to real CCTV feeds' },
              { label: 'Camera Count', value: '79,842 (simulated)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

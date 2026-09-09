import { X, Search, Shield, Navigation, AlertTriangle, CheckCircle, Video } from 'lucide-react';
import { Alert } from '@/lib/types';
import { useState } from 'react';

interface IncidentDetailsModalProps {
  alert: Alert;
  onClose: () => void;
  onCreateCase: () => void;
  onTrace?: () => void;
}

export function IncidentDetailsModal({ alert, onClose, onCreateCase, onTrace }: IncidentDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--bg-panel)] w-full max-w-2xl max-h-[90vh] rounded-xl border border-[var(--border)] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              alert.severity === 'CRITICAL' ? 'bg-[var(--status-critical)]/10 text-[var(--status-critical)]' :
              alert.severity === 'HIGH' ? 'bg-[var(--status-warning)]/10 text-[var(--status-warning)]' :
              'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]'
            }`}>
              {alert.severity === 'CRITICAL' ? <AlertTriangle size={16} /> : <Shield size={16} />}
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[var(--text-primary)]">INCIDENT DETAILS</h2>
              <p className="text-[12px] text-[var(--text-muted)]">{alert.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-input)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {alert.evidenceImage && (
            <div>
              <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 uppercase">Evidence</div>
              <div className="relative rounded-lg overflow-hidden border border-[var(--border)] bg-black">
                <img src={alert.evidenceImage} alt="Evidence" className="w-full h-64 object-cover opacity-90" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur border border-white/10 rounded text-[10px] font-mono text-white/90">
                  {alert.timestamp}
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 bg-red-500/20 backdrop-blur border border-red-500/30 rounded text-[10px] font-bold text-red-400">
                  EVIDENCE
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border)]">
              <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Detection</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{alert.source || 'AI Analytics Pipeline'}</div>
            </div>
            <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border)]">
              <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Subject</div>
              <div className="text-[13px] font-mono font-medium text-[var(--text-primary)]">{alert.entityDescription}</div>
            </div>
            <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border)]">
              <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Location</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{alert.cameraLocation}</div>
            </div>
            <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border)]">
              <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Camera</div>
              <div className="text-[13px] font-mono text-[var(--text-secondary)]">{alert.cameraId}</div>
            </div>
            {alert.confidence && (
              <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border)]">
                <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Confidence</div>
                <div className="text-[13px] font-medium text-[var(--accent-cyan)]">{alert.confidence}%</div>
              </div>
            )}
            {alert.watchlistType && (
              <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border)]">
                <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Database Match</div>
                <div className="text-[13px] font-medium text-[var(--status-warning)]">{alert.watchlistType}</div>
              </div>
            )}
          </div>

          <div>
            <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-3 uppercase">Related Sightings & Timeline</div>
            <div className="flex flex-col gap-1 relative pl-2">
              <div className="absolute left-[13px] top-2 bottom-2 w-px bg-[var(--border)]"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[var(--bg-input)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                  <Video size={10} className="text-[var(--text-secondary)]" />
                </div>
                <div className="pb-4">
                  <div className="text-[12px] font-bold text-[var(--text-primary)]">21:31 — Vehicle First Detected</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">SP Ring Road, Bopal Junction</div>
                </div>
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[var(--bg-input)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                  <Search size={10} className="text-[var(--text-secondary)]" />
                </div>
                <div className="pb-4">
                  <div className="text-[12px] font-bold text-[var(--text-primary)]">21:34 — Cross-Camera Match</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Ahmedabad Ring Road Interchange</div>
                </div>
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[var(--bg-input)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                  <Video size={10} className="text-[var(--text-secondary)]" />
                </div>
                <div className="pb-4">
                  <div className="text-[12px] font-bold text-[var(--text-primary)]">21:41 — New Sighting</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Sachin GIDC Entry, Surat</div>
                </div>
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[var(--status-warning)]/10 border border-[var(--status-warning)]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield size={10} className="text-[var(--status-warning)]" />
                </div>
                <div className="pb-4">
                  <div className="text-[12px] font-bold text-[var(--text-primary)]">21:43 — Watchlist Correlation</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{alert.watchlistType || 'Stolen Vehicle Database'} match ({alert.confidence}%)</div>
                </div>
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[var(--status-critical)]/10 border border-[var(--status-critical)]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={10} className="text-[var(--status-critical)]" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-[var(--status-critical)]">21:43:21 — Alert Escalated</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Broadcast to Command Center</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-secondary)] flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-input)] transition-colors">
            Close
          </button>
          {alert.actionButtons.includes('TRACE_VEHICLE') || alert.actionButtons.includes('TRACE_PERSON') ? (
            <button 
              onClick={() => { onClose(); if(onTrace) onTrace(); }}
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors flex items-center gap-2"
            >
              <Navigation size={14} /> Track Across Cameras
            </button>
          ) : null}
          <button 
            onClick={() => { onClose(); onCreateCase(); }}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-bright)] transition-colors shadow-lg"
          >
            Create Investigation
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateCaseDialog({ alert, onClose, onSuccess }: { alert: Alert, onClose: () => void, onSuccess: (caseId: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      onSuccess(`INV-20260908-${Math.floor(Math.random() * 1000)}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--bg-panel)] w-full max-w-md rounded-xl border border-[var(--border)] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        <div className="p-5 border-b border-[var(--border)]">
          <h2 className="text-[16px] font-bold text-[var(--text-primary)] mb-1">CREATE INVESTIGATION</h2>
          <p className="text-[13px] text-[var(--text-muted)]">Initialize a new case file from this alert.</p>
        </div>
        
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase block mb-1">Case Title</label>
            <input type="text" defaultValue={`${alert.title} — ${alert.entityId}`} className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-md px-3 py-2 text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-cyan)] transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase block mb-1">Incident</label>
            <div className="text-[13px] text-[var(--text-secondary)] bg-[var(--bg-surface)] px-3 py-2 rounded-md border border-[var(--border)]">{alert.title}</div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase block mb-1">Location</label>
            <div className="text-[13px] text-[var(--text-secondary)] bg-[var(--bg-surface)] px-3 py-2 rounded-md border border-[var(--border)]">{alert.cameraLocation}</div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase block mb-1">Priority</label>
              <div className="text-[13px] font-bold text-[var(--status-critical)] bg-[var(--status-critical)]/10 px-3 py-2 rounded-md border border-[var(--status-critical)]/20">{alert.severity}</div>
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase block mb-1">Evidence</label>
              <div className="text-[13px] font-mono text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 px-3 py-2 rounded-md border border-[var(--accent-cyan)]/20">3 Items Attached</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-secondary)] flex justify-end gap-3">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 rounded-lg text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-input)] transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={loading} className="px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-bright)] transition-colors shadow-md min-w-[120px] flex items-center justify-center">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Case'}
          </button>
        </div>
      </div>
    </div>
  );
}

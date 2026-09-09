import { useState, useEffect } from 'react';
import { AlertTriangle, Navigation, Search, Shield, Video } from 'lucide-react';
import { ALERTS } from '@/lib/mock-data';
import { Alert } from '@/lib/types';
import { IncidentDetailsModal, CreateCaseDialog } from './IncidentModals';

interface IntelligenceDrawerProps {
  onAlertClick: (id: string) => void;
  onTrace?: () => void;
  onInvestigate?: () => void;
}

export function IntelligenceDrawer({ onAlertClick, onTrace, onInvestigate }: IntelligenceDrawerProps) {
  const [activeAlertId, setActiveAlertId] = useState<string | null>(ALERTS[0].alertId);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const [detailsAlert, setDetailsAlert] = useState<Alert | null>(null);
  const [createCaseAlert, setCreateCaseAlert] = useState<Alert | null>(null);

  // Trigger map pan for default selection
  useEffect(() => {
    if (ALERTS[0]) {
      onAlertClick(ALERTS[0].alertId);
    }
  }, [onAlertClick]);

  const handleSelect = (alert: Alert) => {
    setActiveAlertId(alert.alertId);
    onAlertClick(alert.alertId);
  };

  const filteredAlerts = ALERTS.filter(alert => {
    if (filter === 'Critical' && alert.severity !== 'CRITICAL') return false;
    if (filter === 'Watchlist' && alert.type !== 'WATCHLIST_MATCH' && alert.type !== 'PERSON_WATCHLIST') return false;
    if (search && !alert.title.toLowerCase().includes(search.toLowerCase()) && !alert.entityDescription.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full w-[400px] border-l border-[var(--border)] bg-[var(--bg-panel)] flex-shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[14px] font-semibold tracking-wide text-[var(--text-primary)]">
              Intelligence Feed
            </div>
            <div className="text-[12px] text-[var(--text-muted)] mt-0.5">
              Real-time analytics & alerts
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-[var(--status-critical)]/10 border border-[var(--status-critical)]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--status-critical)] animate-pulse" />
            <span className="text-[10px] font-bold text-[var(--status-critical)]">LIVE</span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-md pl-9 pr-3 py-1.5 text-[12px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-cyan)] transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Critical', 'Watchlist', 'AI Events'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors border ${
                  filter === f 
                    ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white' 
                    : 'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-input)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative">
        {filteredAlerts.map(alert => {
          const isSelected = activeAlertId === alert.alertId;
          const isCritical = alert.severity === 'CRITICAL';
          const isWatchlist = alert.watchlistType != null;
          
          let borderColor = 'border-[var(--border)]';
          let bgColor = 'bg-[var(--bg-surface)]';
          let hoverBg = 'hover:bg-[var(--bg-elevated)]';
          
          if (isCritical) {
            borderColor = isSelected ? 'border-[var(--status-critical)]' : 'border-[var(--status-critical)]/30';
            bgColor = isSelected ? 'bg-[var(--status-critical)]/10' : 'bg-[var(--bg-surface)]';
            hoverBg = 'hover:bg-[var(--status-critical)]/5';
          } else if (isSelected) {
            borderColor = 'border-[var(--accent-cyan)]';
            bgColor = 'bg-[var(--accent-cyan)]/5';
          }

          if (isSelected) {
            // EXPANDED CARD
            return (
              <div key={alert.alertId} className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden shadow-md transition-all duration-300`}>
                {/* Header */}
                <div className="p-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    {isCritical ? <AlertTriangle size={14} className="text-[var(--status-critical)]" /> : <Shield size={14} className="text-[var(--accent-cyan)]" />}
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${isCritical ? 'text-[var(--status-critical)]' : 'text-[var(--accent-cyan)]'}`}>
                      {isCritical ? 'CRITICAL INCIDENT' : isWatchlist ? 'WATCHLIST MATCH' : 'AI EVENT'}
                    </span>
                  </div>
                  <div className="text-[14px] font-bold text-[var(--text-primary)] mb-1">{alert.title}</div>
                  <div className="text-[12px] text-[var(--text-secondary)] leading-snug">{alert.description}</div>
                </div>
                
                {/* Evidence Image */}
                {alert.evidenceImage && (
                  <div className="relative w-full h-40 bg-black border-b border-[var(--border)]">
                    <img src={alert.evidenceImage} alt="Evidence" className="w-full h-full object-cover opacity-90" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur rounded border border-white/20 text-[9px] font-bold text-white tracking-widest">
                      EVIDENCE
                    </div>
                  </div>
                )}
                
                {/* Metadata */}
                <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Subject</div>
                    <div className="text-[12px] font-mono text-[var(--text-primary)]">{alert.entityDescription}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Confidence</div>
                    <div className="text-[12px] font-bold text-[var(--accent-cyan)]">{alert.confidence ? `${alert.confidence}%` : 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Location</div>
                    <div className="text-[12px] text-[var(--text-secondary)]">{alert.cameraLocation}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Time</div>
                    <div className="text-[12px] font-mono text-[var(--text-secondary)]">
                      {new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </div>
                  </div>
                  {alert.watchlistType && (
                    <div className="col-span-2">
                      <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-1 uppercase">Database Match</div>
                      <div className="text-[12px] font-bold text-[var(--status-warning)]">{alert.watchlistType}</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-3 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex flex-wrap gap-2">
                  <button onClick={() => setDetailsAlert(alert)} className="flex-1 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-[11px] font-bold text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-colors">
                    View Details
                  </button>
                  <button onClick={() => setCreateCaseAlert(alert)} className="flex-1 py-1.5 bg-[var(--accent-blue)] rounded text-[11px] font-bold text-white hover:bg-[var(--accent-blue-bright)] transition-colors shadow-sm">
                    Create Case
                  </button>
                  {(alert.actionButtons.includes('TRACE_VEHICLE') || alert.actionButtons.includes('TRACE_PERSON')) && (
                    <button onClick={onTrace} className="w-full py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded text-[11px] font-bold text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-colors flex justify-center items-center gap-1.5 mt-1">
                      <Navigation size={12} /> Track Subject
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // COMPACT CARD
          const isPersonEvent = alert.type.includes('PERSON') || alert.actionButtons.includes('TRACE_PERSON');
          
          return (
            <div 
              key={alert.alertId} 
              onClick={() => handleSelect(alert)}
              className={`p-4 rounded-xl border ${borderColor} ${bgColor} ${hoverBg} cursor-pointer transition-all shadow-sm`}
            >
              <div className="flex gap-4">
                <div className="mt-1 shrink-0">
                  {isCritical ? <AlertTriangle size={16} className="text-[var(--status-critical)]" /> : 
                   isWatchlist ? <Shield size={16} className="text-[var(--status-warning)]" /> :
                   <Video size={16} className="text-[var(--text-muted)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-[var(--text-primary)] leading-snug mb-1">
                    {alert.title}
                  </div>
                  <div className="text-[12px] font-mono text-[var(--text-secondary)] truncate mb-2">
                    {alert.entityId}
                  </div>
                  
                  {(isPersonEvent && alert.evidenceImage) && (
                    <div className="mb-3 mt-2 rounded-lg overflow-hidden border border-[var(--border)] w-[110px] h-[80px] shrink-0 shadow-sm relative">
                      <img src={alert.evidenceImage} alt="Evidence" className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur rounded text-[8px] font-bold text-white tracking-widest">
                        MATCH
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)]">
                    <span className="truncate max-w-[160px]">{alert.cameraLocation}</span>
                    <span className="font-mono whitespace-nowrap ml-2">
                      {new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                  {/* Quick Action */}
                  <div className="mt-3 flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setDetailsAlert(alert); }} className="flex-1 py-1.5 bg-[var(--bg-input)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md text-[11px] font-bold text-[var(--text-primary)] transition-colors text-center">
                      View Details
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setCreateCaseAlert(alert); }} className="flex-1 py-1.5 bg-[var(--accent-blue)]/10 hover:bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] rounded-md text-[11px] font-bold transition-colors text-center">
                      Open Case
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {detailsAlert && (
        <IncidentDetailsModal 
          alert={detailsAlert} 
          onClose={() => setDetailsAlert(null)} 
          onCreateCase={() => { setDetailsAlert(null); setCreateCaseAlert(detailsAlert); }}
          onTrace={onTrace}
        />
      )}
      
      {createCaseAlert && (
        <CreateCaseDialog
          alert={createCaseAlert}
          onClose={() => setCreateCaseAlert(null)}
          onSuccess={(id) => {
            setCreateCaseAlert(null);
            // Optionally could trigger a toast here
            alert(`Case ${id} created successfully!`);
          }}
        />
      )}
    </div>
  );
}

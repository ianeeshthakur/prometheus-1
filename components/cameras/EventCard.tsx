import { AlertTriangle, Shield, CheckCircle, Clock } from 'lucide-react';

export interface EventData {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  timestamp: string;
  location?: string;
  evidenceImage?: string;
  confidence?: string;
}

interface EventCardProps {
  event: EventData;
  onView: () => void;
  onCase: () => void;
}

export function EventCard({ event, onView, onCase }: EventCardProps) {
  const isCritical = event.severity === 'CRITICAL';
  const isWarning = event.severity === 'WARNING';

  const borderColor = isCritical ? 'border-red-500/50' : isWarning ? 'border-amber-500/50' : 'border-[var(--accent-cyan)]/30';
  const bgColor = isCritical ? 'bg-red-500/5' : isWarning ? 'bg-amber-500/5' : 'bg-[#0f172a]/50';
  const Icon = isCritical ? AlertTriangle : isWarning ? Shield : CheckCircle;
  const iconColor = isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-[var(--accent-cyan)]';

  return (
    <div className={`p-3 rounded-lg border ${borderColor} ${bgColor} hover:bg-[#1e293b]/80 transition-colors`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon size={14} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[10px] font-bold tracking-wider uppercase ${iconColor}`}>
              {event.type}
            </span>
            <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
              <Clock size={10} /> {event.timestamp}
            </span>
          </div>
          <div className="text-[12px] font-medium text-white/90 leading-snug mb-2">
            {event.description}
          </div>
          
          {event.evidenceImage && (
            <div className="mb-3 relative rounded-md overflow-hidden border border-white/10 h-[80px] w-full">
              <img src={event.evidenceImage} alt="Evidence" className="w-full h-full object-cover opacity-80" />
              {event.confidence && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] font-bold text-[var(--accent-cyan)] tracking-wider">
                  {event.confidence} MATCH
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button 
              onClick={onView}
              className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-bold text-white transition-colors"
            >
              VIEW
            </button>
            <button 
              onClick={onCase}
              className="flex-1 py-1.5 bg-[var(--accent-blue)]/20 hover:bg-[var(--accent-blue)]/40 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30 rounded text-[10px] font-bold transition-colors"
            >
              CASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

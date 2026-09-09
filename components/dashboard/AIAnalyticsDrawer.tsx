import { X, Crosshair, Activity, Users, MapPin, Box } from 'lucide-react';

interface AIAnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAnalyticsDrawer({ isOpen, onClose }: AIAnalyticsDrawerProps) {
  const AI_MODELS = [
    { name: 'Vehicle Detection', icon: Crosshair, description: 'Track speed, path, and classification' },
    { name: 'ANPR', icon: Activity, description: 'Automatic number plate recognition' },
    { name: 'Person Detection', icon: Users, description: 'Identify individuals and characteristics' },
    { name: 'Crowd Detection', icon: MapPin, description: 'Monitor density and flow' },
    { name: 'Object Detection', icon: Box, description: 'Identify abandoned or suspicious items' }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`absolute top-0 bottom-0 left-0 w-[320px] bg-[var(--bg-panel)] border-r border-[var(--border)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-[var(--text-primary)]">AI Analytics</h2>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">Configure active recognition models</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-3">
            {AI_MODELS.map((model, idx) => {
              const Icon = model.icon;
              return (
                <button 
                  key={idx}
                  className="w-full text-left p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] hover:border-[var(--accent-cyan)]/50 transition-all group flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-lg bg-[var(--bg-input)] group-hover:bg-[var(--accent-cyan)]/10 text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] transition-colors shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-cyan)] transition-colors">
                      {model.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] leading-snug">
                      {model.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

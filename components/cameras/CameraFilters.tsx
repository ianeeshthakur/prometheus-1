import { Search, SlidersHorizontal, ChevronDown, ListFilter } from 'lucide-react';

interface CameraFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export function CameraFilters({ statusFilter, setStatusFilter }: CameraFiltersProps) {
  const filters = [
    { id: 'ALL', label: 'All Cameras' },
    { id: 'HIGH_PRIORITY', label: 'High Priority' },
    { id: 'INCIDENTS', label: 'Incidents' },
    { id: 'ONLINE', label: 'Online' },
    { id: 'OFFLINE', label: 'Offline' }
  ];

  return (
    <div className="flex flex-col gap-4 p-6 border-b border-white/5 bg-[#0a0f18] shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-wide">LIVE MONITORING</h1>
          <p className="text-[12px] text-[var(--text-muted)] mt-1 tracking-wide">Real-time video feeds and edge AI detections</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] border border-white/10 rounded-lg text-[12px] font-bold text-white transition-colors">
            <SlidersHorizontal size={14} /> Grid: 3x3
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] border border-white/10 rounded-lg text-[12px] font-bold text-white transition-colors">
            All Clusters <ChevronDown size={14} className="text-white/50" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-white/40" />
          </div>
          <input 
            type="text" 
            placeholder="Search cameras by ID, location, or type..." 
            className="w-full pl-10 pr-4 py-2 bg-[#05080c] border border-white/10 rounded-lg text-[13px] text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all"
          />
        </div>

        <div className="w-px h-6 bg-white/10 mx-2" />

        <div className="flex items-center gap-2">
          <ListFilter size={16} className="text-white/40 mr-2" />
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider transition-colors ${
                statusFilter === filter.id 
                ? 'bg-[var(--accent-blue)] text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

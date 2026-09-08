import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface StreamHealthBadgeProps {
  status: string;
  fps: number;
  latencyMs: number;
}

export function StreamHealthBadge({ status, fps, latencyMs }: StreamHealthBadgeProps) {
  if (status === 'STARTING' || status === 'RECONNECTING') {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded bg-blue-900/40 border border-blue-500/30">
        <RefreshCw size={10} className="text-blue-400 animate-spin" />
        <span className="text-[9px] font-bold text-blue-400 tracking-wider">{status}</span>
      </div>
    );
  }

  if (status === 'OFFLINE' || status === 'ERROR') {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-900/40 border border-red-500/30">
        <WifiOff size={10} className="text-red-400" />
        <span className="text-[9px] font-bold text-red-400 tracking-wider">{status}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-2 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <div className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
        </div>
        <span className="text-[9px] font-bold text-green-400 tracking-wider">LIVE</span>
      </div>
      
      <div className="h-2 w-px bg-white/20"></div>
      
      <div className="flex items-center gap-2 text-[9px] font-mono text-gray-400">
        <span>{fps} FPS</span>
        <span className={latencyMs > 1000 ? 'text-yellow-400' : ''}>{latencyMs}ms</span>
      </div>
    </div>
  );
}

import React from 'react';
import { useIRASettings } from '../store';
import { 
  Activity, 
  ShieldAlert, 
  Wind, 
  Clock,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils';

const StatusBar: React.FC = () => {
  const { 
    gridData, 
    weather, 
    systemStatus 
  } = useIRASettings();

  const avgSuitability = gridData.length > 0 
    ? (gridData.reduce((acc, curr) => acc + curr.compositeScore, 0) / gridData.length) * 100
    : 0;

  const avgRisk = gridData.length > 0
    ? (gridData.reduce((acc, curr) => {
        const risk = (0.4 * curr.floodRisk) + (0.3 * curr.heatScore) + (0.3 * curr.airQuality);
        return acc + risk;
      }, 0) / gridData.length) * 100
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'PROCESSING': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse';
      case 'OFFLINE': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      default: return 'bg-white/20';
    }
  };

  return (
    <footer className="h-[48px] bg-[#040810]/92 backdrop-blur-[24px] border-t border-white/10 flex items-center justify-between px-6 fixed bottom-0 left-[300px] right-0 z-[100]">
      <div className="flex items-center gap-4">
        <div className="stat-pill">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tiles: <strong className="text-white">{gridData.length}</strong></span>
        </div>
        <div className="stat-pill">
          <Activity className="w-3.5 h-3.5 text-orange-500" />
          <span>Suitability: <strong className="text-orange-500">{Math.round(avgSuitability)}%</strong></span>
        </div>
        <div className="stat-pill">
          <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          <span>Risk: <strong className="text-red-500">{avgRisk.toFixed(1)}%</strong></span>
        </div>
        <div className="stat-pill">
          <Wind className="w-3.5 h-3.5 text-emerald-500" />
          <span>AQI: <strong className="text-emerald-500">{weather.aqi}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(systemStatus))} />
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">System {systemStatus}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-white/20" />
            <span className="text-[10px] font-mono text-white/40">{format(new Date(weather.lastSync), 'HH:mm:ss')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;

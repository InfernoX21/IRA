import React from 'react';
import { useIRASettings } from '../store';
import { 
  Wind, 
  CloudRain, 
  Sun, 
  TreePine, 
  Construction, 
  Zap,
  Mountain,
  Layers,
  Map as MapIcon,
  Box,
  Eye,
  EyeOff,
  Thermometer,
  Activity,
  Maximize2
} from 'lucide-react';
import { cn } from '../utils';

const Sidebar: React.FC = () => {
  const { 
    mapType, 
    setMapType, 
    is3D, 
    set3D,
    activeLayers,
    setLayerVisibility,
    setLayerOpacity,
    gridData
  } = useIRASettings();

  const LayerControl = ({ id, label, icon: Icon }: { id: keyof typeof activeLayers, label: string, icon: any }) => {
    const settings = activeLayers[id];
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              settings.visible ? "bg-white/10 text-orange-500" : "bg-white/5 text-white/20"
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={cn(
              "text-[13px] font-bold transition-colors",
              settings.visible ? "text-white/90" : "text-white/30"
            )}>
              {label}
            </span>
          </div>
          <button 
            onClick={() => setLayerVisibility(id, !settings.visible)}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              settings.visible ? "text-orange-500" : "text-white/10 hover:text-white/20"
            )}
          >
            {settings.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-1 bg-white/5 rounded-full relative">
            <div 
              className="absolute inset-y-0 left-0 bg-orange-500 rounded-full"
              style={{ width: `${settings.opacity * 100}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={settings.opacity}
              onChange={(e) => setLayerOpacity(id, parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-[#080D18] shadow-lg"
              style={{ left: `calc(${settings.opacity * 100}% - 6px)` }}
            />
          </div>
          <span className="text-[10px] font-bold text-white/30 w-8 text-right">{Math.round(settings.opacity * 100)}%</span>
        </div>
      </div>
    );
  };

  return (
    <aside className="w-[300px] bg-[#080D18] border-r border-white/10 flex flex-col fixed top-[56px] bottom-0 left-0 z-[100]">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
        {/* Base Map Engine */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <MapIcon className="w-5 h-5 text-orange-500" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Base Map Engine</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'satellite', label: 'Satellite' },
              { id: 'terrain', label: 'Terrain' },
              { id: 'roadmap', label: 'Street' },
              { id: 'hybrid', label: 'Hybrid' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setMapType(type.id as any)}
                className={cn(
                  "py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-2",
                  mapType === type.id 
                    ? "bg-white/10 border-white/20 text-white" 
                    : "bg-white/5 border-transparent text-white/20 hover:bg-white/10"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => set3D(!is3D)}
            className={cn(
              "w-full flex items-center justify-center gap-3 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-2",
              is3D 
                ? "bg-orange-500/10 border-orange-500/40 text-orange-500" 
                : "bg-white/5 border-transparent text-white/20"
            )}
          >
            <Box className="w-4 h-4" />
            3D Terrain: {is3D ? 'Enabled' : 'Disabled'}
          </button>
        </section>

        <div className="h-px bg-white/5" />

        {/* Intelligent Overlays */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-orange-500" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Intelligent Overlays</h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/20 block">Environmental</label>
              <div className="space-y-6">
                <LayerControl id="heatMap" label="Heat Map" icon={Thermometer} />
                <LayerControl id="floodRisk" label="Flood Risk" icon={CloudRain} />
                <LayerControl id="airQuality" label="Air Quality" icon={Wind} />
                <LayerControl id="elevation" label="Elevation" icon={Activity} />
              </div>
            </div>

            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/20 block">Planning</label>
              <div className="space-y-6">
                <LayerControl id="plantation" label="Tree Suitability" icon={TreePine} />
                <LayerControl id="construction" label="Construction Feasibility" icon={Construction} />
                <LayerControl id="solar" label="Solar Potential" icon={Sun} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10 bg-[#05080F] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-3.5 h-3.5 text-white/20" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Visible Area:</span>
          <span className="text-[10px] font-black text-white">0.0 km²</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Tiles:</span>
          <span className="text-[10px] font-black text-blue-500">{gridData.length}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

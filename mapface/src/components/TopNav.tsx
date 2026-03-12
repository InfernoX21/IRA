import React, { useEffect } from 'react';
import { useIRASettings, PlanningObjective } from '../store';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { 
  Download, 
  Bell, 
  User,
  ChevronDown,
  PenTool,
  Trash2
} from 'lucide-react';
import { cn } from '../utils';

const TopNav: React.FC = () => {
  const { 
    objective, 
    setObjective, 
    timelineYear, 
    setTimelineYear,
    currentLocationName,
    setCurrentLocationName,
    isDrawingMode,
    setIsDrawingMode,
    plottedArea,
    setPlottedArea,
    setUserLocation,
    gridData
  } = useIRASettings();

  const geocodingLibrary = useMapsLibrary('geocoding');

  const handleExport = () => {
    if (gridData.length === 0) return;

    const headers = [
      'ID',
      'Latitude',
      'Longitude',
      'Tree Score',
      'Construction Score',
      'Solar Score',
      'Flood Risk',
      'Elevation',
      'Composite Score',
      'AI Recommendation'
    ];

    const rows = gridData.map(cell => [
      cell.id,
      cell.coordinates[0],
      cell.coordinates[1],
      cell.treeScore.toFixed(4),
      cell.constructionScore.toFixed(4),
      cell.solarScore.toFixed(4),
      cell.floodRisk.toFixed(4),
      cell.elevation.toFixed(2),
      cell.compositeScore.toFixed(4),
      `"${cell.aiRecommendation.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ira_analysis_${currentLocationName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (navigator.geolocation && geocodingLibrary) {
      const geocoder = new geocodingLibrary.Geocoder();
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const pos = { lat: latitude, lng: longitude };
          setUserLocation(pos);
          
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const city = results[0].address_components.find((c: any) => c.types.includes('locality'))?.long_name;
              const state = results[0].address_components.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name;
              if (city && state) {
                setCurrentLocationName(`${city}, ${state}`);
              } else {
                setCurrentLocationName(results[0].formatted_address);
              }
            } else {
              console.warn(`Geocoding failed: ${status}`);
              if (status === 'REQUEST_DENIED') {
                setCurrentLocationName('Location Service Disabled');
              }
            }
          });
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [setUserLocation, setCurrentLocationName, geocodingLibrary]);

  const objectives: { id: PlanningObjective; label: string }[] = [
    { id: 'Environmental', label: 'Environmental' },
    { id: 'Balanced', label: 'Balanced' },
    { id: 'Revenue', label: 'Revenue' },
    { id: 'Resilience', label: 'Resilience' }
  ];

  return (
    <nav className="h-[56px] bg-[#080D18]/90 backdrop-blur-[32px] border-b border-white/10 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-[100]">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter leading-none">I.R.A.</span>
          </div>
        </div>
        <div className="h-10 w-px bg-white/10" />
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <div className="relative flex h-1.5 w-1.5">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></div>
              </div>
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>
          <span className={cn(
            "text-lg font-black uppercase tracking-tight leading-none max-w-[200px] truncate transition-colors",
            (currentLocationName === 'Detecting Location...' || (currentLocationName === 'San Francisco Bay Area' && !plottedArea)) ? "text-white/40 italic" : "text-white"
          )}>
            {currentLocationName}
          </span>
        </div>
      </div>

      {/* Center Section — Objective Pills & Plot Tool */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
          {objectives.map((obj) => (
            <button
              key={obj.id}
              onClick={() => setObjective(obj.id)}
              className={cn(
                "px-5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                objective === obj.id 
                  ? "bg-orange-500/12 border border-orange-500/30 text-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.12)]" 
                  : "text-white/40 hover:text-white/60"
              )}
            >
              {obj.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDrawingMode(!isDrawingMode)}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border",
              isDrawingMode 
                ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20" 
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
            )}
          >
            <PenTool className="w-3.5 h-3.5" />
            {plottedArea ? 'Re-plot Area' : 'Plot Area'}
          </button>
          {plottedArea && (
            <button
              onClick={() => {
                setPlottedArea(null);
                setIsDrawingMode(false);
              }}
              className="p-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
              title="Clear Plotted Area"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Section — Simulation & Actions */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 min-w-[240px]">
          <span className="text-[11px] text-white/30 font-bold uppercase tracking-widest">Simulation</span>
          <div className="flex-1 relative flex items-center group">
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="1" 
              value={timelineYear}
              onChange={(e) => setTimelineYear(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500"
              style={{
                background: `linear-gradient(90deg, #F97316 ${timelineYear * 10}%, rgba(255,255,255,0.06) ${timelineYear * 10}%)`
              }}
            />
            <div className="absolute -top-6 left-0 right-0 flex justify-between text-[10px] text-white/20 font-mono uppercase">
              <span>Present</span>
              <span>+10Y</span>
            </div>
          </div>
          <span className="text-xs font-mono text-orange-500 font-bold w-8">+{timelineYear}Y</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={gridData.length === 0}
            className={cn(
              "p-2 rounded-lg border transition-all",
              gridData.length > 0 
                ? "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10" 
                : "bg-white/2 border-white/5 text-white/10 cursor-not-allowed"
            )}
            title={gridData.length > 0 ? "Export Analysis to CSV" : "No data to export"}
          >
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all relative">
            <Bell className="w-4 h-4" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full border border-[#080D18]" />
          </button>
          <div className="h-8 w-px bg-white/10 mx-1" />
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;

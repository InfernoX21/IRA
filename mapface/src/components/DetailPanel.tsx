import React, { useEffect, useState, useRef } from 'react';
import { useIRASettings } from '../store';
import { 
  X, 
  MapPin, 
  Activity,
  Zap,
  TreePine,
  Building2,
  Brain,
  Camera,
  Loader2,
  Search,
  Map as MapIcon,
  BarChart3,
  Leaf,
  Target,
  Maximize2,
  ArrowUpRight,
  Mountain,
  Wind
} from 'lucide-react';
import { cn } from '../utils';
import { 
  getGeminiRecommendation, 
  getComplexAnalysis, 
  analyzeSiteImage,
  getSearchGroundingAnalysis,
  getMapsGrounding
} from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

const DetailPanel: React.FC = () => {
  const { selectedCell, setSelectedCell, objective, weather } = useIRASettings();
  const [recommendation, setRecommendation] = useState<string>('');
  const [deepAnalysis, setDeepAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [deepLoading, setDeepLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mapsLoading, setMapsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedCell) {
      setLoading(true);
      setDeepAnalysis('');
      getGeminiRecommendation(selectedCell, objective)
        .then(res => setRecommendation(res || ''))
        .finally(() => setLoading(false));
    } else {
      setRecommendation('');
      setDeepAnalysis('');
    }
  }, [selectedCell, objective]);

  const handleDeepAnalysis = async () => {
    if (!selectedCell) return;
    setDeepLoading(true);
    try {
      const res = await getComplexAnalysis(
        `Provide a deep climate-adaptive analysis for this specific grid cell. Consider long-term sustainability and infrastructure resilience.`,
        { cell: selectedCell, objective, weather }
      );
      setDeepAnalysis(res || '');
    } catch (error) {
      console.error(error);
    } finally {
      setDeepLoading(false);
    }
  };

  const handleSearchAnalysis = async () => {
    if (!selectedCell) return;
    setSearchLoading(true);
    try {
      const res = await getSearchGroundingAnalysis(
        `What are the latest urban planning trends or environmental regulations affecting the area around ${selectedCell.coordinates[0]}, ${selectedCell.coordinates[1]}?`
      );
      setDeepAnalysis(res || '');
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleMapsAnalysis = async () => {
    if (!selectedCell) return;
    setMapsLoading(true);
    try {
      const res = await getMapsGrounding(
        `What are the nearest critical infrastructure points (hospitals, fire stations, schools) for the location ${selectedCell.coordinates[0]}, ${selectedCell.coordinates[1]}?`
      );
      setDeepAnalysis(res.text || '');
    } catch (error) {
      console.error(error);
    } finally {
      setMapsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCell) return;

    setImageLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await analyzeSiteImage(base64, "Analyze this site photo for urban planning suitability and environmental impact.");
        setDeepAnalysis(res || '');
      } catch (error) {
        console.error(error);
      } finally {
        setImageLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {selectedCell && (
        <motion.aside 
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 30, 
            stiffness: 300,
            opacity: { duration: 0.2 }
          }}
          className="w-[320px] bg-[#080D18]/88 backdrop-blur-[32px] border-l border-white/10 flex flex-col fixed top-[56px] bottom-[48px] right-0 z-[100] overflow-y-auto"
        >
          <div className="p-5 space-y-8 pb-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold text-white tracking-tight">Zone Intelligence</h2>
              </div>
              <button 
                onClick={() => setSelectedCell(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid Header */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Grid Reference</span>
                </div>
                <span className="text-[10px] font-mono text-white/40">ID: {selectedCell.id.slice(0, 8)}</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/30 font-bold uppercase">Latitude</span>
                  <span className="text-sm font-mono text-white/80">{selectedCell.coordinates[0].toFixed(6)}</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-white/30 font-bold uppercase">Longitude</span>
                  <span className="text-sm font-mono text-white/80">{selectedCell.coordinates[1].toFixed(6)}</span>
                </div>
              </div>
            </section>

            {/* Score Cards (2x2 Grid) */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Suitability Matrix</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Plantation', value: selectedCell.treeScore, icon: TreePine, color: '#22C55E' },
                  { label: 'Construction', value: selectedCell.constructionScore, icon: Building2, color: '#3B82F6' },
                  { label: 'Solar Yield', value: selectedCell.solarScore, icon: Zap, color: '#EAB308' },
                  { label: 'Flood Risk', value: selectedCell.floodRisk, icon: Leaf, color: '#EF4444' },
                ].map((score) => (
                  <div key={score.label} className="score-card group">
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: score.color }} />
                    <div className="flex items-center justify-between mb-2">
                      <score.icon className="w-4 h-4" style={{ color: score.color }} />
                      <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-white/40 transition-colors" />
                    </div>
                    <span className="block text-[10px] text-text-muted font-bold uppercase mb-1">{score.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold" style={{ color: score.color }}>
                        {Math.round(score.value * 100)}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono">/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Metrics Row */}
            <section className="grid grid-cols-3 gap-2">
              {[
                { label: 'Elevation', value: `${selectedCell.elevation.toFixed(1)}m`, icon: Mountain },
                { label: 'Slope', value: '4.2°', icon: Activity },
                { label: 'AQI', value: weather.aqi, icon: Wind },
              ].map((m) => (
                <div key={m.label} className="flex flex-col items-center p-2 rounded-xl bg-white/3 border border-white/5">
                  <m.icon className="w-3.5 h-3.5 text-white/20 mb-1.5" />
                  <span className="text-[9px] text-white/30 font-bold uppercase mb-0.5">{m.label}</span>
                  <span className="text-xs font-mono text-white/70">{m.value}</span>
                </div>
              ))}
            </section>

            {/* AI Recommendation Block */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">AI Insights</span>
              </div>
              <div className="ai-rec">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">✦ AI Analysis</span>
                </div>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-3 skeleton-shimmer rounded w-3/4" />
                    <div className="h-3 skeleton-shimmer rounded w-full" />
                    <div className="h-3 skeleton-shimmer rounded w-5/6" />
                  </div>
                ) : (
                  <p className="text-[13px] text-slate-300 leading-relaxed">
                    {recommendation}
                  </p>
                )}
              </div>
            </section>

            {/* Advanced Tools */}
            <section className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleDeepAnalysis}
                  disabled={deepLoading}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group disabled:opacity-50"
                >
                  {deepLoading ? <Loader2 className="w-4 h-4 text-orange-500 animate-spin" /> : <Brain className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />}
                  <span className="text-[9px] font-bold uppercase tracking-wider">Deep Think</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group disabled:opacity-50"
                >
                  {imageLoading ? <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" /> : <Camera className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />}
                  <span className="text-[9px] font-bold uppercase tracking-wider">Site Photo</span>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </button>
                <button onClick={handleSearchAnalysis} disabled={searchLoading} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group disabled:opacity-50">
                  {searchLoading ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" /> : <Search className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />}
                  <span className="text-[9px] font-bold uppercase tracking-wider">Search</span>
                </button>
                <button onClick={handleMapsAnalysis} disabled={mapsLoading} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group disabled:opacity-50">
                  {mapsLoading ? <Loader2 className="w-4 h-4 text-red-500 animate-spin" /> : <MapIcon className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />}
                  <span className="text-[9px] font-bold uppercase tracking-wider">Nearby</span>
                </button>
              </div>
              
              {deepAnalysis && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 mt-4"
                >
                  <div className="text-xs text-white/80 leading-relaxed markdown-body">
                    <ReactMarkdown>{deepAnalysis}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </section>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default DetailPanel;

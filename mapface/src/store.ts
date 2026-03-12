import { create } from 'zustand';

export type PlanningObjective = 'Environmental' | 'Revenue' | 'Balanced' | 'Resilience';

export interface GridCell {
  id: string;
  coordinates: [number, number]; // [lat, lng]
  treeScore: number;
  constructionScore: number;
  solarScore: number;
  floodRisk: number;
  heatScore: number;
  airQuality: number;
  slope: number;
  elevation: number;
  rainfall: number;
  temperature: number;
  solarIrradiance: number;
  zoningType: string;
  compositeScore: number;
  aiRecommendation: string;
}

export interface LayerSettings {
  visible: boolean;
  opacity: number;
}

interface IRAState {
  objective: PlanningObjective;
  timelineYear: number;
  selectedCell: GridCell | null;
  gridData: GridCell[];
  isProjectionMode: boolean;
  suitabilityThreshold: number;
  mapType: 'satellite' | 'terrain' | 'roadmap' | 'hybrid';
  is3D: boolean;
  
  // Filters
  filters: {
    scoreRange: [number, number];
    riskLevel: 'All' | 'Low' | 'Medium' | 'High';
    zoning: string;
  };

  activeLayers: {
    heatMap: LayerSettings;
    floodRisk: LayerSettings;
    airQuality: LayerSettings;
    elevation: LayerSettings;
    plantation: LayerSettings;
    construction: LayerSettings;
    solar: LayerSettings;
  };
  
  weather: {
    temp: number;
    humidity: number;
    aqi: number;
    lastSync: string;
  };

  currentLocationName: string;
  plottedArea: any | null; // GeoJSON Polygon or null
  isDrawingMode: boolean;
  userLocation: { lat: number; lng: number } | null;
  isTracking: boolean;
  systemStatus: 'LIVE' | 'PROCESSING' | 'OFFLINE';

  setObjective: (objective: PlanningObjective) => void;
  setTimelineYear: (year: number) => void;
  setSelectedCell: (cell: GridCell | null) => void;
  setGridData: (data: GridCell[]) => void;
  setSuitabilityThreshold: (val: number) => void;
  setMapType: (type: 'satellite' | 'terrain' | 'roadmap' | 'hybrid') => void;
  set3D: (val: boolean) => void;
  setLayerVisibility: (layer: keyof IRAState['activeLayers'], visible: boolean) => void;
  setLayerOpacity: (layer: keyof IRAState['activeLayers'], opacity: number) => void;
  setFilter: (key: keyof IRAState['filters'], value: any) => void;
  updateWeather: (data: Partial<IRAState['weather']>) => void;
  setCurrentLocationName: (name: string) => void;
  setPlottedArea: (area: any | null) => void;
  setIsDrawingMode: (val: boolean) => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  setIsTracking: (val: boolean) => void;
  setSystemStatus: (status: 'LIVE' | 'PROCESSING' | 'OFFLINE') => void;
}

export const useIRASettings = create<IRAState>((set) => ({
  objective: 'Balanced',
  timelineYear: 0,
  selectedCell: null,
  gridData: [],
  isProjectionMode: false,
  suitabilityThreshold: 0.3,
  mapType: 'satellite',
  is3D: true,
  filters: {
    scoreRange: [0, 100],
    riskLevel: 'All',
    zoning: 'All',
  },
  activeLayers: {
    heatMap: { visible: false, opacity: 0.6 },
    floodRisk: { visible: true, opacity: 0.6 },
    airQuality: { visible: false, opacity: 0.6 },
    elevation: { visible: false, opacity: 0.6 },
    plantation: { visible: true, opacity: 0.6 },
    construction: { visible: true, opacity: 0.6 },
    solar: { visible: true, opacity: 0.6 },
  },
  weather: {
    temp: 24,
    humidity: 65,
    aqi: 42,
    lastSync: new Date().toISOString(),
  },
  currentLocationName: 'Project Area',
  plottedArea: null,
  isDrawingMode: false,
  userLocation: null,
  isTracking: false,
  systemStatus: 'LIVE',

  setObjective: (objective) => set({ objective }),
  setTimelineYear: (year) => set({ timelineYear: year, isProjectionMode: year > 0 }),
  setSelectedCell: (cell) => set({ selectedCell: cell }),
  setGridData: (gridData) => set({ gridData }),
  setSuitabilityThreshold: (suitabilityThreshold) => set({ suitabilityThreshold }),
  setMapType: (mapType) => set({ mapType }),
  set3D: (is3D) => set({ is3D }),
  setLayerVisibility: (layer, visible) => set((state) => ({
    activeLayers: { ...state.activeLayers, [layer]: { ...state.activeLayers[layer], visible } }
  })),
  setLayerOpacity: (layer, opacity) => set((state) => ({
    activeLayers: { ...state.activeLayers, [layer]: { ...state.activeLayers[layer], opacity } }
  })),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  updateWeather: (data) => set((state) => ({
    weather: { ...state.weather, ...data }
  })),
  setCurrentLocationName: (currentLocationName) => set({ currentLocationName }),
  setPlottedArea: (plottedArea) => set({ plottedArea }),
  setIsDrawingMode: (isDrawingMode) => set({ isDrawingMode }),
  setUserLocation: (userLocation) => set({ userLocation }),
  setIsTracking: (isTracking) => set({ isTracking }),
  setSystemStatus: (systemStatus) => set({ systemStatus }),
}));

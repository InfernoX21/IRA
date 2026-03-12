import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Map, useMap, useMapsLibrary, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { GeoJsonLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { useIRASettings } from '../store';
import { generateGrid } from '../utils';
import { 
  Plus, 
  Minus, 
  Compass, 
  Layers,
  Box,
  MousePointer2,
  Navigation
} from 'lucide-react';
import { cn } from '../utils';

const MapOverlay: React.FC<{ 
  gridGeoJSON: any, 
  is3D: boolean, 
  suitabilityThreshold: number, 
  activeLayers: any, 
  hoveredCell: any, 
  selectedCell: any,
  setHoveredCell: (cell: any) => void, 
  setSelectedCell: (cell: any) => void 
}> = ({ 
  gridGeoJSON, 
  is3D, 
  suitabilityThreshold, 
  activeLayers, 
  hoveredCell, 
  selectedCell,
  setHoveredCell, 
  setSelectedCell 
}) => {
  const map = useMap();
  const overlay = useMemo(() => new GoogleMapsOverlay({ layers: [] }), []);

  useEffect(() => {
    if (map && overlay) {
      overlay.setMap(map);
      return () => overlay.setMap(null);
    }
  }, [map, overlay]);

  // Center map on selected cell
  useEffect(() => {
    if (map && selectedCell) {
      map.panTo({ lat: selectedCell.coordinates[0], lng: selectedCell.coordinates[1] });
      // Optionally zoom in a bit if not already zoomed in
      if (map.getZoom()! < 17) {
        map.setZoom(17);
      }
    }
  }, [map, selectedCell]);

  useEffect(() => {
    const layers: any[] = [];

    // 1. Base Grid Layer
    layers.push(new GeoJsonLayer({
      id: 'urban-grid-base',
      data: gridGeoJSON,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: is3D,
      getElevation: (f: any) => is3D ? f.properties.elevation * 2 : 0,
      getFillColor: (f: any) => {
        const cell = f.properties;
        const score = (cell.treeScore + cell.constructionScore + cell.solarScore) / 3;
        if (score < suitabilityThreshold) return [0, 0, 0, 0];
        
        let color: [number, number, number, number] = [249, 115, 22, 100];
        if (cell.treeScore > cell.constructionScore && cell.treeScore > cell.solarScore && activeLayers.plantation.visible) 
          color = [34, 197, 94, activeLayers.plantation.opacity * 255];
        else if (cell.constructionScore > cell.treeScore && cell.constructionScore > cell.solarScore && activeLayers.construction.visible) 
          color = [59, 130, 246, activeLayers.construction.opacity * 255];
        else if (cell.solarScore > cell.treeScore && cell.solarScore > cell.constructionScore && activeLayers.solar.visible) 
          color = [234, 179, 8, activeLayers.solar.opacity * 255];
        
        if (selectedCell && selectedCell.id === cell.id) return [color[0], color[1], color[2], 255];
        if (hoveredCell && hoveredCell.id === cell.id) return [color[0], color[1], color[2], Math.min(255, color[3] + 50)];
        return color;
      },
      getLineColor: (f: any) => {
        if (selectedCell && selectedCell.id === f.properties.id) return [249, 115, 22, 255];
        if (hoveredCell && hoveredCell.id === f.properties.id) return [249, 115, 22, 230];
        return [255, 255, 255, 30];
      },
      getLineWidth: (f: any) => {
        if (selectedCell && selectedCell.id === f.properties.id) return 4;
        if (hoveredCell && hoveredCell.id === f.properties.id) return 2;
        return 1;
      },
      lineWidthUnits: 'pixels',
      onHover: (info) => setHoveredCell(info.object ? info.object.properties : null),
      onClick: (info) => {
        if (info.object) {
          setSelectedCell({
            id: info.object.properties.id,
            coordinates: [info.object.geometry.coordinates[0][0][1], info.object.geometry.coordinates[0][0][0]],
            ...info.object.properties
          });
        }
      },
      updateTriggers: {
        getFillColor: [suitabilityThreshold, activeLayers, hoveredCell, selectedCell],
        getLineColor: [hoveredCell, selectedCell],
        getLineWidth: [hoveredCell, selectedCell],
        getElevation: [is3D]
      }
    }));

    // 2. Heat Map Overlay
    if (activeLayers.heatMap.visible) {
      layers.push(new GeoJsonLayer({
        id: 'overlay-heat',
        data: gridGeoJSON,
        filled: true,
        stroked: false,
        getFillColor: (f: any) => {
          const v = f.properties.heatScore;
          if (v < 0.5) return [255, 255 * (1 - v), 0, activeLayers.heatMap.opacity * 255];
          return [255, 165 * (1 - (v - 0.5) * 2), 0, activeLayers.heatMap.opacity * 255];
        },
        updateTriggers: { getFillColor: [activeLayers.heatMap.opacity] }
      }));
    }

    // 3. Flood Risk Overlay
    if (activeLayers.floodRisk.visible) {
      layers.push(new GeoJsonLayer({
        id: 'overlay-flood',
        data: gridGeoJSON,
        filled: true,
        stroked: false,
        getFillColor: (f: any) => {
          const v = f.properties.floodRisk;
          return [0, 100 * (1 - v), 255 * (1 - v * 0.5), activeLayers.floodRisk.opacity * 255];
        },
        updateTriggers: { getFillColor: [activeLayers.floodRisk.opacity] }
      }));
    }

    // 4. Air Quality Overlay
    if (activeLayers.airQuality.visible) {
      layers.push(new GeoJsonLayer({
        id: 'overlay-air',
        data: gridGeoJSON,
        filled: true,
        stroked: false,
        getFillColor: (f: any) => {
          const v = f.properties.airQuality;
          if (v < 0.5) return [Math.floor(255 * (v * 2)), 255, 0, activeLayers.airQuality.opacity * 255];
          return [255, Math.floor(255 * (1 - (v - 0.5) * 2)), 0, activeLayers.airQuality.opacity * 255];
        },
        updateTriggers: { getFillColor: [activeLayers.airQuality.opacity] }
      }));
    }

    // 5. Elevation Overlay
    if (activeLayers.elevation.visible) {
      layers.push(new GeoJsonLayer({
        id: 'overlay-elevation',
        data: gridGeoJSON,
        filled: true,
        stroked: false,
        getFillColor: (f: any) => {
          const v = (f.properties.elevation - 100) / 50;
          if (v < 0.5) return [Math.floor(139 * (v * 2)), 128 + Math.floor(69 * (v * 2)), Math.floor(19 * (v * 2)), activeLayers.elevation.opacity * 255];
          return [139 + Math.floor(116 * (v - 0.5) * 2), 197 + Math.floor(58 * (v - 0.5) * 2), 19 + Math.floor(236 * (v - 0.5) * 2), activeLayers.elevation.opacity * 255];
        },
        updateTriggers: { getFillColor: [activeLayers.elevation.opacity] }
      }));
    }

    overlay.setProps({ layers });
  }, [gridGeoJSON, suitabilityThreshold, setSelectedCell, is3D, activeLayers, overlay, hoveredCell, setHoveredCell, selectedCell]);

  return null;
};

const DrawingManager: React.FC = () => {
  const map = useMap();
  const drawingLibrary = useMapsLibrary('drawing');
  const { isDrawingMode, setPlottedArea, setIsDrawingMode } = useIRASettings();
  const [manager, setManager] = useState<google.maps.drawing.DrawingManager | null>(null);

  useEffect(() => {
    if (!map || !drawingLibrary) return;

    const dm = new drawingLibrary.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#F97316',
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeColor: '#F97316',
        clickable: false,
        editable: false,
        zIndex: 1
      }
    });

    dm.setMap(map);
    setManager(dm);

    const listener = google.maps.event.addListener(dm, 'polygoncomplete', (polygon: google.maps.Polygon) => {
      const path = polygon.getPath();
      const coords = [];
      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        coords.push([point.lng(), point.lat()]);
      }
      coords.push(coords[0]); // Close polygon

      const geojsonPolygon = {
        type: 'Polygon' as const,
        coordinates: [coords]
      };

      setPlottedArea(geojsonPolygon);
      
      // Remove the drawn polygon from map, we'll handle it via state/deck.gl if needed
      polygon.setMap(null);
      setIsDrawingMode(false);
    });

    return () => {
      google.maps.event.removeListener(listener);
      dm.setMap(null);
    };
  }, [map, drawingLibrary, setPlottedArea, setIsDrawingMode]);

  useEffect(() => {
    if (manager) {
      manager.setDrawingMode(isDrawingMode ? google.maps.drawing.OverlayType.POLYGON : null);
    }
  }, [isDrawingMode, manager]);

  return null;
};

const MapControls: React.FC<{ is3D: boolean, set3D: (val: boolean) => void }> = ({ is3D, set3D }) => {
  const map = useMap();
  const { userLocation, isTracking, setIsTracking } = useIRASettings();
  
  return (
    <div className="map-controls">
      <button 
        onClick={() => {
          if (userLocation && map) {
            map.panTo(userLocation);
            map.setZoom(17);
            setIsTracking(!isTracking);
          }
        }} 
        className={cn("map-btn", isTracking && "bg-emerald-500/20 border-emerald-500/40")}
        title={isTracking ? "Stop Tracking" : "Track My Location"}
      >
        <Navigation className={cn("w-4 h-4", isTracking ? "text-emerald-500" : "text-orange-500")} />
      </button>
      <div className="h-px w-4 bg-white/10 mx-auto my-1" />
      <button onClick={() => map?.setZoom((map.getZoom() || 15) + 1)} className="map-btn">
        <Plus className="w-4 h-4 text-white/60" />
      </button>
      <button onClick={() => map?.setZoom((map.getZoom() || 15) - 1)} className="map-btn">
        <Minus className="w-4 h-4 text-white/60" />
      </button>
      <button onClick={() => map?.setHeading(0)} className="map-btn">
        <Compass className="w-4 h-4 text-white/60" />
      </button>
      <button onClick={() => set3D(!is3D)} className={cn("map-btn", is3D && "bg-orange-500/20 border-orange-500/40")}>
        <Box className={cn("w-4 h-4", is3D ? "text-orange-500" : "text-white/60")} />
      </button>
    </div>
  );
};

const MapContainer: React.FC = () => {
  const { 
    setGridData,
    selectedCell,
    setSelectedCell, 
    suitabilityThreshold, 
    timelineYear,
    mapType, 
    is3D,
    set3D,
    activeLayers,
    plottedArea,
    isDrawingMode,
    setIsDrawingMode,
    isTracking,
    setIsTracking,
    userLocation,
    currentLocationName,
    setCurrentLocationName,
    setSystemStatus
  } = useIRASettings();
  
  const [gridGeoJSON, setGridGeoJSON] = useState<any>({ type: "FeatureCollection", features: [] });
  const [hoveredCell, setHoveredCell] = useState<any>(null);
  const geometryLibrary = useMapsLibrary('geometry');
  const geocodingLibrary = useMapsLibrary('geocoding');

  const handleBoundsChange = useCallback((e: any) => {
    const map = e.map;
    if (!map || !geometryLibrary) return;
    const bounds = map.getBounds();
    if (!bounds) return;

    setSystemStatus('PROCESSING');

    // Update location name based on map center if not tracking GPS
    if (!isTracking && geocodingLibrary) {
      const geocoder = new geocodingLibrary.Geocoder();
      geocoder.geocode({ location: map.getCenter() }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const city = results[0].address_components.find((c: any) => c.types.includes('locality'))?.long_name;
          const state = results[0].address_components.find((c: any) => c.types.includes('administrative_area_level_1'))?.short_name;
          if (city && state) {
            setCurrentLocationName(`${city}, ${state}`);
          } else {
            setCurrentLocationName(results[0].formatted_address.split(',')[0]);
          }
        } else if (status === 'REQUEST_DENIED') {
          // Only log once to avoid console spam
          if (currentLocationName !== 'Location Service Disabled') {
            console.error("Geocoding API not enabled in Google Cloud Console.");
            setCurrentLocationName('Location Service Disabled');
          }
        }
      });
    }

    setTimeout(() => {
      let features = generateGrid(bounds);

      // Filter features if plottedArea exists
      if (plottedArea) {
        const polygon = new google.maps.Polygon({ paths: plottedArea.coordinates[0].map((c: any) => ({ lng: c[0], lat: c[1] })) });
        features = features.filter(f => {
          const center = new google.maps.LatLng(f.properties.coordinates[0], f.properties.coordinates[1]);
          return google.maps.geometry.poly.containsLocation(center, polygon);
        });
      } else {
        // If no plotted area, don't show grid (as per user request: "dont show it all over")
        features = [];
      }

      setGridGeoJSON({ type: "FeatureCollection", features });
      setGridData(features.map(f => ({
        id: f.properties.id,
        coordinates: f.properties.coordinates,
        ...f.properties
      })));
      
      setSystemStatus('LIVE');
    }, 500); // Simulate processing time
  }, [geometryLibrary, geocodingLibrary, isTracking, plottedArea, setGridData, setCurrentLocationName, setSystemStatus]);

  // Re-run grid generation when plottedArea changes
  const map = useMap();
  useEffect(() => {
    if (map) {
      handleBoundsChange({ map });
    }
  }, [plottedArea, map, handleBoundsChange]);

  // Center map on user location when first available or when tracking is on
  const [hasCentered, setHasCentered] = useState(false);

  useEffect(() => {
    if (userLocation && map) {
      if (!hasCentered || isTracking) {
        map.panTo(userLocation);
        if (!hasCentered) {
          map.setZoom(16);
          setHasCentered(true);
        }
      }
    }
  }, [userLocation, map, hasCentered, isTracking]);

  return (
    <div className="flex-1 relative bg-bg-void">
      <Map
        defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
        defaultZoom={15}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || null}
        disableDefaultUI={true}
        mapTypeId={mapType}
        tilt={is3D ? 45 : 0}
        renderingType="VECTOR"
        onBoundsChanged={handleBoundsChange}
        styles={mapStyles}
        className="w-full h-full"
      >
        <MapOverlay 
          gridGeoJSON={gridGeoJSON}
          is3D={is3D}
          suitabilityThreshold={suitabilityThreshold}
          activeLayers={activeLayers}
          hoveredCell={hoveredCell}
          selectedCell={selectedCell}
          setHoveredCell={setHoveredCell}
          setSelectedCell={setSelectedCell}
        />
        <DrawingManager />
        <MapControls is3D={is3D} set3D={set3D} />
        
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 bg-orange-500/20 rounded-full animate-ping" />
              <div className="absolute w-8 h-8 bg-orange-500/30 rounded-full animate-pulse" />
              <div className="relative z-10">
                <Pin background={'#F97316'} glyphColor={'#FFF'} borderColor={'#FFF'} scale={1} />
              </div>
            </div>
          </AdvancedMarker>
        )}
      </Map>

      {/* Drawing Instructions */}
      {isDrawingMode && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[101] flex items-center gap-3 px-6 py-3 bg-orange-500 text-white rounded-full shadow-2xl transition-all duration-500 ease-out">
          <MousePointer2 className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">Draw a polygon on the map to analyze the area</span>
        </div>
      )}

      {!plottedArea && !isDrawingMode && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[101] flex flex-col items-center gap-4 px-8 py-6 glass-card border-orange-500/30 text-center max-w-md">
          <Layers className="w-12 h-12 text-orange-500/50 mb-2" />
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">No Analysis Area Defined</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            To begin urban planning analysis, please use the <strong>Plot Area</strong> tool in the top navigation bar to define your project boundaries.
          </p>
          <button 
            onClick={() => setIsDrawingMode(true)}
            className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            Start Plotting
          </button>
        </div>
      )}

      {/* Projection Mode Badge */}
      {timelineYear > 0 && (
        <div className="projection-badge">
          Projection Mode: +{timelineYear} Years
        </div>
      )}

      {/* Tooltip */}
      {hoveredCell && (
        <div 
          className="fixed pointer-events-none z-[200] glass-card px-3 py-2 flex flex-col gap-1 min-w-[120px]"
          style={{ 
            left: '50%', 
            top: '50%', 
            transform: 'translate(-50%, -120%)' 
          }}
        >
          <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Grid ID: {hoveredCell.id.slice(0, 8)}</span>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80 font-medium">Suitability</span>
            <span className="text-xs font-bold text-orange-500">{Math.round((hoveredCell.treeScore + hoveredCell.constructionScore + hoveredCell.solarScore) / 3 * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#080D18" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#475569" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#040810" }]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{ "color": "#111B2E" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#040810" }]
  }
];

export default MapContainer;

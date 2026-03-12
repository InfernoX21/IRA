import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scoreToColor = (score: number): [number, number, number, number] => {
  // Red (0) -> Yellow (0.5) -> Green (1)
  if (score < 0.5) {
    const r = 255;
    const g = Math.floor(255 * (score * 2));
    return [r, g, 0, 180];
  } else {
    const r = Math.floor(255 * (1 - (score - 0.5) * 2));
    const g = 255;
    return [r, g, 0, 180];
  }
};

const seededRandom = (lat: number, lng: number, seed: number) => {
  const x = Math.sin(lat * 12.9898 + lng * 78.233 + seed) * 43758.5453;
  return x - Math.floor(x);
};

export const generateGrid = (bounds: google.maps.LatLngBounds): any[] => {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  
  const latStep = 0.00045; // ~50m
  const lngStep = 0.00055; // ~50m
  
  const features = [];
  
  for (let lat = sw.lat(); lat < ne.lat(); lat += latStep) {
    for (let lng = sw.lng(); lng < ne.lng(); lng += lngStep) {
      // Use deterministic values based on coordinates to prevent "jiggling" data
      const treeScore = seededRandom(lat, lng, 1);
      const constructionScore = seededRandom(lat, lng, 2);
      const solarScore = seededRandom(lat, lng, 3);
      const floodRisk = seededRandom(lat, lng, 4);
      const heatScore = seededRandom(lat, lng, 7);
      const airQuality = seededRandom(lat, lng, 8);
      const compositeScore = (treeScore + constructionScore + solarScore) / 3;
      
      features.push({
        type: "Feature",
        properties: {
          id: `grid-${lat.toFixed(5)}-${lng.toFixed(5)}`,
          compositeScore,
          treeScore,
          constructionScore,
          solarScore,
          floodRisk,
          heatScore,
          airQuality,
          elevation: 100 + seededRandom(lat, lng, 5) * 50,
          solarIrradiance: 4 + seededRandom(lat, lng, 6) * 4,
          zoningType: "Residential",
          aiRecommendation: "Analyzing...",
          coordinates: [lat, lng]
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [lng, lat],
            [lng + lngStep, lat],
            [lng + lngStep, lat + latStep],
            [lng, lat + latStep],
            [lng, lat]
          ]]
        }
      });
    }
  }
  
  return features;
};

import React, { useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import DetailPanel from './components/DetailPanel';
import MapContainer from './components/MapContainer';
import StatusBar from './components/StatusBar';
import { useIRASettings } from './store';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function App() {
  const { updateWeather } = useIRASettings();

  useEffect(() => {
    // WebSocket connection for live updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'WEATHER_UPDATE') {
        updateWeather({
          temp: message.data.temp,
          humidity: message.data.humidity,
          lastSync: message.data.timestamp
        });
      }
    };

    return () => ws.close();
  }, [updateWeather]);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['drawing', 'places', 'geometry']}>
      <div className="flex flex-col h-screen bg-bg-void text-text-primary overflow-hidden font-sans">
        <TopNav />
        
        <main className="flex-1 flex relative mt-[56px] mb-[48px] overflow-hidden">
          <Sidebar />
          
          <div className="flex-1 relative ml-[300px] flex flex-col">
            <MapContainer />
          </div>
          
          <DetailPanel />
        </main>

        <StatusBar />
      </div>
    </APIProvider>
  );
}

import { useState } from 'react';
import { StationSearch } from './components/StationSearch';
import { DepartureBoard } from './components/DepartureBoard';
import { CameraSelfie } from './components/CameraSelfie'; 

interface Station {
  name: string;
  id: string;
}

type View = 'search' | 'departures' | 'selfie';

function App() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [currentView, setCurrentView] = useState<View>('search');

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setCurrentView('departures'); 
  };

  const handleStartNewSearch = () => {
    setSelectedStation(null);
    setCurrentView('search'); 
  };

  const handleCheckIn = () => {
    setCurrentView('selfie'); 
  };

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center pt-10 sm:pt-20 p-4">
      {/* SÖK-VYN */}
      {currentView === 'search' && (
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 text-center">
              Min Avgångstavla
            </h1>
            <p className="text-gray-600 text-center mt-2">
              Sök en hållplats för att se avgångar i realtid
            </p>
          </div>
          <StationSearch onStationSelect={handleStationSelect} />
        </div>
      )}

      {/* AVGÅNGS-VYN */}
      {currentView === 'departures' && selectedStation && (
        <div className="w-full flex flex-col items-center gap-8">
          <button 
            onClick={handleStartNewSearch}
            className="w-full max-w-md p-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
          >
            Sök ny station
          </button>
          <DepartureBoard 
            stationId={selectedStation.id} 
            stationName={selectedStation.name}
            onCheckIn={handleCheckIn}
          />
        </div>
      )}

      {/* SELFIE-VYN */}
      {currentView === 'selfie' && selectedStation && (
        <CameraSelfie 
          stationName={selectedStation.name}
          onClose={handleStartNewSearch} 
        />
      )}
    </main>
  );
}

export default App;
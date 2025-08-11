import { useState } from 'react';
import { StationSearch } from './components/StationSearch';
import { DepartureBoard } from './components/DepartureBoard';
import { CameraSelfie } from './components/CameraSelfie';
import { Header } from './components/Header';

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
    <main className='bg-gray-100 min-h-screen flex flex-col items-center pt-10 sm:pt-12 p-4'>
      {/* SÖK-VYN */}
      <div
        className={`view ${
          currentView === 'search' ? 'view-visible' : 'view-hidden'
        }`}
      >
        <div className='w-full max-w-md text-center'>
          <h1 className='text-4xl font-bold text-gray-800'>Rese-Selfie</h1>
          <p className='text-gray-600 mt-2'>
            Sök en hållplats, se avgångar och checka in med en selfie!
          </p>
        </div>
        <StationSearch onStationSelect={handleStationSelect} />
      </div>

      {/* AVGÅNGS-VYN */}
      <div
        className={`view ${
          currentView === 'departures' ? 'view-visible' : 'view-hidden'
        }`}
      >
        {selectedStation && (
          <>
            <Header
              stationName={selectedStation.name}
              onNewSearch={handleStartNewSearch}
              onCheckIn={handleCheckIn}
            />
            <DepartureBoard
              stationId={selectedStation.id}
              stationName={selectedStation.name}
              onCheckIn={handleCheckIn}
            />
          </>
        )}
      </div>

      {/* SELFIE-VYN */}
      <div
        className={`view ${
          currentView === 'selfie' ? 'view-visible' : 'view-hidden'
        }`}
      >
        {selectedStation && (
          <CameraSelfie
            stationName={selectedStation.name}
            onClose={handleStartNewSearch}
          />
        )}
      </div>
    </main>
  );
}

export default App;

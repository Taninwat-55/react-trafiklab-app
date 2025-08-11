import { useState } from 'react';
import { StationSearch } from './components/StationSearch';
import { DepartureBoard } from './components/DepartureBoard'; 

interface Station {
  name: string;
  id: string;
}

function App() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
  };

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center pt-10 sm:pt-20 p-4">
      <div className="w-full max-w-md space-y-8">
        {!selectedStation && ( 
            <div>
                <h1 className="text-4xl font-bold text-gray-800 text-center">
                    Min Avgångstavla
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    Sök en hållplats för att se avgångar i realtid
                </p>
            </div>
        )}
        
        {selectedStation ? (
          <button 
            onClick={() => setSelectedStation(null)}
            className="w-full p-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
          >
            Sök ny station
          </button>
        ) : (
          <StationSearch onStationSelect={handleStationSelect} />
        )}
      </div>

      <div className="mt-8 w-full">
        {selectedStation && (
          <DepartureBoard 
            stationId={selectedStation.id} 
            stationName={selectedStation.name}
          />
        )}
      </div>
    </main>
  );
}

export default App;
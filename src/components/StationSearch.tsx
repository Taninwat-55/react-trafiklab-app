import { useState, useEffect } from 'react';

// --- TYPER ---
// Dessa är samma som förut
interface ApiStopLocation {
  id: string;
  name: string;
  lon: number;
  lat: number;
}

interface ApiLocationWrapper {
  StopLocation?: ApiStopLocation;
}

interface Station {
  name: string;
  id: string;
}

// 1. DEFINIERA PROPS: Lägg till denna interface för att beskriva
// vilken data/funktioner komponenten kan ta emot.
interface StationSearchProps {
  onStationSelect: (station: Station) => void;
}


// --- KOMPONENTEN ---

// 2. ACCEPTERA PROPS: Uppdatera komponentens definition
// så att den tar emot "onStationSelect".
export const StationSearch = ({ onStationSelect }: StationSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = import.meta.env.VITE_RESEPLANERARE_API_KEY;

  // useEffect-logiken är exakt densamma...
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const fetchStations = async () => {
      setIsLoading(true);
      const url = `https://api.resrobot.se/v2.1/location.name?input=${query}&format=json&accessId=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API-fel med status: ${response.status}`);
        }
        const data = await response.json();
        const validStations: Station[] = data.stopLocationOrCoordLocation
          .map((loc: ApiLocationWrapper) => loc.StopLocation)
          .filter(Boolean);
        setResults(validStations);
      } catch (error) {
        console.error("Kunde inte hämta stationer:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const searchTimeout = setTimeout(fetchStations, 300);
    return () => clearTimeout(searchTimeout);
  }, [query, apiKey]);


  // JSX-koden
  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sök efter en station..."
        className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />

      {isLoading && <p className="p-3 text-gray-500">Söker...</p>}

      {results.length > 0 && (
        <ul className="list-none p-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.map((station) => (
            // 3. GÖR KLICKBAR: Lägg till onClick här igen.
            // Denna kallar på funktionen som skickades från App.tsx.
            <li
              key={station.id}
              onClick={() => onStationSelect(station)}
              className="p-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition last:border-b-0"
            >
              {station.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
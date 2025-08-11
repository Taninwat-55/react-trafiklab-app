import { useState, useEffect } from 'react';

// --- TYPER ---
interface Departure {
  name: string; 
  type: string; 
  time: string; 
  rtTime?: string; 
  track: string; 
  direction: string; 
}

interface DepartureBoardProps {
  stationId: string;
  stationName: string;
  onCheckIn: () => void;
}

export const DepartureBoard = ({
  stationId,
  stationName,
  // onCheckIn,
}: DepartureBoardProps) => {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_STOLPTIDSTABELLER_API_KEY;

  useEffect(() => {
    if (!stationId) return;

    const fetchDepartures = async () => {
      setIsLoading(true);
      setError(null);
      setDepartures([]);

      const url = `https://api.resrobot.se/v2.1/departureBoard?id=${stationId}&format=json&accessId=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Kunde inte hämta avgångar. Status: ${response.status}`
          );
        }
        const data = await response.json();

        setDepartures(data.Departure || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ett okänt fel inträffade.');
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartures();
  }, [stationId, apiKey]);

  if (isLoading) {
    return (
      <div className='p-4 text-center text-gray-500'>Laddar avgångar...</div>
    );
  }

  if (error) {
    return (
      <div className='p-4 text-center text-red-500 bg-red-100 rounded-lg'>
        {error}
      </div>
    );
  }

  return (
    <div className='w-full max-w-4xl p-4 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>
        Avgångar från {stationName}
      </h2>
      <div className='overflow-x-auto'>
        <table className='w-full text-left'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 text-sm font-semibold text-gray-600'>Tid</th>
              <th className='p-3 text-sm font-semibold text-gray-600'>Till</th>
              <th className='p-3 text-sm font-semibold text-gray-600 hidden sm:table-cell'>
                Linje
              </th>
              <th className='p-3 text-sm font-semibold text-gray-600'>Spår</th>
            </tr>
          </thead>
          <tbody>
            {departures.length > 0 ? (
              departures.map((dep, index) => (
                <tr
                  key={index}
                  className='border-b border-gray-100 last:border-b-0'
                >
                  <td className='p-3 font-mono'>
                    {dep.rtTime && dep.rtTime !== dep.time ? (
                      <>
                        <span className='line-through text-gray-500'>
                          {dep.time.substring(0, 5)}
                        </span>
                        <span className='font-bold text-red-500 ml-2'>
                          {dep.rtTime.substring(0, 5)}
                        </span>
                      </>
                    ) : (
                      <span className='font-bold'>
                        {dep.time.substring(0, 5)}
                      </span>
                    )}
                  </td>
                  <td className='p-3 font-semibold'>{dep.direction}</td>
                  <td className='p-3 text-gray-600 hidden sm:table-cell'>
                    {dep.name}
                  </td>
                  <td className='p-3 font-bold text-center'>{dep.track}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className='p-4 text-center text-gray-500'>
                  Inga kommande avgångar hittades.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <div className='mt-6 text-center'>
        <button
          onClick={onCheckIn}
          className='px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition'
        >
          📸 Checka in på {stationName}
        </button>
      </div> */}
    </div>
  );
};

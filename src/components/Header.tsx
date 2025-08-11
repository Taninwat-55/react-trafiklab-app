interface HeaderProps {
  stationName: string;
  onNewSearch: () => void;
  onCheckIn: () => void;
}

export const Header = ({ stationName, onNewSearch, onCheckIn }: HeaderProps) => {
  return (
    <header className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-500">Visar avgångar för</p>
          <h1 className="text-2xl font-bold text-gray-800">{stationName}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCheckIn}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            📸 Checka in
          </button>
          <button
            onClick={onNewSearch}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Ny sökning
          </button>
        </div>
      </div>
    </header>
  );
};
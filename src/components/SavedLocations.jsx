import { useWeather } from "../context/WeatherContext";
import { FixedSizeList } from 'react-window';
import { FiTrash2, FiMapPin, FiThermometer } from 'react-icons/fi';

export default function SavedLocations() {
  const { savedLocations, deleteLocation } = useWeather();

  const Row = ({ index, style }) => {
    const location = savedLocations[index];
    
    return (
      <div
        style={style}
        className="group relative px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
        data-testid="location-item"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiMapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 data-testid="saved-location-name" className="font-semibold text-gray-800">
                {location.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FiThermometer className="w-4 h-4" />
                <span>{location.current?.temperature_2m}°C</span>
                <span className="mx-2">•</span>
                <span className="text-xs">
                  Updated {new Date(location.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <button
            data-testid={`delete-btn-${location.id}`}
            onClick={() => deleteLocation(location.id)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <FiMapPin className="w-6 h-6 text-blue-600" />
          <span>Saved Locations</span>
        </h2>
      </div>
      
      {savedLocations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p className="mb-2">No saved locations yet</p>
          <p className="text-sm">Search for a city to add it here</p>
        </div>
      ) : (
        <FixedSizeList
          height={Math.min(savedLocations.length * 80, 400)}
          width="100%"
          itemSize={80}
          itemCount={savedLocations.length}
          className="scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100"
        >
          {Row}
        </FixedSizeList>
      )}
    </div>
  );
}
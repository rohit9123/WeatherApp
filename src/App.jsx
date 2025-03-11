// App.js
import { useState } from "react";
import { useWeather } from "./context/WeatherContext";
import { searchLocations, fetchWeatherData } from "./services/WeatherApi";
import Search from "./components/Search";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import SavedLocations from "./components/SavedLocations";

export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [weatherError, setWeatherError] = useState(null);
  const { savedLocations, addLocation } = useWeather();

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setWeatherError(null);
    try {
      const results = await searchLocations(query);
      setSearchResults(results);
    } catch (error) {
      setWeatherError("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeather = async (location) => {
    setIsLoading(true);
    setSearchResults([]);
    setSaveError("");
    setWeatherError(null);
    try {
      const data = await fetchWeatherData(location);
      if (data) {
        setWeatherData(data);
        setSelectedLocation(location);
      }
    } catch (error) {
      setWeatherError("Failed to load weather data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLocation = () => {
    if (!selectedLocation || !weatherData) return;

    if (savedLocations.some(l => l.id === selectedLocation.id)) {
      setSaveError("This location is already saved");
      return;
    }

    addLocation({
      ...selectedLocation,
      current: weatherData.current,
      daily: weatherData.daily,
      updatedAt: weatherData.updatedAt
    });
    setSaveError("");
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="app-container">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Weather Finder</h1>
          <Search
            results={searchResults}
            isLoading={isLoading}
            onSearch={handleSearch}
            onSelect={fetchWeather}
          />
        </div>

        {weatherError && (
          <div data-testid="weather-error" className="text-red-500 p-4">
            {weatherError}
          </div>
        )}

        {weatherData && selectedLocation && (
          <div className="space-y-6" data-testid="current-weather-section">
            <CurrentWeather
              data={weatherData.current}
              location={selectedLocation}
              updatedAt={weatherData.updatedAt}
              onSave={handleSaveLocation}
              isSaved={savedLocations.some(l => l.id === selectedLocation.id)}
            />
            {saveError && (
              <div className="text-red-500 text-sm" data-testid="save-error">
                {saveError}
              </div>
            )}
            <Forecast daily={weatherData.daily} />
          </div>
        )}

        <SavedLocations data-testid="saved-locations" />
      </div>
    </div>
  );
}
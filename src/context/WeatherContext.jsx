import { createContext, useContext, useEffect, useState } from 'react';

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('locations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('locations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const addLocation = (location) => {
    setSavedLocations(prev => {
      const exists = prev.some(l => l.id === location.id);
      return exists ? prev : [...prev, location];
    });
  };

  const deleteLocation = (id) => {
    setSavedLocations(prev => prev.filter(l => l.id !== id));
  };

  return (
    <WeatherContext.Provider value={{ 
      savedLocations,
      addLocation,
      deleteLocation
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
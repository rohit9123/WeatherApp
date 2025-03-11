// App.test.jsx
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { useWeather } from './context/WeatherContext';
import { searchLocations, fetchWeatherData } from './services/weatherApi';

jest.mock('./context/WeatherContext');
jest.mock('./services/weatherApi');

const mockLocations = [
  { id: 1, name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { id: 2, name: 'Paris', latitude: 48.8566, longitude: 2.3522 }
];

const mockWeatherData = {
  current: {
    temperature_2m: 18,
    apparent_temperature: 17,
    precipitation: 0,
    humidity: 65,
    wind_speed: 10
  },
  daily: {
    time: ['2024-02-20', '2024-02-21'],
    temperature_2m_max: [19, 20],
    temperature_2m_min: [12, 13],
    precipitation_probability_max: [0, 5]
  },
  updatedAt: '2024-02-20T12:00:00Z'
};

describe('App Component', () => {
  const mockAddLocation = jest.fn();

  beforeEach(() => {
    useWeather.mockReturnValue({
      savedLocations: [],
      addLocation: mockAddLocation,
      deleteLocation: jest.fn()
    });

    searchLocations.mockResolvedValue(mockLocations);
    fetchWeatherData.mockResolvedValue(mockWeatherData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial state correctly', () => {
    render(<App />);
    
    expect(screen.getByText('Weather Finder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search city...')).toBeInTheDocument();
    expect(screen.queryByTestId('current-weather-section')).not.toBeInTheDocument();
  });

  test('performs location search and displays results', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Search city...');
    await user.type(input, 'lon');
    
    await waitFor(() => {
      expect(searchLocations).toHaveBeenCalledWith('lon');
      expect(screen.getAllByTestId(/search-result-/)).toHaveLength(2);
    });
  });

  test('fetches and displays weather data when location is selected', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Perform search and select location
    const input = screen.getByPlaceholderText('Search city...');
    await user.type(input, 'lon');
    const resultItem = await screen.findByTestId('search-result-1');
    await user.click(resultItem);

    // Verify weather data display
    await waitFor(() => {
      expect(fetchWeatherData).toHaveBeenCalledWith(mockLocations[0]);
      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('18°C')).toBeInTheDocument();
      expect(screen.getByText('17°C')).toBeInTheDocument();
    });
  });

  test('saves location successfully', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Fetch weather data first
    const input = screen.getByPlaceholderText('Search city...');
    await user.type(input, 'lon');
    const resultItem = await screen.findByTestId('search-result-1');
    await user.click(resultItem);

    // Save location
    const saveButton = await screen.findByText('Save Location');
    await user.click(saveButton);

    expect(mockAddLocation).toHaveBeenCalledWith({
      ...mockLocations[0],
      current: mockWeatherData.current,
      daily: mockWeatherData.daily,
      updatedAt: mockWeatherData.updatedAt
    });
  });

  test('handles weather fetch errors gracefully', async () => {
    fetchWeatherData.mockRejectedValue(new Error('API Error'));
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/search city/i);
    await user.type(input, 'lon');
    const resultItem = await screen.findByTestId('search-result-1');
    await user.click(resultItem);

    await waitFor(() => {
      expect(screen.getByTestId('weather-error')).toBeInTheDocument();
      expect(screen.queryByTestId('current-weather-section')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('displays forecast data correctly', async () => {
    const user = userEvent.setup();
    render(<App />);
  
    const input = screen.getByPlaceholderText(/search city/i);
    await user.type(input, 'lon');
    const resultItem = await screen.findByTestId('search-result-1');
    await user.click(resultItem);
  
    await waitFor(() => {
      // Verify forecast container exists
      expect(screen.getByTestId('forecast-container')).toBeInTheDocument();
      
      // Verify forecast items
      const forecastDays = screen.getAllByTestId('forecast-day');
      expect(forecastDays).toHaveLength(2);
  
      // Verify temperatures (now using test IDs and correct formatting)
      const maxTemps = screen.getAllByTestId('temperature-max');
      const minTemps = screen.getAllByTestId('temperature-min');
      
      expect(maxTemps[0]).toHaveTextContent('19°'); // Changed from '19°C'
      expect(minTemps[0]).toHaveTextContent('12°'); // Changed from '12°C'
      expect(maxTemps[1]).toHaveTextContent('20°');
      expect(minTemps[1]).toHaveTextContent('13°');
  
      
    }, { timeout: 3000 });
  });

  
});
// tests/services/WeatherApi.test.js
import axios from 'axios';
import {
  searchLocations,
  fetchWeatherData
} from '../../src/services/WeatherApi';

jest.mock('axios');

describe('Weather API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchLocations', () => {
    const mockGeoResponse = {
      results: Array(10).fill({
        id: 1,
        name: 'London',
        country: 'GB',
        latitude: 51.5074,
        longitude: -0.1278
      })
    };

    test('should trim query and return up to 5 locations', async () => {
      axios.get.mockResolvedValue({ data: mockGeoResponse });
      const results = await searchLocations('  london  ');
      
      expect(axios.get).toHaveBeenCalledWith(
        'https://geocoding-api.open-meteo.com/v1/search',
        expect.objectContaining({
          params: {
            name: 'london',
            count: 10,
            language: 'en',
            format: 'json'
          }
        })
      );
      expect(results).toHaveLength(5);
    });

    test('should return empty array for empty response', async () => {
      axios.get.mockResolvedValue({ data: {} });
      const results = await searchLocations('unknown');
      expect(results).toEqual([]);
    });

    test('should handle API errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));
      const results = await searchLocations('paris');
      expect(results).toEqual([]);
    });
  });

  describe('fetchWeatherData', () => {
    const mockLocation = {
      latitude: 51.5074,
      longitude: -0.1278,
      id: 1,
      name: 'London'
    };

    const mockWeatherResponse = {
      current: {
        temperature_2m: 18.5,
        apparent_temperature: 20.0,
        precipitation: 0.2,
        relative_humidity_2m: 75,
        wind_speed_10m: 15.3
      },
      daily: {
        time: ['2024-05-20', '2024-05-21'],
        temperature_2m_max: [22.1, 23.4],
        temperature_2m_min: [12.3, 13.5],
        precipitation_probability_max: [10, 20]
      }
    };

    test('should fetch weather data with correct parameters', async () => {
      axios.get.mockResolvedValue({ data: mockWeatherResponse });
      await fetchWeatherData(mockLocation);

      expect(axios.get).toHaveBeenCalledWith(
        'https://api.open-meteo.com/v1/forecast',
        {
          params: {
            latitude: 51.5074,
            longitude: -0.1278,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m',
            daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
            timezone: 'auto',
            forecast_days: 5
          }
        }
      );
    });

    test('should transform API response correctly', async () => {
      axios.get.mockResolvedValue({ data: mockWeatherResponse });
      const result = await fetchWeatherData(mockLocation);

      expect(result).toMatchObject({
        current: {
          temperature_2m: 18.5,
          apparent_temperature: 20.0,
          precipitation: 0.2,
          humidity: 75,
          wind_speed: 15.3
        },
        daily: {
          time: ['2024-05-20', '2024-05-21'],
          temperature_2m_max: [22.1, 23.4],
          temperature_2m_min: [12.3, 13.5],
          precipitation_probability_max: [10, 20]
        },
        updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      });
    });

    test('should handle missing data in response', async () => {
      const incompleteResponse = { 
        current: { ...mockWeatherResponse.current },
        daily: { time: [], temperature_2m_max: [], temperature_2m_min: [] }
      };
      axios.get.mockResolvedValue({ data: incompleteResponse });
      
      const result = await fetchWeatherData(mockLocation);
      expect(result.daily.precipitation_probability_max).toBeUndefined();
      expect(result.updatedAt).toBeDefined();
    });

    test('should return null on API failure', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));
      const result = await fetchWeatherData(mockLocation);
      expect(result).toBeNull();
    });
  });
});
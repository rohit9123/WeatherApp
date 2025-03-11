// WeatherApi.js
import axios from "axios";

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API = "https://api.open-meteo.com/v1/forecast";

export const searchLocations = async (query) => {
  try {
    const { data } = await axios.get(GEOCODING_API, {
      params: {
        name: query.trim(),
        count: 10,
        language: "en",
        format: "json"
      }
    });
    return data.results?.slice(0, 5) || [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

export const fetchWeatherData = async (location) => {
  try {
    const { data } = await axios.get(FORECAST_API, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m",
        daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        timezone: "auto",
        forecast_days: 5,
      }
    });

    return {
      current: {
        temperature_2m: data.current.temperature_2m,
        apparent_temperature: data.current.apparent_temperature,
        precipitation: data.current.precipitation,
        humidity: data.current.relative_humidity_2m,
        wind_speed: data.current.wind_speed_10m,
      },
      daily: {
        time: data.daily.time,
        temperature_2m_max: data.daily.temperature_2m_max,
        temperature_2m_min: data.daily.temperature_2m_min,
        precipitation_probability_max: data.daily.precipitation_probability_max,
      },
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
};
import { render, screen } from '@testing-library/react';
import CurrentWeather from './CurrentWeather';

describe('CurrentWeather Component', () => {
  const mockData = {
    temperature_2m: 18,
    apparent_temperature: 17,
    humidity: 65,
    wind_speed: 12,
    precipitation: 0
  };

  const mockLocation = {
    name: 'London'
  };

  test('displays complete weather data correctly', () => {
    render(
      <CurrentWeather 
        data={mockData}
        location={mockLocation}
        updatedAt="2024-02-20T12:00:00Z"
      />
    );

    expect(screen.getByTestId('location-name')).toHaveTextContent('London');
    expect(screen.getByTestId('update-time')).toHaveTextContent('Updated:');
    
    expect(screen.getByTestId('temperature')).toHaveTextContent('18°C');
    expect(screen.getByTestId('feels-like')).toHaveTextContent('17°C');
    expect(screen.getByTestId('humidity')).toHaveTextContent('65%');
    expect(screen.getByTestId('wind')).toHaveTextContent('12 km/h');
    expect(screen.getByTestId('precipitation')).toHaveTextContent('0 mm');
  });

  test('handles missing data gracefully', () => {
    render(
      <CurrentWeather 
        data={{}} 
        location={{}} 
        updatedAt={null}
      />
    );

    // Test location name
    expect(screen.getByTestId('location-name')).toHaveTextContent('N/A');
    
    // Test update time is not shown
    expect(screen.queryByTestId('update-time')).not.toBeInTheDocument();
    
    // Test all weather parameters show N/A
    expect(screen.getByTestId('temperature')).toHaveTextContent('N/A');
    expect(screen.getByTestId('feels-like')).toHaveTextContent('N/A');
    expect(screen.getByTestId('humidity')).toHaveTextContent('N/A');
    expect(screen.getByTestId('wind')).toHaveTextContent('N/A');
    expect(screen.getByTestId('precipitation')).toHaveTextContent('N/A');
  });

  test('handles partial data', () => {
    render(
      <CurrentWeather 
        data={{ temperature_2m: 20, wind_speed: 15 }}
        location={{ name: 'Paris' }}
      />
    );

    expect(screen.getByTestId('location-name')).toHaveTextContent('Paris');
    expect(screen.queryByTestId('update-time')).not.toBeInTheDocument();
    
    expect(screen.getByTestId('temperature')).toHaveTextContent('20°C');
    expect(screen.getByTestId('wind')).toHaveTextContent('15 km/h');
    expect(screen.getByTestId('feels-like')).toHaveTextContent('N/A');
  });
});
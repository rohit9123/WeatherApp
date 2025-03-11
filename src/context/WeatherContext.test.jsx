// WeatherContext.test.jsx
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeatherProvider, useWeather } from './WeatherContext';

// Test component that uses the weather context
function TestComponent() {
  const { savedLocations, addLocation, deleteLocation } = useWeather();
  return (
    <div>
      <div data-testid="locations">
        {savedLocations.map(loc => (
          <div key={loc.id} data-testid="location">
            {loc.name}
            <button 
              data-testid={`delete-${loc.id}`}
              onClick={() => deleteLocation(loc.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        data-testid="add-button"
        onClick={() => addLocation({ id: 1, name: 'London' })}
      >
        Add Location
      </button>
    </div>
  );
}

describe('WeatherContext', () => {
  beforeEach(() => {
    // Mock localStorage methods
    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'setItem');
    Storage.prototype.getItem = jest.fn(() => '[]');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('initializes with empty locations', () => {
    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    expect(screen.queryByTestId('location')).not.toBeInTheDocument();
    expect(localStorage.getItem).toHaveBeenCalledWith('locations');
  });

  test('loads initial locations from localStorage', () => {
    const mockLocations = [{ id: 1, name: 'London' }];
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(mockLocations));

    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(localStorage.getItem).toHaveBeenCalledWith('locations');
  });

  test('adds new location and persists to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    await user.click(screen.getByTestId('add-button'));

    // Check UI update
    expect(screen.getByText('London')).toBeInTheDocument();
    
    // Check localStorage update
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'locations',
      JSON.stringify([{ id: 1, name: 'London' }])
    );
  });

  test('prevents adding duplicate locations', async () => {
    const user = userEvent.setup();
    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    // Add first location
    await user.click(screen.getByTestId('add-button'));
    // Try adding duplicate
    await user.click(screen.getByTestId('add-button'));

    const locations = screen.getAllByTestId('location');
    expect(locations).toHaveLength(1);
  });

  test('deletes location and persists to localStorage', async () => {
    const user = userEvent.setup();
    Storage.prototype.getItem = jest.fn(() => 
      JSON.stringify([{ id: 1, name: 'London' }])
    );

    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    await user.click(screen.getByTestId('delete-1'));

    // Check UI update
    expect(screen.queryByText('London')).not.toBeInTheDocument();
    
    // Check localStorage update
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'locations',
      JSON.stringify([])
    );
  });

  test('persists changes across re-renders', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    await user.click(screen.getByTestId('add-button'));
    
    // Force re-render
    rerender(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    expect(screen.getByText('London')).toBeInTheDocument();
  });
});
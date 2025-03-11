// SavedLocations.test.jsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SavedLocations from './SavedLocations';
import { useWeather } from '../context/WeatherContext';

jest.mock('../context/WeatherContext', () => ({
  useWeather: jest.fn(),
}));

describe('SavedLocations Component', () => {
  const mockLocations = [
    {
      id: 1,
      name: 'London',
      current: { temperature_2m: 18 },
      updatedAt: '2024-02-20T12:00:00Z'
    },
    {
      id: 2,
      name: 'Paris',
      current: { temperature_2m: 22 },
      updatedAt: '2024-02-20T12:30:00Z'
    }
  ];

  const mockDelete = jest.fn();

  beforeEach(() => {
    useWeather.mockReturnValue({
      savedLocations: mockLocations,
      deleteLocation: mockDelete,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty state when no locations', () => {
    useWeather.mockReturnValue({ savedLocations: [], deleteLocation: mockDelete });
    render(<SavedLocations />);
    
    expect(screen.getByText('No saved locations yet')).toBeInTheDocument();
    expect(screen.getByText('Search for a city to add it here')).toBeInTheDocument();
    expect(screen.queryByTestId('location-item')).not.toBeInTheDocument();
  });

  test('displays list of saved locations', () => {
    render(<SavedLocations />);
    
    const locationItems = screen.getAllByTestId('location-item');
    expect(locationItems).toHaveLength(2);
  });

  test('displays correct location information', () => {
    render(<SavedLocations />);
    
    const locationItems = screen.getAllByTestId('location-item');
    mockLocations.forEach((location, index) => {
      const item = locationItems[index];
      expect(within(item).getByTestId('saved-location-name')).toHaveTextContent(location.name);
      expect(within(item).getByText(`${location.current.temperature_2m}°C`)).toBeInTheDocument();
    });
  });

  test('calls deleteLocation with correct id when delete button clicked', async () => {
    const user = userEvent.setup();
    render(<SavedLocations />);
    
    const deleteButtons = screen.getAllByTestId(/delete-btn-/);
    await user.click(deleteButtons[0]);
    
    expect(mockDelete).toHaveBeenCalledWith(1);
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  test('displays correct temperature and timestamp', () => {
    render(<SavedLocations />);
    
    const locationItems = screen.getAllByTestId('location-item');
    mockLocations.forEach((location, index) => {
      const item = locationItems[index];
      expect(within(item).getByText(`${location.current.temperature_2m}°C`)).toBeInTheDocument();
      expect(within(item).getByText(/Updated/)).toBeInTheDocument();
    });
  });
});
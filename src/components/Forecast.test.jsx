import { render, screen } from '@testing-library/react';
import PropTypes from 'prop-types';
import Forecast from '../components/Forecast';

describe('Forecast Component', () => {
  const mockDailyData = {
    time: ['2024-05-20', '2024-05-21', '2024-05-22'],
    temperature_2m_max: [22.1, 23.4, 24.5],
    temperature_2m_min: [12.3, 13.5, 14.6],
    precipitation_probability_max: [10, 20, 30]
  };

  test('renders empty state when no daily data', () => {
    render(<Forecast daily={{}} />);
    expect(screen.getByTestId('forecast-empty')).toBeInTheDocument();
  });

  test('displays correct number of forecast days', () => {
    render(<Forecast daily={mockDailyData} />);
    expect(screen.getAllByTestId('forecast-day')).toHaveLength(3);
  });

  test('displays precipitation probability correctly', () => {
    render(<Forecast daily={mockDailyData} />);
    const icons = screen.getAllByRole('img', { name: 'Precipitation probability' });
    expect(icons).toHaveLength(3);
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  

  test('handles missing values with fallback', () => {
    const incompleteData = {
      time: ['2024-05-23'],
      temperature_2m_max: [null],
      temperature_2m_min: [undefined],
      precipitation_probability_max: [null]
    };
    
    render(<Forecast daily={incompleteData} />);
    
    // Check specific elements using test IDs
    expect(screen.getByTestId('temperature-max')).toHaveTextContent('--°');
    expect(screen.getByTestId('temperature-min')).toHaveTextContent('--°');
    expect(screen.getByTestId('precipitation')).toHaveTextContent('--%');
  });
});
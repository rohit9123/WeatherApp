import PropTypes from 'prop-types';

export default function Forecast({ daily }) {
  if (!daily?.time?.length) {
    return (
      <div data-testid="forecast-empty" className="text-gray-500">
        No forecast data available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
      <div 
        data-testid="forecast-container"
        className="flex overflow-x-auto pb-4 space-x-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {daily.time.map((date, index) => (
          <div 
            key={date}
            data-testid="forecast-day"
            className="flex-shrink-0 bg-gray-50 rounded-lg p-4 text-center min-w-[120px]"
          >
            <div className="font-medium text-sm mb-2">
              {new Date(date).toLocaleDateString('en', { weekday: 'short' })}
            </div>
            
            <div 
              data-testid="temperature-max"
              className="text-xl font-bold text-blue-600"
            >
              {daily.temperature_2m_max?.[index] ?? '--'}°
            </div>
            
            <div 
              data-testid="temperature-min"
              className="text-lg text-gray-600 mb-2"
            >
              {daily.temperature_2m_min?.[index] ?? '--'}°
            </div>
            
            <div 
              data-testid="precipitation"
              className="flex items-center justify-center space-x-1"
            >
              <svg 
                role="img"
                aria-label="Precipitation probability"
                className="w-4 h-4 text-blue-500" 
                fill="currentColor" 
                viewBox="0 0 16 16"
              >
                <path d="M8 16a6 6 0 0 0 6-6c0-3-6-10-6-10S2 7 2 10a6 6 0 0 0 6 6zm-.002-3.999C5.055 12.001 4 10.945 4 9.5a3.5 3.5 0 0 1 7 0c0 1.445-1.055 2.501-2.002 2.501z"/>
              </svg>
              <span>{daily.precipitation_probability_max?.[index] ?? '--'}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Forecast.propTypes = {
  daily: PropTypes.shape({
    time: PropTypes.arrayOf(PropTypes.string),
    temperature_2m_max: PropTypes.arrayOf(PropTypes.number),
    temperature_2m_min: PropTypes.arrayOf(PropTypes.number),
    precipitation_probability_max: PropTypes.arrayOf(PropTypes.number)
  })
};
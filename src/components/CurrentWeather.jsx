// CurrentWeather.js
import PropTypes from 'prop-types';

export default function CurrentWeather({ 
  data = {}, 
  location = {}, 
  updatedAt,
  onSave,
  isSaved,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6" data-testid="current-weather">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">
          <span data-testid="location-name">{location?.name || 'N/A'}</span>
          <span> Current Weather</span>
        </h2>
        <div className="flex items-center gap-4">
          {updatedAt && (
            <span 
              data-testid="update-time" 
              className="text-sm text-gray-500"
            >
              Updated: {new Date(updatedAt).toLocaleTimeString()}
            </span>
          )}
          <div className="relative group">
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`px-4 py-2 rounded-lg transition-colors relative
                ${isSaved 
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              data-testid="save-button"
            >
              {isSaved ? 'Saved ✓' : 'Save Location'}
            </button>
            
            {isSaved && (
              <div 
                className="absolute top-full left-0 mt-2 w-full bg-gray-700 text-white text-xs px-2 py-1 rounded-md
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                          whitespace-nowrap z-10"
                data-testid="already-saved-message"
              >
                already saved
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Temperature', value: data?.temperature_2m, unit: '°C', testId: 'temperature' },
          { label: 'Feels like', value: data?.apparent_temperature, unit: '°C', testId: 'feels-like' },
          { label: 'Humidity', value: data?.humidity, unit: '%', testId: 'humidity' },
          { label: 'Wind', value: data?.wind_speed, unit: ' km/h', testId: 'wind' },
          { label: 'Precipitation', value: data?.precipitation, unit: ' mm', testId: 'precipitation' },
        ].map(({ label, value, unit, testId }) => (
          <div key={label} className="space-y-1">
            <div className="text-gray-600">{label}</div>
            <div data-testid={testId} className="text-2xl">
              {value != null ? `${value}${unit}` : 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

CurrentWeather.propTypes = {
  data: PropTypes.shape({
    temperature_2m: PropTypes.number,
    apparent_temperature: PropTypes.number,
    humidity: PropTypes.number,
    wind_speed: PropTypes.number,
    precipitation: PropTypes.number,
  }),
  location: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  }),
  updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onSave: PropTypes.func.isRequired,
  isSaved: PropTypes.bool,
};

CurrentWeather.defaultProps = {
  isSaved: false
};
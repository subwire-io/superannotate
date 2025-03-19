export interface WeatherData {
    city: string;
    current: {
      temp: number;
      feels_like: number;
      humidity: number;
      wind_speed: number;
      description: string;
      icon: string;
    };
    hourly: Array<{
      time: string;
      temp: number;
      icon: string;
    }>;
    daily: Array<{
      date: string;
      min: number;
      max: number;
      description: string;
      icon: string;
    }>;
  }
  
  // Mock weather API function
  export async function fetchWeatherData(city: string): Promise<WeatherData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data with some randomization for variety
    const icons = ['clear-day', 'partly-cloudy-day', 'cloudy', 'rain', 'thunderstorm', 'snow'];
    const descriptions = ['Clear sky', 'Partly cloudy', 'Cloudy', 'Light rain', 'Thunderstorm', 'Snow'];
    
    // Generate some random weather data
    const currentTemp = Math.round(15 + Math.random() * 20);
    const currentIcon = icons[Math.floor(Math.random() * icons.length)];
    const currentDescription = descriptions[icons.indexOf(currentIcon)];
    
    // Generate hourly forecast
    const hourly = Array.from({ length: 24 }, (_, i) => {
      const hourTemp = currentTemp + Math.round(Math.sin(i / 12 * Math.PI) * 5);
      return {
        time: `${(i % 12) || 12}${i < 12 ? 'AM' : 'PM'}`,
        temp: hourTemp,
        icon: icons[Math.floor(Math.random() * icons.length)]
      };
    });
    
    // Generate daily forecast
    const daily = Array.from({ length: 7 }, (_, i) => {
      const dayTemp = currentTemp + Math.round(Math.sin(i / 3.5 * Math.PI) * 8);
      const dayIcon = icons[Math.floor(Math.random() * icons.length)];
      return {
        date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        min: dayTemp - Math.round(Math.random() * 8),
        max: dayTemp + Math.round(Math.random() * 8),
        description: descriptions[icons.indexOf(dayIcon)],
        icon: dayIcon
      };
    });
    
    return {
      city,
      current: {
        temp: currentTemp,
        feels_like: currentTemp - 2 + Math.round(Math.random() * 4),
        humidity: Math.round(40 + Math.random() * 50),
        wind_speed: Math.round(5 + Math.random() * 20),
        description: currentDescription,
        icon: currentIcon
      },
      hourly,
      daily
    };
  }
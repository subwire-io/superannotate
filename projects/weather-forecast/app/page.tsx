"use client";
import { useState } from 'react';
import { fetchWeatherData, type WeatherData } from '@/lib/mock-api';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CurrentWeather } from './components/current-weather';
import { DailyForecast } from './components/daily-forecast';
import { HourlyForecast } from './components/hourly-forecast';
import { SearchForm } from './components/search-form';

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Weather Forecast</h1>
      
      <div className="flex justify-center mb-8">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>
      
      {isLoading && (
        <div className="flex justify-center my-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <div className="text-center text-red-500 my-8">
          {error}
        </div>
      )}
      
      {!weatherData && !isLoading && !error && (
        <Card className="max-w-xl mx-auto my-12">
          <CardContent className="pt-6 text-center text-muted-foreground">
            Search for a city to see the weather forecast
          </CardContent>
        </Card>
      )}
      
      {weatherData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-3">
            <CurrentWeather
              city={weatherData.city}
              temp={weatherData.current.temp}
              feels_like={weatherData.current.feels_like}
              humidity={weatherData.current.humidity}
              wind_speed={weatherData.current.wind_speed}
              description={weatherData.current.description}
              icon={weatherData.current.icon}
            />
          </div>
          <div className="md:col-span-2">
            <HourlyForecast forecast={weatherData.hourly} />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <DailyForecast forecast={weatherData.daily} />
          </div>
        </div>
      )}
    </div>
  );
}
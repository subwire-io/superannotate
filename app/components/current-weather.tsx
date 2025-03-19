import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./weather-icon";
import { Droplets, Wind } from "lucide-react";

interface CurrentWeatherProps {
  city: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
}

export function CurrentWeather({
  city,
  temp,
  feels_like,
  humidity,
  wind_speed,
  description,
  icon
}: CurrentWeatherProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{city}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <WeatherIcon icon={icon} className="h-16 w-16" />
            <div className="space-y-1">
              <div className="text-5xl font-bold">{temp}°C</div>
              <div className="text-muted-foreground">{description}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground">Feels like</div>
              <div className="font-medium">{feels_like}°C</div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <div className="text-muted-foreground">Humidity</div>
              <div className="font-medium">{humidity}%</div>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <div className="text-muted-foreground">Wind</div>
              <div className="font-medium">{wind_speed} km/h</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
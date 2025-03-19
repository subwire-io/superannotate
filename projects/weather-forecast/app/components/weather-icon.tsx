import { Cloud, CloudDrizzle, CloudLightning, CloudSnow, Sun, Moon } from "lucide-react";

type WeatherIconProps = {
  icon: string;
  className?: string;
};

export function WeatherIcon({ icon, className = "h-8 w-8" }: WeatherIconProps) {
  switch (icon) {
    case 'clear-day':
      return <Sun className={className} />;
    case 'clear-night':
      return <Moon className={className} />;
    case 'partly-cloudy-day':
    case 'partly-cloudy-night':
      return <Cloud className={className} />;
    case 'cloudy':
      return <Cloud className={className} />;
    case 'rain':
      return <CloudDrizzle className={className} />;
    case 'thunderstorm':
      return <CloudLightning className={className} />;
    case 'snow':
      return <CloudSnow className={className} />;
    default:
      return <Sun className={className} />;
  }
}
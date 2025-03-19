import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./weather-icon";

interface DailyForecastProps {
  forecast: Array<{
    date: string;
    min: number;
    max: number;
    description: string;
    icon: string;
  }>;
}

export function DailyForecast({ forecast }: DailyForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {forecast.map((day, index) => (
            <div key={index} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2">
              <div>
                <div className="font-medium">{day.date}</div>
                <div className="text-sm text-muted-foreground">{day.description}</div>
              </div>
              <WeatherIcon icon={day.icon} className="h-6 w-6" />
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{day.max}°</span>
                <span className="text-muted-foreground">{day.min}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

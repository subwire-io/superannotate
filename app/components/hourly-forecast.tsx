import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WeatherIcon } from "./weather-icon";

interface HourlyForecastProps {
  forecast: Array<{
    time: string;
    temp: number;
    icon: string;
  }>;
}

export function HourlyForecast({ forecast }: HourlyForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex w-max space-x-8 p-1">
            {forecast.map((hour, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="text-sm text-muted-foreground">{hour.time}</div>
                <WeatherIcon icon={hour.icon} className="h-6 w-6" />
                <div className="text-sm font-medium">{hour.temp}°C</div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

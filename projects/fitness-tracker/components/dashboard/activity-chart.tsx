import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workout } from "@/types";
import { generateWorkoutHistoryData } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { LineChart } from "lucide-react";

interface ActivityChartProps {
  workouts: Workout[];
}

export function ActivityChart({ workouts }: ActivityChartProps) {
  const data = generateWorkoutHistoryData(workouts);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip 
              formatter={(value) => [`${value} workout${value !== 1 ? 's' : ''}`]}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            />
            <Bar 
              dataKey="count" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
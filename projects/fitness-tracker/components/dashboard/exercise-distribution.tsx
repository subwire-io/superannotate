import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workout } from "@/types";
import { generateExerciseDistributionData } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface ExerciseDistributionProps {
  workouts: Workout[];
}

export function ExerciseDistribution({ workouts }: ExerciseDistributionProps) {
  const data = generateExerciseDistributionData(workouts);
  
  // Only include categories with count > 0
  const filteredData = data.filter(item => item.count > 0);
  
  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--destructive))',
    'hsl(var(--muted))'
  ];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
        cx, cy, midAngle, innerRadius, outerRadius, percent 
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        
        return (
            <text 
            x={x} 
            y={y} 
            fill="white" 
            textAnchor="middle" 
            dominantBaseline="central"
            >
            {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    };
    
    if (filteredData.length === 0) {
        return (
        <Card>
        <CardHeader>
        <CardTitle className="flex items-center gap-2">
        <PieChartIcon className="h-5 w-5" />
        Exercise Distribution
        </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
        <p className="text-muted-foreground text-center">
        No exercise data available. Start logging workouts to see your distribution.
        </p>
        </CardContent>
        </Card>
        );
    }

    return (
        <Card>
        <CardHeader>
        <CardTitle className="flex items-center gap-2">
        <PieChartIcon className="h-5 w-5" />
        Exercise Distribution
        </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
        <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                >
        {filteredData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
        </Pie>
        <Tooltip formatter={(value, name, props) => [`${value} exercises`, props.payload?.category]} />
        <Legend />
        </PieChart>
        </ResponsiveContainer>
        </CardContent>
        </Card>
    )
}
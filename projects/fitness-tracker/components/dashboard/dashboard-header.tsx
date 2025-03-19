import { useState } from "react";
import { User } from "@/types";
import { CalendarDays, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initUserData } from "@/lib/storage";

interface DashboardHeaderProps {
  onAddWorkout: () => void;
  onAddGoal: () => void;
}

export function DashboardHeader({ onAddWorkout, onAddGoal }: DashboardHeaderProps) {
  const userData = initUserData();
  const [currentDate] = useState(new Date());
  
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center text-muted-foreground mt-1">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddWorkout}>
              New Workout
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddGoal}>
              New Goal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
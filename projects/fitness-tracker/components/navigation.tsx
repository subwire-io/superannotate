import { useState } from 'react';
import { Dumbbell, LineChart, Target, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
    activeTab: string;
    onChangeTab: (tab: string) => void;
}

export function Navigation({ activeTab, onChangeTab }: NavigationProps) {
    return (
        <nav className="flex border-b space-x-1 overflow-x-auto pb-px">
            <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                className="rounded-none border-b-2 border-transparent px-4 py-2"
                onClick={() => onChangeTab('dashboard')}
            >
                <LineChart className="h-4 w-4 mr-2" />
                Dashboard
            </Button>
            <Button
                variant={activeTab === 'workouts' ? 'default' : 'ghost'}
                className="rounded-none border-b-2 border-transparent px-4 py-2"
                onClick={() => onChangeTab('workouts')}
            >
                <Dumbbell className="h-4 w-4 mr-2" />
                Workouts
            </Button>
            <Button
                variant={activeTab === 'goals' ? 'default' : 'ghost'}
                className="rounded-none border-b-2 border-transparent px-4 py-2"
                onClick={() => onChangeTab('goals')}
            >
                <Target className="h-4 w-4 mr-2" />
                Goals
            </Button>
            <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                className="rounded-none border-b-2 border-transparent px-4 py-2"
                onClick={() => onChangeTab('profile')}
            >
                <User className="h-4 w-4 mr-2" />
                Profile
            </Button>
        </nav>
    );
}
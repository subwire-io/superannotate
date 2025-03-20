"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/types"
import { updateUserProfile } from "@/lib/storage"
import { UserIcon } from "lucide-react"

interface ProfileViewProps {
    userData: User
    onProfileChange: () => void
}

export function ProfileView({ userData, onProfileChange }: ProfileViewProps) {
    const [weight, setWeight] = useState(userData.weight?.toString() || "")
    const [height, setHeight] = useState(userData.height?.toString() || "")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const weightValue = weight ? Number.parseFloat(weight) : undefined
        const heightValue = height ? Number.parseFloat(height) : undefined

        updateUserProfile(weightValue, heightValue)
        onProfileChange()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        User Profile
                    </CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                step="0.1"
                                placeholder="Enter your weight in kg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                                id="height"
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                step="0.1"
                                placeholder="Enter your height in cm"
                            />
                        </div>

                        {weight && height && Number.parseFloat(weight) > 0 && Number.parseFloat(height) > 0 && (
                            <div className="pt-2">
                                <p className="text-sm font-medium">
                                    BMI: {calculateBMI(Number.parseFloat(weight), Number.parseFloat(height)).toFixed(1)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {getBMICategory(calculateBMI(Number.parseFloat(weight), Number.parseFloat(height)))}
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Save Profile
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

function calculateBMI(weight: number, height: number): number {
    // Convert height from cm to m
    const heightInMeters = height / 100
    return weight / (heightInMeters * heightInMeters)
}

function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "Underweight"
    if (bmi < 25) return "Normal weight"
    if (bmi < 30) return "Overweight"
    return "Obese"
}


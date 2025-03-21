"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "./theme-toggle"

export function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("")
  const [name, setName] = useState("")
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const router = useRouter()

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingId.trim() || !name.trim()) return

    // In a real app, this would pass state to the video conference
    router.push("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Join Meeting</CardTitle>
          <CardDescription>Enter a meeting ID and your name to join a video conference</CardDescription>
        </CardHeader>
        <form onSubmit={handleJoin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-id">Meeting ID</Label>
              <Input
                id="meeting-id"
                placeholder="Enter meeting ID"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="audio" className="flex items-center gap-2">
                  Join with audio
                </Label>
                <Switch id="audio" checked={audioEnabled} onCheckedChange={setAudioEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="video" className="flex items-center gap-2">
                  Join with video
                </Label>
                <Switch id="video" checked={videoEnabled} onCheckedChange={setVideoEnabled} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Join Meeting
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


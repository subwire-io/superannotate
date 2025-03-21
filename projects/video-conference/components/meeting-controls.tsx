"use client"

import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, MonitorUp, MoreVertical, Users, Phone, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MeetingControlsProps {
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  isScreenSharing: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onToggleScreenShare: () => void
  onLeaveCall: () => void
}

export function MeetingControls({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveCall,
}: MeetingControlsProps) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium mr-2 hidden sm:inline-block">Meeting Controls</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Users className="h-4 w-4 mr-2" />
              Participants
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={onLeaveCall}>
              <Phone className="h-4 w-4 mr-2 rotate-135" />
              Leave call
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant={isAudioEnabled ? "outline" : "destructive"}
          size="icon"
          onClick={onToggleAudio}
          aria-label={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
          aria-pressed={!isAudioEnabled}
        >
          {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>

        <Button
          variant={isVideoEnabled ? "outline" : "destructive"}
          size="icon"
          onClick={onToggleVideo}
          aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          aria-pressed={!isVideoEnabled}
        >
          {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </Button>

        <Button
          variant={isScreenSharing ? "default" : "outline"}
          size="icon"
          onClick={onToggleScreenShare}
          aria-label={isScreenSharing ? "Stop screen sharing" : "Start screen sharing"}
          aria-pressed={isScreenSharing}
        >
          <MonitorUp className="h-4 w-4" />
        </Button>

        <Button variant="destructive" className="hidden sm:flex" onClick={onLeaveCall}>
          Leave Call
        </Button>
        <Button variant="destructive" size="icon" className="sm:hidden" onClick={onLeaveCall} aria-label="Leave call">
          <Phone className="h-4 w-4 rotate-135" />
        </Button>
      </div>
    </div>
  )
}


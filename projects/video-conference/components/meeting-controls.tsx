"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MoreVertical,
  Users,
  Phone,
  Settings,
  MessageSquare,
  Search,
  MonitorUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface MeetingControlsProps {
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  isScreenSharing: boolean
  isChatOpen: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onToggleScreenShare: () => void
  onToggleChat: () => void
  onLeaveCall: () => void
  onSearch: (term: string) => void
}

export function MeetingControls({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isChatOpen,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onLeaveCall,
  onSearch,
}: MeetingControlsProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium mr-2 hidden sm:inline-block">Meeting Controls</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="transition-all hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Users className="h-4 w-4 mr-2" />
                  Participants
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Participants</DialogTitle>
                  <DialogDescription>Current participants in the meeting</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <p>You (Host)</p>
                  <p>Alex Johnson</p>
                  <p>Maria Garcia</p>
                  <p>James Smith</p>
                  <p>Emma Williams</p>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenuItem onSelect={() => setIsSearchOpen(true)}>
              <Search className="h-4 w-4 mr-2" />
              Search participants
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onToggleScreenShare}>
              <MonitorUp className="h-4 w-4 mr-2" />
              {isScreenSharing ? "Stop sharing" : "Share screen"}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onToggleChat}>
              <MessageSquare className="h-4 w-4 mr-2" />
              {isChatOpen ? "Hide chat" : "Show chat"}
            </DropdownMenuItem>

            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Meeting Settings</DialogTitle>
                  <DialogDescription>Configure your meeting preferences</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Enable background blur</span>
                    <input type="checkbox" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mute on entry</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-record meeting</span>
                    <input type="checkbox" />
                  </div>
                </div>
                <DialogClose asChild>
                  <Button className="mt-4">Save Settings</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>

            <DropdownMenuSeparator />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
                  <Phone className="h-4 w-4 mr-2 rotate-135" />
                  Leave call
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave Meeting?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave this meeting? You can rejoin later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onLeaveCall}>Leave</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isSearchOpen && (
        <div className="absolute left-0 right-0 top-0 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 z-10">
          <Input
            placeholder="Search participants..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsSearchOpen(false)
              setSearchTerm("")
              onSearch("")
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant={isAudioEnabled ? "outline" : "destructive"}
          size="icon"
          onClick={onToggleAudio}
          className="transition-all hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
          aria-label={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
          aria-pressed={!isAudioEnabled}
        >
          {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>

        <Button
          variant={isVideoEnabled ? "outline" : "destructive"}
          size="icon"
          onClick={onToggleVideo}
          className="transition-all hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
          aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          aria-pressed={!isVideoEnabled}
        >
          {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="hidden sm:flex transition-all hover:bg-red-600 active:scale-95">
              Leave Call
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Meeting?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave this meeting? You can rejoin later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onLeaveCall}>Leave</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="sm:hidden transition-all hover:bg-red-600 active:scale-95"
              aria-label="Leave call"
            >
              <Phone className="h-4 w-4 rotate-135" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Meeting?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave this meeting? You can rejoin later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onLeaveCall}>Leave</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}


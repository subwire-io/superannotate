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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MeetingControlsProps {
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  isScreenSharing: boolean
  isChatOpen: boolean
  isParticipantsOpen: boolean
  settings: {
    backgroundBlur: boolean
    muteOnEntry: boolean
    autoRecord: boolean
  }
  onSaveSettings: (settings: {
    backgroundBlur: boolean
    muteOnEntry: boolean
    autoRecord: boolean
  }) => void
  onToggleAudio: () => void
  onToggleVideo: () => void
  onToggleScreenShare: () => void
  onToggleChat: () => void
  onToggleParticipants: () => void
  onLeaveCall: () => void
  onSearch: (term: string) => void
}

export function MeetingControls({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isChatOpen,
  isParticipantsOpen,
  settings,
  onSaveSettings,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  onLeaveCall,
  onSearch,
}: MeetingControlsProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [tempSettings, setTempSettings] = useState(settings)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    onSearch(e.target.value)
  }

  // Handle settings changes
  const handleSettingsChange = (key: keyof typeof settings, value: boolean) => {
    setTempSettings({
      ...tempSettings,
      [key]: value,
    })
  }

  // Save settings
  const saveSettings = () => {
    onSaveSettings(tempSettings)
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between fixed bottom-0 left-0 right-0 md:relative">
      {/* Left side controls */}
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
            {/* Only show participants and chat options on mobile */}
            {isMobile && (
              <>
                <DropdownMenuItem onClick={onToggleParticipants}>
                  <Users className="h-4 w-4 mr-2" />
                  {isParticipantsOpen ? "Hide participants" : "Show participants"}
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => setIsSearchOpen(true)}>
                  <Search className="h-4 w-4 mr-2" />
                  Search participants
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onToggleChat}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {isChatOpen ? "Hide chat" : "Show chat"}
                </DropdownMenuItem>
              </>
            )}

            {/* Always show screen sharing option */}
            <DropdownMenuItem onClick={onToggleScreenShare}>
              <MonitorUp className="h-4 w-4 mr-2" />
              {isScreenSharing ? "Stop sharing" : "Share screen"}
            </DropdownMenuItem>

            {/* Settings dialog */}
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
                  {/* Settings options */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="background-blur">Enable background blur</Label>
                    <Switch
                      id="background-blur"
                      checked={tempSettings.backgroundBlur}
                      onCheckedChange={(checked) => handleSettingsChange("backgroundBlur", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mute-on-entry">Mute on entry</Label>
                    <Switch
                      id="mute-on-entry"
                      checked={tempSettings.muteOnEntry}
                      onCheckedChange={(checked) => handleSettingsChange("muteOnEntry", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-record">Auto-record meeting</Label>
                    <Switch
                      id="auto-record"
                      checked={tempSettings.autoRecord}
                      onCheckedChange={(checked) => handleSettingsChange("autoRecord", checked)}
                    />
                  </div>
                </div>
                <DialogClose asChild>
                  <Button className="mt-4" onClick={saveSettings}>
                    Save Settings
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>

            <DropdownMenuSeparator />

            {/* Leave call dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
                  <Phone className="h-4 w-4 mr-2 rotate-135" />
                  Leave call
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                {/* Leave call confirmation */}
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

      {/* Search overlay */}
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

      {/* Main controls */}
      <div className="flex items-center gap-3">
        {/* Audio toggle */}
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

        {/* Video toggle */}
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

        {/* Leave call button (desktop) */}
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

        {/* Leave call button (mobile) */}
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


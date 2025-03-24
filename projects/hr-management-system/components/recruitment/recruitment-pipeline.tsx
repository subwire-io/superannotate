"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Calendar, Briefcase, MapPin, UserX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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

// Mock data for the recruitment pipeline
const initialCandidates = [
  {
    id: 1,
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JS",
    position: "Senior Developer",
    location: "San Francisco, CA",
    appliedDate: "Aug 5, 2023",
    stage: "Applied",
  },
  {
    id: 2,
    name: "Emily Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "EJ",
    position: "UX Designer",
    location: "New York, NY",
    appliedDate: "Aug 7, 2023",
    stage: "Applied",
  },
  {
    id: 3,
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MB",
    position: "Product Manager",
    location: "Chicago, IL",
    appliedDate: "Aug 3, 2023",
    stage: "Screening",
  },
  {
    id: 4,
    name: "Sarah Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SD",
    position: "Marketing Specialist",
    location: "Austin, TX",
    appliedDate: "Aug 8, 2023",
    stage: "Screening",
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DW",
    position: "Senior Developer",
    location: "Seattle, WA",
    appliedDate: "Jul 28, 2023",
    stage: "Interview",
  },
  {
    id: 6,
    name: "Jennifer Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JL",
    position: "Product Manager",
    location: "Boston, MA",
    appliedDate: "Jul 30, 2023",
    stage: "Interview",
  },
  {
    id: 7,
    name: "Robert Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RT",
    position: "Senior Developer",
    location: "Denver, CO",
    appliedDate: "Jul 25, 2023",
    stage: "Offer",
  },
  {
    id: 8,
    name: "Lisa Anderson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LA",
    position: "UX Designer",
    location: "Portland, OR",
    appliedDate: "Jul 27, 2023",
    stage: "Hired",
  },
]

const stages = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"]

export function RecruitmentPipeline() {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [selectedPosition, setSelectedPosition] = useState("all")
  const [deletedCandidates, setDeletedCandidates] = useState<any[]>([])
  const { toast } = useToast()

  const filteredCandidates =
    selectedPosition === "all" ? candidates : candidates.filter((candidate) => candidate.position === selectedPosition)

  const positions = [...new Set(candidates.map((candidate) => candidate.position))]

  const handleMoveCandidate = (candidateId: number, newStage: string) => {
    setCandidates(
      candidates.map((candidate) => (candidate.id === candidateId ? { ...candidate, stage: newStage } : candidate)),
    )

    const candidate = candidates.find((c) => c.id === candidateId)

    toast({
      title: "Candidate Moved",
      description: `${candidate?.name} moved to ${newStage} stage`,
    })
  }

  const handleViewProfile = (candidateId: number) => {
    const candidate = candidates.find((c) => c.id === candidateId)

    toast({
      title: "Profile Viewed",
      description: `Viewing profile for ${candidate?.name}`,
    })
  }

  const handleScheduleInterview = (candidateId: number) => {
    const candidate = candidates.find((c) => c.id === candidateId)

    toast({
      title: "Interview Scheduled",
      description: `Scheduling interview for ${candidate?.name}`,
    })
  }

  const handleDeleteCandidate = (candidateId: number) => {
    const candidateToDelete = candidates.find((c) => c.id === candidateId)
    const updatedCandidates = candidates.filter((c) => c.id !== candidateId)

    setDeletedCandidates([...deletedCandidates, candidateToDelete])
    setCandidates(updatedCandidates)

    toast({
      title: "Candidate Removed",
      description: `${candidateToDelete?.name} has been removed`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCandidates([...updatedCandidates, candidateToDelete!])
            setDeletedCandidates(deletedCandidates.filter((c) => c.id !== candidateId))
            toast({
              title: "Action Undone",
              description: `${candidateToDelete?.name} has been restored`,
            })
          }}
        >
          Undo
        </Button>
      ),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-muted-foreground">Showing {filteredCandidates.length} candidates</div>
        <div className="flex items-center gap-2">
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {positions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md">
          <UserX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No candidates found</h3>
          <p className="text-muted-foreground mt-2">No candidates match your current filter criteria.</p>
          <Button className="mt-4" variant="outline" onClick={() => setSelectedPosition("all")}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stages.map((stage) => (
            <div key={stage} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{stage}</h3>
                <Badge variant="outline">{filteredCandidates.filter((c) => c.stage === stage).length}</Badge>
              </div>
              <div className="space-y-3">
                {filteredCandidates
                  .filter((candidate) => candidate.stage === stage)
                  .map((candidate) => (
                    <Card
                      key={candidate.id}
                      className="shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/50"
                    >
                      <CardHeader className="p-3 pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={candidate.avatar} alt={candidate.name} />
                              <AvatarFallback>{candidate.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-sm font-medium truncate max-w-[150px]">
                                {candidate.name}
                              </CardTitle>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 transition-all hover:bg-secondary">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewProfile(candidate.id)}>
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleInterview(candidate.id)}>
                                Schedule Interview
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Move to Stage</DropdownMenuLabel>
                              {stages
                                .filter((s) => s !== candidate.stage)
                                .map((s) => (
                                  <DropdownMenuItem key={s} onClick={() => handleMoveCandidate(candidate.id, s)}>
                                    {s}
                                  </DropdownMenuItem>
                                ))}
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                    Remove Candidate
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently remove the candidate from the
                                      recruitment pipeline.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteCandidate(candidate.id)}>
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-2">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Briefcase className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{candidate.position}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{candidate.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">Applied: {candidate.appliedDate}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {filteredCandidates.filter((c) => c.stage === stage).length === 0 && (
                  <div className="flex flex-col items-center justify-center p-4 text-center border rounded-md border-dashed">
                    <p className="text-xs text-muted-foreground">No candidates in this stage</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


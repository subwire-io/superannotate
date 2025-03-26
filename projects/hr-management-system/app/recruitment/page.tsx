"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useMobile } from "@/hooks/use-mobile"
import { Separator } from "@/components/ui/separator"

// Sample job postings
const initialJobPostings = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    posted: "2 weeks ago",
    applicants: 24,
  },
  {
    id: "2",
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    posted: "1 week ago",
    applicants: 18,
  },
  {
    id: "3",
    title: "Marketing Manager",
    department: "Marketing",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "3 days ago",
    applicants: 12,
  },
  {
    id: "4",
    title: "Financial Analyst",
    department: "Finance",
    location: "Chicago, IL",
    type: "Full-time",
    posted: "5 days ago",
    applicants: 9,
  },
]

// Sample candidates
const candidates = [
  {
    id: "1",
    name: "John Smith",
    position: "Senior Frontend Developer",
    stage: "Interview",
    rating: 4.5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    position: "UX Designer",
    stage: "Screening",
    rating: 4.0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Michael Brown",
    position: "Marketing Manager",
    stage: "Applied",
    rating: 3.5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Emily Davis",
    position: "Financial Analyst",
    stage: "Offer",
    rating: 4.8,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Robert Wilson",
    position: "Senior Frontend Developer",
    stage: "Interview",
    rating: 4.2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Jennifer Lee",
    position: "UX Designer",
    stage: "Applied",
    rating: 3.8,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function RecruitmentPage() {
  const [view, setView] = useState("pipeline")
  const [jobPostings, setJobPostings] = useState([])
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
  })
  const isMobile = useMobile()

  // Load job postings from localStorage on initial render
  useEffect(() => {
    const storedJobs = localStorage.getItem("jobPostings")
    if (storedJobs) {
      setJobPostings(JSON.parse(storedJobs))
    } else {
      setJobPostings(initialJobPostings)
    }
  }, [])

  // Save job postings to localStorage whenever they change
  useEffect(() => {
    if (jobPostings.length > 0) {
      localStorage.setItem("jobPostings", JSON.stringify(jobPostings))
    }
  }, [jobPostings])

  // Group candidates by stage for the kanban view
  const stages = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"]
  const candidatesByStage = stages.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage)
    return acc
  }, {})

  const handleAddJob = () => {
    // Validate form
    if (!newJob.title || !newJob.department || !newJob.location) {
      toast.error("Please fill in all required fields")
      return
    }

    const newJobData = {
      id: (jobPostings.length + 1).toString(),
      ...newJob,
      posted: "Just now",
      applicants: 0,
    }

    setJobPostings([newJobData, ...jobPostings])

    // Reset form
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
    })

    // Show success toast
    toast.success(`Job "${newJob.title}" has been posted successfully.`)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Recruitment</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Post Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
                <DialogDescription>Fill in the details for the new job posting.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="Senior Frontend Developer"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newJob.department}
                    onValueChange={(value) => setNewJob({ ...newJob, department: value })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="Remote, New York, NY, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select value={newJob.type} onValueChange={(value) => setNewJob({ ...newJob, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Input
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="Brief description of the job"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddJob}>Post Job</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="pipeline" value={view} onValueChange={setView}>
        <TabsList className="mb-4">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-hidden">
            {stages.map((stage) => (
              <Card key={stage} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{stage}</CardTitle>
                  <CardDescription>{candidatesByStage[stage]?.length || 0} candidates</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-2">
                    {candidatesByStage[stage]?.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="bg-card rounded-md border p-3 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                            <AvatarFallback>
                              {candidate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium text-sm truncate">{candidate.name}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2 truncate">{candidate.position}</div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {candidate.rating} ★
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>Manage your current job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {isMobile ? (
                  // Mobile view - card-based layout with improved spacing
                  <div className="divide-y">
                    {jobPostings.map((job) => (
                      <div key={job.id} className="p-5 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-muted/50">
                              {job.department}
                            </Badge>
                            <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{job.type}</span>
                          </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                              Location
                            </span>
                            <span className="font-medium mt-1">{job.location}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                                Posted
                              </span>
                              <span className="font-medium mt-1">{job.posted}</span>
                            </div>

                            <div className="flex flex-col items-end">
                              <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                                Applicants
                              </span>
                              <span className="font-medium mt-1">{job.applicants}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Desktop view - table layout
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted">
                        <th className="px-4 py-2 text-left font-medium">Position</th>
                        <th className="px-4 py-2 text-left font-medium">Department</th>
                        <th className="px-4 py-2 text-left font-medium">Location</th>
                        <th className="px-4 py-2 text-left font-medium">Type</th>
                        <th className="px-4 py-2 text-left font-medium">Posted</th>
                        <th className="px-4 py-2 text-left font-medium">Applicants</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {jobPostings.map((job) => (
                        <tr key={job.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">{job.title}</td>
                          <td className="px-4 py-3">{job.department}</td>
                          <td className="px-4 py-3">{job.location}</td>
                          <td className="px-4 py-3">{job.type}</td>
                          <td className="px-4 py-3">{job.posted}</td>
                          <td className="px-4 py-3">{job.applicants}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>All Candidates</CardTitle>
              <CardDescription>View and manage all candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 border rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.avatar} alt={candidate.name} />
                      <AvatarFallback>
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-base leading-none">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{candidate.position}</p>
                    </div>
                    <div className="flex flex-row items-center gap-3 mt-2 sm:mt-0 sm:ml-auto">
                      <Badge className="px-3 py-1">{candidate.stage}</Badge>
                      <div className="font-medium text-base">{candidate.rating} ★</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


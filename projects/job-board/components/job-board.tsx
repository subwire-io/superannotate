"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, MapPin, Briefcase, Calendar, BookmarkPlus, Filter, X, BookmarkCheck } from "lucide-react"
import { ApplicationForm } from "./application-form"

// Mock data for jobs
const jobsData = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions Inc.",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$90,000 - $120,000",
    description:
      "We're looking for a skilled Frontend Developer to join our team, focusing on React and modern JavaScript frameworks.",
    postedDate: "2 days ago",
    skills: ["React", "JavaScript", "TypeScript", "CSS"],
  },
  {
    id: 2,
    title: "UX Designer",
    company: "Creative Agency",
    location: "New York, NY",
    jobType: "Full-time",
    salary: "$85,000 - $110,000",
    description:
      "Join our design team to create beautiful and functional user experiences for web and mobile applications.",
    postedDate: "1 week ago",
    skills: ["Figma", "User Research", "Wireframing", "Prototyping"],
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "Data Systems",
    location: "Austin, TX",
    jobType: "Full-time",
    salary: "$100,000 - $130,000",
    description: "Looking for an experienced backend developer to architect and build scalable APIs and services.",
    postedDate: "3 days ago",
    skills: ["Node.js", "Python", "AWS", "SQL"],
  },
  {
    id: 4,
    title: "Content Writer",
    company: "Publishing Plus",
    location: "Remote",
    jobType: "Part-time",
    salary: "$30 - $45 per hour",
    description: "We need creative content writers to produce engaging articles and blog posts for various clients.",
    postedDate: "1 day ago",
    skills: ["Content Creation", "SEO", "Copywriting", "Research"],
  },
  {
    id: 5,
    title: "Project Manager",
    company: "BuildWorks",
    location: "Chicago, IL",
    jobType: "Contract",
    salary: "$90,000 - $110,000",
    description: "Experienced project manager needed to oversee development projects from inception to completion.",
    postedDate: "5 days ago",
    skills: ["Agile", "Scrum", "Budgeting", "Stakeholder Management"],
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Boston, MA",
    jobType: "Full-time",
    salary: "$110,000 - $150,000",
    description: "Join our data science team to extract insights from complex datasets and build predictive models.",
    postedDate: "1 week ago",
    skills: ["Python", "R", "Machine Learning", "SQL"],
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Seattle, WA",
    jobType: "Full-time",
    salary: "$120,000 - $150,000",
    description: "Looking for a DevOps engineer to improve our CI/CD pipelines and infrastructure management.",
    postedDate: "3 days ago",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
  },
  {
    id: 8,
    title: "Technical Writer",
    company: "Documentation Pro",
    location: "Remote",
    jobType: "Contract",
    salary: "$40 - $60 per hour",
    description: "We need technical writers to create clear and concise documentation for software products.",
    postedDate: "2 days ago",
    skills: ["Technical Writing", "API Documentation", "Information Architecture"],
  },
]

// Extract unique locations and job types for filters
const locations = Array.from(new Set(jobsData.map((job) => job.location)))
const jobTypes = Array.from(new Set(jobsData.map((job) => job.jobType)))

export default function JobBoard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("")
  const [filteredJobs, setFilteredJobs] = useState(jobsData)
  const [currentPage, setCurrentPage] = useState(1)
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const jobsPerPage = 4

  // Filter jobs based on search query and filters
  useEffect(() => {
    let result = jobsData

    if (searchQuery) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedLocation && selectedLocation !== "all") {
      result = result.filter((job) => job.location === selectedLocation)
    }

    if (selectedJobType && selectedJobType !== "all") {
      result = result.filter((job) => job.jobType === selectedJobType)
    }

    setFilteredJobs(result)
    setCurrentPage(1) // Reset to first page when filtering
  }, [searchQuery, selectedLocation, selectedJobType])

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLocation("")
    setSelectedJobType("")
  }

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId)
      } else {
        return [...prev, jobId]
      }
    })
  }

  return (
    <main className="container mx-auto p-4 md:p-6 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
        <p className="text-muted-foreground">Browse through hundreds of job listings</p>
      </header>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for jobs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for jobs"
            />
          </div>

          {/* Only show one clear button based on screen size */}
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            disabled={!searchQuery && !selectedLocation && !selectedJobType}
            aria-label="Clear all filters"
            title="Clear all filters"
            className="md:hidden" // Only show on mobile
          >
            <X className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!searchQuery && !selectedLocation && !selectedJobType}
            className="hidden md:flex" // Only show on desktop
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Job Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Types</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(searchQuery || selectedLocation || selectedJobType) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} aria-label={`Remove search for ${searchQuery}`}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedJobType && selectedJobType !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Type: {selectedJobType}
                <button
                  onClick={() => setSelectedJobType("")}
                  aria-label={`Remove job type filter for ${selectedJobType}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedLocation && selectedLocation !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Location: {selectedLocation}
                <button
                  onClick={() => setSelectedLocation("")}
                  aria-label={`Remove location filter for ${selectedLocation}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div aria-live="polite">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredJobs.length === 0 ? 0 : indexOfFirstJob + 1} -{" "}
            {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
          </p>

          {savedJobs.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved
            </Badge>
          )}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
            <h2 className="text-xl font-medium">No matching jobs found</h2>
            <p className="text-muted-foreground mt-1 mb-4">Try adjusting your search or filters</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid gap-6" role="list" aria-label="Job listings">
            {currentJobs.map((job) => (
              <Card key={job.id} role="listitem" aria-labelledby={`job-title-${job.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle id={`job-title-${job.id}`} className="text-xl mb-1">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-base">{job.company}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveJob(job.id)}
                      aria-label={
                        savedJobs.includes(job.id)
                          ? `Remove ${job.title} job from bookmarks`
                          : `Save ${job.title} job to bookmarks`
                      }
                      aria-pressed={savedJobs.includes(job.id)}
                    >
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <BookmarkPlus className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="flex items-center">
                      <Briefcase className="mr-1 h-3 w-3" aria-hidden="true" />
                      {job.jobType}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" aria-hidden="true" />
                      {job.location}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" aria-hidden="true" />
                      {job.postedDate}
                    </Badge>
                  </div>
                  <p className="mb-3 text-muted-foreground">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                  <p className="font-medium">{job.salary}</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Apply Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                        <DialogDescription>
                          Complete the form below to apply for this position at {job.company}.
                        </DialogDescription>
                      </DialogHeader>
                      <ApplicationForm job={job} />
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {filteredJobs.length > 0 && totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  aria-disabled={currentPage === 1}
                  tabIndex={currentPage === 1 ? -1 : 0}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  aria-label="Go to previous page"
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1
                const isCurrentPage = pageNumber === currentPage

                // Show only a limited number of page numbers
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={isCurrentPage}
                        aria-current={isCurrentPage ? "page" : undefined}
                        aria-label={`Page ${pageNumber}`}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                // Add ellipsis where needed
                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={`ellipsis-${pageNumber}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                return null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  aria-disabled={currentPage === totalPages}
                  tabIndex={currentPage === totalPages ? -1 : 0}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  aria-label="Go to next page"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </main>
  )
}


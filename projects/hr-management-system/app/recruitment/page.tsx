"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecruitmentPipeline } from "@/components/recruitment/recruitment-pipeline"
import { JobPostings } from "@/components/recruitment/job-postings"
import { CandidatesList } from "@/components/recruitment/candidates-list"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RecruitmentPage() {
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
          <p className="text-muted-foreground">Manage job postings and track candidates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              toast({
                title: "Post Job",
                description: "Opening job posting form",
              })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Post Job
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>
        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Pipeline</CardTitle>
              <CardDescription>Track candidates through the recruitment process</CardDescription>
            </CardHeader>
            <CardContent>
              <RecruitmentPipeline />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>Manage and track all job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <JobPostings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidates</CardTitle>
              <CardDescription>View and manage all candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <CandidatesList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


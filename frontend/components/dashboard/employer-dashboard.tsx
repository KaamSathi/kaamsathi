"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import SidebarLayout from "@/components/sidebar-layout"
import { EmployerStatsCards } from "./employer-stats-cards"
import { CompanyProfileCard } from "./company-profile-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import JobPostingAnalytics from "./job-posting-analytics"

// Mock data would ideally be moved to a central file like `data/mock-data.ts`
const jobPostings = [
  { id: 1, title: "Plumber", status: "Active", applications: 5, postedDate: "2023-09-01" },
  { id: 2, title: "Electrician", status: "Active", applications: 3, postedDate: "2023-09-05" },
  { id: 3, title: "Gardener", status: "Closed", applications: 7, postedDate: "2023-08-20" },
]

export default function EmployerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  return (
    <SidebarLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[2000px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              Employer Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your job postings and find the right workers.
            </p>
          </div>
          <Button 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm px-3 sm:px-4 w-full sm:w-auto" 
            onClick={() => router.push("/post-job")}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Post New Job</span>
            <span className="xs:hidden">Post Job</span>
          </Button>
        </div>

        <CompanyProfileCard />
        <EmployerStatsCards />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              Overview
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Applications</span>
              <span className="sm:hidden">Apps</span>
            </TabsTrigger>
            <TabsTrigger value="workers" className="text-xs sm:text-sm py-2 px-1 sm:px-3 hidden lg:block">
              Workers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 px-1 sm:px-3 hidden lg:block">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 sm:mt-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Welcome!</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Here's a summary of your recent activity.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">12</div>
                    <p className="text-xs sm:text-sm text-gray-600">Active Jobs</p>
                  </div>
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">48</div>
                    <p className="text-xs sm:text-sm text-gray-600">New Applications</p>
                  </div>
                  <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">6</div>
                    <p className="text-xs sm:text-sm text-gray-600">Interviews Scheduled</p>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">3</div>
                    <p className="text-xs sm:text-sm text-gray-600">Hires This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="mt-4 sm:mt-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Job Management</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Manage your active and past job postings.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                {/* Mobile Card View */}
                <div className="space-y-3 sm:hidden">
                  {jobPostings.map((job) => (
                    <div key={job.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{job.title}</h3>
                          <p className="text-xs text-gray-500">Posted: {job.postedDate}</p>
                        </div>
                        <Badge variant={job.status === "Active" ? "default" : "secondary"} className="text-xs">
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{job.applications} applications</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toast({ title: "Viewing Job", description: job.title })}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toast({ title: "Editing Job", description: job.title })}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500"
                            onClick={() =>
                              toast({ title: "Deleting Job", description: job.title, variant: "destructive" })
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs lg:text-sm">Job Title</TableHead>
                        <TableHead className="text-xs lg:text-sm">Status</TableHead>
                        <TableHead className="text-xs lg:text-sm">Applications</TableHead>
                        <TableHead className="text-xs lg:text-sm">Posted Date</TableHead>
                        <TableHead className="text-xs lg:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobPostings.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{job.title}</TableCell>
                          <TableCell>
                            <Badge variant={job.status === "Active" ? "default" : "secondary"} className="text-xs">
                              {job.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{job.applications}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{job.postedDate}</TableCell>
                          <TableCell className="flex gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                              onClick={() => toast({ title: "Viewing Job", description: job.title })}
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                              onClick={() => toast({ title: "Editing Job", description: job.title })}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-500"
                              onClick={() =>
                                toast({ title: "Deleting Job", description: job.title, variant: "destructive" })
                              }
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="mt-4 sm:mt-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Applications</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Review and manage job applications.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="text-sm text-gray-600">Applications management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workers" className="mt-4 sm:mt-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Workers</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Find and manage workers.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="text-sm text-gray-600">Worker management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4 sm:mt-6">
            <JobPostingAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  )
}

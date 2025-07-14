"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreHorizontal,
  Edit,
  Pause,
  Play,
  Trash2,
  Eye,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Search,
  Plus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockJobs } from "@/data/mock-data"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface EmployerJob {
  id: number
  title: string
  location: string
  salary: string
  description: string
  skills: string[]
  status: "active" | "paused" | "closed" | "draft"
  applicantCount: number
  viewCount: number
  createdAt: string
  expiresAt: string
}

export default function EmployerJobManagement() {
  const [jobs, setJobs] = useState<EmployerJob[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_date")
  const [filteredJobs, setFilteredJobs] = useState<EmployerJob[]>([])

  useEffect(() => {
    loadEmployerJobs()
  }, [])

  useEffect(() => {
    filterAndSortJobs()
  }, [jobs, searchTerm, statusFilter, sortBy])

  const loadEmployerJobs = () => {
    // Simulate employer's jobs with additional data
    const employerJobs: EmployerJob[] = mockJobs.slice(0, 5).map((job, index) => ({
      ...job,
      status: index === 0 ? "draft" : index === 1 ? "paused" : index === 4 ? "closed" : "active",
      applicantCount: Math.floor(Math.random() * 50) + 5,
      viewCount: Math.floor(Math.random() * 200) + 50,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }))
    setJobs(employerJobs)
  }

  const filterAndSortJobs = () => {
    let filtered = [...jobs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case "created_date":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "applicants":
        filtered.sort((a, b) => b.applicantCount - a.applicantCount)
        break
      case "views":
        filtered.sort((a, b) => b.viewCount - a.viewCount)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredJobs(filtered)
  }

  const updateJobStatus = (jobId: number, newStatus: EmployerJob["status"]) => {
    const updatedJobs = jobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job))
    setJobs(updatedJobs)

    const statusMessages = {
      active: "Job has been activated",
      paused: "Job has been paused",
      closed: "Job has been closed",
      draft: "Job has been moved to draft",
    }

    toast({
      title: "Job Status Updated",
      description: statusMessages[newStatus],
    })
  }

  const deleteJob = (jobId: number) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId)
    setJobs(updatedJobs)

    toast({
      title: "Job Deleted",
      description: "The job posting has been permanently deleted.",
    })
  }

  const getStatusColor = (status: EmployerJob["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: EmployerJob["status"]) => {
    switch (status) {
      case "active":
        return <Play className="h-3 w-3" />
      case "paused":
        return <Pause className="h-3 w-3" />
      case "closed":
        return <Trash2 className="h-3 w-3" />
      case "draft":
        return <Edit className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Job Postings</h2>
          <p className="text-gray-600">Manage your job listings and track applications</p>
        </div>
        <Link href="/post-job">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{jobs.filter((j) => j.status === "active").length}</p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{jobs.reduce((sum, job) => sum + job.applicantCount, 0)}</p>
                <p className="text-sm text-gray-600">Total Applicants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{jobs.reduce((sum, job) => sum + job.viewCount, 0)}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-sm text-gray-600">Total Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search your jobs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_date">Date Created</SelectItem>
                <SelectItem value="applicants">Applicants</SelectItem>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="title">Job Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <Badge className={getStatusColor(job.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(job.status)}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </div>
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Created {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Job
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Job
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {job.status === "active" ? (
                        <DropdownMenuItem onClick={() => updateJobStatus(job.id, "paused")}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Job
                        </DropdownMenuItem>
                      ) : job.status === "paused" ? (
                        <DropdownMenuItem onClick={() => updateJobStatus(job.id, "active")}>
                          <Play className="h-4 w-4 mr-2" />
                          Activate Job
                        </DropdownMenuItem>
                      ) : null}
                      {job.status !== "closed" && (
                        <DropdownMenuItem onClick={() => updateJobStatus(job.id, "closed")}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Close Job
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deleteJob(job.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-lg font-semibold">{job.applicantCount}</span>
                    </div>
                    <p className="text-xs text-gray-600">Applicants</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Eye className="h-4 w-4 text-green-500" />
                      <span className="text-lg font-semibold">{job.viewCount}</span>
                    </div>
                    <p className="text-xs text-gray-600">Views</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-lg font-semibold">
                        {Math.ceil((new Date(job.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Days Left</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-lg font-semibold">
                        {job.applicantCount > 0 ? Math.round((job.viewCount / job.applicantCount) * 100) / 100 : 0}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Conversion</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && <Badge variant="outline">+{job.skills.length - 3} more</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/applications?jobId=${job.id}`}>
                      <Button variant="outline" size="sm">
                        View Applications
                      </Button>
                    </Link>
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="sm">View Job</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-4">
                {jobs.length === 0
                  ? "You haven't posted any jobs yet. Create your first job posting to get started."
                  : "No jobs match your current filters. Try adjusting your search criteria."}
              </p>
              <Link href="/post-job">
                <Button>Post Your First Job</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

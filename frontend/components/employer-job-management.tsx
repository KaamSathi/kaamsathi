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
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import api, { Job } from "../services/api"

interface Application {
  id: string
  applicant: any
  status: string
  coverLetter?: string
  proposedSalary?: number
  availability?: string
  appliedAt: string
}

export default function EmployerJobManagement() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_date")
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)
  const [applications, setApplications] = useState<Record<string, Application[]>>({})
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [loadingApps, setLoadingApps] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchEmployerJobs()
  }, [statusFilter])

  const fetchEmployerJobs = async () => {
    setLoadingJobs(true)
    try {
      const res = await api.jobs.getEmployerJobs({ status: statusFilter })
      if (res && res.status === "success" && res.data && res.data.jobs) {
        setJobs(res.data.jobs as Job[])
      } else {
        setJobs([])
      }
    } catch (err) {
      setJobs([])
    } finally {
      setLoadingJobs(false)
    }
  }

  const fetchApplications = async (jobId: string) => {
    setLoadingApps((prev) => ({ ...prev, [jobId]: true }))
    try {
      const res = await api.applications.getByJob(jobId)
      if (res.status === "success" && res.data) {
        setApplications((prev) => ({ ...prev, [jobId]: res.data.applications }))
      } else {
        setApplications((prev) => ({ ...prev, [jobId]: [] }))
      }
    } catch (err) {
      setApplications((prev) => ({ ...prev, [jobId]: [] }))
    } finally {
      setLoadingApps((prev) => ({ ...prev, [jobId]: false }))
    }
  }

  const handleExpand = (jobId: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null)
    } else {
      setExpandedJobId(jobId)
      if (!applications[jobId]) {
        fetchApplications(jobId)
      }
    }
  }

  // Filtering and sorting
  const filteredJobs = jobs
    .filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location?.city || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "created_date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "applicants":
          return (b.currentApplications || 0) - (a.currentApplications || 0)
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

      {/* Remove Search and Filters section for a cleaner UI */}

      {/* Jobs List */}
      <div className="space-y-4">
        {loadingJobs ? (
          <Card>
            <CardContent className="p-12 text-center">Loading jobs...</CardContent>
          </Card>
        ) : filteredJobs.length > 0 ? (
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
                        {job.location?.city || "-"}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary?.min} - {job.salary?.max} {job.salary?.currency}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Created {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleExpand(job.id)}>
                    {expandedJobId === job.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {expandedJobId === job.id ? "Hide Applications" : "View Applications"}
                  </Button>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                {/* Applications Section */}
                {expandedJobId === job.id && (
                  <div className="mt-6 border-t pt-4">
                    {loadingApps[job.id] ? (
                      <div className="text-center py-4">Loading applications...</div>
                    ) : applications[job.id] && applications[job.id].length > 0 ? (
                      <div className="space-y-4">
                        {applications[job.id].map((app) => (
                          <Card key={app.id} className="bg-gray-50">
                            <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="font-semibold">{app.applicant?.name || "Unknown"}</div>
                                <div className="text-xs text-gray-500 mb-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-700 mb-1">Status: {app.status}</div>
                                {app.coverLetter && <div className="text-xs text-gray-600 mb-1">Cover: {app.coverLetter}</div>}
                                {app.proposedSalary && <div className="text-xs text-gray-600 mb-1">Proposed: {app.proposedSalary}</div>}
                                {app.availability && <div className="text-xs text-gray-600 mb-1">Availability: {app.availability}</div>}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">No applications for this job yet.</div>
                    )}
                  </div>
                )}
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

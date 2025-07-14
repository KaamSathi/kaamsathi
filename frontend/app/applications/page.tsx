"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import SidebarLayout from "@/components/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Eye, Calendar, MapPin, DollarSign, Search, Filter, FileText, Loader2, AlertCircle, MessageCircle, Building } from "lucide-react"
import Link from "next/link"
import QuickMessageButton from "@/components/quick-message-button"
import api, { type Application } from "@/services/api"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/hooks/use-toast"

export default function ApplicationsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Fetch applications from API
  const fetchApplications = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page,
        limit: 20,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        sortBy: sortBy === "newest" ? "createdAt" : sortBy === "oldest" ? "createdAt" : "appliedAt",
        sortOrder: sortBy === "oldest" ? "asc" : "desc"
      }

      // For now, only get worker's applications since employer applications need different handling
      const response = await api.applications.getMyApplications(params)
      
      if (response.status === 'success' && response.data) {
        setApplications(response.data.applications)
        setPagination(response.data.pagination)
      } else {
        throw new Error(response.message || 'Failed to fetch applications')
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err)
      setError(err.message || 'Failed to load applications')
      setApplications([])
      
      toast({
        title: "Error Loading Applications",
        description: "Unable to load applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return
    }
    
    fetchApplications()
  }, [isAuthenticated, user, activeTab, statusFilter, sortBy, searchTerm])

  // Filter applications based on search and tab
  const filteredApplications = applications.filter(app => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      if (!app.job.title.toLowerCase().includes(searchLower) && 
          !app.job.employer.companyName?.toLowerCase().includes(searchLower) &&
          !app.job.employer.name.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Tab filter
    if (activeTab !== "all") {
      switch (activeTab) {
        case "pending":
          return ["submitted", "under_review"].includes(app.status)
        case "shortlisted":
          return app.status === "shortlisted"
        case "rejected":
          return app.status === "rejected"
        default:
          return true
      }
    }

    return true
  })

  if (!isAuthenticated || !user) {
    return (
      <SidebarLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view applications</h1>
          <p className="text-gray-600">You need to be logged in to manage your applications.</p>
        </div>
      </SidebarLayout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800'
      case 'interview':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'accepted':
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'shortlisted':
        return <Eye className="h-4 w-4" />
      case 'interview':
        return <MessageCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getApplicationStats = () => {
    const total = applications.length
    const pending = applications.filter((app) => ["submitted", "under_review"].includes(app.status)).length
    const shortlisted = applications.filter((app) => app.status === "shortlisted").length
    const rejected = applications.filter((app) => app.status === "rejected").length

    return { total, pending, shortlisted, rejected }
  }

  const stats = getApplicationStats()

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    if (user?.role !== "employer") {
      toast({
        title: "Access Denied",
        description: "Only employers can update application status.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await api.applications.updateStatus(applicationId, newStatus)
      
      if (response.status === 'success') {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        )
        
        toast({
          title: "Status Updated",
          description: `Application status updated to ${newStatus}.`,
        })
      } else {
        throw new Error(response.message || 'Failed to update status')
      }
    } catch (err: any) {
      console.error('Error updating status:', err)
      
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update application status.",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (newPage: number) => {
    fetchApplications(newPage)
  }

  const getTabCounts = () => {
    const counts = {
      all: applications.length,
      pending: applications.filter(app => app.status.toLowerCase() === 'pending').length,
      shortlisted: applications.filter(app => app.status.toLowerCase() === 'shortlisted').length,
      accepted: applications.filter(app => ['accepted', 'approved'].includes(app.status.toLowerCase())).length,
      rejected: applications.filter(app => app.status.toLowerCase() === 'rejected').length,
    }
    return counts
  }

  const tabCounts = getTabCounts()

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Track the status of your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{loading ? "..." : stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                  <p className="text-2xl font-bold text-green-600">{loading ? "..." : stats.shortlisted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{loading ? "..." : stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by job title or company..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-8 w-8 text-blue-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Loading applications...</h3>
                  <p className="text-gray-500">Please wait while we fetch your applications</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Failed to load applications</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <Button onClick={() => fetchApplications(1)} variant="outline">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredApplications.length > 0 ? (
              <div className="space-y-4">
                {filteredApplications.map((application) => {
                  const appliedDate = new Date(application.appliedAt)
                  const timeAgo = formatDistanceToNow(appliedDate, { addSuffix: true })

                  return (
                    <Card key={application.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {application.job.title}
                                </h3>
                                <p className="text-gray-600">
                                  {application.job.employer.companyName || application.job.employer.name}
                                </p>
                              </div>
                              <Badge
                                className={`${getStatusColor(application.status)} flex items-center gap-1`}
                              >
                                {getStatusIcon(application.status)}
                                {formatStatus(application.status)}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {application.job.location.city}, {application.job.location.state}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {application.job.formattedSalary}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Applied {timeAgo}
                              </div>
                            </div>

                            {application.coverLetter && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Cover Letter:</span> {application.coverLetter}
                                </p>
                              </div>
                            )}

                            {application.proposedSalary && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Proposed Salary:</span> ₹{application.proposedSalary.toLocaleString()}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  Application ID: {application.id}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Link href={`/jobs/${application.job.id}`}>
                                  <Button variant="outline" size="sm">
                                    View Job
                                  </Button>
                                </Link>
                                <QuickMessageButton 
                                  recipientId={application.job.employer.id}
                                  recipientName={application.job.employer.name}
                                  recipientRole="employer"
                                  jobTitle={application.job.title}
                                  jobId={Number(application.job.id)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchApplications(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600 px-3">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchApplications(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No applications found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria." 
                      : "You haven't applied to any jobs yet."}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Link href="/jobs">
                      <Button>Browse Jobs</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import SidebarLayout from "@/components/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Briefcase, Bell, TrendingUp, Bookmark, Eye, Users, Calendar, AlertCircle, Loader2, SlidersHorizontal } from "lucide-react"
import api, { type Job } from "@/services/api"
import JobCard from "@/components/job-card"
import RecommendedJobs from "@/components/recommended-jobs"
import SavedJobs from "@/components/saved-jobs"
import JobAlerts from "@/components/job-alerts"
import EmployerJobManagement from "@/components/employer-job-management"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

// Job categories for filtering
const jobCategories = [
  "All Categories",
  "Construction",
  "Plumbing", 
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Delivery",
  "Housekeeping",
  "Security",
  "Gardening",
  "Cooking",
  "HVAC",
  "Masonry",
  "Welding",
  "Roofing"
]

const locations = [
  "All Locations",
  "Mumbai, Maharashtra",
  "Delhi, NCR", 
  "Bangalore, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Kolkata, West Bengal",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh"
]

export default function JobsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedType, setSelectedType] = useState("All Types")
  const [sortBy, setSortBy] = useState("newest")
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Fetch jobs from API
  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page,
        limit: 20,
        search: searchTerm || undefined,
        category: selectedCategory !== "All Categories" ? selectedCategory.toLowerCase() : undefined,
        city: selectedLocation !== "All Locations" ? selectedLocation.split(",")[0] : undefined,
        type: selectedType !== "All Types" ? selectedType.toLowerCase() : undefined,
        sortBy: sortBy === "newest" ? "createdAt" : sortBy === "salary" ? "salary.min" : "createdAt",
        sortOrder: "desc"
      }

      const response = await api.jobs.getAll(params)
      
      if (response.status === 'success' && response.data) {
        setJobs(response.data.jobs)
        setPagination(response.data.pagination)
      } else {
        throw new Error(response.message || 'Failed to fetch jobs')
      }
    } catch (err: any) {
      console.error('Error fetching jobs:', err)
      setError(err.message || 'Failed to load jobs')
      setJobs([])
      
      toast({
        title: "Error Loading Jobs",
        description: "Unable to load jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial load and reload when filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs(1)
    }
  }, [isAuthenticated, searchTerm, selectedCategory, selectedLocation, selectedType, sortBy])

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchJobs(page)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All Categories")
    setSelectedLocation("All Locations") 
    setSelectedType("All Types")
    setSortBy("newest")
  }

  if (!user) {
    return null
  }

  const workerTabs = [
    { value: "all", label: "All Jobs", icon: Briefcase },
    { value: "recommended", label: "Recommended", icon: TrendingUp },
    { value: "saved", label: "Saved Jobs", icon: Bookmark },
    { value: "alerts", label: "Job Alerts", icon: Bell },
  ]

  const employerTabs = [
    { value: "all", label: "All Jobs", icon: Eye },
    { value: "manage", label: "My Jobs", icon: Briefcase },
    { value: "analytics", label: "Analytics", icon: TrendingUp },
  ]

  const tabs = user.role === "worker" ? workerTabs : employerTabs

  return (
    <SidebarLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {user.role === "worker" ? "Find Jobs" : "Job Management"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {user.role === "worker"
                ? "Discover opportunities that match your skills and preferences"
                : "Manage your job postings and track applications"}
            </p>
          </div>
          {/* Remove the Post Job button from here to ensure only one button is visible */}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex h-auto p-1">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3">
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:hidden lg:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            {/* Search and Filters */}
            <Card className="shadow-sm">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Search Input - Full width on mobile */}
                  <div className="w-full">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                      <Input
                        placeholder="Search jobs by title, company, or keywords..."
                        className="pl-8 sm:pl-10 text-xs sm:text-sm h-9 sm:h-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Filter Controls - Stack on mobile, row on larger screens */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Types">All Types</SelectItem>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm xs:col-span-2 lg:col-span-1">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="title">Title A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {loading ? "..." : pagination.totalJobs}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">Jobs Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">1.2k</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">Active Employers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">85%</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {jobs.filter(job => {
                          const today = new Date()
                          const jobDate = new Date(job.createdAt)
                          return today.getTime() - jobDate.getTime() < 24 * 60 * 60 * 1000
                        }).length}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">New Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
                <h2 className="text-lg sm:text-xl font-semibold">
                  {searchTerm || selectedLocation || selectedType ? "Search Results" : "Latest Jobs"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {loading ? "Loading..." : `${pagination.totalJobs} ${pagination.totalJobs === 1 ? "job" : "jobs"} found`}
                </p>
              </div>

              {loading ? (
                <Card className="shadow-sm">
                  <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                    <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mx-auto mb-3 sm:mb-4 animate-spin" />
                    <h3 className="text-base sm:text-lg font-medium mb-2">Loading jobs...</h3>
                    <p className="text-sm sm:text-base text-gray-500">Please wait while we fetch the latest opportunities</p>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card className="shadow-sm">
                  <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                    <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium mb-2">Failed to load jobs</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 max-w-md mx-auto">
                      {error}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchJobs(1)}
                      className="text-xs sm:text-sm"
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : jobs.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="text-xs sm:text-sm"
                      >
                        Previous
                      </Button>
                      <span className="text-xs sm:text-sm text-gray-600 px-3">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="text-xs sm:text-sm"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Card className="shadow-sm">
                  <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                    <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium mb-2">No jobs found</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 max-w-md mx-auto">
                      Try adjusting your search criteria or check back later for new opportunities.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedLocation("")
                        setSelectedType("")
                      }}
                      className="text-xs sm:text-sm"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {user.role === "worker" && (
            <>
              <TabsContent value="recommended">
                <RecommendedJobs />
              </TabsContent>

              <TabsContent value="saved">
                <SavedJobs />
              </TabsContent>

              <TabsContent value="alerts">
                <JobAlerts />
              </TabsContent>
            </>
          )}

          {user.role === "employer" && (
            <>
              <TabsContent value="manage">
                <EmployerJobManagement />
              </TabsContent>

              <TabsContent value="analytics">
                <div className="space-y-4 sm:space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader className="p-3 sm:p-4 lg:p-6">
                      <CardTitle className="text-base sm:text-lg lg:text-xl">Job Performance Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                      <p className="text-sm sm:text-base text-gray-600">Analytics dashboard coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </SidebarLayout>
  )
}

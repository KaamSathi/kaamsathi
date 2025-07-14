"use client"
import { useAuth } from "@/contexts/auth-context"
import SidebarLayout from "@/components/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Clock, DollarSign, MapPin, Star, CheckCircle, Eye, Calendar, Award } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function WorkerDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()

  // Worker-specific stats
  const workerStats = {
    totalApplications: 24,
    activeApplications: 8,
    completedJobs: 12,
    totalEarnings: 45000,
    profileViews: 156,
    rating: 4.8,
    profileCompletion: 75,
    skillsVerified: 5,
  }

  // Auto-matched jobs for workers
  const autoMatchedJobs = [
    {
      id: 1,
      title: "Landscaping Assistant",
      description: "Assist with landscaping projects, including planting, weeding, and lawn care.",
      requirements: "Experience preferred but not required.",
      location: "Mumbai, Maharashtra",
      type: "Part-time",
      salary: "₹400-600/day",
      match: 95,
      company: "Green Gardens Ltd",
      posted: "2 hours ago",
    },
    {
      id: 2,
      title: "Event Setup Crew",
      description: "Help set up and tear down events, including arranging tables, chairs, and decorations.",
      requirements: "Must be able to lift 50 lbs.",
      location: "Mumbai, Maharashtra",
      type: "Contract",
      salary: "₹500-700/day",
      match: 88,
      company: "Event Masters",
      posted: "5 hours ago",
    },
    {
      id: 3,
      title: "Warehouse Worker",
      description: "Loading and unloading trucks, organizing inventory, and maintaining warehouse cleanliness.",
      requirements: "Previous warehouse experience preferred.",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      salary: "₹15,000-18,000/month",
      match: 82,
      company: "LogiCorp Solutions",
      posted: "1 day ago",
    },
  ]

  // Recent applications
  const recentApplications = [
    {
      id: 1,
      jobTitle: "Construction Worker",
      company: "ABC Construction",
      location: "Mumbai, Maharashtra",
      appliedDate: "2024-01-15",
      status: "shortlisted",
      salary: "₹18,000/month",
    },
    {
      id: 2,
      jobTitle: "Plumber",
      company: "Home Services Ltd",
      location: "Delhi, NCR",
      appliedDate: "2024-01-12",
      status: "under_review",
      salary: "₹600/day",
    },
    {
      id: 3,
      jobTitle: "Electrician",
      company: "Power Solutions",
      location: "Bangalore, Karnataka",
      appliedDate: "2024-01-10",
      status: "rejected",
      salary: "₹500/day",
    },
  ]

  // Work history for workers
  const workHistory = [
    {
      id: 1,
      title: "Residential Plumbing",
      company: "Home Fix Services",
      completedDate: "2024-01-05",
      duration: "3 days",
      earnings: "₹2,400",
      rating: 5,
    },
    {
      id: 2,
      title: "Office Electrical Work",
      company: "Corporate Solutions",
      completedDate: "2023-12-28",
      duration: "5 days",
      earnings: "₹4,500",
      rating: 4,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <SidebarLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[2000px] mx-auto">
        {/* Welcome Header with Worker Profile */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
            Welcome, {user?.name}
          </h1>

          {/* Worker Profile Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 flex-1">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 border-2 sm:border-3 md:border-4 border-blue-500 self-center sm:self-start">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">
                      {user?.name}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1">30 years old, 5 years experience</p>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3">
                      Skills: Landscaping, Event Setup, Warehouse
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs px-2 py-1">
                        <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        <span className="hidden xs:inline">Verified Worker</span>
                        <span className="xs:hidden">Verified</span>
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                        <Award className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        <span className="hidden xs:inline">Top Rated</span>
                        <span className="xs:hidden">Top</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-right flex-shrink-0 w-full sm:w-auto">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">4.8</div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Rating</div>
                  <div className="flex items-center justify-center sm:justify-end gap-0.5 sm:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Based on {workerStats.completedJobs} jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Worker Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Total Applications</CardTitle>
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{workerStats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Active Applications</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{workerStats.activeApplications}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Total Earnings</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">₹{workerStats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Profile Views</CardTitle>
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{workerStats.profileViews}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Auto-Matched Jobs Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">Auto-Matched Jobs</h2>
              <p className="text-sm sm:text-base text-gray-600">Jobs that match your skills and preferences</p>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm" asChild>
              <Link href="/jobs">
                <span className="hidden sm:inline">View All Jobs</span>
                <span className="sm:hidden">View All</span>
              </Link>
            </Button>
          </div>

          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {autoMatchedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
                            {job.title}
                          </h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs flex-shrink-0">
                            {job.match}% match
                          </Badge>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">{job.company}</p>
                        <p className="text-sm text-gray-700 mb-1 sm:mb-2 line-clamp-2">{job.description}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-1">{job.requirements}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-medium">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{job.posted}</span>
                      </div>
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm" asChild>
                        <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm"
                        onClick={() =>
                          toast({ title: "Job Saved!", description: `${job.title} has been saved to your list.` })
                        }
                      >
                        Save Job
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Worker-specific tabs */}
        <Tabs defaultValue="applications" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
            <TabsTrigger value="applications" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">My Applications</span>
              <span className="sm:hidden">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Profile Progress</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Work History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Skills & Certifications</span>
              <span className="sm:hidden">Skills</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Recent Applications</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Track the status of your job applications</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base truncate">{application.jobTitle}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{application.company}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">{application.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Applied {application.appliedDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="font-medium">{application.salary}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                        <Badge className={`${getStatusColor(application.status)} text-xs px-2 py-1`}>
                          {application.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Profile Completion</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Complete your profile to get better job matches</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base">Basic Information</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base">Skills & Experience</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base">Documents</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base">Profile Picture</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Complete</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Work History</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your completed jobs and earnings</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {workHistory.map((work) => (
                    <div key={work.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base">{work.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{work.company}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                          <span>Duration: {work.duration}</span>
                          <span>Completed: {work.completedDate}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="font-semibold text-sm sm:text-base">{work.earnings}</div>
                        <div className="flex items-center gap-0.5 sm:gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${i < work.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Skills & Certifications</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage your skills and add certifications</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm sm:text-base">Verified Skills</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Landscaping
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Event Setup
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Warehouse Operations
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-sm sm:text-base">Pending Verification</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Construction
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Plumbing
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" className="mt-3 sm:mt-4 text-xs sm:text-sm">Add New Skill</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  )
}

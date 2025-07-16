"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import SidebarLayout from "@/components/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Briefcase, Calendar, Building, Users, CheckCircle, ArrowLeft, Share2, Bookmark } from "lucide-react"
import api, { type Job } from "@/services/api"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function JobDetailPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }
    
    fetchJobDetails()
  }, [isAuthenticated, jobId, router])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.jobs.getById(jobId)
      
      if (response.status === 'success' && response.data) {
        setJob(response.data.job)
        setHasApplied(response.data.hasApplied)
      } else {
        throw new Error(response.message || 'Failed to fetch job details')
      }
    } catch (err: any) {
      console.error('Error fetching job:', err)
      setError(err.message || 'Failed to load job details')
      
      toast({
        title: "Error Loading Job",
        description: "Unable to load job details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (hasApplied) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this job.",
        variant: "default",
      })
      return
    }
    
    router.push(`/jobs/${jobId}/apply`)
  }

  const handleSaveJob = () => {
    // TODO: Implement save job functionality
    toast({
      title: "Job Saved",
      description: "This job has been saved to your bookmarks.",
    })
  }

  const handleShareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.employer?.companyName || job?.employer?.name}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Job link copied to clipboard.",
      })
    }
  }

  const formatSalary = (salary: any) => {
    if (!salary) return "Salary not specified"
    
    const { min, max, type } = salary
    const currency = "₹"
    
    if (min && max) {
      return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}/${type}`
    } else if (min) {
      return `${currency}${min.toLocaleString()}/${type}`
    }
    
    return "Salary negotiable"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysAgo = (dateString: string) => {
    const now = new Date()
    const posted = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - posted.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  if (error || !job) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Job Not Found</h2>
              <p className="text-red-600 mb-4">
                {error || "The job you're looking for doesn't exist or has been removed."}
              </p>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => router.back()}>
                  Go Back
                </Button>
                <Button onClick={() => router.push("/jobs")}>
                  Browse Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveJob}>
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareJob}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Job Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {job.category}
                  </Badge>
                  <Badge 
                    variant={job.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {job.status}
                  </Badge>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Building className="h-4 w-4" />
                  <span className="font-medium">
                    {job.employer.companyName || job.employer.name}
                  </span>
                  {job.employer.isVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{job.location.city}, {job.location.state}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{formatSalary(job.salary)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="capitalize">{job.type.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              {user?.role === "worker" && (
                <div className="flex flex-col gap-2 sm:min-w-[200px]">
                  {hasApplied ? (
                    <div className="flex flex-col items-center">
                      <span className="relative inline-block mb-2">
                        <svg className="h-10 w-10 text-green-500 animate-ping-slow absolute inset-0 opacity-50" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /></svg>
                        <CheckCircle className="h-10 w-10 text-green-500 relative z-10 animate-pop" />
                      </span>
                      <p className="text-green-700 font-semibold mb-1">Already Applied</p>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleApply}
                      disabled={job.status !== 'active'}
                      className="w-full"
                    >
                      Apply Now
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Posted:</span>
                <br />
                {getDaysAgo(job.createdAt)}
              </div>
              
                               <div>
                   <span className="font-medium">Experience:</span>
                   <br />
                   <span className="capitalize">{job.requirements?.experience || 'Not specified'}</span>
                 </div>
              
              <div>
                <span className="font-medium">Applications:</span>
                <br />
                {job.currentApplications} received
              </div>
              
              <div>
                <span className="font-medium">Views:</span>
                <br />
                {job.views} views
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements?.skills && job.requirements.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Requirements */}
            {(job.requirements?.experience || job.requirements?.education) && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.experience && (
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Experience: {job.requirements.experience}</span>
                      </li>
                    )}
                    {job.requirements.education && (
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Education: {job.requirements.education}</span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

                     {/* Sidebar */}
           <div className="space-y-6">
             {/* Skills Required */}
             {job.requirements?.skills && job.requirements.skills.length > 0 && (
               <Card>
                 <CardHeader>
                   <CardTitle>Skills Required</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="flex flex-wrap gap-2">
                     {job.requirements.skills.map((skill: string, index: number) => (
                       <Badge key={index} variant="outline" className="text-xs">
                         {skill}
                       </Badge>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             )}

            {/* Employer Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Employer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {job.employer.avatar ? (
                      <img 
                        src={job.employer.avatar} 
                        alt={job.employer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600">
                          {job.employer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium">{job.employer.name}</h4>
                      {job.employer.companyName && (
                        <p className="text-sm text-gray-600">{job.employer.companyName}</p>
                      )}
                    </div>
                  </div>

                  {job.employer.rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Rating:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{job.employer.rating.average.toFixed(1)}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </div>
                  )}

                  {job.employer.isVerified && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Verified Employer</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Job Type:</span>
                    <span className="font-medium capitalize">{job.type.replace('-', ' ')}</span>
                  </div>
                  
                                     <div className="flex justify-between">
                     <span>Experience Level:</span>
                     <span className="font-medium capitalize">{job.requirements?.experience || 'Not specified'}</span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span>Posted Date:</span>
                     <span className="font-medium">{formatDate(job.createdAt)}</span>
                   </div>

                   <div className="flex justify-between">
                     <span>Applications:</span>
                     <span className="font-medium">
                       {job.currentApplications} received
                     </span>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Apply Section for Mobile */}
        {user?.role === "worker" && (
          <Card className="lg:hidden">
            <CardContent className="p-4">
              {hasApplied ? (
                <div className="flex flex-col items-center">
                  <span className="relative inline-block mb-2">
                    <svg className="h-10 w-10 text-green-500 animate-ping-slow absolute inset-0 opacity-50" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /></svg>
                    <CheckCircle className="h-10 w-10 text-green-500 relative z-10 animate-pop" />
                  </span>
                  <p className="text-green-700 font-semibold mb-1">Already Applied</p>
                </div>
              ) : (
                <Button 
                  onClick={handleApply}
                  disabled={job.status !== 'active'}
                  className="w-full"
                  size="lg"
                >
                  Apply Now
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <style jsx global>{`
        @keyframes pop {
          0% { transform: scale(0.7); opacity: 0.5; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-ping-slow {
          animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        }
      `}</style>
    </SidebarLayout>
  )
}

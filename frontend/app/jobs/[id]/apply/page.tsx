"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import SidebarLayout from "@/components/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, DollarSign, Briefcase, Calendar, Building, Upload, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import api, { type Job } from "@/services/api"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function JobApplicationPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    proposedSalary: "",
    availability: "immediate",
  })
  
  const [formErrors, setFormErrors] = useState({
    coverLetter: "",
    proposedSalary: "",
  })

  const [alreadyApplied, setAlreadyApplied] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }
    
    if (user?.role !== "worker") {
      toast({
        title: "Access Denied",
        description: "Only workers can apply for jobs.",
        variant: "destructive",
      })
      router.push("/jobs")
      return
    }
    
    fetchJobDetails()
  }, [isAuthenticated, user, jobId, router])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.jobs.getById(jobId)
      
      if (response.status === 'success' && response.data) {
        setJob(response.data.job)
        
        // Check if already applied
        if (response.data.hasApplied) {
          setAlreadyApplied(true)
          return
        }
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

  const validateForm = () => {
    const errors = { coverLetter: "", proposedSalary: "" }
    let isValid = true

    if (!applicationData.coverLetter.trim()) {
      errors.coverLetter = "Cover letter is required."
      isValid = false
    } else if (applicationData.coverLetter.trim().length < 50) {
      errors.coverLetter = "Cover letter should be at least 50 characters long."
      isValid = false
    }

    if (applicationData.proposedSalary && isNaN(Number(applicationData.proposedSalary))) {
      errors.proposedSalary = "Please enter a valid salary amount."
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors and try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const applicationPayload = {
        coverLetter: applicationData.coverLetter.trim(),
        proposedSalary: applicationData.proposedSalary ? Number(applicationData.proposedSalary) : undefined,
        availability: applicationData.availability,
      }

      const response = await api.applications.apply(jobId, applicationPayload)

      if (response.status === 'success') {
        toast({
          title: "Application Submitted!",
          description: "Your application has been sent to the employer successfully.",
        })
        
        router.push(`/jobs/${jobId}/apply/success`)
      } else {
        throw new Error(response.message || 'Failed to submit application')
      }
    } catch (err: any) {
      console.error('Error submitting application:', err)
      
      toast({
        title: "Application Failed",
        description: err.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  if (alreadyApplied) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <span className="relative inline-block mb-4">
            <svg className="h-16 w-16 text-green-500 animate-ping-slow absolute inset-0 opacity-50" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /></svg>
            <CheckCircle className="h-16 w-16 text-green-500 relative z-10 animate-pop" />
          </span>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Already Applied</h2>
          <p className="text-gray-600 mb-4">You have already applied for this job.</p>
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

  if (error || !job) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Job Not Found</h2>
              <p className="text-red-600 mb-4">
                {error || "The job you're trying to apply for doesn't exist or has been removed."}
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
          
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Apply for Job
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Job Application</CardTitle>
                <p className="text-sm text-gray-600">
                  Fill out the form below to apply for this position.
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cover Letter */}
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">
                      Cover Letter <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell the employer why you're interested in this position and what makes you a good fit..."
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                      rows={6}
                      className={formErrors.coverLetter ? "border-red-500" : ""}
                    />
                    {formErrors.coverLetter && (
                      <p className="text-sm text-red-500">{formErrors.coverLetter}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {applicationData.coverLetter.length}/1000 characters (minimum 50)
                    </p>
                  </div>

                  {/* Proposed Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="proposedSalary">
                      Your Expected Salary (Optional)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        id="proposedSalary"
                        type="number"
                        placeholder="Enter amount"
                        value={applicationData.proposedSalary}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, proposedSalary: e.target.value }))}
                        className={`pl-8 ${formErrors.proposedSalary ? "border-red-500" : ""}`}
                      />
                    </div>
                    {formErrors.proposedSalary && (
                      <p className="text-sm text-red-500">{formErrors.proposedSalary}</p>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="space-y-2">
                    <Label htmlFor="availability">When can you start?</Label>
                    <Select value={applicationData.availability} onValueChange={(value) => setApplicationData(prev => ({ ...prev, availability: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediately</SelectItem>
                        <SelectItem value="1-week">Within 1 week</SelectItem>
                        <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                        <SelectItem value="1-month">Within 1 month</SelectItem>
                        <SelectItem value="negotiable">Negotiable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Job Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{job.employer.companyName || job.employer.name}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
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

                <div className="pt-3 border-t">
                  <Badge variant="secondary" className="text-xs">
                    {job.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Application Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Be specific about your relevant experience</li>
                  <li>• Mention any certifications or special skills</li>
                  <li>• Show enthusiasm for the role</li>
                  <li>• Keep your cover letter concise but informative</li>
                  <li>• Double-check your application before submitting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}

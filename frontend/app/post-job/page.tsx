"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import SidebarLayout from "@/components/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Briefcase, DollarSign, Tag, ListChecks, CalendarDays, Plus, X, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { mockJobs } from "@/data/mock-data" // For skills suggestions or other data
import api from "@/services/api"
import { Checkbox } from "@/components/ui/checkbox"

interface JobFormData {
  title: string
  category: string
  description: string
  requirements: {
    experience: string
    skills: string[]
    education: string
  }
  location: {
    address: string
    city: string
    state: string
    pincode: string
  }
  salary: {
    min: string
    max: string
    type: string
    isNegotiable: boolean
  }
  type: string
  isUrgent: boolean
  applicationDeadline: string
  maxApplications: string
}

const initialJobFormData: JobFormData = {
  title: "",
  category: "",
  description: "",
  requirements: {
    experience: "",
    skills: [],
    education: ""
  },
  location: {
    address: "",
    city: "",
    state: "",
    pincode: ""
  },
  salary: {
    min: "",
    max: "",
    type: "monthly",
    isNegotiable: false
  },
  type: "",
  isUrgent: false,
  applicationDeadline: "",
  maxApplications: ""
}

// Sample skills for suggestions - in a real app, this might come from a DB
const allSkills = [
  "Construction",
  "Plumbing",
  "Electrical Work",
  "Painting",
  "Carpentry",
  "Driving",
  "Cooking",
  "Cleaning",
  "Gardening",
  "Welding",
  "Masonry",
]

// Job categories
const jobCategories = [
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
  "Roofing",
  "Other"
]

// Common skills by category
const skillsByCategory: Record<string, string[]> = {
  Construction: ["Masonry", "Concrete Work", "Foundation", "Framing", "Safety", "Blueprint Reading", "Heavy Machinery"],
  Plumbing: ["Pipe Installation", "Pipe Repair", "Water Heater", "Drain Cleaning", "Leak Detection", "Bathroom Fitting"],
  Electrical: ["Wiring", "Circuit Installation", "Troubleshooting", "Panel Installation", "Lighting", "Safety Standards"],
  Carpentry: ["Woodworking", "Furniture Making", "Door Installation", "Window Installation", "Measuring", "Power Tools"],
  Painting: ["Surface Preparation", "Color Mixing", "Brush Techniques", "Spray Painting", "Wall Texturing", "Interior Design"],
  Cleaning: ["Deep Cleaning", "Floor Care", "Window Cleaning", "Sanitization", "Equipment Operation", "Chemical Handling"],
  Delivery: ["Vehicle Operation", "Route Planning", "Customer Service", "Package Handling", "GPS Navigation", "Time Management"],
  Housekeeping: ["Room Cleaning", "Laundry", "Organization", "Disinfection", "Kitchen Maintenance", "Attention to Detail"],
  Security: ["Surveillance", "Access Control", "Emergency Response", "Report Writing", "First Aid", "Communication"],
  Gardening: ["Plant Care", "Landscaping", "Irrigation", "Pruning", "Fertilization", "Garden Design", "Tool Maintenance"],
}

// Indian states
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
]

export default function PostJobPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<JobFormData>(initialJobFormData)
  const [currentSkill, setCurrentSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }
    
    if (user?.role !== "employer") {
      toast({
        title: "Access Denied",
        description: "Only employers can post jobs.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    if (formData.category && skillsByCategory[formData.category]) {
      setSuggestedSkills(skillsByCategory[formData.category])
    } else {
      setSuggestedSkills([])
    }
  }, [formData.category])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.requirements.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          skills: [...prev.requirements.skills, skill]
        }
      }))
    }
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills: prev.requirements.skills.filter(skill => skill !== skillToRemove)
      }
    }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Required fields validation
    if (!formData.title.trim()) errors.title = "Job title is required"
    if (!formData.category) errors.category = "Category is required"
    if (!formData.description.trim()) errors.description = "Job description is required"
    if (!formData.type) errors.type = "Job type is required"
    if (!formData.location.city.trim()) errors.city = "City is required"
    if (!formData.location.state) errors.state = "State is required"
    if (!formData.salary.min.trim()) errors.salaryMin = "Minimum salary is required"
    
    // Salary validation
    if (formData.salary.min && isNaN(Number(formData.salary.min))) {
      errors.salaryMin = "Please enter a valid number"
    }
    if (formData.salary.max && isNaN(Number(formData.salary.max))) {
      errors.salaryMax = "Please enter a valid number"
    }
    if (formData.salary.min && formData.salary.max && Number(formData.salary.min) > Number(formData.salary.max)) {
      errors.salaryMax = "Maximum salary should be greater than minimum"
    }

    // Pincode validation
    if (formData.location.pincode && !/^\d{6}$/.test(formData.location.pincode)) {
      errors.pincode = "Please enter a valid 6-digit pincode"
    }

    // Max applications validation
    if (formData.maxApplications && (isNaN(Number(formData.maxApplications)) || Number(formData.maxApplications) < 1)) {
      errors.maxApplications = "Please enter a valid number greater than 0"
    }

    // Description length validation
    if (formData.description.trim().length < 50) {
      errors.description = "Job description should be at least 50 characters long"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
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
      // Prepare job data for API
      const jobData = {
        title: formData.title.trim(),
        category: formData.category.toLowerCase(),
        description: formData.description.trim(),
        requirements: {
          experience: formData.requirements.experience || "Any",
          skills: formData.requirements.skills,
          education: formData.requirements.education || "Any",
        },
        location: {
          address: formData.location.address.trim(),
          city: formData.location.city.trim(),
          state: formData.location.state,
          pincode: formData.location.pincode || undefined,
        },
        salary: {
          min: Number(formData.salary.min),
          max: formData.salary.max ? Number(formData.salary.max) : Number(formData.salary.min),
          type: formData.salary.type,
          currency: "INR",
          isNegotiable: formData.salary.isNegotiable,
        },
        type: formData.type,
        isUrgent: formData.isUrgent,
        applicationDeadline: formData.applicationDeadline || undefined,
        maxApplications: formData.maxApplications ? Number(formData.maxApplications) : undefined,
      }

      const response = await api.jobs.create(jobData)

      if (response.status === 'success') {
        toast({
          title: "Job Posted Successfully!",
          description: `Your job "${formData.title}" is now live and accepting applications.`,
        })
        
        router.push("/dashboard")
      } else {
        throw new Error(response.message || 'Failed to post job')
      }
    } catch (err: any) {
      console.error('Error posting job:', err)
      
      toast({
        title: "Failed to Post Job",
        description: err.message || "Unable to post job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated || user?.role !== "employer") {
    return null
  }

  return (
    <SidebarLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-1">Find the perfect candidate for your open position</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="e.g., Experienced Plumber"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={formErrors.title ? "border-red-500" : ""}
                  />
                  {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select job category" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.category && <p className="text-sm text-red-500">{formErrors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job responsibilities, what you're looking for in a candidate, and any other relevant details..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  className={formErrors.description ? "border-red-500" : ""}
                />
                {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
                <p className="text-xs text-gray-500">
                  {formData.description.length}/2000 characters (minimum 50)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select value={formData.requirements.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, requirements: { ...prev.requirements, experience: value } }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry Level">Entry Level (0-1 years)</SelectItem>
                      <SelectItem value="Intermediate">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="Experienced">Experienced (5+ years)</SelectItem>
                      <SelectItem value="Senior">Senior (10+ years)</SelectItem>
                      <SelectItem value="Any">Any Experience Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Select value={formData.requirements.education} onValueChange={(value) => setFormData(prev => ({ ...prev, requirements: { ...prev.requirements, education: value } }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any Education</SelectItem>
                      <SelectItem value="10th Pass">10th Pass</SelectItem>
                      <SelectItem value="12th Pass">12th Pass</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(newSkill))}
                  />
                  <Button type="button" onClick={() => handleAddSkill(newSkill)} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Suggested Skills */}
                {suggestedSkills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Suggested skills for {formData.category}:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills.map((skill) => (
                        <Button
                          key={skill}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSkill(skill)}
                          disabled={formData.requirements.skills.includes(skill)}
                        >
                          + {skill}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Skills */}
                {formData.requirements.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.requirements.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, address: e.target.value } }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={formData.location.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, city: e.target.value } }))}
                    className={formErrors.city ? "border-red-500" : ""}
                  />
                  {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                  <Select value={formData.location.state} onValueChange={(value) => setFormData(prev => ({ ...prev, location: { ...prev.location, state: value } }))}>
                    <SelectTrigger className={formErrors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.state && <p className="text-sm text-red-500">{formErrors.state}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    placeholder="6-digit pincode"
                    value={formData.location.pincode}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, pincode: e.target.value } }))}
                    className={formErrors.pincode ? "border-red-500" : ""}
                  />
                  {formErrors.pincode && <p className="text-sm text-red-500">{formErrors.pincode}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation & Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation & Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type <span className="text-red-500">*</span></Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className={formErrors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.type && <p className="text-sm text-red-500">{formErrors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryType">Salary Type</Label>
                  <Select value={formData.salary.type} onValueChange={(value) => setFormData(prev => ({ ...prev, salary: { ...prev.salary, type: value } }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="fixed">Fixed Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Minimum Salary (₹) <span className="text-red-500">*</span></Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    placeholder="Enter minimum amount"
                    value={formData.salary.min}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: { ...prev.salary, min: e.target.value } }))}
                    className={formErrors.salaryMin ? "border-red-500" : ""}
                  />
                  {formErrors.salaryMin && <p className="text-sm text-red-500">{formErrors.salaryMin}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Maximum Salary (₹)</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    placeholder="Enter maximum amount (optional)"
                    value={formData.salary.max}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: { ...prev.salary, max: e.target.value } }))}
                    className={formErrors.salaryMax ? "border-red-500" : ""}
                  />
                  {formErrors.salaryMax && <p className="text-sm text-red-500">{formErrors.salaryMax}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="negotiable"
                  checked={formData.salary.isNegotiable}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, salary: { ...prev.salary, isNegotiable: !!checked } }))}
                />
                <Label htmlFor="negotiable">Salary is negotiable</Label>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxApplicants">Maximum Applications</Label>
                  <Input
                    id="maxApplicants"
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.maxApplications}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxApplications: e.target.value }))}
                    className={formErrors.maxApplications ? "border-red-500" : ""}
                  />
                  {formErrors.maxApplications && <p className="text-sm text-red-500">{formErrors.maxApplications}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={formData.isUrgent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isUrgent: !!checked }))}
                />
                <Label htmlFor="urgent">Mark as urgent job</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting Job...
                </>
              ) : (
                'Post Job'
              )}
            </Button>
          </div>
        </form>
      </div>
    </SidebarLayout>
  )
}

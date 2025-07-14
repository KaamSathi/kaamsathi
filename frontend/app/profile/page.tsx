"use client"

import type React from "react"
import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type User } from "@/contexts/auth-context"
import SidebarLayout from "@/components/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { UserIcon, Building, Briefcase, Edit3, Trash2, PlusCircle, AlertCircle } from "lucide-react"

// Helper for email validation
const isValidEmail = (email: string): boolean => {
  // Basic email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Helper for URL validation
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (_) {
    return false
  }
}

type FormErrors = Partial<Record<keyof User | "form", string>>

export default function ProfilePage() {
  const { user, isAuthenticated, loading, updateUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<User>>({})
  const [newSkill, setNewSkill] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        avatar: user.avatar || "/placeholder-user.jpg",
        bio: user.bio || "",
        experience: user.experience || "",
        skills: user.skills || [],
        companyName: user.companyName || "",
        companyWebsite: user.companyWebsite || "",
        companyDescription: user.companyDescription || "",
      })
    }
  }, [isAuthenticated, loading, router, user])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.name?.trim()) {
      newErrors.name = "Full name is required."
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email address is required."
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (user?.role === "employer") {
      if (formData.companyName && !formData.companyName.trim()) {
        newErrors.companyName = "Company name cannot be empty if provided." // Or make it required
      }
      if (formData.companyWebsite && !isValidUrl(formData.companyWebsite)) {
        newErrors.companyWebsite = "Please enter a valid URL (e.g., https://example.com)."
      }
    }

    if (user?.role === "worker") {
      if (formData.experience && formData.experience.length > 50) {
        newErrors.experience = "Experience summary should be less than 50 characters."
      }
      if (formData.bio && formData.bio.length > 500) {
        newErrors.bio = "Bio should be less than 500 characters."
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error for this field on change
    if (errors[name as keyof User]) {
      setErrors({ ...errors, [name as keyof User]: undefined })
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setErrors((prev) => ({ ...prev, avatar: "Image size should not exceed 2MB." }))
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, avatar: event.target.result as string })
          setErrors((prev) => ({ ...prev, avatar: undefined }))
          toast({ title: "Avatar Preview Updated", description: "Save changes to apply." })
        }
      }
      reader.readAsDataURL(file)
    } else {
      setFormData({ ...formData, avatar: e.target.value })
      setErrors((prev) => ({ ...prev, avatar: undefined }))
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      if (newSkill.trim().length > 50) {
        setErrors((prev) => ({ ...prev, form: "Skill length should not exceed 50 characters." }))
        return
      }
      setFormData({ ...formData, skills: [...(formData.skills || []), newSkill.trim()] })
      setNewSkill("")
      setErrors((prev) => ({ ...prev, form: undefined }))
    } else if (formData.skills?.includes(newSkill.trim())) {
      setErrors((prev) => ({ ...prev, form: "This skill has already been added." }))
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills?.filter((skill) => skill !== skillToRemove) })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      })
      return
    }

    const changedData: Partial<User> = {}
    ;(Object.keys(formData) as Array<keyof User>).forEach((key) => {
      // @ts-ignore
      if (
        formData[key] !== user[key] &&
        !(
          Array.isArray(formData[key]) &&
          Array.isArray(user[key]) &&
          JSON.stringify(formData[key]) === JSON.stringify(user[key])
        )
      ) {
        // @ts-ignore
        changedData[key] = formData[key]
      }
    })

    // Ensure skills array is always passed if it exists in formData, even if unchanged in content but changed in reference
    if (formData.skills && JSON.stringify(formData.skills) !== JSON.stringify(user.skills)) {
      changedData.skills = formData.skills
    }

    if (Object.keys(changedData).length > 0) {
      updateUser(changedData)
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      })
    } else {
      toast({
        title: "No Changes",
        description: "No changes were made to your profile.",
      })
    }
  }

  if (loading || !user) {
    return (
      <SidebarLayout>
        <div className="p-6 flex justify-center items-center h-full">
          <p>Loading profile...</p>
        </div>
      </SidebarLayout>
    )
  }

  const renderError = (field: keyof FormErrors) => {
    return errors[field] ? (
      <p className="text-sm text-red-600 mt-1 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1" />
        {errors[field]}
      </p>
    ) : null
  }

  return (
    <SidebarLayout>
      <div className="p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" /> Personal Information
              </CardTitle>
              <CardDescription>Manage your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar || "/placeholder-user.jpg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <Label htmlFor="avatar">Avatar URL or Upload</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/png, image/jpeg, image/gif" // Specify accepted image types
                    onChange={handleAvatarChange}
                    className={`mt-1 ${errors.avatar ? "border-red-500" : ""}`}
                  />
                  {renderError("avatar")}
                  <Input
                    id="avatarUrl"
                    name="avatar" // Keep name consistent if this is an alternative way to set avatar
                    type="text"
                    placeholder="Or paste image URL"
                    value={
                      typeof formData.avatar === "string" && formData.avatar?.startsWith("http") ? formData.avatar : ""
                    }
                    onChange={handleChange} // Use general handleChange for text input
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload an image (PNG, JPG, GIF, max 2MB) or paste an image URL.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
                    required
                  />
                  {renderError("name")}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                    required
                  />
                  {renderError("email")}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (Cannot be changed)</Label>
                  <Input id="phone" name="phone" value={user.phone} disabled className="mt-1 bg-gray-100" />
                </div>
                <div>
                  <Label htmlFor="location">Location (e.g., City, State)</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>

              {user.role === "worker" && (
                <>
                  <div>
                    <Label htmlFor="bio">Bio / About Me</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleChange}
                      className={`mt-1 ${errors.bio ? "border-red-500" : ""}`}
                      placeholder="Tell us a bit about yourself, your experience, and what you're looking for (max 500 chars)."
                      maxLength={500}
                    />
                    {renderError("bio")}
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience / Summary</Label>
                    <Input
                      id="experience"
                      name="experience"
                      value={formData.experience || ""}
                      onChange={handleChange}
                      className={`mt-1 ${errors.experience ? "border-red-500" : ""}`}
                      placeholder="e.g., 2 years, 5+ years in plumbing (max 50 chars)"
                      maxLength={50}
                    />
                    {renderError("experience")}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {user.role === "worker" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Skills
                </CardTitle>
                <CardDescription>
                  Showcase your expertise by listing your skills (max 50 chars per skill).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        aria-label={`Remove skill ${skill}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 items-start">
                  {" "}
                  {/* Changed to items-start for error alignment */}
                  <div className="flex-grow">
                    <Label htmlFor="newSkill">Add Skill</Label>
                    <Input
                      id="newSkill"
                      value={newSkill}
                      onChange={(e) => {
                        setNewSkill(e.target.value)
                        if (errors.form) setErrors((prev) => ({ ...prev, form: undefined })) // Clear general form error on typing
                      }}
                      placeholder="e.g., Plumbing, Data Entry"
                      className="mt-1"
                      maxLength={50}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    variant="outline"
                    size="icon"
                    className="mt-auto mb-[1px]"
                  >
                    {" "}
                    {/* Adjusted margin for alignment */}
                    <PlusCircle className="h-5 w-5" />
                    <span className="sr-only">Add Skill</span>
                  </Button>
                </div>
                {renderError("form")} {/* For general skill-related errors */}
              </CardContent>
            </Card>
          )}

          {user.role === "employer" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" /> Company Information
                </CardTitle>
                <CardDescription>Manage your company's details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName || ""}
                    onChange={handleChange}
                    className={`mt-1 ${errors.companyName ? "border-red-500" : ""}`}
                  />
                  {renderError("companyName")}
                </div>
                <div>
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    value={formData.companyWebsite || ""}
                    onChange={handleChange}
                    className={`mt-1 ${errors.companyWebsite ? "border-red-500" : ""}`}
                    placeholder="https://example.com"
                  />
                  {renderError("companyWebsite")}
                </div>
                <div>
                  <Label htmlFor="companyDescription">Company Description</Label>
                  <Textarea
                    id="companyDescription"
                    name="companyDescription"
                    value={formData.companyDescription || ""}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Briefly describe your company."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <CardFooter className="flex justify-end border-t pt-6">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Edit3 className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </div>
    </SidebarLayout>
  )
}

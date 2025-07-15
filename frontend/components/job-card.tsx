"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  Heart,
  Share2,
  Bookmark,
  Eye,
  Users,
  Clock,
  Building,
  CheckCircle
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { type Job } from "@/services/api"

interface JobCardProps {
  job: Job
  variant?: "default" | "compact"
  openChat?: (otherUserId: string, jobId?: string) => void
}

export default function JobCard({ job, variant = "default", openChat }: JobCardProps) {
  const { user } = useAuth()
  const [isSaved, setIsSaved] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (user?.role === "worker") {
      const savedJobs = JSON.parse(localStorage.getItem(`saved_jobs_${user.id}`) || "[]")
      const likedJobs = JSON.parse(localStorage.getItem(`liked_jobs_${user.id}`) || "[]")
      setIsSaved(savedJobs.some((savedJob: any) => savedJob.id === job.id))
      setIsLiked(likedJobs.some((likedJob: any) => likedJob.id === job.id))
    }
  }, [job.id, user])

  const postedDate = new Date(job.createdAt)
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true })

  const handleSaveJob = () => {
    if (!user || user.role !== "worker") return
    const newSavedState = !isSaved
    setIsSaved(newSavedState)
    const savedJobsKey = `saved_jobs_${user.id}`
    let savedJobs = JSON.parse(localStorage.getItem(savedJobsKey) || "[]")

    if (newSavedState) {
      savedJobs.push({ ...job, savedAt: new Date().toISOString() })
      toast({
        title: "Job Saved",
        description: `"${job.title}" has been added to your saved list.`,
      })
    } else {
      savedJobs = savedJobs.filter((savedJob: any) => savedJob.id !== job.id)
      toast({
        title: "Job Unsaved",
        description: `"${job.title}" has been removed from your saved list.`,
      })
    }
    localStorage.setItem(savedJobsKey, JSON.stringify(savedJobs))
  }

  const handleLikeJob = () => {
    if (!user || user.role !== "worker") return
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    const likedJobsKey = `liked_jobs_${user.id}`
    let likedJobs = JSON.parse(localStorage.getItem(likedJobsKey) || "[]")

    if (newLikedState) {
      likedJobs.push({ ...job, likedAt: new Date().toISOString() })
      toast({
        title: "Job Liked",
        description: `You liked "${job.title}".`,
      })
    } else {
      likedJobs = likedJobs.filter((likedJob: any) => likedJob.id !== job.id)
      toast({
        title: "Job Unliked",
        description: `You unliked "${job.title}".`,
      })
    }
    localStorage.setItem(likedJobsKey, JSON.stringify(likedJobs))
  }

  const handleShareJob = () => {
    if (navigator.share) {
      navigator
        .share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.employer.companyName || job.employer.name}`,
          url: window.location.origin + `/jobs/${job.id}`,
        })
        .catch((error) => console.log("Error sharing:", error))
    } else {
      navigator.clipboard.writeText(window.location.origin + `/jobs/${job.id}`)
      toast({
        title: "Link Copied",
        description: "Job link has been copied to clipboard.",
      })
    }
  }

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      action()
    }
  }

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-medium text-lg truncate">{job.title}</h3>
              <p className="text-gray-600 text-sm">{job.employer.companyName || job.employer.name}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {job.type}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location.city}, {job.location.state}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {job.formattedSalary}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link href={`/jobs/${job.id}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
            {user?.role === "worker" && (
              <>
                <Link href={`/jobs/${job.id}/apply`}>
                  <Button size="sm">Apply</Button>
                </Link>
                <Button size="sm" variant="secondary" onClick={() => openChat?.(job.employer.id, job.id)}>
                  Message Employer
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-lg">{job.title}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="h-4 w-4" />
                  <span>{job.employer.companyName || job.employer.name}</span>
                  {job.employer.isVerified && (
                    <span title="Verified Employer">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user?.role === "worker" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLikeJob}
                      className={isLiked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"}
                      aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                      aria-pressed={isLiked}
                      onKeyDown={(e) => handleButtonKeyDown(e, handleLikeJob)}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveJob}
                      className={isSaved ? "text-blue-500 hover:text-blue-600" : "text-gray-400 hover:text-gray-600"}
                      aria-label={isSaved ? "Remove from saved" : "Save job"}
                      aria-pressed={isSaved}
                      onKeyDown={(e) => handleButtonKeyDown(e, handleSaveJob)}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShareJob}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Share job"
                  onKeyDown={(e) => handleButtonKeyDown(e, handleShareJob)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {job.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {job.type}
              </Badge>
              {job.isUrgent && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
              {job.priority === 'high' && (
                <Badge variant="default" className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-200">
                  High Priority
                </Badge>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{job.location.city}, {job.location.state}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>{job.formattedSalary}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{job.requirements.experience}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{timeAgo}</span>
              </div>
            </div>

            {job.requirements.skills && job.requirements.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {job.requirements.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.requirements.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.requirements.skills.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{job.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{job.currentApplications} applied</span>
                </div>
                {job.employer.rating && (
                  <div className="flex items-center gap-1">
                    <span>★</span>
                    <span>{job.employer.rating.average.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/jobs/${job.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                {user?.role === "worker" && (
                  <>
                    <Link href={`/jobs/${job.id}/apply`}>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        Apply Now
                      </Button>
                    </Link>
                    <Button size="sm" variant="secondary" onClick={() => openChat?.(job.employer.id, job.id)}>
                      Message Employer
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

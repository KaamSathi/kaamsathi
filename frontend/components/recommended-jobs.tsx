"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Target, Sparkles, RefreshCw } from "lucide-react"
import { mockJobs } from "@/data/mock-data"
import JobCard from "./job-card"

export default function RecommendedJobs() {
  const { user } = useAuth()
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    generateRecommendations()
  }, [user])

  const generateRecommendations = () => {
    setIsRefreshing(true)

    // Simulate AI-based job recommendations
    setTimeout(() => {
      const userSkills = user?.skills || ["Construction", "Plumbing", "Electrical"]
      const userLocation = user?.location || "Mumbai"

      const recommendations = mockJobs
        .filter((job) => {
          // Match skills
          const skillMatch = job.skills.some((skill) =>
            userSkills.some(
              (userSkill) =>
                userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(userSkill.toLowerCase()),
            ),
          )

          // Match location preference
          const locationMatch = job.location.includes(userLocation)

          return skillMatch || locationMatch
        })
        .map((job) => ({
          ...job,
          matchScore: calculateMatchScore(job, userSkills, userLocation),
          matchReasons: getMatchReasons(job, userSkills, userLocation),
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6)

      setRecommendedJobs(recommendations)
      setIsRefreshing(false)
    }, 1000)
  }

  const calculateMatchScore = (job: any, userSkills: string[], userLocation: string) => {
    let score = 0

    // Skill matching (40% weight)
    const skillMatches = job.skills.filter((skill: string) =>
      userSkills.some(
        (userSkill) =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase()),
      ),
    ).length
    score += (skillMatches / job.skills.length) * 40

    // Location matching (30% weight)
    if (job.location.includes(userLocation)) {
      score += 30
    }

    // Experience level matching (20% weight)
    if (job.experienceLevel === "Intermediate") {
      score += 20
    } else if (job.experienceLevel === "Entry Level") {
      score += 15
    }

    // Recency (10% weight)
    const daysSincePosted = Math.floor(
      (new Date().getTime() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysSincePosted <= 7) {
      score += 10
    }

    return Math.min(score, 100)
  }

  const getMatchReasons = (job: any, userSkills: string[], userLocation: string) => {
    const reasons = []

    const skillMatches = job.skills.filter((skill: string) =>
      userSkills.some(
        (userSkill) =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase()),
      ),
    )

    if (skillMatches.length > 0) {
      reasons.push(`${skillMatches.length} skill match${skillMatches.length > 1 ? "es" : ""}`)
    }

    if (job.location.includes(userLocation)) {
      reasons.push("Location match")
    }

    if (job.experienceLevel === "Intermediate") {
      reasons.push("Experience level match")
    }

    const daysSincePosted = Math.floor(
      (new Date().getTime() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysSincePosted <= 3) {
      reasons.push("Recently posted")
    }

    return reasons
  }

  const refreshRecommendations = () => {
    generateRecommendations()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Recommended for You
          </h2>
          <p className="text-gray-600">Jobs matched to your skills and preferences</p>
        </div>
        <Button
          variant="outline"
          onClick={refreshRecommendations}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Recommendation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{recommendedJobs.length}</p>
                <p className="text-sm text-gray-600">Recommended Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {recommendedJobs.length > 0
                    ? Math.round(recommendedJobs.reduce((acc, job) => acc + job.matchScore, 0) / recommendedJobs.length)
                    : 0}
                  %
                </p>
                <p className="text-sm text-gray-600">Avg Match Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{recommendedJobs.filter((job) => job.matchScore >= 80).length}</p>
                <p className="text-sm text-gray-600">High Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Jobs List */}
      <div className="space-y-4">
        {recommendedJobs.length > 0 ? (
          recommendedJobs.map((job) => (
            <div key={job.id} className="relative">
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className="bg-green-500 text-white">{job.matchScore}% match</Badge>
              </div>
              <JobCard job={job} />
              <div className="mt-2 flex flex-wrap gap-1">
                {job.matchReasons.map((reason: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
              <p className="text-gray-500 mb-4">Complete your profile to get personalized job recommendations.</p>
              <Button variant="outline">Complete Profile</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

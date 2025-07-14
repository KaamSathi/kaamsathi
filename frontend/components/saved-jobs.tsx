"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bookmark, Search, Trash2, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import JobCard from "./job-card"
import { toast } from "@/hooks/use-toast"

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("saved_date")
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])

  useEffect(() => {
    loadSavedJobs()
  }, [])

  useEffect(() => {
    filterAndSortJobs()
  }, [savedJobs, searchTerm, sortBy])

  const loadSavedJobs = () => {
    const saved = JSON.parse(localStorage.getItem("saved_jobs") || "[]")
    setSavedJobs(saved)
  }

  const filterAndSortJobs = () => {
    let filtered = [...savedJobs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "saved_date":
        filtered.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
        break
      case "job_date":
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
        break
      case "salary":
        filtered.sort((a, b) => {
          const aMatch = a.salary.match(/₹(\d+,?\d*)/)
          const bMatch = b.salary.match(/₹(\d+,?\d*)/)
          const aValue = aMatch ? Number.parseInt(aMatch[1].replace(",", "")) : 0
          const bValue = bMatch ? Number.parseInt(bMatch[1].replace(",", "")) : 0
          return bValue - aValue
        })
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredJobs(filtered)
  }

  const removeSavedJob = (jobId: number) => {
    const updatedJobs = savedJobs.filter((job) => job.id !== jobId)
    setSavedJobs(updatedJobs)
    localStorage.setItem("saved_jobs", JSON.stringify(updatedJobs))

    toast({
      title: "Job Removed",
      description: "Job has been removed from your saved list.",
    })
  }

  const clearAllSavedJobs = () => {
    setSavedJobs([])
    localStorage.setItem("saved_jobs", JSON.stringify([]))

    toast({
      title: "All Jobs Removed",
      description: "All saved jobs have been cleared.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-blue-500" />
            Saved Jobs
          </h2>
          <p className="text-gray-600">Jobs you've bookmarked for later</p>
        </div>
        {savedJobs.length > 0 && (
          <Button variant="outline" onClick={clearAllSavedJobs} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {savedJobs.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search saved jobs..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saved_date">Date Saved (newest)</SelectItem>
                  <SelectItem value="job_date">Job Posted (newest)</SelectItem>
                  <SelectItem value="salary">Salary (high to low)</SelectItem>
                  <SelectItem value="title">Job Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="relative">
              <JobCard job={job} />
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSavedJob(job.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Saved {formatDistanceToNow(new Date(job.savedAt), { addSuffix: true })}</span>
              </div>
            </div>
          ))
        ) : savedJobs.length > 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search terms.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved jobs yet</h3>
              <p className="text-gray-500 mb-4">Start saving jobs you're interested in to view them here.</p>
              <Button variant="outline">Browse Jobs</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, DollarSign } from "lucide-react"
import Header from "@/components/header"

export default function FindJobsPage() {
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const jobs = [
    {
      id: 1,
      title: "Construction Worker",
      company: "ABC Construction",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      salary: "₹15,000 - ₹20,000/month",
      description: "Looking for experienced construction workers for residential project.",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Plumber",
      company: "Home Services Ltd",
      location: "Delhi, NCR",
      type: "Contract",
      salary: "₹500 - ₹800/day",
      description: "Skilled plumber needed for residential and commercial projects.",
      posted: "1 day ago",
    },
    {
      id: 3,
      title: "Electrician",
      company: "Power Solutions",
      location: "Bangalore, Karnataka",
      type: "Part-time",
      salary: "₹400 - ₹600/day",
      description: "Certified electrician required for maintenance work.",
      posted: "3 days ago",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Jobs</h1>
          <p className="text-gray-600">Discover opportunities that match your skills</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Jobs</Label>
              <Input
                id="search"
                placeholder="Job title or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="kolkata">Kolkata</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">Search Jobs</Button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">{job.posted}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

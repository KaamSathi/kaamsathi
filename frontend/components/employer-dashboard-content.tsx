"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Eye, Edit, Trash2, Plus } from "lucide-react"

export default function EmployerDashboardContent() {
  const { user } = useAuth()

  // Mock data for job postings
  const jobPostings = [
    {
      id: 1,
      title: "Plumber",
      status: "Active",
      applications: 5,
      postedDate: "2023-09-01",
    },
    {
      id: 2,
      title: "Electrician",
      status: "Active",
      applications: 3,
      postedDate: "2023-09-05",
    },
    {
      id: 3,
      title: "Gardener",
      status: "Closed",
      applications: 7,
      postedDate: "2023-08-20",
    },
  ]

  // Mock data for applications
  const applications = [
    {
      id: 1,
      applicantName: "Rajesh Kumar",
      jobTitle: "Plumber",
      status: "New",
      appliedDate: "2023-09-10",
    },
    {
      id: 2,
      applicantName: "Priya Sharma",
      jobTitle: "Electrician",
      status: "Reviewed",
      appliedDate: "2023-09-08",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "new":
        return "bg-blue-100 text-blue-800"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Manage your company profile and job postings.</p>
      </div>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" placeholder="Enter company name" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" placeholder="Enter industry" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="description">Company Description</Label>
            <Textarea id="description" placeholder="Describe your company" rows={4} className="mt-1" />
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Job Postings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Job Postings</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Post a New Job
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Job Title</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Applications</th>
                  <th className="text-left py-3 px-4">Posted Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobPostings.map((job) => (
                  <tr key={job.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{job.title}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    </td>
                    <td className="py-3 px-4">{job.applications}</td>
                    <td className="py-3 px-4">{job.postedDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Applicant Name</th>
                  <th className="text-left py-3 px-4">Job Title</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Applied Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{application.applicantName}</td>
                    <td className="py-3 px-4">{application.jobTitle}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                    </td>
                    <td className="py-3 px-4">{application.appliedDate}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

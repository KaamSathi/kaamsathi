"use client"

import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Clock, DollarSign } from "lucide-react"

export default function WorkerDashboardContent() {
  const { user } = useAuth()

  // Mock data for auto-matched jobs
  const autoMatchedJobs = [
    {
      id: 1,
      title: "Landscaping Assistant",
      description: "Assist with landscaping projects, including planting, weeding, and lawn care.",
      experience: "Experience preferred but not required.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wobjokMMCqAvQZsSEsVaZ8PSV6nnGv.png",
      location: "Mumbai, Maharashtra",
      type: "Part-time",
      salary: "₹400-600/day",
    },
    {
      id: 2,
      title: "Event Setup Crew",
      description: "Help set up and tear down events, including arranging tables, chairs, and decorations.",
      experience: "Must be able to lift 50 lbs.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wobjokMMCqAvQZsSEsVaZ8PSV6nnGv.png",
      location: "Mumbai, Maharashtra",
      type: "Contract",
      salary: "₹500-700/day",
    },
    {
      id: 3,
      title: "Warehouse Assistant",
      description:
        "Assist with warehouse tasks such as organizing inventory, packing orders, and loading/unloading items.",
      experience: "Attention to detail is key.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wobjokMMCqAvQZsSEsVaZ8PSV6nnGv.png",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      salary: "₹15,000-18,000/month",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
      </div>

      {/* User Profile Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 p-1">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      width={72}
                      height={72}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">{user?.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">30 years old, 5 years experience</p>
              <p className="text-gray-600">Skills: Landscaping, Event Setup, Warehouse</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-500">Rating</div>
              <div className="flex items-center justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Matched Jobs */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Auto-Matched Jobs</h2>
        <div className="space-y-4">
          {autoMatchedJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-gray-700 mb-2">{job.description}</p>
                    <p className="text-gray-600 text-sm mb-4">{job.experience}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
                  </div>
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=96&width=128"
                      alt={job.title}
                      width={128}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Job History */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job History</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Garden Maintenance</h3>
                  <p className="text-sm text-gray-500">Green Spaces Ltd • Completed Dec 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">₹2,400</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Event Setup</h3>
                  <p className="text-sm text-gray-500">Event Masters • Completed Nov 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">₹1,800</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="h-3 w-3 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

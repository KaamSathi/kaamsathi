"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HardHat,
  Users,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Shield,
  Award,
  CheckCircle,
  Building,
  Wrench,
} from "lucide-react"
import ModernHeader from "@/components/modern-header"

const constructionSkills = [
  "Masonry",
  "Concrete Work",
  "Steel Fixing",
  "Carpentry",
  "Painting",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Flooring",
  "Welding",
]

const projectTypes = [
  { name: "Residential Buildings", count: "2.5K+ projects", icon: Building },
  { name: "Commercial Construction", count: "1.8K+ projects", icon: Building },
  { name: "Infrastructure", count: "950+ projects", icon: Building },
  { name: "Renovation", count: "3.2K+ projects", icon: Wrench },
]

const topWorkers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Mumbai, Maharashtra",
    experience: "8 years",
    rating: 4.9,
    completedJobs: 156,
    skills: ["Masonry", "Concrete Work", "Steel Fixing"],
    hourlyRate: "₹180-220",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Suresh Patel",
    location: "Delhi, NCR",
    experience: "12 years",
    rating: 4.8,
    completedJobs: 203,
    skills: ["Carpentry", "Roofing", "Renovation"],
    hourlyRate: "₹200-250",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Amit Singh",
    location: "Bangalore, Karnataka",
    experience: "6 years",
    rating: 4.7,
    completedJobs: 98,
    skills: ["Painting", "Flooring", "Electrical"],
    hourlyRate: "₹160-200",
    image: "/placeholder.svg?height=80&width=80",
  },
]

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Construction Worker",
    content:
      "KaamSathi helped me find consistent construction work. The platform connects me with reliable employers who value skilled workers.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Vikram Enterprises",
    role: "Construction Company",
    content:
      "We've hired over 50 construction workers through KaamSathi. The quality of workers and the platform's verification process is excellent.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
]

export default function ConstructionCategoryPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="absolute inset-0">
          <Image
            src="/images/construction-workers.png"
            alt="Construction workers"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <HardHat className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Construction Workers
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Building India's Future</h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90">
              Connect with skilled construction professionals for residential, commercial, and infrastructure projects
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">15K+</div>
                <div className="text-white/80">Active Workers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">5K+</div>
                <div className="text-white/80">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">₹25K</div>
                <div className="text-white/80">Avg. Monthly Salary</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">4.8★</div>
                <div className="text-white/80">Average Rating</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search/workers?category=construction">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  Find Construction Workers
                </Button>
              </Link>
              <Link href="/search/jobs?category=construction">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Construction Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workers">Top Workers</TabsTrigger>
            <TabsTrigger value="projects">Project Types</TabsTrigger>
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Construction Skills Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {constructionSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="justify-center py-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Construction Workers */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-orange-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Verified Professionals</h3>
                  <p className="text-gray-600">
                    All construction workers are background verified with proper documentation and skill certificates.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-orange-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Experienced Teams</h3>
                  <p className="text-gray-600">
                    Access to both individual workers and complete construction teams for large projects.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 text-orange-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Quality Assurance</h3>
                  <p className="text-gray-600">
                    Rating system and reviews ensure you get quality work from reliable construction professionals.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle>What People Say</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700">{testimonial.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workers" className="space-y-6">
            <div className="grid gap-6">
              {topWorkers.map((worker) => (
                <Card key={worker.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Image
                        src={worker.image || "/placeholder.svg"}
                        alt={worker.name}
                        width={80}
                        height={80}
                        className="rounded-full mx-auto md:mx-0"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{worker.name}</h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              {worker.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">{worker.hourlyRate}/hour</div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{worker.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{worker.experience} experience</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{worker.completedJobs} jobs completed</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {worker.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <Button className="bg-orange-600 hover:bg-orange-700">Contact Worker</Button>
                          <Button variant="outline">View Profile</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {projectTypes.map((project) => (
                <Card key={project.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <project.icon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{project.name}</h3>
                        <p className="text-gray-600">{project.count}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Find specialized construction workers for {project.name.toLowerCase()} with verified experience
                      and skills.
                    </p>
                    <Button variant="outline" className="w-full">
                      Find Workers for {project.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Salary Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Entry Level (0-2 years)</span>
                      <span className="font-semibold">₹15K - ₹20K/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Experienced (3-7 years)</span>
                      <span className="font-semibold">₹25K - ₹35K/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Senior (8+ years)</span>
                      <span className="font-semibold">₹40K - ₹60K/month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Mumbai, Maharashtra</span>
                      <span className="font-semibold">3.2K workers</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Delhi, NCR</span>
                      <span className="font-semibold">2.8K workers</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Bangalore, Karnataka</span>
                      <span className="font-semibold">2.1K workers</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Chennai, Tamil Nadu</span>
                      <span className="font-semibold">1.9K workers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Construction Project?</h2>
          <p className="text-xl mb-8 text-white/90">
            Connect with verified construction workers and get your project completed on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post-job">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Post a Construction Job
              </Button>
            </Link>
            <Link href="/signup?role=employer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Join as Employer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, MapPin, Clock, Star, TrendingUp, Shield, Award, CheckCircle, Package, Bike } from "lucide-react"
import ModernHeader from "@/components/modern-header"

const deliveryServices = [
  "Food Delivery",
  "E-commerce Delivery",
  "Grocery Delivery",
  "Medicine Delivery",
  "Document Delivery",
  "Parcel Delivery",
  "Same-day Delivery",
  "Express Delivery",
]

const serviceTypes = [
  { name: "Food Delivery", count: "4.5K+ workers", icon: Package },
  { name: "E-commerce", count: "3.2K+ workers", icon: Truck },
  { name: "Grocery Delivery", count: "2.8K+ workers", icon: Package },
  { name: "Express Services", count: "1.5K+ workers", icon: Bike },
]

const topWorkers = [
  {
    id: 1,
    name: "Arjun Sharma",
    location: "Mumbai, Maharashtra",
    experience: "3 years",
    rating: 4.9,
    completedDeliveries: 2156,
    services: ["Food Delivery", "E-commerce", "Express"],
    hourlyRate: "₹120-150",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Ravi Kumar",
    location: "Delhi, NCR",
    experience: "5 years",
    rating: 4.8,
    completedDeliveries: 3203,
    services: ["All Services", "Express", "Medicine"],
    hourlyRate: "₹140-180",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Sunil Yadav",
    location: "Bangalore, Karnataka",
    experience: "2 years",
    rating: 4.7,
    completedDeliveries: 1598,
    services: ["Food Delivery", "Grocery", "Documents"],
    hourlyRate: "₹100-130",
    image: "/placeholder.svg?height=80&width=80",
  },
]

const testimonials = [
  {
    name: "Rohit Singh",
    role: "Delivery Partner",
    content:
      "KaamSathi helped me find consistent delivery work with multiple companies. The flexible scheduling allows me to earn more.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "QuickMart Logistics",
    role: "E-commerce Company",
    content:
      "We've hired reliable delivery partners through KaamSathi. Their verification process ensures we get trustworthy workers.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
]

export default function DeliveryCategoryPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
        <div className="absolute inset-0">
          <Image
            src="/images/delivery-workers-real.png"
            alt="Delivery workers"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Truck className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Delivery Workers
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Moving India Forward</h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90">
              Connect with reliable delivery partners for food, e-commerce, groceries, and express delivery services
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">12K+</div>
                <div className="text-white/80">Active Workers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">8K+</div>
                <div className="text-white/80">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">₹22K</div>
                <div className="text-white/80">Avg. Monthly Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">4.7★</div>
                <div className="text-white/80">Average Rating</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search/workers?category=delivery">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Find Delivery Partners
                </Button>
              </Link>
              <Link href="/search/jobs?category=delivery">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Delivery Jobs
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
            <TabsTrigger value="workers">Top Partners</TabsTrigger>
            <TabsTrigger value="services">Service Types</TabsTrigger>
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Delivery Services Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {deliveryServices.map((service) => (
                    <Badge key={service} variant="secondary" className="justify-center py-2">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Delivery Partners */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-green-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Verified Partners</h3>
                  <p className="text-gray-600">
                    All delivery partners are background verified with valid driving licenses and vehicle documentation.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-green-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Fast & Reliable</h3>
                  <p className="text-gray-600">
                    Experienced delivery partners who understand the importance of timely and safe deliveries.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600">
                    Partners available for full-time, part-time, and on-demand delivery requirements.
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
                            <div className="text-2xl font-bold text-green-600">{worker.hourlyRate}/hour</div>
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
                            <span className="text-sm">{worker.completedDeliveries} deliveries</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {worker.services.map((service) => (
                            <Badge key={service} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <Button className="bg-green-600 hover:bg-green-700">Contact Partner</Button>
                          <Button variant="outline">View Profile</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {serviceTypes.map((service) => (
                <Card key={service.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <service.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        <p className="text-gray-600">{service.count}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Find specialized delivery partners for {service.name.toLowerCase()} with verified experience and
                      reliable service.
                    </p>
                    <Button variant="outline" className="w-full">
                      Find {service.name} Partners
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
                  <CardTitle>Earnings Potential</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Part-time (4-6 hours/day)</span>
                      <span className="font-semibold">₹12K - ₹18K/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Full-time (8-10 hours/day)</span>
                      <span className="font-semibold">₹22K - ₹30K/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Peak hours bonus</span>
                      <span className="font-semibold">+20-30% extra</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Delivery Hubs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Mumbai, Maharashtra</span>
                      <span className="font-semibold">2.8K partners</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Delhi, NCR</span>
                      <span className="font-semibold">2.5K partners</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Bangalore, Karnataka</span>
                      <span className="font-semibold">2.1K partners</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Hyderabad, Telangana</span>
                      <span className="font-semibold">1.8K partners</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Reliable Delivery Partners?</h2>
          <p className="text-xl mb-8 text-white/90">
            Connect with verified delivery professionals and ensure your customers get their orders on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post-job">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Post a Delivery Job
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

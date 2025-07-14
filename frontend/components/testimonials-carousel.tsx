"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote, MapPin, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  location: string
  review: string
  avatar: string
  rating: number
  verified: boolean
  category: string
  completedJobs?: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Homeowner",
    company: "Tech Professional",
    location: "Mumbai, Maharashtra",
    review:
      "KaamSathi helped me find a reliable plumber within hours. The service was professional and the pricing was transparent. Highly recommend!",
    avatar: "/images/avatars/priya-sharma.png",
    rating: 5,
    verified: true,
    category: "Plumbing",
  },
  {
    id: 2,
    name: "Amit Patel",
    role: "Business Owner",
    company: "Patel Construction Ltd",
    location: "Delhi, NCR",
    review:
      "Found skilled construction workers for my office renovation. The team was punctual, professional, and delivered excellent results on time.",
    avatar: "/images/avatars/amit-patel.png",
    rating: 5,
    verified: true,
    category: "Construction",
  },
  {
    id: 3,
    name: "Sunita Reddy",
    role: "Property Manager",
    company: "Reddy Properties",
    location: "Bangalore, Karnataka",
    review:
      "Managing multiple properties is easy with KaamSathi. I can quickly find reliable workers for any maintenance job. Great platform!",
    avatar: "/images/avatars/sunita-reddy.png",
    rating: 5,
    verified: true,
    category: "Property Management",
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    role: "Electrician",
    company: "Kumar Electrical Services",
    location: "Chennai, Tamil Nadu",
    review:
      "As a worker, KaamSathi has transformed my career. I get regular work, fair wages, and direct contact with clients. Life-changing platform!",
    avatar: "/images/avatars/rajesh-kumar.png",
    rating: 5,
    verified: true,
    category: "Electrical",
    completedJobs: 150,
  },
  {
    id: 5,
    name: "Meera Joshi",
    role: "Homeowner",
    company: "Software Engineer",
    location: "Pune, Maharashtra",
    review:
      "The carpenter I hired through KaamSathi did an amazing job on my kitchen cabinets. Quality work at reasonable prices. Will use again!",
    avatar: "/images/avatars/meera-joshi.png",
    rating: 5,
    verified: true,
    category: "Carpentry",
  },
  {
    id: 6,
    name: "Vikram Singh",
    role: "Contractor",
    company: "Singh Construction",
    location: "Hyderabad, Telangana",
    review:
      "KaamSathi connects me with quality projects and reliable clients. The platform is user-friendly and the support team is always helpful.",
    avatar: "/images/avatars/vikram-singh.png",
    rating: 5,
    verified: true,
    category: "Construction",
    completedJobs: 200,
  },
  {
    id: 7,
    name: "Anita Gupta",
    role: "Small Business Owner",
    company: "Gupta Boutique",
    location: "Kolkata, West Bengal",
    review:
      "Hired a carpenter to build custom furniture for my boutique. The craftsmanship was excellent and the price was very reasonable.",
    avatar: "/images/avatars/anita-gupta.png",
    rating: 5,
    verified: true,
    category: "Carpentry",
  },
  {
    id: 8,
    name: "Deepak Verma",
    role: "Mason",
    company: "Verma Masonry Works",
    location: "Jaipur, Rajasthan",
    review:
      "KaamSathi gave me the opportunity to showcase my masonry skills to a wider audience. I've built a strong reputation and steady income.",
    avatar: "/images/avatars/deepak-verma.png",
    rating: 5,
    verified: true,
    category: "Masonry",
    completedJobs: 120,
  },
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const testimonialsPerView = 3
  const maxIndex = Math.max(0, testimonials.length - testimonialsPerView)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, maxIndex])

  const nextTestimonials = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevTestimonials = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  const currentTestimonials = testimonials.slice(currentIndex, currentIndex + testimonialsPerView)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl lg:rounded-3xl p-8 lg:p-12 mb-12 relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Quote className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">What do our users say?</h2>
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
              Real experiences from thousands of satisfied users across India
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group relative ${
                  hoveredCard === testimonial.id ? "ring-2 ring-blue-400 ring-opacity-50" : ""
                }`}
                onMouseEnter={() => setHoveredCard(testimonial.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Verified Badge */}
                {testimonial.verified && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1">✓ Verified</Badge>
                  </div>
                )}

                {/* Profile Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-20 w-20 lg:h-24 lg:w-24 mx-auto ring-4 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300">
                      <AvatarImage
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=80&width=80&text=${testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}`
                        }}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xl font-bold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Floating Quote Icon */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                      <Quote className="h-4 w-4 text-white" />
                    </div>

                    {/* Professional Badge for Workers */}
                    {testimonial.completedJobs && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {testimonial.completedJobs}+ jobs
                        </Badge>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm lg:text-base mb-2">
                    {testimonial.role} • {testimonial.company}
                  </p>
                  <div className="flex items-center justify-center text-gray-500 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {testimonial.location}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center justify-center gap-1 mb-4">{renderStars(testimonial.rating)}</div>

                  {/* Category Badge */}
                  <Badge variant="outline" className="text-xs mb-4">
                    {testimonial.category}
                  </Badge>
                </div>

                {/* Review Text */}
                <div className="relative">
                  <div className="absolute -top-2 -left-2 text-blue-400/20 group-hover:text-blue-400/40 transition-colors duration-300">
                    <Quote className="h-8 w-8" />
                  </div>
                  <blockquote className="text-gray-700 text-base lg:text-lg leading-relaxed relative z-10 italic">
                    "{testimonial.review}"
                  </blockquote>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            {/* Arrow Controls */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonials}
                className="w-12 h-12 rounded-full border-2 border-blue-500 text-blue-700 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonials}
                className="w-12 h-12 rounded-full border-2 border-blue-500 text-blue-700 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Dot Indicators */}
            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-blue-500 scale-125 shadow-lg" : "bg-gray-300 hover:bg-blue-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Auto-play Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">
                {currentIndex + 1} of {maxIndex + 1}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-gray-600 hover:text-blue-700 transition-colors duration-300"
              >
                {isAutoPlaying ? "Pause" : "Play"}
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">4.9★</div>
            <div className="text-sm lg:text-base text-gray-600">Average Rating</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl lg:text-4xl font-bold text-green-500 mb-2">50K+</div>
            <div className="text-sm lg:text-base text-gray-600">Happy Users</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl lg:text-4xl font-bold text-blue-500 mb-2">98%</div>
            <div className="text-sm lg:text-base text-gray-600">Satisfaction</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl lg:text-4xl font-bold text-purple-500 mb-2">2M+</div>
            <div className="text-sm lg:text-base text-gray-600">Jobs Done</div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import VideoBackground from "./video-background"

const slides = [
  {
    id: 1,
    category: "Construction Workers",
    title: "Building India's Future",
    description: "Connect with skilled construction professionals for your building projects",
    stats: { workers: "15K+", jobs: "5K+", salary: "₹25K/month" },
    videoSrc: "/videos/construction-workers.mp4",
    imageSrc: "/images/construction-workers.png",
    gradient: "from-orange-600/80 via-red-600/70 to-pink-600/60",
  },
  {
    id: 2,
    category: "Plumbers",
    title: "Expert Plumbing Solutions",
    description: "Find certified plumbers for residential and commercial projects",
    stats: { workers: "8K+", jobs: "2K+", salary: "₹30K/month" },
    videoSrc: "/videos/plumbing-workers.mp4",
    imageSrc: "/images/plumber-worker.png",
    gradient: "from-blue-600/80 via-cyan-600/70 to-teal-600/60",
  },
  {
    id: 3,
    category: "Electricians",
    title: "Licensed Electrical Experts",
    description: "Professional electricians for safe and reliable electrical work",
    stats: { workers: "6K+", jobs: "1.5K+", salary: "₹35K/month" },
    videoSrc: "/videos/electrical-workers.mp4",
    imageSrc: "/images/electrician-worker.png",
    gradient: "from-yellow-600/80 via-orange-600/70 to-red-600/60",
  },
  {
    id: 4,
    category: "Delivery Workers",
    title: "Fast & Reliable Delivery",
    description: "Connect with experienced delivery professionals for logistics needs",
    stats: { workers: "12K+", jobs: "8K+", salary: "₹22K/month" },
    videoSrc: "/videos/delivery-workers.mp4",
    imageSrc: "/images/delivery-workers-real.png",
    gradient: "from-green-600/80 via-emerald-600/70 to-teal-600/60",
  },
  {
    id: 5,
    category: "Maintenance Workers",
    title: "Professional Maintenance",
    description: "Skilled maintenance professionals for facility and equipment care",
    stats: { workers: "9K+", jobs: "3K+", salary: "₹28K/month" },
    videoSrc: "/videos/maintenance-workers.mp4",
    imageSrc: "/images/maintenance-worker.png",
    gradient: "from-purple-600/80 via-indigo-600/70 to-blue-600/60",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedTab, setSelectedTab] = useState<"talent" | "jobs">("talent")

  // Auto-rotation effect
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000) // 8 seconds per slide

    return () => clearInterval(interval)
  }, [isPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <VideoBackground
              videoSrc={slide.videoSrc}
              imageSrc={slide.imageSrc}
              alt={slide.category}
              isActive={index === currentSlide}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm sm:text-base px-3 py-1"
            >
              {currentSlideData.category}
            </Badge>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Connecting skilled workers
              <br />
              <span className="text-yellow-300">with opportunities</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              {currentSlideData.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300">
                  {currentSlideData.stats.workers}
                </div>
                <div className="text-sm sm:text-base text-white/80">Workers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300">
                  {currentSlideData.stats.jobs}
                </div>
                <div className="text-sm sm:text-base text-white/80">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300">
                  {currentSlideData.stats.salary}
                </div>
                <div className="text-sm sm:text-base text-white/80">Avg. Salary</div>
              </div>
            </div>

            {/* Tab Selection */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
                <button
                  onClick={() => setSelectedTab("talent")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setSelectedTab("talent")
                    } else if (e.key === "ArrowRight") {
                      e.preventDefault()
                      setSelectedTab("jobs")
                    }
                  }}
                  className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
                    selectedTab === "talent" ? "bg-white text-gray-900 shadow-lg" : "text-white hover:bg-white/10"
                  }`}
                >
                  Find Talent
                </button>
                <button
                  onClick={() => setSelectedTab("jobs")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setSelectedTab("jobs")
                    } else if (e.key === "ArrowLeft") {
                      e.preventDefault()
                      setSelectedTab("talent")
                    }
                  }}
                  className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
                    selectedTab === "jobs" ? "bg-white text-gray-900 shadow-lg" : "text-white hover:bg-white/10"
                  }`}
                >
                  Browse Jobs
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {selectedTab === "talent"
                ? `Find ${currentSlideData.category}`
                : `Browse ${currentSlideData.category} Jobs`}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              prevSlide()
            }
          }}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-4 sm:right-6 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          aria-label="Next slide"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              nextSlide()
            }
          }}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Play/Pause Button */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setIsPlaying(!isPlaying)
            }
          }}
        >
          {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  goToSlide(index)
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Loader2, Shield, Mail, MapPinIcon } from "lucide-react"
import UserIntentModal from "@/components/user-intent-modal"
import { toast } from "@/components/ui/use-toast"
import contentConfig from "@/config/contentConfig"
import TestimonialsCarousel from "@/components/testimonials-carousel"

export default function Home() {
  const { isAuthenticated, user, loading, sendOTP, verifyOTP } = useAuth()
  const router = useRouter()
  const [showIntentModal, setShowIntentModal] = useState(false)
  const [userIntent, setUserIntent] = useState<"hire" | "job" | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Authentication states
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [userName, setUserName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)

  // Contact form states
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [contactFormErrors, setContactFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Always show intent modal for non-authenticated users - only after hydration
  useEffect(() => {
    if (!isHydrated) return
    
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        const savedIntent = localStorage.getItem("kaamsathi-user-intent")
        if (savedIntent) {
          setUserIntent(savedIntent as "hire" | "job")
        } else {
          // Force show the intent modal after a short delay
          const timer = setTimeout(() => {
            setShowIntentModal(true)
          }, 500)
          return () => clearTimeout(timer)
        }
      } else {
        // Set a default value during SSR to prevent loading stuck state
        setUserIntent("hire")
      }
    }
  }, [isAuthenticated, isHydrated])

  // Optional: Redirect authenticated users to dashboard
  // Comment out or remove this if you want authenticated users to see the home page
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     router.push("/dashboard")
  //   }
  // }, [isAuthenticated, user, router])

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    // Optionally, show a loading spinner or nothing while redirecting
    return null;
  }

  const validateContactForm = () => {
    const errors = { firstName: "", lastName: "", email: "", phone: "", message: "" }
    let isValid = true

    if (!contactForm.firstName.trim()) {
      errors.firstName = "First name is required."
      isValid = false
    }
    if (!contactForm.lastName.trim()) {
      errors.lastName = "Last name is required."
      isValid = false
    }
    if (!contactForm.email.trim()) {
      errors.email = "Email is required."
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = "Email is invalid."
      isValid = false
    }
    if (!contactForm.phone.trim()) {
      errors.phone = "Phone number is required."
      isValid = false
    } else if (!/^\d{10}$/.test(contactForm.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be 10 digits."
      isValid = false
    }
    if (!contactForm.message.trim()) {
      errors.message = "Message is required."
      isValid = false
    }
    setContactFormErrors(errors)
    return isValid
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateContactForm()) {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      })
      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      })
      setContactFormErrors({ firstName: "", lastName: "", email: "", phone: "", message: "" })
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      })
    }
  }

  const handleIntentSelection = (intent: "hire" | "job") => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("kaamsathi-user-intent", intent)
    }
    setUserIntent(intent)
    setShowIntentModal(false)
  }

  const handleCloseModal = () => {
    return
  }

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      })
      return
    }

    setIsSendingOtp(true)
    try {
      const result = await sendOTP(phoneNumber)
      if (result.success) {
        setIsOtpSent(true)
        toast({
          title: "OTP Sent",
          description: "A 6-digit verification code has been sent to your phone number.",
        })
      } else {
        toast({
          title: "Failed to send OTP",
          description: result.error || "Please try again later",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpString = otp.join("")
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the terms and conditions to continue",
        variant: "destructive",
      })
      return
    }

    if (!userIntent) {
      toast({
        title: "Role Selection Required",
        description: "Please select whether you're looking for work or hiring",
        variant: "destructive",
      })
      return
    }

    // Check if name is required for new users
    if (showNameInput && !userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to complete registration",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    try {
      // Convert user intent to role
      const role = userIntent === "job" ? "worker" : "employer"
      
      const result = await verifyOTP(phoneNumber, otpString, role, userName.trim() || undefined)
      if (result.success) {
        toast({
          title: "Welcome to KaamSathi!",
          description: userName ? `Account created successfully!` : `Login successful!`,
        })
        // Redirect will be handled by the auth context
        router.push("/dashboard")
      } else {
        // Check if error indicates new user needs name
        if (result.error?.includes("Name is required")) {
          setShowNameInput(true)
          toast({
            title: "Name Required",
            description: "Please enter your name to complete registration",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Verification Failed",
            description: result.error || "Invalid OTP. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleChangeIntent = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("kaamsathi-user-intent")
    }
    setUserIntent(null)
    setShowIntentModal(true)
  }

  // Show loading only while auth is being determined
  if (loading || !isHydrated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading KaamSathi...</p>
        </div>
      </div>
    )
  }

  const config = contentConfig[userIntent || "hire"]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* User Intent Modal */}
      <UserIntentModal isOpen={showIntentModal} onClose={handleCloseModal} onSelect={handleIntentSelection} />

      {/* Enhanced Glass Effect Header - Always on top */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/30 shadow-lg supports-[backdrop-filter]:bg-white/60">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - Responsive sizing */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm sm:text-lg">K</span>
              </div>
              <span className="font-bold text-lg sm:text-xl text-gray-900 hidden xs:block">KaamSathi</span>
            </Link>

            {/* Right side buttons - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a
                href={config.headerLink}
                className="text-blue-600 hover:text-blue-700 font-medium hidden md:block transition-colors text-sm"
              >
                {config.headerText} →
              </a>
              <Button
                onClick={handleChangeIntent}
                className="bg-blue-600/90 hover:bg-blue-700 text-white px-3 sm:px-4 lg:px-6 text-xs sm:text-sm shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <span className="hidden sm:inline">{userIntent === "hire" ? "Worker Login" : "Employer Login"}</span>
                <span className="sm:hidden">{userIntent === "hire" ? "Worker" : "Employer"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-14 sm:pt-16">
        {/* Hero Section - Fixed responsive layout */}
        <section className="relative min-h-[400px] xs:min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={config.backgroundImage || "/placeholder.svg?width=1920&height=1080&text=Hero+Background"}
              fill
              alt="Hero background"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center min-h-[350px] xs:min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
              {/* Left side - Hero content */}
              <div className="text-white order-2 lg:order-1 text-center lg:text-left px-2 sm:px-0">
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                  {config.heroTitle}
                </h1>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 lg:mb-8 text-gray-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {config.heroSubtitle}
                </p>
              </div>

              {/* Right side - Login Card with Glass Effect */}
              <div className="order-1 lg:order-2 w-full max-w-sm xs:max-w-md mx-auto lg:max-w-lg lg:ml-auto px-2 sm:px-0">
                <div className="backdrop-blur-xl bg-white/90 border border-white/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 xs:p-4 sm:p-6 lg:p-8 xl:p-10 shadow-2xl w-full supports-[backdrop-filter]:bg-white/80">
                  <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 xl:mb-8 text-center">
                    {config.loginTitle}
                  </h2>

                  {!isOtpSent ? (
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                      {/* Mobile Number Input */}
                      <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="phoneNumber" className="text-xs sm:text-sm font-medium text-gray-700">
                          Mobile Number
                        </label>
                        <div className="flex">
                          <div className="flex items-center px-2 sm:px-3 lg:px-4 bg-gray-50/80 backdrop-blur-sm border border-r-0 border-gray-300/50 rounded-l-lg">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-1 sm:mr-2" />
                            <span className="text-xs sm:text-sm text-gray-600">+91</span>
                          </div>
                          <Input
                            id="phoneNumber"
                            type="tel"
                            placeholder="Your Mobile Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="rounded-l-none border-l-0 focus:border-l text-xs sm:text-sm lg:text-base py-2 sm:py-3 lg:py-4 bg-white/80 backdrop-blur-sm border-gray-300/50 h-9 sm:h-10 lg:h-12"
                            disabled={isSendingOtp}
                            maxLength={10}
                            aria-label="Mobile Number"
                          />
                        </div>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                          className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4"
                        />
                        <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          I agree to the{" "}
                          <a href="#terms" className="text-blue-600 hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </a>
                        </label>
                      </div>

                      {/* Send OTP Button */}
                      <Button
                        onClick={handleSendOTP}
                        disabled={!phoneNumber || phoneNumber.length !== 10 || !agreedToTerms || isSendingOtp}
                        className="w-full py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl bg-blue-600/90 hover:bg-blue-700 text-white shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-9 sm:h-10 lg:h-12"
                      >
                        {isSendingOtp ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                      {/* Shield Icon */}
                      <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
                        <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <Shield className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-blue-600" />
                        </div>
                      </div>

                      {/* Verify Your Number */}
                      <div className="text-center space-y-1 sm:space-y-2">
                        <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Verify Your Number</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Enter the 6-digit code sent to</p>
                        <p className="text-blue-600 font-semibold text-xs sm:text-sm">+91 {phoneNumber}</p>
                      </div>

                      {/* Name Input for New Users */}
                      {showNameInput && (
                        <div className="space-y-1 sm:space-y-2">
                          <label htmlFor="userName" className="text-xs sm:text-sm font-medium text-gray-700">
                            Full Name *
                          </label>
                          <Input
                            id="userName"
                            type="text"
                            placeholder="Enter your full name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="text-xs sm:text-sm lg:text-base py-2 sm:py-3 lg:py-4 bg-white/80 backdrop-blur-sm border-gray-300/50 h-9 sm:h-10 lg:h-12"
                            maxLength={50}
                            aria-label="Full Name"
                          />
                          <p className="text-xs text-gray-500">This will be used for your profile</p>
                        </div>
                      )}

                      {/* OTP Input Boxes - Responsive sizing */}
                      <div className="flex justify-center space-x-1.5 sm:space-x-2">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-center text-sm xs:text-base sm:text-lg lg:text-xl font-semibold border-2 rounded-lg bg-white/80 backdrop-blur-sm border-gray-300/50 focus:border-blue-500 focus:ring-blue-500"
                            maxLength={1}
                            aria-label={`OTP digit ${index + 1}`}
                          />
                        ))}
                      </div>

                      {/* Verify Button */}
                      <Button
                        onClick={handleVerifyOTP}
                        disabled={otp.some((digit) => !digit) || isVerifying}
                        className="w-full py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl bg-blue-600/90 hover:bg-blue-700 text-white shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-9 sm:h-10 lg:h-12"
                      >
                        {isVerifying ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                            <span>Verifying...</span>
                          </div>
                        ) : (
                          "Verify & Continue"
                        )}
                      </Button>

                      {/* Change Number Button */}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsOtpSent(false)
                          setOtp(["", "", "", "", "", ""])
                        }}
                        className="w-full py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border-gray-300/50 hover:bg-gray-50 h-9 sm:h-10 lg:h-12"
                      >
                        Change Mobile Number
                      </Button>

                      {/* Demo OTP */}
                      <div className="text-center">
                        <span className="inline-flex items-center bg-green-100/80 text-green-800 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
                          Demo: Use OTP 123456
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards - Fixed responsive layout */}
          <div className="absolute bottom-0 left-0 right-0 z-20 transform translate-y-1/2">
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
                {config.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 lg:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div
                      className={`w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-1 xs:mb-2 sm:mb-3 lg:mb-4`}
                    >
                      <stat.icon
                        className={`h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6 ${stat.iconColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="text-xs xs:text-sm sm:text-lg lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Spacer for overlapping cards */}
        <div className="h-6 xs:h-8 sm:h-12 lg:h-16 xl:h-20 bg-gray-50"></div>

        {/* How It Works Section - Fixed responsive layout */}
        <section className="py-8 sm:py-12 lg:py-16 bg-white">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                How KaamSathi Works
              </h2>
              <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                {userIntent === "hire"
                  ? "Find and hire local workers in just 3 simple steps"
                  : "Get hired for daily wage work in just 3 simple steps"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {userIntent === "hire" ? (
                <>
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">Post Your Job</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Describe your work requirements and daily wage budget
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">
                      Review Local Workers
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">Browse profiles of workers in your area</p>
                  </div>
                  <div className="text-center sm:col-span-2 lg:col-span-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">Hire & Pay</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Connect with workers and pay for completed work
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">Create Profile</h3>
                    <p className="text-sm sm:text-base text-gray-600">Showcase your skills and work experience</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">Find Local Jobs</h3>
                    <p className="text-sm sm:text-base text-gray-600">Browse daily wage jobs in your area</p>
                  </div>
                  <div className="text-center sm:col-span-2 lg:col-span-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">Work & Earn</h3>
                    <p className="text-sm sm:text-base text-gray-600">Complete work and receive daily payments</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Carousel Section */}
        <TestimonialsCarousel />

        {/* Contact Section - Fixed responsive layout */}
        <section className="py-8 sm:py-12 lg:py-16 bg-slate-800 text-white">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Left side - Contact Info */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-6">Get in Touch</h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 lg:mb-8">
                  Have questions? We're here to help you succeed.
                </p>

                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {/* Email */}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg">Email</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-300">support@kaamsathi.com</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg">Phone</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-300">+91 98765 43210</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg">Address</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-300">Mumbai, Maharashtra, India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Contact Form */}
              <div className="bg-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 lg:mb-6">Send us a Message</h3>

                <form onSubmit={handleContactSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="contact-firstName" className="sr-only">
                        First Name
                      </label>
                      <Input
                        id="contact-firstName"
                        placeholder="First Name"
                        value={contactForm.firstName}
                        onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                        className={`bg-slate-600 border-slate-500 text-white placeholder-gray-400 text-sm sm:text-base ${contactFormErrors.firstName ? "border-red-500" : ""}`}
                        required
                        aria-invalid={!!contactFormErrors.firstName}
                        aria-describedby={contactFormErrors.firstName ? "firstName-error" : undefined}
                      />
                      {contactFormErrors.firstName && (
                        <p id="firstName-error" className="text-red-400 text-xs mt-1">
                          {contactFormErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="contact-lastName" className="sr-only">
                        Last Name
                      </label>
                      <Input
                        id="contact-lastName"
                        placeholder="Last Name"
                        value={contactForm.lastName}
                        onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                        className={`bg-slate-600 border-slate-500 text-white placeholder-gray-400 text-sm sm:text-base ${contactFormErrors.lastName ? "border-red-500" : ""}`}
                        required
                        aria-invalid={!!contactFormErrors.lastName}
                        aria-describedby={contactFormErrors.lastName ? "lastName-error" : undefined}
                      />
                      {contactFormErrors.lastName && (
                        <p id="lastName-error" className="text-red-400 text-xs mt-1">
                          {contactFormErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="sr-only">
                      Email
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className={`bg-slate-600 border-slate-500 text-white placeholder-gray-400 text-sm sm:text-base ${contactFormErrors.email ? "border-red-500" : ""}`}
                      required
                      aria-invalid={!!contactFormErrors.email}
                      aria-describedby={contactFormErrors.email ? "email-error" : undefined}
                    />
                    {contactFormErrors.email && (
                      <p id="email-error" className="text-red-400 text-xs mt-1">
                        {contactFormErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="sr-only">
                      Phone Number
                    </label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="Phone Number (10 digits)"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                      }
                      className={`bg-slate-600 border-slate-500 text-white placeholder-gray-400 text-sm sm:text-base ${contactFormErrors.phone ? "border-red-500" : ""}`}
                      required
                      maxLength={10}
                      aria-invalid={!!contactFormErrors.phone}
                      aria-describedby={contactFormErrors.phone ? "phone-error" : undefined}
                    />
                    {contactFormErrors.phone && (
                      <p id="phone-error" className="text-red-400 text-xs mt-1">
                        {contactFormErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="sr-only">
                      Your Message
                    </label>
                    <Textarea
                      id="contact-message"
                      placeholder="Your Message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className={`bg-slate-600 border-slate-500 text-white placeholder-gray-400 text-sm sm:text-base ${contactFormErrors.message ? "border-red-500" : ""}`}
                      required
                      aria-invalid={!!contactFormErrors.message}
                      aria-describedby={contactFormErrors.message ? "message-error" : undefined}
                    />
                    {contactFormErrors.message && (
                      <p id="message-error" className="text-red-400 text-xs mt-1">
                        {contactFormErrors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 rounded-lg text-sm sm:text-base"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Fixed responsive layout */}
        <footer className="bg-slate-900 text-white py-6 sm:py-8 lg:py-12">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-lg">K</span>
                  </div>
                  <span className="font-bold text-lg sm:text-xl">Kaamsathi</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Connecting skilled workers with employers across India. Find work or hire talent with ease.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a href="#how-it-works" className="hover:text-white transition-colors">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <a href="#support" className="hover:text-white transition-colors">
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">Legal</h4>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>
                    <a href="#privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#terms" className="hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#safety" className="hover:text-white transition-colors">
                      Safety Guidelines
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">For Workers</h4>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>
                    <Link href="/find-jobs" className="hover:text-white transition-colors">
                      Find Daily Jobs
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="hover:text-white transition-colors">
                      Create Profile
                    </Link>
                  </li>
                  <li>
                    <a href="#how-it-works" className="hover:text-white transition-colors">
                      How It Works
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center text-gray-400 text-xs sm:text-sm pt-4 sm:pt-6 lg:pt-8 border-t border-gray-800">
              © {new Date().getFullYear()} KaamSathi. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Users, Briefcase, ArrowRight, CheckCircle } from "lucide-react"

interface UserIntentModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (intent: "hire" | "job") => void
}

export default function UserIntentModal({ isOpen, onClose, onSelect }: UserIntentModalProps) {
  const [selectedIntent, setSelectedIntent] = useState<"hire" | "job" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const jobOptionRef = useRef<HTMLLabelElement>(null)
  const hireOptionRef = useRef<HTMLLabelElement>(null)

  // Handle selection with animation
  const handleSelection = () => {
    if (selectedIntent) {
      setIsAnimating(true)
      setTimeout(() => {
        onSelect(selectedIntent)
      }, 800)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, intent: "hire" | "job") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setSelectedIntent(intent)
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      setSelectedIntent(intent === "job" ? "hire" : "job")
      if (intent === "job") {
        hireOptionRef.current?.focus()
      } else {
        jobOptionRef.current?.focus()
      }
    }
  }

  // Auto-select when user clicks on a card
  useEffect(() => {
    if (selectedIntent) {
      const timer = setTimeout(() => {
        handleSelection()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedIntent])

  useEffect(() => {
    if (isOpen) {
      // Set initial focus to the first option when modal opens
      setTimeout(() => {
        jobOptionRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent
        className="w-[95vw] max-w-[800px] max-h-[95vh] p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
        hideCloseButton
      >
        <DialogTitle className="sr-only">
          Choose Your Intent - आपको क्या चाहिए? What are you looking for?
        </DialogTitle>
        <div className="sr-only" aria-live="polite">
          Use arrow keys to navigate between options and press Enter to select.
        </div>
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 p-6 sm:p-8 md:p-10 overflow-y-auto max-h-[95vh]">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-green-200/30 to-transparent rounded-full translate-x-20 translate-y-20"></div>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              #1 Job Platform for Bharat
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
              आपको क्या चाहिए?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 font-medium">What are you looking for?</p>
          </div>

          {/* Selection Cards */}
          <RadioGroup
            value={selectedIntent || ""}
            onValueChange={(value) => setSelectedIntent(value as "hire" | "job")}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 relative z-10"
          >
            {/* Job Seeker Option */}
            <div className="relative group">
              <Label
                ref={jobOptionRef}
                htmlFor="job-option"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, "job")}
                className={`block relative overflow-hidden rounded-2xl border-3 cursor-pointer transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  selectedIntent === "job"
                    ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-2xl scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-green-300 hover:shadow-xl"
                }`}
              >
                {/* Success Animation */}
                {selectedIntent === "job" && isAnimating && (
                  <div className="absolute inset-0 bg-green-500 flex items-center justify-center z-20 rounded-2xl">
                    <CheckCircle className="w-16 h-16 text-white animate-bounce" />
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  {/* Icon Section */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        selectedIntent === "job" ? "bg-green-500 shadow-lg" : "bg-green-100 group-hover:bg-green-200"
                      }`}
                    >
                      <Briefcase
                        className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300 ${
                          selectedIntent === "job" ? "text-white" : "text-green-600"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">मुझे काम चाहिए</h3>
                    <p className="text-lg font-semibold text-green-600">I want a Job</p>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Daily wage jobs • Construction • Delivery • Housekeeping • और भी बहुत कुछ
                    </p>
                  </div>

                  {/* Action Indicator */}
                  <div className="flex justify-center mt-6">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        selectedIntent === "job"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-700"
                      }`}
                    >
                      <span className="text-sm font-medium">Select</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Radio Button */}
                <RadioGroupItem
                  value="job"
                  id="job-option"
                  className="absolute top-4 right-4 h-6 w-6 border-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
              </Label>
            </div>

            {/* Employer Option */}
            <div className="relative group">
              <Label
                ref={hireOptionRef}
                htmlFor="hire-option"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, "hire")}
                className={`block relative overflow-hidden rounded-2xl border-3 cursor-pointer transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedIntent === "hire"
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl"
                }`}
              >
                {/* Success Animation */}
                {selectedIntent === "hire" && isAnimating && (
                  <div className="absolute inset-0 bg-blue-500 flex items-center justify-center z-20 rounded-2xl">
                    <CheckCircle className="w-16 h-16 text-white animate-bounce" />
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  {/* Icon Section */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        selectedIntent === "hire" ? "bg-blue-500 shadow-lg" : "bg-blue-100 group-hover:bg-blue-200"
                      }`}
                    >
                      <Users
                        className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300 ${
                          selectedIntent === "hire" ? "text-white" : "text-blue-600"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">मुझे मजदूर चाहिए</h3>
                    <p className="text-lg font-semibold text-blue-600">I want to Hire</p>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Skilled workers • Quick hiring • Verified profiles • Local workers
                    </p>
                  </div>

                  {/* Action Indicator */}
                  <div className="flex justify-center mt-6">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        selectedIntent === "hire"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                      }`}
                    >
                      <span className="text-sm font-medium">Select</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Radio Button */}
                <RadioGroupItem
                  value="hire"
                  id="hire-option"
                  className="absolute top-4 right-4 h-6 w-6 border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
              </Label>
            </div>
          </RadioGroup>

          {/* Footer */}
          <div className="mt-8 text-center relative z-10">
            <p className="text-sm text-gray-500 mb-2">कृपया आगे बढ़ने के लिए एक विकल्प चुनें</p>
            <p className="text-xs text-gray-400">Please select an option to continue to KaamSathi</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

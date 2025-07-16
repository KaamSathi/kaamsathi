"use client"

import { useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import SidebarLayout from "@/components/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Home } from "lucide-react"
import { mockJobs } from "@/data/mock-data"
import Link from "next/link"

export default function ApplicationSuccessPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const job = mockJobs.find((j) => j.id === jobId)
  const redirectTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
    // Redirect after 3 seconds
    redirectTimeout.current = setTimeout(() => {
      router.push("/applications")
    }, 3000)
    return () => {
      if (redirectTimeout.current) clearTimeout(redirectTimeout.current)
    }
  }, [isAuthenticated, router])

  if (!user || !job) {
    return null
  }

  return (
    <SidebarLayout>
      <div className="max-w-2xl mx-auto py-12">
        <Card className="text-center">
          <CardContent className="p-12">
            <div className="mb-6 flex flex-col items-center">
              {/* Animated checkmark */}
              <span className="relative inline-block mb-4">
                <svg className="h-16 w-16 text-green-500 animate-ping-slow absolute inset-0 opacity-50" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /></svg>
                <CheckCircle className="h-16 w-16 text-green-500 relative z-10 animate-pop" />
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
              <p className="text-gray-600">
                Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been
                successfully submitted.
              </p>
              <p className="text-sm text-gray-400 mt-2">Redirecting to Applications...</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-gray-900 mb-3">What happens next?</h2>
              <div className="space-y-2 text-sm text-gray-600 text-left">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </span>
                  <span>The employer will review your application within 2-3 business days</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </span>
                  <span>If shortlisted, you'll receive a notification and interview details</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </span>
                  <span>You can track your application status in the Applications section</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/applications">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Track Application
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <style jsx global>{`
        @keyframes pop {
          0% { transform: scale(0.7); opacity: 0.5; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-ping-slow {
          animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        }
      `}</style>
    </SidebarLayout>
  )
}

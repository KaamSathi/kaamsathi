"use client"

import { useEffect } from "react"
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
  const jobId = Number(params.id)

  const job = mockJobs.find((j) => j.id === jobId)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
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
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
              <p className="text-gray-600">
                Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been
                successfully submitted.
              </p>
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
    </SidebarLayout>
  )
}

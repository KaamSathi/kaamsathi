"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from "recharts"
import { mockJobs } from "@/data/mock-data"

// Mock data for job posting analytics
// This data would typically come from a backend API
const jobPerformanceData = [
  { date: "Jan", views: 1200, applications: 300 },
  { date: "Feb", views: 1500, applications: 350 },
  { date: "Mar", views: 1300, applications: 320 },
  { date: "Apr", views: 1800, applications: 400 },
  { date: "May", views: 2000, applications: 450 },
  { date: "Jun", views: 1700, applications: 380 },
]

// Aggregate data for individual job performance (using existing mockJobs)
const individualJobPerformance = mockJobs.slice(0, 5).map((job, index) => ({
  name: job.title,
  views: Math.floor(Math.random() * 1000) + 200, // Random views
  applications: Math.floor(Math.random() * 100) + 20, // Random applications
}))

export default function JobPostingAnalytics() {
  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--primary))", // Use primary blue
    },
    applications: {
      label: "Applications",
      color: "hsl(var(--primary) / 0.6)", // Lighter shade of primary blue
    },
  } as const

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Posting Performance Trends</CardTitle>
          <CardDescription>Monthly overview of job views and applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={jobPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="var(--color-views)" name="Views" />
              <Line type="monotone" dataKey="applications" stroke="var(--color-applications)" name="Applications" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Individual Job Performance</CardTitle>
          <CardDescription>Views and applications for your top job postings.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={individualJobPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} height={60} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="views" fill="var(--color-views)" name="Views" />
              <Bar dataKey="applications" fill="var(--color-applications)" name="Applications" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

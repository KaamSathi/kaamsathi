import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Briefcase, Clock, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface WorkerCardProps {
  worker: {
    id: number
    name: string
    avatar?: string
    location: string
    skills: string[]
    yearsOfExperience: number
    rating: number
    completedJobs: number
    hourlyRate: string
    availability: string
    isVerified: boolean
    lastActive: string
    bio: string
  }
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const lastActive = new Date(worker.lastActive)
  const timeAgo = formatDistanceToNow(lastActive, { addSuffix: true })

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden relative">
              {worker.avatar ? (
                <Image src={worker.avatar || "/placeholder.svg"} alt={worker.name} fill className="object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-xl font-bold">
                  {worker.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{worker.name}</h3>
                {worker.isVerified && (
                  <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{worker.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({worker.completedJobs})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {worker.location}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {worker.yearsOfExperience} {worker.yearsOfExperience === 1 ? "year" : "years"} experience
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {worker.availability}
              </div>
            </div>

            <p className="text-gray-700 mb-3 line-clamp-2">{worker.bio}</p>

            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {worker.skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                {worker.skills.length > 5 && <Badge variant="outline">+{worker.skills.length - 5} more</Badge>}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span>Rate: {worker.hourlyRate}</span>
                <span className="mx-2">•</span>
                <span>Last active {timeAgo}</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/workers/${worker.id}`}>
                  <Button variant="outline">View Profile</Button>
                </Link>
                <Button>Contact</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

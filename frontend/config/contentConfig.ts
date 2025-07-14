import { Users, MapPin, Building2, Briefcase, Footprints, type LucideIcon } from "lucide-react"

interface Stat {
  icon: LucideIcon
  number: string
  label: string
  color: string
  iconColor: string
}

interface IntentConfig {
  headerText: string
  headerLink: string
  loginTitle: string
  heroTitle: string
  heroSubtitle: string
  backgroundImage: string
  stats: Stat[]
}

interface ContentConfig {
  hire: IntentConfig
  job: IntentConfig
}

const contentConfig: ContentConfig = {
  hire: {
    headerText: "Looking for workers?",
    headerLink: "#for-workers", // Example link, adjust as needed
    loginTitle: "Employer Login/Signup",
    heroTitle: "Find skilled local workers",
    heroSubtitle: "Connect with verified workers in your area for daily wage jobs.",
    backgroundImage: "/images/diverse-professionals.png", // Updated image for employers
    stats: [
      { icon: Footprints, number: "3", label: "easy steps", color: "bg-orange-100", iconColor: "text-orange-500" },
      { icon: Users, number: "50K+", label: "local workers", color: "bg-blue-100", iconColor: "text-blue-500" },
      { icon: MapPin, number: "250+", label: "districts", color: "bg-red-100", iconColor: "text-red-500" },
      { icon: Building2, number: "10K+", label: "employers", color: "bg-purple-100", iconColor: "text-purple-500" },
    ],
  },
  job: {
    headerText: "Looking to hire?",
    headerLink: "#for-employers", // Example link, adjust as needed
    loginTitle: "Worker Login/Signup",
    heroTitle: "Find daily wage work near you",
    heroSubtitle: "Discover local job opportunities that match your skills.",
    backgroundImage: "/images/sewing-factory.png", // Using the other image for workers
    stats: [
      { icon: Footprints, number: "3", label: "easy steps", color: "bg-orange-100", iconColor: "text-orange-500" },
      { icon: Briefcase, number: "25K+", label: "daily jobs", color: "bg-blue-100", iconColor: "text-blue-500" },
      { icon: MapPin, number: "250+", label: "districts", color: "bg-red-100", iconColor: "text-red-500" },
      { icon: Users, number: "15K+", label: "local employers", color: "bg-purple-100", iconColor: "text-purple-500" },
    ],
  },
}

export default contentConfig

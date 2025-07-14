"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface DemoLoginButtonProps {
  role: "worker" | "employer"
  className?: string
}

export default function DemoLoginButton({ role, className = "" }: DemoLoginButtonProps) {
  const { login } = useAuth()
  const router = useRouter()

  const handleDemoLogin = () => {
    if (role === "worker") {
      login({
        id: "worker123",
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        role: "worker",
      })
    } else {
      login({
        id: "employer123",
        name: "Priya Sharma",
        phone: "+91 98765 43211",
        email: "priya@abcconstruction.com",
        role: "employer",
      })
    }

    router.push("/profile")
  }

  return (
    <Button onClick={handleDemoLogin} className={className} variant={role === "worker" ? "default" : "outline"}>
      Demo {role === "worker" ? "Worker" : "Employer"} Login
    </Button>
  )
}

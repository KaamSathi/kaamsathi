"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, Briefcase, Settings, Bell, LogOut, TrendingUp } from "lucide-react"

export default function UserDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push("/")
  }

  if (!user) return null

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          aria-label="Open user menu"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsOpen(!isOpen)
            }
          }}
        >
          {user.avatar ? (
            <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-gray-500">{user.phone}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex w-full cursor-pointer items-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.click()
                  setIsOpen(false)
                }
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          {user.role === "worker" ? (
            <DropdownMenuItem asChild>
              <Link
                href="/my-applications"
                className="flex w-full cursor-pointer items-center"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.click()
                    setIsOpen(false)
                  }
                }}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>My Applications</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link
                href="/my-jobs"
                className="flex w-full cursor-pointer items-center"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.click()
                    setIsOpen(false)
                  }
                }}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>My Job Postings</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="flex w-full cursor-pointer items-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.click()
                  setIsOpen(false)
                }
              }}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/notifications"
              className="flex w-full cursor-pointer items-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.click()
                  setIsOpen(false)
                }
              }}
            >
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="flex w-full cursor-pointer items-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.click()
                  setIsOpen(false)
                }
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface MessageNotification {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  conversationId: string
}

export default function MessageNotification() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<MessageNotification[]>([])

  useEffect(() => {
    if (user) {
      // Check for new messages periodically (in a real app, this would be WebSocket-based)
      const interval = setInterval(checkForNewMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [user])

  const checkForNewMessages = () => {
    // This would typically be a WebSocket listener or API call
    // For demo purposes, we'll simulate random notifications
    if (Math.random() < 0.1) {
      // 10% chance every 5 seconds
      const mockNotification: MessageNotification = {
        id: "notif-" + Date.now(),
        senderId: "sender-" + Math.random(),
        senderName: user?.role === "worker" ? "ABC Construction" : "Rajesh Kumar",
        content: "Hi! I have a question about the project timeline.",
        timestamp: new Date().toISOString(),
        conversationId: "conv-" + Math.random(),
      }

      setNotifications((prev) => [...prev, mockNotification])

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== mockNotification.id))
      }, 5000)
    }
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Card key={notification.id} className="w-80 shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={notification.senderAvatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {notification.senderName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 truncate">{notification.senderName}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{notification.content}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </span>
                  <Link href="/messages">
                    <Button size="sm" className="h-6 text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

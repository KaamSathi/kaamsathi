"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRealTimeMessaging } from "@/hooks/use-real-time-messaging"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, MessageSquare, Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Notification {
  id: string
  type: "message" | "system"
  title: string
  content: string
  timestamp: string
  read: boolean
  actionUrl?: string
  senderName?: string
  senderAvatar?: string
}

export default function RealTimeNotifications() {
  const { user } = useAuth()
  const { conversations } = useRealTimeMessaging()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    if (user) {
      // Check for unread messages and create notifications
      const unreadNotifications: Notification[] = []

      conversations.forEach((conv) => {
        if (conv.unreadCount > 0 && conv.lastMessage) {
          const otherParticipant = conv.participants.find((p) => p.id !== user.id)
          if (otherParticipant && conv.lastMessage.senderId !== user.id) {
            unreadNotifications.push({
              id: `msg-${conv.id}`,
              type: "message",
              title: `New message from ${otherParticipant.name}`,
              content: conv.lastMessage.content,
              timestamp: conv.lastMessage.timestamp,
              read: false,
              actionUrl: "/messages",
              senderName: otherParticipant.name,
            })
          }
        }
      })

      setNotifications(unreadNotifications)
    }
  }, [conversations, user])

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!user) return null

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <Button variant="ghost" size="sm" onClick={() => setShowNotifications(!showNotifications)} className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {notification.senderName?.charAt(0).toUpperCase() || "N"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm text-gray-900 truncate">{notification.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dismissNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{notification.content}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </span>
                          {notification.actionUrl && (
                            <Link href={notification.actionUrl}>
                              <Button size="sm" className="h-6 text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications
          .filter((n) => !n.read)
          .slice(0, 3)
          .map((notification) => (
            <Card
              key={notification.id}
              className="w-80 shadow-lg border-l-4 border-l-blue-500 animate-in slide-in-from-right"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {notification.senderName?.charAt(0).toUpperCase() || "N"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{notification.senderName || "System"}</h4>
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
                      {notification.actionUrl && (
                        <Link href={notification.actionUrl}>
                          <Button size="sm" className="h-6 text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  )
}

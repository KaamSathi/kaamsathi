"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useRealTimeMessaging } from "@/hooks/use-real-time-messaging"
import SidebarLayout from "@/components/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Circle,
  MessageSquare,
  Users,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "@/utils/date"
import type { Conversation } from "@/hooks/use-real-time-messaging"

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { conversations, messages, typingStatuses, sendMessage, loadMessages, markAsRead, setTypingStatus } =
    useRealTimeMessaging()

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const messageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      markAsRead(selectedConversation.id)
    }
  }, [selectedConversation, loadMessages, markAsRead])

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation?.id])

  useEffect(() => {
    // Auto-select first conversation if none selected
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations, selectedConversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user || isSending) return

    setIsSending(true)

    try {
      await sendMessage(selectedConversation.id, newMessage)
      setNewMessage("")
      messageInputRef.current?.focus()
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)

    if (!selectedConversation || !user) return

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Start typing indicator
    if (value.trim() && !isTyping) {
      setIsTyping(true)
      setTypingStatus(selectedConversation.id, user.id, user.name, true)
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      if (selectedConversation && user) {
        setTypingStatus(selectedConversation.id, user.id, user.name, false)
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm) return true
    const otherParticipant = conv.participants.find((p) => p.id !== user?.id)
    return (
      otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const currentMessages = selectedConversation ? messages[selectedConversation.id] || [] : []
  const currentTypingStatuses = selectedConversation
    ? typingStatuses.filter(
        (status) => status.conversationId === selectedConversation.id && status.userId !== user?.id && status.isTyping,
      )
    : []

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  if (!user) {
    return null
  }

  return (
    <SidebarLayout>
      <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg border overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Messages</h2>
              <div className="flex items-center gap-2">
                {totalUnreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {totalUnreadCount}
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const otherParticipant = conversation.participants.find((p) => p.id !== user.id)
                if (!otherParticipant) return null

                const isTypingInConv = typingStatuses.some(
                  (status) =>
                    status.conversationId === conversation.id &&
                    status.userId === otherParticipant.id &&
                    status.isTyping,
                )

                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {otherParticipant.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {otherParticipant.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{otherParticipant.name}</h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                            </span>
                          )}
                        </div>

                        {conversation.jobTitle && <p className="text-xs text-blue-600 mb-1">{conversation.jobTitle}</p>}

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {isTypingInConv ? (
                              <span className="text-blue-600 italic">typing...</span>
                            ) : (
                              conversation.lastMessage?.content || "No messages yet"
                            )}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs ml-2">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>

                        {!otherParticipant.isOnline && otherParticipant.lastSeen && (
                          <p className="text-xs text-gray-400 mt-1">
                            Last seen {formatDistanceToNow(new Date(otherParticipant.lastSeen), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search" : "Start a conversation by applying to jobs"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const otherParticipant = selectedConversation.participants.find((p) => p.id !== user.id)
                      return otherParticipant ? (
                        <>
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {otherParticipant.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {otherParticipant.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{otherParticipant.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {otherParticipant.role}
                              </Badge>
                              {selectedConversation.jobTitle && (
                                <span className="text-xs text-blue-600">• {selectedConversation.jobTitle}</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {otherParticipant.isOnline ? (
                                <span className="flex items-center gap-1">
                                  <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                                  Online
                                </span>
                              ) : otherParticipant.lastSeen ? (
                                `Last seen ${formatDistanceToNow(new Date(otherParticipant.lastSeen), { addSuffix: true })}`
                              ) : (
                                "Offline"
                              )}
                            </p>
                          </div>
                        </>
                      ) : null
                    })()}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Block User</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.senderId === user.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 ${
                          message.senderId === user.id ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        <span className="text-xs">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {message.senderId === user.id && (
                          <>
                            {message.delivered ? (
                              message.read ? (
                                <CheckCheck className="h-3 w-3 text-blue-200" />
                              ) : (
                                <CheckCheck className="h-3 w-3" />
                              )
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicators */}
                {currentTypingStatuses.map((status) => (
                  <div key={status.userId} className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{status.userName} is typing...</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      ref={messageInputRef}
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isSending}
                      className="pr-10"
                    />
                    <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}

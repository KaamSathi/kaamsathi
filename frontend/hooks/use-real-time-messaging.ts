"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  read: boolean
  delivered: boolean
  type: "text" | "file" | "system"
}

export interface Participant {
  id: string
  name: string
  role: "worker" | "employer"
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}

export interface Conversation {
  id: string
  participants: Participant[]
  lastMessage?: Message
  unreadCount: number
  jobTitle?: string
  jobId?: number
}

export interface TypingStatus {
  conversationId: string
  userId: string
  userName: string
  isTyping: boolean
  timestamp: string
}

export function useRealTimeMessaging() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [typingStatuses, setTypingStatuses] = useState<TypingStatus[]>([])
  const [isConnected, setIsConnected] = useState(true)

  const pollIntervalRef = useRef<NodeJS.Timeout>()
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({})

  // Initialize conversations and start polling
  useEffect(() => {
    if (user) {
      loadConversations()
      startPolling()
      setupStorageListener()
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      Object.values(typingTimeoutRef.current).forEach(clearTimeout)
    }
  }, [user])

  const loadConversations = useCallback(() => {
    if (!user) return

    const savedConversations = JSON.parse(localStorage.getItem("conversations") || "[]")

    if (savedConversations.length === 0) {
      const mockConversations = generateMockConversations()
      localStorage.setItem("conversations", JSON.stringify(mockConversations))
      setConversations(mockConversations)
    } else {
      setConversations(
        savedConversations.filter((conv: Conversation) => conv.participants.some((p) => p.id === user.id)),
      )
    }
  }, [user])

  const generateMockConversations = (): Conversation[] => {
    if (!user) return []

    const mockConversations: Conversation[] = []

    if (user.role === "worker") {
      mockConversations.push(
        {
          id: "conv-1",
          participants: [
            { id: user.id, name: user.name, role: "worker", isOnline: true },
            { id: "emp-1", name: "Priya Sharma", role: "employer", isOnline: true },
          ],
          lastMessage: {
            id: "msg-1",
            conversationId: "conv-1",
            senderId: "emp-1",
            senderName: "Priya Sharma",
            content:
              "Hi! I reviewed your application for the Construction Worker position. Would you be available for an interview tomorrow?",
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            read: false,
            delivered: true,
            type: "text",
          },
          unreadCount: 2,
          jobTitle: "Construction Worker",
          jobId: 1,
        },
        {
          id: "conv-2",
          participants: [
            { id: user.id, name: user.name, role: "worker", isOnline: true },
            {
              id: "emp-2",
              name: "Rajesh Kumar",
              role: "employer",
              isOnline: false,
              lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
          ],
          lastMessage: {
            id: "msg-2",
            conversationId: "conv-2",
            senderId: user.id,
            senderName: user.name,
            content: "Thank you for the opportunity. I'm very interested in this position.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: true,
            delivered: true,
            type: "text",
          },
          unreadCount: 0,
          jobTitle: "Plumber",
          jobId: 2,
        },
      )
    } else {
      mockConversations.push(
        {
          id: "conv-3",
          participants: [
            { id: user.id, name: user.name, role: "employer", isOnline: true },
            { id: "worker-1", name: "Amit Singh", role: "worker", isOnline: true },
          ],
          lastMessage: {
            id: "msg-3",
            conversationId: "conv-3",
            senderId: "worker-1",
            senderName: "Amit Singh",
            content: "Yes, I'm available tomorrow at 2 PM. Should I bring any documents?",
            timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
            read: false,
            delivered: true,
            type: "text",
          },
          unreadCount: 1,
          jobTitle: "Electrician",
          jobId: 3,
        },
        {
          id: "conv-4",
          participants: [
            { id: user.id, name: user.name, role: "employer", isOnline: true },
            {
              id: "worker-2",
              name: "Suresh Patel",
              role: "worker",
              isOnline: false,
              lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            },
          ],
          lastMessage: {
            id: "msg-4",
            conversationId: "conv-4",
            senderId: user.id,
            senderName: user.name,
            content: "Great! Looking forward to working with you on this project.",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            read: true,
            delivered: true,
            type: "text",
          },
          unreadCount: 0,
          jobTitle: "Carpenter",
          jobId: 4,
        },
      )
    }

    return mockConversations
  }

  const loadMessages = useCallback((conversationId: string) => {
    const savedMessages = JSON.parse(localStorage.getItem(`messages_${conversationId}`) || "[]")

    if (savedMessages.length === 0) {
      const mockMessages = generateMockMessages(conversationId)
      localStorage.setItem(`messages_${conversationId}`, JSON.stringify(mockMessages))
      setMessages((prev) => ({ ...prev, [conversationId]: mockMessages }))
    } else {
      setMessages((prev) => ({ ...prev, [conversationId]: savedMessages }))
    }
  }, [])

  const generateMockMessages = (conversationId: string): Message[] => {
    const conversation = conversations.find((c) => c.id === conversationId)
    if (!conversation || !user) return []

    const otherParticipant = conversation.participants.find((p) => p.id !== user.id)
    if (!otherParticipant) return []

    const mockMessages: Message[] = [
      {
        id: "msg-" + Date.now() + "-1",
        conversationId,
        senderId: otherParticipant.id,
        senderName: otherParticipant.name,
        content: `Hi ${user.name}! I saw your application for the ${conversation.jobTitle} position.`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        delivered: true,
        type: "text",
      },
      {
        id: "msg-" + Date.now() + "-2",
        conversationId,
        senderId: user.id,
        senderName: user.name,
        content: "Hello! Thank you for reaching out. I'm very interested in this opportunity.",
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        read: true,
        delivered: true,
        type: "text",
      },
      {
        id: "msg-" + Date.now() + "-3",
        conversationId,
        senderId: otherParticipant.id,
        senderName: otherParticipant.name,
        content: "Great! Could you tell me more about your experience with similar projects?",
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        read: true,
        delivered: true,
        type: "text",
      },
      {
        id: "msg-" + Date.now() + "-4",
        conversationId,
        senderId: user.id,
        senderName: user.name,
        content:
          "I have over 5 years of experience in construction and have worked on both residential and commercial projects. I'm skilled in various aspects including masonry, electrical work, and project coordination.",
        timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
        read: true,
        delivered: true,
        type: "text",
      },
    ]

    if (conversation.lastMessage) {
      mockMessages.push(conversation.lastMessage)
    }

    return mockMessages
  }

  const sendMessage = useCallback(
    async (conversationId: string, content: string): Promise<void> => {
      if (!user) return

      const message: Message = {
        id: "msg-" + Date.now(),
        conversationId,
        senderId: user.id,
        senderName: user.name,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        delivered: false,
        type: "text",
      }

      // Add message to current conversation
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), message],
      }))

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) => (conv.id === conversationId ? { ...conv, lastMessage: message } : conv)),
      )

      // Save to localStorage
      const currentMessages = JSON.parse(localStorage.getItem(`messages_${conversationId}`) || "[]")
      const updatedMessages = [...currentMessages, message]
      localStorage.setItem(`messages_${conversationId}`, JSON.stringify(updatedMessages))

      // Simulate delivery
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [conversationId]: prev[conversationId]?.map((msg) =>
            msg.id === message.id ? { ...msg, delivered: true } : msg,
          ),
        }))
      }, 500)

      // Simulate response
      setTimeout(
        () => {
          simulateResponse(conversationId)
        },
        2000 + Math.random() * 3000,
      )
    },
    [user],
  )

  const simulateResponse = useCallback(
    (conversationId: string) => {
      const conversation = conversations.find((c) => c.id === conversationId)
      if (!conversation || !user) return

      const otherParticipant = conversation.participants.find((p) => p.id !== user.id)
      if (!otherParticipant) return

      const responses = [
        "That sounds great! When would you be available to start?",
        "Perfect! I'll send you the project details shortly.",
        "Thank you for the information. Let me discuss this with my team.",
        "Excellent! We'd like to schedule an interview. Are you available this week?",
        "I appreciate your interest. I'll get back to you within 24 hours.",
        "Could you provide more details about your previous experience?",
        "The project timeline is flexible. What works best for you?",
        "I'll review your portfolio and get back to you soon.",
      ]

      const responseMessage: Message = {
        id: "msg-" + Date.now(),
        conversationId,
        senderId: otherParticipant.id,
        senderName: otherParticipant.name,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        read: false,
        delivered: true,
        type: "text",
      }

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), responseMessage],
      }))

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, lastMessage: responseMessage, unreadCount: conv.unreadCount + 1 }
            : conv,
        ),
      )

      // Save to localStorage
      const currentMessages = JSON.parse(localStorage.getItem(`messages_${conversationId}`) || "[]")
      localStorage.setItem(`messages_${conversationId}`, JSON.stringify([...currentMessages, responseMessage]))

      // Trigger notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`New message from ${otherParticipant.name}`, {
          body: responseMessage.content,
          icon: "/favicon.ico",
        })
      }
    },
    [conversations, user],
  )

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))

    setMessages((prev) => ({
      ...prev,
      [conversationId]: prev[conversationId]?.map((msg) => ({ ...msg, read: true })),
    }))
  }, [])

  const setTypingStatus = useCallback((conversationId: string, userId: string, userName: string, isTyping: boolean) => {
    const typingStatus: TypingStatus = {
      conversationId,
      userId,
      userName,
      isTyping,
      timestamp: new Date().toISOString(),
    }

    setTypingStatuses((prev) => {
      const filtered = prev.filter((status) => !(status.conversationId === conversationId && status.userId === userId))
      return isTyping ? [...filtered, typingStatus] : filtered
    })

    // Clear typing status after timeout
    if (isTyping) {
      if (typingTimeoutRef.current[`${conversationId}-${userId}`]) {
        clearTimeout(typingTimeoutRef.current[`${conversationId}-${userId}`])
      }

      typingTimeoutRef.current[`${conversationId}-${userId}`] = setTimeout(() => {
        setTypingStatuses((prev) =>
          prev.filter((status) => !(status.conversationId === conversationId && status.userId === userId)),
        )
      }, 3000)
    }
  }, [])

  const startPolling = useCallback(() => {
    pollIntervalRef.current = setInterval(() => {
      // Simulate online status updates
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          participants: conv.participants.map((participant) => ({
            ...participant,
            isOnline: Math.random() > 0.3, // 70% chance of being online
            lastSeen: !participant.isOnline ? new Date().toISOString() : participant.lastSeen,
          })),
        })),
      )

      // Clean up old typing statuses
      setTypingStatuses((prev) => prev.filter((status) => Date.now() - new Date(status.timestamp).getTime() < 5000))
    }, 10000)
  }, [])

  const setupStorageListener = useCallback(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("messages_") || e.key === "conversations") {
        loadConversations()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [loadConversations])

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  return {
    conversations,
    messages,
    typingStatuses,
    isConnected,
    sendMessage,
    loadMessages,
    markAsRead,
    setTypingStatus,
  }
}

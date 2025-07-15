"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { io, Socket } from 'socket.io-client'
import { getMessages, sendMessage as sendMessageApi, getConversations } from '@/services/api'

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

let socket: Socket | null = null

export function useRealTimeMessaging() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [typingStatuses, setTypingStatuses] = useState<TypingStatus[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!user) return

    // Connect to Socket.IO backend
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001', {
        auth: { token: localStorage.getItem('kaamsathi-token') },
        transports: ['websocket'],
      })
    }

    socket.on('connect', () => {
      setIsConnected(true)
      // Join the user's room for private messaging
      socket?.emit('join', user.id)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    // Listen for incoming messages
    socket.on('receive_message', (data: { senderId: string; message: string; timestamp: string; jobId?: string }) => {
      const { senderId, message, timestamp, jobId } = data
      const conversationId = jobId || senderId
      const newMsg: Message = {
        id: 'msg-' + Date.now(),
        conversationId,
        senderId,
        senderName: '', // Optionally fetch sender name
        content: message,
        timestamp,
        read: false,
        delivered: true,
        type: 'text',
      }
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMsg],
      }))
    })

    // Cleanup on unmount
    return () => {
      socket?.disconnect()
      socket = null
    }
  }, [user])

  const sendMessage = useCallback(
    async (conversationId: string, content: string): Promise<void> => {
      if (!user || !socket) return
      const messageData = {
        senderId: user.id,
        receiverId: conversationId, // Assuming conversationId is the receiver's userId
        message: content,
        jobId: undefined, // Add jobId if needed
      }
      socket.emit('send_message', messageData)
      // Optimistically update UI
      const newMsg: Message = {
        id: 'msg-' + Date.now(),
        conversationId,
        senderId: user.id,
        senderName: user.name,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        delivered: false,
        type: 'text',
      }
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMsg],
      }))
    },
    [user],
  )

  // Fetch conversations from backend API
  const loadConversations = useCallback(async () => {
    if (!user) return
    const token = localStorage.getItem('kaamsathi-token') || ''
    const res = await getConversations(token)
    if (res.status === 'success') {
      setConversations(res.conversations)
    }
  }, [user])

  // Fetch messages for a conversation from backend API
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user) return
    const token = localStorage.getItem('kaamsathi-token') || ''
    const res = await getMessages(conversationId, token)
    if (res.status === 'success') {
      setMessages((prev) => ({ ...prev, [conversationId]: res.messages }))
    }
  }, [user])

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))
    setMessages((prev) => ({
      ...prev,
      [conversationId]: prev[conversationId]?.map((msg) => ({ ...msg, read: true })),
    }))
  }, [])

  // Typing status logic can be implemented with additional socket events if needed
  const setTypingStatus = useCallback(() => {}, [])

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

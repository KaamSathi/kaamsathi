"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, Send } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface QuickMessageButtonProps {
  recipientId: string
  recipientName: string
  recipientRole: "worker" | "employer"
  jobTitle?: string
  jobId?: number
  className?: string
}

export default function QuickMessageButton({
  recipientId,
  recipientName,
  recipientRole,
  jobTitle,
  jobId,
  className = "",
}: QuickMessageButtonProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState(jobTitle ? `Regarding: ${jobTitle}` : "")
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return

    setIsSending(true)

    // Create new conversation
    const conversationId = `conv-${Date.now()}`
    const newConversation = {
      id: conversationId,
      participants: [
        { id: user.id, name: user.name, role: user.role, isOnline: true },
        { id: recipientId, name: recipientName, role: recipientRole, isOnline: false },
      ],
      lastMessage: {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: user.id,
        senderName: user.name,
        content: message,
        timestamp: new Date().toISOString(),
        read: false,
        type: "text" as const,
      },
      unreadCount: 0,
      jobTitle,
      jobId,
    }

    // Save conversation
    const conversations = JSON.parse(localStorage.getItem("conversations") || "[]")
    conversations.push(newConversation)
    localStorage.setItem("conversations", JSON.stringify(conversations))

    // Save initial message
    const messages = [
      {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: user.id,
        senderName: user.name,
        content: message,
        timestamp: new Date().toISOString(),
        read: false,
        type: "text" as const,
      },
    ]
    localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages))

    setIsSending(false)
    setIsOpen(false)
    setMessage("")
    setSubject(jobTitle ? `Regarding: ${jobTitle}` : "")

    // Show success message or redirect to messages
    // In a real app, you might want to redirect to the conversation
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>Start a conversation with {recipientName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {recipientName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{recipientName}</h3>
                  <p className="text-sm text-gray-500 capitalize">{recipientRole}</p>
                  {jobTitle && <p className="text-xs text-blue-600">{jobTitle}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message subject..."
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

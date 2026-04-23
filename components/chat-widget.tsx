"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { conversationAPI } from "@/lib/api"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatWidgetProps {
  onClose: () => void
}

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your health assistant. Ask me about vaccinations, disease prevention, or any health concerns.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Update initial greeting message when language changes
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your health assistant. Ask me about vaccinations, disease prevention, or any health concerns.",
        sender: "bot",
        timestamp: new Date(),
      },
    ])
  }, [language])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setLoading(true)

    try {
      if (!conversationId) {
        // Create new conversation
        const response = await conversationAPI.create({
          message: currentInput,
          category: "general",
        })

        if (response.data?.conversation) {
          setConversationId(response.data.conversation._id)
          
          // Poll for bot response
          setTimeout(async () => {
            const convResponse = await conversationAPI.getById(response.data.conversation._id)
            if (convResponse.data?.conversation) {
              const botMessages = convResponse.data.conversation.messages.filter(
                (m: any) => m.sender === 'bot'
              )
              if (botMessages.length > 0) {
                const latestBot = botMessages[botMessages.length - 1]
                const botMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  text: latestBot.content,
                  sender: "bot",
                  timestamp: new Date(latestBot.timestamp),
                }
                setMessages((prev) => [...prev, botMessage])
              }
            }
            setLoading(false)
          }, 1500)
        } else {
          throw new Error("Failed to create conversation")
        }
      } else {
        // Add message to existing conversation
        const response = await conversationAPI.addMessage(conversationId, currentInput, 'user')
        
        if (response.data) {
          // Poll for bot response
          setTimeout(async () => {
            const convResponse = await conversationAPI.getById(conversationId)
            if (convResponse.data?.conversation) {
              const botMessages = convResponse.data.conversation.messages.filter(
                (m: any) => m.sender === 'bot'
              )
              if (botMessages.length > 0) {
                const latestBot = botMessages[botMessages.length - 1]
                const botMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  text: latestBot.content,
                  sender: "bot",
                  timestamp: new Date(latestBot.timestamp),
                }
                setMessages((prev) => [...prev, botMessage])
              }
            }
            setLoading(false)
          }, 1500)
        } else {
          throw new Error("Failed to send message")
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className="w-96 h-96 flex flex-col shadow-xl rounded-lg border-border">
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
          <div>
            <h3 className="font-bold">{t("askAboutHealth") ? "Health Assistant" : "Health Assistant"}</h3>
            <p className="text-sm opacity-90">Always here to help</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-primary-foreground hover:bg-primary/90">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4 flex gap-2">
          <Input
            placeholder={t("typeMessage")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

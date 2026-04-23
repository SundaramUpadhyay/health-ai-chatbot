"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Send, Loader2, Upload, Image as ImageIcon, Camera, Pill, MessageSquare, Paperclip } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { conversationAPI } from "@/lib/api"
import Image from "next/image"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  image?: string
  diagnosis?: {
    disease: string
    confidence: number
    prescription: string[]
    recommendations: string[]
    lowConfidence?: boolean
  }
}

interface AIHealthChatProps {
  onClose: () => void
  fullPage?: boolean
}

export default function AIHealthChat({ onClose, fullPage = false }: AIHealthChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Health Assistant.\n\nI can help you with:\n• Symptom analysis\n• Medicine advice\n• Skin disease detection from images\n\nHow can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("chat")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(() => scrollToBottom(), [messages])

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = "unset" } }, [])

  // -----------------------------
  // IMAGE UPLOAD
  // -----------------------------
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.")
      return
    }

    setSelectedImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)

    setActiveTab("image")
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const triggerFileInput = () => {
    const input = document.getElementById("image-file-input") as HTMLInputElement
    input?.click()
  }

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 45000) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }
  }

  // -----------------------------
  // AI IMAGE ANALYSIS (with LOW CONFIDENCE handling)
  // -----------------------------
  const analyzeDiseaseImage = async (imageBase64: string): Promise<any> => {
    try {
      let response: Response | null = null
      let errorMessage = "Failed to analyze image"

      for (let attempt = 1; attempt <= 2; attempt++) {
        response = await fetchWithTimeout("/api/ai/analyze-disease", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ image: imageBase64 }),
        }, 50000)

        if (response.ok) {
          return await response.json()
        }

        let errorData: any = null
        try {
          errorData = await response.json()
        } catch {
          errorData = null
        }

        errorMessage = errorData?.details || errorData?.error || `Image analysis failed (${response.status})`
        const shouldRetry = response.status === 503 || response.status === 504

        if (attempt < 2 && shouldRetry) {
          await wait(3000)
          continue
        }

        break
      }

      return {
        error: true,
        message: errorMessage,
      }
    } catch (error) {
      console.error("Image analysis error:", error)

      return {
        error: true,
        message: "Image analysis service is temporarily unavailable. Please try again.",
      }
    }
  }

  // -----------------------------
  // AI TEXT CHAT FALLBACK
  // -----------------------------
  const getAIMedicineAdvice = async (query: string): Promise<string> => {
    try {
      const response = await fetchWithTimeout("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: query }),
      }, 50000)

      if (!response.ok) {
        let errorMessage = "Chat API failed"
        try {
          const errorData = await response.json()
          errorMessage = errorData?.details || errorData?.error || errorMessage
        } catch {
          // Ignore response parsing errors and keep generic message
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("AI chat error:", error)
      if (error instanceof Error && error.name === "AbortError") {
        return "The AI server is taking too long to respond. It may be waking up from inactivity. Please try again in 30-60 seconds."
      }

      return "I'm having trouble responding right now. Please try again."
    }
  }

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return

    setLoading(true)

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input || "Please analyze this image.",
        sender: "user",
        timestamp: new Date(),
        image: imagePreview || undefined,
      }

      setMessages(prev => [...prev, userMessage])
      const userInputMemory = input
      setInput("")

      let botResponse: Message

      // -----------------------------
      // IMAGE MODE
      // -----------------------------
      if (selectedImage && imagePreview) {
        const diagnosis = await analyzeDiseaseImage(imagePreview)

        if (diagnosis?.error) {
          botResponse = {
            id: (Date.now() + 1).toString(),
            text:
              `⚠️ Image analysis is temporarily unavailable.\n\n` +
              `${diagnosis.message || "Please try again in a moment."}`,
            sender: "bot",
            timestamp: new Date(),
          }

          removeImage()
          setActiveTab("chat")
          setMessages(prev => [...prev, botResponse])
          setLoading(false)
          return
        }

        const normalizedDisease = String(diagnosis.disease || "").toLowerCase()
        const isLow = diagnosis.confidence < 0.30 || normalizedDisease === "unknown"

        if (isLow) {
          botResponse = {
            id: (Date.now() + 1).toString(),
            text:
              `⚠️ The AI could not confidently detect a known skin disease.\n\n` +
              `**Confidence:** ${(diagnosis.confidence * 100).toFixed(1)}%\n\n` +
              `Reasons might include:\n` +
              `• Blurry/unclear image\n` +
              `• Poor lighting\n` +
              `• Condition not in database\n\n` +
              `👉 Please upload a clearer close-up image.`,
            sender: "bot",
            timestamp: new Date(),
            diagnosis: {
              disease: "Unknown Condition",
              confidence: diagnosis.confidence,
              prescription: [],
              recommendations: [
                "Retake the image with better lighting",
                "Ensure skin area is centered and focused",
                "Avoid shadow or blurry images",
                "Consult a dermatologist for accuracy",
              ],
              lowConfidence: true,
            },
          }

        } else {
          // Show result even with moderate confidence
          const confidenceWarning = diagnosis.confidence < 0.60 
            ? `\n\n⚠️ **Note:** Moderate confidence. Please verify with a healthcare professional.` 
            : '';
          
          botResponse = {
            id: (Date.now() + 1).toString(),
            text:
              `Based on the image:\n\n**Diagnosis:** ${diagnosis.disease}\n` +
              `**Confidence:** ${(diagnosis.confidence * 100).toFixed(1)}%${confidenceWarning}`,
            sender: "bot",
            timestamp: new Date(),
            diagnosis,
          }
        }

        removeImage()
        setActiveTab("chat")
      }

      // -----------------------------
      // TEXT MODE
      // -----------------------------
      else {
        const aiResponse = await getAIMedicineAdvice(userInputMemory)
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: "bot",
          timestamp: new Date(),
        }
      }

      setMessages(prev => [...prev, botResponse])

      // Stop loader as soon as user gets the bot response.
      setLoading(false)

      // Save chat in background so network slowness does not block UI.
      ;(async () => {
        try {
          if (!conversationId) {
            const response = await conversationAPI.create({
              message: userInputMemory || "Image analysis request",
              category: "health-ai",
            })
            if (response.data?.conversation) {
              setConversationId(response.data.conversation._id)
            }
          } else {
            await conversationAPI.addMessage(conversationId, userInputMemory || "Image analysis", 'user')
          }
        } catch (saveError) {
          console.error("Conversation save error:", saveError)
        }
      })()

      return

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: "err",
          text: "Something went wrong. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }

    setLoading(false)
  }

  const quickActions = [
    { label: "Fever advice", query: "I have fever, what should I do?" },
    { label: "Cold & cough", query: "How to treat a cold?" },
    { label: "Headache relief", query: "What is best for headache?" },
    { label: "Upload image", action: () => triggerFileInput() },
  ]

  // -----------------------------
  // UI RETURN
  // -----------------------------
  return (
    <div className={fullPage ? "min-h-screen bg-background" : "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4 overflow-hidden"}>

      <input type="file" accept="image/*" id="image-file-input" onChange={handleImageSelect} style={{ display: "none" }} />

      <Card className={fullPage ? "w-full h-screen flex flex-col border-0" : "w-full max-w-5xl h-[95vh] flex flex-col"}>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between">
          <div className="flex gap-3">
            <Pill className="w-6 h-6" />
            <div>
              <h3 className="font-bold">AI Health Assistant</h3>
              <p className="text-xs opacity-80">Chat • Diagnosis • Prescription</p>
            </div>
          </div>

          {!fullPage && (
            <Button variant="ghost" onClick={onClose} className="text-white">
              <X />
            </Button>
          )}
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsList className="grid grid-cols-2 mx-4 mt-4 shrink-0">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="image">Image Analysis</TabsTrigger>
          </TabsList>

          {/* CHAT TAB */}
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden min-h-0">

            <ScrollArea className="flex-1 px-4 py-3 overflow-y-auto">
              <div className="space-y-3">
                {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-3`}>
                  <div className="max-w-[80%]">

                    <div className={`p-3 rounded-lg ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-black"}`}>

                      {msg.image && (
                        <Image src={msg.image} alt="User" width={260} height={150} className="rounded mb-2" />
                      )}

                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                      {/* LOW CONFIDENCE BADGE */}
                      {msg.diagnosis?.lowConfidence && (
                        <Badge className="bg-yellow-500 text-white mt-2">Low Confidence Result</Badge>
                      )}

                      {/* PRESCRIPTION & ADVICE */}
                      {msg.diagnosis && msg.diagnosis.prescription.length > 0 && (
                        <div className="mt-3 border-t pt-2 text-xs">
                          <p className="font-bold mb-1">💊 Prescription:</p>
                          {msg.diagnosis.prescription.map((p, i) => (
                            <p key={i}>• {p}</p>
                          ))}

                          <p className="font-bold mt-2 mb-1">📋 Recommendations:</p>
                          {msg.diagnosis.recommendations.map((r, i) => (
                            <p key={i}>• {r}</p>
                          ))}
                        </div>
                      )}

                      {/* RECOMMENDATIONS ONLY (for low confidence) */}
                      {msg.diagnosis && msg.diagnosis.prescription.length === 0 && msg.diagnosis.recommendations.length > 0 && (
                        <div className="mt-3 border-t pt-2 text-xs">
                          <p className="font-bold mb-1">📋 Recommendations:</p>
                          {msg.diagnosis.recommendations.map((r, i) => (
                            <p key={i}>• {r}</p>
                          ))}
                        </div>
                      )}

                      <span className="text-[10px] opacity-60 block mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

                {loading && (
                  <div className="flex justify-start">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* QUICK ACTIONS */}
            <div className="px-4 py-2 border-t bg-white flex gap-2 flex-wrap shrink-0">
              {quickActions.map((q, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="outline"
                  onClick={() => q.action ? q.action() : setInput(q.query || "")}
                >
                  {q.label}
                </Button>
              ))}
            </div>

            {/* INPUT */}
            <div className="border-t p-3 flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={triggerFileInput}>
                <Paperclip />
              </Button>

              <Input
                placeholder="Type your health question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
              />

              <Button onClick={handleSend} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
            </div>

          </TabsContent>

          {/* IMAGE TAB */}
          <TabsContent value="image" className="flex-1 p-6 flex flex-col items-center justify-center">

            {!imagePreview ? (
              <div className="text-center">
                <ImageIcon className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">Upload a clear picture of the affected skin area</p>
                <Button className="bg-blue-600" onClick={triggerFileInput}>
                  <Upload className="mr-2" /> Choose Image
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Image src={imagePreview} alt="Preview" width={300} height={200} className="rounded shadow mb-4" />

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={removeImage}>Remove</Button>
                  <Button className="bg-blue-600" onClick={handleSend} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Camera className="mr-2" />}
                    Analyze Disease
                  </Button>
                </div>
              </div>
            )}

          </TabsContent>
        </Tabs>

        <div className="text-center text-[11px] py-2 bg-yellow-50 border-t text-yellow-700">
          ⚠️ AI cannot replace medical professionals. Seek urgent care if symptoms worsen.
        </div>

      </Card>
    </div>
  )
}

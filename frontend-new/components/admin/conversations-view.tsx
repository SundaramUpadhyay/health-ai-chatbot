"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Flag } from "lucide-react"

const conversations = [
  {
    id: 1,
    user: "Rajesh Kumar",
    channel: "WhatsApp",
    topic: "Vaccination Schedule",
    status: "resolved",
    confidence: 95,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    user: "Priya Sharma",
    channel: "SMS",
    topic: "COVID-19 Symptoms",
    status: "escalated",
    confidence: 62,
    timestamp: "15 minutes ago",
  },
  {
    id: 3,
    user: "Amit Patel",
    channel: "Web",
    topic: "Fever Treatment",
    status: "pending_review",
    confidence: 78,
    timestamp: "5 minutes ago",
  },
]

export default function ConversationsView() {
  return (
    <div className="space-y-4 ml-64">
      <h2 className="text-2xl font-bold text-foreground">Recent Conversations</h2>

      {conversations.map((conv) => (
        <Card key={conv.id} className="border-border hover:border-primary/50 transition">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{conv.user}</h3>
                <p className="text-sm text-muted-foreground mt-1">{conv.topic}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {conv.channel}
                  </Badge>
                  <Badge
                    className={`text-xs ${
                      conv.status === "resolved"
                        ? "bg-accent text-white"
                        : conv.status === "escalated"
                          ? "bg-destructive text-white"
                          : "bg-secondary text-white"
                    }`}
                  >
                    {conv.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Confidence: {conv.confidence}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{conv.timestamp}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

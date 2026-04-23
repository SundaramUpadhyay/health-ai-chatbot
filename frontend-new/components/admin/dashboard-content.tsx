"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Activity, MessageSquare, Users, TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

const chartData = [
  { name: "Mon", messages: 240, accuracy: 85 },
  { name: "Tue", messages: 350, accuracy: 88 },
  { name: "Wed", messages: 280, accuracy: 82 },
  { name: "Thu", messages: 420, accuracy: 90 },
  { name: "Fri", messages: 510, accuracy: 89 },
  { name: "Sat", messages: 480, accuracy: 92 },
  { name: "Sun", messages: 390, accuracy: 88 },
]

export default function DashboardContent() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const kpis = [
    { icon: Activity, label: t("activeUsers"), value: "12,584", change: "+8.2%" },
    { icon: MessageSquare, label: t("messagesToday"), value: "2,847", change: "+12.5%" },
    { icon: Users, label: t("newRegistrations"), value: "428", change: "+5.1%" },
    { icon: TrendingUp, label: t("accuracyRate"), value: "88.3%", change: "+2.1%" },
  ]

  return (
    <div className="space-y-6 ml-64">
      <div className="grid md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <Card key={i} className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {kpi.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <p className="text-xs text-accent mt-2">{kpi.change} {t("fromLastWeek")}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>{t("messagesAndEngagement")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="messages" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>{t("answerAccuracyByDay")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Top Health Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Vaccination Info", "Cold & Flu", "COVID-19", "Nutrition", "Mental Health"].map((topic, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-foreground">{topic}</span>
                <div className="w-32 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${90 - i * 12}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

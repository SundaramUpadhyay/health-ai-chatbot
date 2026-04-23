"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FeaturesSection from "@/components/features-section"
import HowItWorks from "@/components/how-it-works"
import Footer from "@/components/footer"
import AIHealthChat from "@/components/ai-health-chat"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes"
import LanguageSelector from "@/components/language-selector"
import ThemeToggle from "@/components/theme-toggle"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"
import { User, LogOut, MessageSquare, Bell, Settings, AlertTriangle, CheckCircle, Info, X, MapPin, Clock, Maximize2 } from "lucide-react"

export default function UserDashboard() {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [chatOpen, setChatOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      title: "Flu Outbreak Alert",
      message: "Increased flu cases reported in your area. Consider getting vaccinated.",
      location: "Mumbai, Maharashtra",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "info",
      title: "Vaccination Reminder",
      message: "Your annual health checkup is due next week.",
      time: "1 day ago",
      read: false
    },
    {
      id: 3,
      type: "success",
      title: "Health Tip",
      message: "Stay hydrated! Drink at least 8 glasses of water daily.",
      time: "2 days ago",
      read: true
    },
    {
      id: 4,
      type: "warning",
      title: "Weather Alert",
      message: "High pollution levels detected. Avoid outdoor activities.",
      location: "Delhi NCR",
      time: "3 days ago",
      read: true
    },
    {
      id: 5,
      type: "info",
      title: "New Feature",
      message: "AI Health Assistant now supports voice commands!",
      time: "5 days ago",
      read: true
    }
  ])
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsAlerts: true,
    locationServices: true,
    healthReminders: true,
    darkMode: false,
    language: "en"
  })

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(storedUser)
    if (userData.role !== "user") {
      router.push("/login")
      return
    }

    setUser(userData)

    const savedLanguage = localStorage.getItem("app-language")
    if (savedLanguage) {
      setSettings((prev) => ({ ...prev, language: savedLanguage }))
    }

    setSettings((prev) => ({ ...prev, darkMode: resolvedTheme === "dark" }))
  }, [router, resolvedTheme])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const updateSetting = (key: string, value: boolean | string) => {
    if (key === "darkMode" && typeof value === "boolean") {
      setTheme(value ? "dark" : "light")
    }

    if (key === "language" && typeof value === "string") {
      localStorage.setItem("app-language", value)
      document.documentElement.lang = value
    }

    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    // Save settings to backend/localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings))
    alert("Settings saved successfully!")
    setSettingsOpen(false)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* User Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            <span className="font-semibold">{t("userDashboard")}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">{t("welcome")}, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </header>

      {/* User Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("activeChats")}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">{t("activeConversations")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("notifications")}</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">{t("unreadAlerts")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("accountStatus")}</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t("active")}</div>
              <p className="text-xs text-muted-foreground">{t("allSystemsOperational")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
            <CardDescription>{t("accessYourMostUsedFeatures")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={() => setChatOpen(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              {t("startChat")}
            </Button>
            <Button onClick={() => router.push('/chat')}>
              <Maximize2 className="h-4 w-4 mr-2" />
              {t("openFullPageChat")}
            </Button>
            <Button variant="outline" onClick={() => setAlertsOpen(true)}>
              <Bell className="h-4 w-4 mr-2" />
              {t("viewAlerts")} {unreadCount > 0 && <Badge className="ml-2" variant="destructive">{unreadCount}</Badge>}
            </Button>
            <Button variant="outline" onClick={() => setSettingsOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              {t("settings")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Features */}
      <FeaturesSection />
      <HowItWorks />
      <Footer />

      {/* AI Health Chat */}
      {chatOpen && <AIHealthChat onClose={() => setChatOpen(false)} />}

      {/* Alerts Dialog */}
      <Dialog open={alertsOpen} onOpenChange={setAlertsOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span>{t("notificationsAndAlerts")}</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  {t("markAllAsRead")}
                </Button>
              )}
            </DialogTitle>
            <DialogDescription>
              {t("stayUpdatedWithHealthAlerts")}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(85vh-140px)] px-6 pb-6">
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t("noNotificationsYet")}</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {notification.type === "warning" && (
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                          )}
                          {notification.type === "info" && (
                            <Info className="h-5 w-5 text-blue-500" />
                          )}
                          {notification.type === "success" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          {!notification.read && (
                            <Badge variant="default" className="ml-2">New</Badge>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {notification.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {notification.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {notification.time}
                        </div>
                      </div>
                      {!notification.read && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="mt-2 p-0 h-auto"
                          onClick={() => markAsRead(notification.id)}
                        >
                          {t("markAsRead")}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("settings")}</DialogTitle>
            <DialogDescription>
              {t("manageYourAccountPreferences")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Profile Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("profileInformation")}</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("fullName")}</Label>
                  <Input id="name" defaultValue={user?.name || ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive health alerts via email</p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get emergency alerts via SMS</p>
                  </div>
                  <Switch 
                    checked={settings.smsAlerts}
                    onCheckedChange={(checked) => updateSetting("smsAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Location Services</Label>
                    <p className="text-sm text-muted-foreground">Enable geo-targeted health alerts</p>
                  </div>
                  <Switch 
                    checked={settings.locationServices}
                    onCheckedChange={(checked) => updateSetting("locationServices", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Health Reminders</Label>
                    <p className="text-sm text-muted-foreground">Vaccination and checkup reminders</p>
                  </div>
                  <Switch 
                    checked={settings.healthReminders}
                    onCheckedChange={(checked) => updateSetting("healthReminders", checked)}
                  />
                </div>
              </div>
            </div>

            {/* App Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">App Preferences</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={settings.language}
                    onChange={(e) => updateSetting("language", e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="te">Telugu</option>
                    <option value="ta">Tamil</option>
                    <option value="mr">Marathi</option>
                  </select>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveSettings}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

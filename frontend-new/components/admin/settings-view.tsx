"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { toast } from "sonner"

export default function SettingsView() {
  const [settings, setSettings] = useState({
    siteName: "HealthAI",
    emailNotifications: true,
    smsNotifications: false,
    autoReportGeneration: true,
    confidenceThreshold: 40,
    maxMessagesPerDay: 1000,
  })

  const handleSave = () => {
    // Save settings logic here
    toast.success("Settings saved successfully!")
  }

  return (
    <div className="space-y-6 ml-64">
      <h2 className="text-2xl font-bold text-foreground">System Settings</h2>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="confidenceThreshold">AI Confidence Threshold (%)</Label>
            <Input
              id="confidenceThreshold"
              type="number"
              min="0"
              max="100"
              value={settings.confidenceThreshold}
              onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseInt(e.target.value) })}
            />
            <p className="text-sm text-muted-foreground">
              Minimum confidence required for AI predictions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMessages">Max Messages Per Day</Label>
            <Input
              id="maxMessages"
              type="number"
              value={settings.maxMessagesPerDay}
              onChange={(e) => setSettings({ ...settings, maxMessagesPerDay: parseInt(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts for important events
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive SMS alerts for critical issues
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Automation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Report Generation</Label>
              <p className="text-sm text-muted-foreground">
                Automatically generate weekly reports
              </p>
            </div>
            <Switch
              checked={settings.autoReportGeneration}
              onCheckedChange={(checked) => setSettings({ ...settings, autoReportGeneration: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}

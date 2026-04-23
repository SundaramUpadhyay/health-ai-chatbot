"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function ProfileView() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    department: "",
    joined: "",
  })

  useEffect(() => {
    // Load user profile from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "admin",
        phone: userData.phone || "",
        department: userData.department || "Administration",
        joined: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A",
      })
    }
  }, [])

  const handleSave = () => {
    // Save profile changes
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      const updatedUser = {
        ...userData,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        department: profile.department,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      toast.success("Profile updated successfully!")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6 ml-64">
      <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" alt={profile.name} />
              <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                JPG, PNG or GIF. Max size 2MB
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={profile.role} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="joined">Joined Date</Label>
              <Input id="joined" value={profile.joined} disabled className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>

          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}

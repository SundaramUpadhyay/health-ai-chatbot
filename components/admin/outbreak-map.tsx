"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const outbreaks = [
  { district: "Jaipur", disease: "Dengue", cases: "234", severity: "high", registeredUsers: "1,240" },
  { district: "Mumbai", disease: "Flu", cases: "156", severity: "medium", registeredUsers: "2,840" },
  { district: "Delhi", disease: "COVID-19", cases: "89", severity: "low", registeredUsers: "3,120" },
]

export default function OutbreakMap() {
  return (
    <div className="space-y-6 ml-64">
      <h2 className="text-2xl font-bold text-foreground">Outbreak Alerts Map</h2>

      <div className="bg-white rounded-lg p-8 border border-border text-center text-muted-foreground h-96 flex items-center justify-center">
        <div>
          <p className="text-lg font-semibold text-foreground mb-2">Geographic Outbreak Map</p>
          <p>Interactive map visualization would go here with outbreak hotspots and alert zones</p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Active Outbreaks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outbreaks.map((outbreak, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-bold text-foreground">{outbreak.district}</h4>
                  <p className="text-sm text-muted-foreground">{outbreak.disease}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">{outbreak.cases}</div>
                  <Badge
                    className={`mt-1 ${
                      outbreak.severity === "high"
                        ? "bg-destructive"
                        : outbreak.severity === "medium"
                          ? "bg-secondary"
                          : "bg-accent"
                    }`}
                  >
                    {outbreak.severity}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Registered Users</p>
                  <p className="text-lg font-bold text-primary">{outbreak.registeredUsers}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

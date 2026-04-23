"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, Filter } from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const allReports = [
  {
    id: 1,
    name: "Weekly Summary Report",
    date: new Date("2024-11-01"),
    messages: "2,847",
    users: "1,284",
    accuracy: "88.3%",
  },
  {
    id: 2,
    name: "Impact Report - Vaccinations",
    date: new Date("2024-10-25"),
    messages: "892",
    users: "412",
    accuracy: "91.2%",
  },
  {
    id: 3,
    name: "Awareness Uplift Analysis",
    date: new Date("2024-10-18"),
    messages: "3,120",
    users: "1,856",
    accuracy: "86.9%",
  },
  {
    id: 4,
    name: "Monthly Health Trends",
    date: new Date("2024-10-01"),
    messages: "5,240",
    users: "2,341",
    accuracy: "87.5%",
  },
  {
    id: 5,
    name: "Disease Prevention Campaign",
    date: new Date("2024-09-20"),
    messages: "1,560",
    users: "892",
    accuracy: "90.1%",
  },
]

export default function ReportsView() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [filteredReports, setFilteredReports] = useState(allReports)

  const handleDateRangeSelect = (from: Date | undefined, to: Date | undefined) => {
    setDateRange({ from, to })
    
    if (from && to) {
      const filtered = allReports.filter((report) => {
        return report.date >= from && report.date <= to
      })
      setFilteredReports(filtered)
    } else {
      setFilteredReports(allReports)
    }
  }

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined })
    setFilteredReports(allReports)
  }

  return (
    <div className="space-y-6 ml-64">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Reports</h2>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn(dateRange.from && "text-primary")}>
                <Calendar className="w-4 h-4 mr-2" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                    value={dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined
                      handleDateRangeSelect(date, dateRange.to)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                    value={dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined
                      handleDateRangeSelect(dateRange.from, date)
                    }}
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={clearDateRange}>
                  Clear Range
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">No reports found for the selected date range.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={clearDateRange}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{format(report.date, "MMM dd, yyyy")}</p>
                    <div className="flex gap-6 mt-3 text-sm">
                      <span className="text-muted-foreground">
                        Messages: <strong className="text-foreground">{report.messages}</strong>
                      </span>
                      <span className="text-muted-foreground">
                        Users: <strong className="text-foreground">{report.users}</strong>
                      </span>
                      <span className="text-muted-foreground">
                        Accuracy: <strong className="text-accent">{report.accuracy}</strong>
                      </span>
                    </div>
                  </div>
                  <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

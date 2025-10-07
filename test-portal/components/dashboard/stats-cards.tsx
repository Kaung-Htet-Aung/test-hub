"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileCheck, Clock } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total Participants",
      value: "150",
      icon: Users,
      change: "+12%",
      period: "vs last month"
    },
    {
      title: "Active Tests",
      value: "5",
      icon: FileCheck,
      change: "+2",
      period: "new this week"
    },
    {
      title: "Upcoming Tests",
      value: "3",
      icon: Clock,
      change: "-1",
      period: "from last week"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {stat.value}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${
                stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-500">
                {stat.period}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
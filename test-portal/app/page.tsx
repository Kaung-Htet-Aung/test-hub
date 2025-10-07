"use client"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentResults } from "@/components/dashboard/recent-results"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  Download,
  Calendar,
  Filter
} from "lucide-react"

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedTest, setSelectedTest] = useState("all")

  // Mock data for analytics
  const analyticsData = {
    overview: {
      totalTests: 156,
      activeUsers: 89,
      avgScore: 82,
      completionRate: 94
    },
    performance: [
      { name: "John Doe", score: 92, tests: 12, avgTime: "15m" },
      { name: "Jane Smith", score: 88, tests: 10, avgTime: "18m" },
      { name: "Michael Brown", score: 85, tests: 8, avgTime: "22m" },
      { name: "Emily Johnson", score: 90, tests: 15, avgTime: "14m" }
    ],
    testStats: [
      { name: "Math Assessment", participants: 45, avgScore: 78, completion: 88 },
      { name: "Programming Test", participants: 32, avgScore: 85, completion: 92 },
      { name: "English Proficiency", participants: 28, avgScore: 82, completion: 95 },
      { name: "Logic Reasoning", participants: 38, avgScore: 80, completion: 90 }
    ],
    trends: {
      daily: [65, 72, 78, 82, 85, 88, 92],
      weekly: [70, 75, 80, 82, 85],
      monthly: [75, 78, 80, 82, 84, 86]
    }
  }

  const actions = (
    <div className="flex items-center gap-3">
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-32 bg-gray-900 border-gray-800 text-gray-100">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-800">
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
          <SelectItem value="1y">Last year</SelectItem>
        </SelectContent>
      </Select>
      <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  )

  return (
    <PageLayout 
      title="Dashboard"
      description="Overview and analytics for your testing platform"
      actions={actions}
    >
      {/* Stats Overview - Combining dashboard and analytics stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">{analyticsData.overview.totalTests}</div>
            <p className="text-xs text-gray-500">+12% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">{analyticsData.overview.activeUsers}</div>
            <p className="text-xs text-gray-500">+8% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Average Score</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">{analyticsData.overview.avgScore}%</div>
            <p className="text-xs text-gray-500">+3% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">{analyticsData.overview.completionRate}%</div>
            <p className="text-xs text-gray-500">+2% from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Dashboard Layout and Analytics Tabs */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-4 lg:space-y-6">
          {/* Recent Results - Full Width */}
          <RecentResults />

          {/* Analytics Tabs */}
          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList className="bg-gray-900 border-gray-800 w-full sm:w-auto">
              <TabsTrigger value="performance" className="text-gray-300 data-[state=active]:bg-gray-800">
                Performance
              </TabsTrigger>
              <TabsTrigger value="tests" className="text-gray-300 data-[state=active]:bg-gray-800">
                Test Analytics
              </TabsTrigger>
              <TabsTrigger value="trends" className="text-gray-300 data-[state=active]:bg-gray-800">
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Performers */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-light text-gray-100">Top Performers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analyticsData.performance.map((performer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-300">
                            {performer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-100">{performer.name}</div>
                            <div className="text-xs text-gray-400">{performer.tests} tests</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-100">{performer.score}%</div>
                          <div className="text-xs text-gray-400">{performer.avgTime}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Performance Distribution */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-light text-gray-100">Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">90-100% (Excellent)</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">24</Badge>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">80-89% (Good)</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">38</Badge>
                      </div>
                      <Progress value={38} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">70-79% (Average)</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">28</Badge>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Below 70% (Needs Improvement)</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">10</Badge>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tests" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Select value={selectedTest} onValueChange={setSelectedTest}>
                  <SelectTrigger className="w-48 bg-gray-900 border-gray-800 text-gray-100">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select test" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Tests</SelectItem>
                    <SelectItem value="math">Math Assessment</SelectItem>
                    <SelectItem value="programming">Programming Test</SelectItem>
                    <SelectItem value="english">English Proficiency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {analyticsData.testStats.map((test, index) => (
                  <Card key={index} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-100">{test.name}</h3>
                          <p className="text-sm text-gray-400">{test.participants} participants</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-light text-gray-100">{test.avgScore}%</div>
                          <div className="text-sm text-gray-400">Average Score</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Completion Rate</span>
                          <span className="text-sm text-gray-300">{test.completion}%</span>
                        </div>
                        <Progress value={test.completion} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-light text-gray-100">Score Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Last 7 days</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-green-400">+7%</span>
                        </div>
                      </div>
                      <div className="h-32 bg-gray-800 rounded-lg flex items-end justify-around p-4">
                        {analyticsData.trends.daily.map((value, index) => (
                          <div
                            key={index}
                            className="w-8 bg-gray-700 rounded-t"
                            style={{ height: `${(value / 100) * 80}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-light text-gray-100">Activity Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Tests Completed</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">156</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Active Sessions</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">23</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Avg. Time per Test</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">18m</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Peak Hours</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">2-4 PM</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="col-span-12 lg:col-span-4 space-y-4 lg:space-y-6">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Recent Activity */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-light text-gray-100">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-100">New test completed</div>
                    <div className="text-xs text-gray-400">John Doe finished Math Assessment</div>
                    <div className="text-xs text-gray-500 mt-1">2 minutes ago</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-100">Participant added</div>
                    <div className="text-xs text-gray-400">Jane Smith joined Programming Test</div>
                    <div className="text-xs text-gray-500 mt-1">15 minutes ago</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-100">Test generated</div>
                    <div className="text-xs text-gray-400">Auto-generated 10 questions for English Test</div>
                    <div className="text-xs text-gray-500 mt-1">1 hour ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </PageLayout>
  )
}
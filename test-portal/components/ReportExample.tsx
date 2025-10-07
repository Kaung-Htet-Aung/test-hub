"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Download, 
  Share, 
  Mail, 
  Calendar, 
  Users, 
  BarChart3, 
  TrendingUp,
  Clock,
  CheckCircle,
  Award,
  Target,
  BookOpen,
  Lightbulb
} from "lucide-react"

interface ReportData {
  title: string
  generatedAt: string
  period: string
  summary: {
    totalTests: number
    totalParticipants: number
    averageScore: number
    completionRate: number
  }
  topPerformers: Array<{
    name: string
    score: number
    testsCompleted: number
    averageTime: string
  }>
  testPerformance: Array<{
    testName: string
    participants: number
    averageScore: number
    completionRate: number
  }>
  insights: string[]
  recommendations: string[]
}

export function ReportExample() {
  const [reportData] = useState<ReportData>({
    title: "Monthly Performance Analysis Report",
    generatedAt: "January 15, 2024",
    period: "January 1-31, 2024",
    summary: {
      totalTests: 24,
      totalParticipants: 156,
      averageScore: 82.5,
      completionRate: 94.2
    },
    topPerformers: [
      { name: "Emily Johnson", score: 94, testsCompleted: 8, averageTime: "14m 32s" },
      { name: "John Doe", score: 91, testsCompleted: 6, averageTime: "16m 18s" },
      { name: "Sarah Chen", score: 89, testsCompleted: 7, averageTime: "15m 45s" },
      { name: "Michael Brown", score: 87, testsCompleted: 5, averageTime: "18m 22s" },
      { name: "Lisa Wang", score: 85, testsCompleted: 9, averageTime: "13m 58s" }
    ],
    testPerformance: [
      { testName: "Mathematics Assessment", participants: 45, averageScore: 78.5, completionRate: 92 },
      { testName: "Programming Fundamentals", participants: 38, averageScore: 85.2, completionRate: 96 },
      { testName: "English Proficiency Test", participants: 32, averageScore: 81.8, completionRate: 94 },
      { testName: "Logical Reasoning", participants: 28, averageScore: 79.6, completionRate: 89 },
      { testName: "Data Analysis Basics", participants: 13, averageScore: 83.4, completionRate: 100 }
    ],
    insights: [
      "Overall test performance improved by 7.3% compared to previous month",
      "Mathematics Assessment shows the lowest average score at 78.5%",
      "Peak test completion time is between 2:00 PM - 4:00 PM",
      "Mobile test completion rate increased by 12% this month",
      "Average time per test decreased by 2.5 minutes"
    ],
    recommendations: [
      "Consider reviewing Mathematics Assessment questions for clarity and difficulty",
      "Implement additional practice resources for lower-performing subject areas",
      "Schedule maintenance during off-peak hours (before 10 AM or after 6 PM)",
      "Continue optimizing mobile experience for better completion rates",
      "Consider adding time management tips for test-takers"
    ]
  })

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-blue-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "border-green-600 text-green-400"
    if (score >= 80) return "border-blue-600 text-blue-400"
    if (score >= 70) return "border-yellow-600 text-yellow-400"
    return "border-red-600 text-red-400"
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-100">{reportData.title}</h1>
            <p className="text-gray-400 mt-1">Generated on {reportData.generatedAt}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </div>

        {/* Period Badge */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            {reportData.period}
          </Badge>
        </div>

        {/* Executive Summary */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-light text-gray-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-light text-gray-100">{reportData.summary.totalTests}</div>
                <div className="text-sm text-gray-400">Total Tests</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-light text-gray-100">{reportData.summary.totalParticipants}</div>
                <div className="text-sm text-gray-400">Participants</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-light text-gray-100">{reportData.summary.averageScore}%</div>
                <div className="text-sm text-gray-400">Avg Score</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-light text-gray-100">{reportData.summary.completionRate}%</div>
                <div className="text-sm text-gray-400">Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-light text-gray-100 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-300">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-100">{performer.name}</div>
                      <div className="text-xs text-gray-400">{performer.testsCompleted} tests completed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-lg font-medium ${getScoreColor(performer.score)}`}>
                        {performer.score}%
                      </div>
                      <div className="text-xs text-gray-400">{performer.averageTime}</div>
                    </div>
                    <Badge variant="outline" className={getScoreBadgeColor(performer.score)}>
                      {performer.score >= 90 ? 'Excellent' : performer.score >= 80 ? 'Good' : 'Average'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Performance */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-light text-gray-100 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Test Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.testPerformance.map((test, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-100">{test.testName}</h3>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getScoreColor(test.averageScore)}`}>
                          {test.averageScore}%
                        </div>
                        <div className="text-xs text-gray-400">Avg Score</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-100">{test.participants}</div>
                        <div className="text-xs text-gray-400">Participants</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Completion Rate</span>
                      <span className="text-sm text-gray-300">{test.completionRate}%</span>
                    </div>
                    <Progress value={test.completionRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-light text-gray-100 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-light text-gray-100 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-300">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-800">
          <div className="text-sm text-gray-400">
            <p>Report generated by TestHub Analytics System</p>
            <p>Confidential - For internal use only</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Generated in 2.3 seconds</span>
          </div>
        </div>
      </div>
    </div>
  )
}
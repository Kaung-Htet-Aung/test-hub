"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TrendingUp, Eye } from "lucide-react"
import { ResultDetailModal } from "./result-detail-modal"

const recentResults = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    score: 85,
    testTitle: "JavaScript Fundamentals",
    date: "2 hours ago",
    completionTime: "2h 15m",
    grade: "B+",
    status: "completed" as const,
    totalQuestions: 20,
    correctAnswers: 17,
    timeSpent: "135m",
    startTime: "2024-01-15 14:00",
    endTime: "2024-01-15 16:15"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    score: 92,
    testTitle: "React Advanced Concepts",
    date: "4 hours ago",
    completionTime: "1h 45m",
    grade: "A",
    status: "completed" as const,
    totalQuestions: 25,
    correctAnswers: 23,
    timeSpent: "105m",
    startTime: "2024-01-15 12:00",
    endTime: "2024-01-15 13:45"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@email.com",
    score: 78,
    testTitle: "Python Basics",
    date: "6 hours ago",
    completionTime: "3h 20m",
    grade: "C+",
    status: "completed" as const,
    totalQuestions: 30,
    correctAnswers: 23,
    timeSpent: "200m",
    startTime: "2024-01-15 09:00",
    endTime: "2024-01-15 12:20"
  },
  {
    id: 4,
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    score: 88,
    testTitle: "Database Design",
    date: "1 day ago",
    completionTime: "2h 30m",
    grade: "B+",
    status: "completed" as const,
    totalQuestions: 22,
    correctAnswers: 19,
    timeSpent: "150m",
    startTime: "2024-01-14 15:00",
    endTime: "2024-01-14 17:30"
  }
]

export function RecentResults() {
  const [selectedResult, setSelectedResult] = useState<typeof recentResults[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (result: typeof recentResults[0]) => {
    setSelectedResult(result)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              Recent Results
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 hover:bg-gray-800">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-800">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-100">
                      {result.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {result.score}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {result.testTitle}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <Progress 
                        value={result.score} 
                        className="h-1"
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {result.date}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-4 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  onClick={() => handleViewDetails(result)}
                  title="View detailed results"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ResultDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={selectedResult}
      />
    </>
  )
}
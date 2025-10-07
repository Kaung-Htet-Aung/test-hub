"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Download, Mail, Phone, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface ResultDetail {
  name: string
  email: string
  score: number
  testTitle: string
  date: string
  completionTime: string
  grade: string
  status: "completed" | "in-progress" | "failed"
  totalQuestions: number
  correctAnswers: number
  timeSpent: string
  startTime: string
  endTime: string
}

interface ResultDetailModalProps {
  isOpen: boolean
  onClose: () => void
  result: ResultDetail | null
}

export function ResultDetailModal({ isOpen, onClose, result }: ResultDetailModalProps) {
  if (!result) return null

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-500"
      case "B": return "bg-blue-500"
      case "C": return "bg-yellow-500"
      case "D": return "bg-orange-500"
      case "F": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-gray-100">
            Test Result Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <h3 className="text-lg font-medium text-gray-100">{result.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="text-sm text-gray-400">{result.email}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                {getStatusIcon(result.status)}
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {result.status}
                </Badge>
              </div>
              <div className="text-sm text-gray-400 mt-1">{result.date}</div>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <div className="text-3xl font-light text-gray-100">{result.score}%</div>
              <div className="text-sm text-gray-400">Score</div>
              <Badge className={`mt-2 ${getGradeColor(result.grade)} text-white border-0`}>
                Grade: {result.grade}
              </Badge>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-gray-300">{result.correctAnswers}/{result.totalQuestions}</span>
              </div>
              <Progress value={result.score} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">
                {result.correctAnswers} correct out of {result.totalQuestions} questions
              </div>
            </div>
          </div>

          {/* Test Information */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Test Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Test Title:</span>
                  <span className="text-sm text-gray-200">{result.testTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-sm text-gray-400">Start Time:</span>
                  <span className="text-sm text-gray-200">{result.startTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-sm text-gray-400">Time Spent:</span>
                  <span className="text-sm text-gray-200">{result.timeSpent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-sm text-gray-400">End Time:</span>
                  <span className="text-sm text-gray-200">{result.endTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Performance Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Accuracy</span>
                <span className="text-sm text-gray-200">
                  {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Average Time per Question</span>
                <span className="text-sm text-gray-200">
                  {Math.round(parseInt(result.timeSpent) / result.totalQuestions)}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Completion Rate</span>
                <span className="text-sm text-gray-200">100%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <Button 
              className="flex-1 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Results
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
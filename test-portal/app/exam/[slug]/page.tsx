"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OptimizedLayout } from "@/components/home/Layout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, WifiOff, Clock, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useSyncManager,
  formatSyncStatus,
  getSyncStatusColor,
  getSyncStatusIcon,
} from "@/lib/sync";
import api from "@/lib/api";
// Types
interface Question {
  id: string;
  type: "multiple-choice" | "single-choice" | "text" | "true-false";
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: Question[];
  passingScore: number;
}

interface UserAnswer {
  questionId: string;
  answer: string[];
  timestamp: Date;
}

// Mock exam data (in real app, this would come from API)
const mockExam: Exam = {
  id: "1",
  title: "JavaScript Fundamentals",
  description: "Test your knowledge of JavaScript basics",
  timeLimit: 60,
  passingScore: 70,
  questions: [
    {
      id: "1",
      type: "multiple-choice",
      question:
        "Which of the following are JavaScript data types? (Select all that apply)",
      options: ["String", "Boolean", "Integer", "Object", "Array"],
      correctAnswer: ["String", "Boolean", "Object", "Array"],
      points: 1,
    },
    {
      id: "2",
      type: "multiple-choice",
      question:
        "Which of the following are JavaScript data types? (Select all that apply)",
      options: ["String", "Boolean", "Integer", "Object", "Array"],
      correctAnswer: ["String"],
      points: 1,
    },
  ],
};

export default function ExamTakingPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.slug as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);

  // Use sync manager
  const {
    syncStatus,
    isOnline,
    saveAnswer,
    loadExamAnswers,
    syncAllPendingAnswers,
  } = useSyncManager();

  // Get sync status icon component
  const SyncStatusIcon = getSyncStatusIcon(syncStatus);

  // Initialize exam
  useEffect(() => {
    // In real app, fetch exam data from API
    const getExam = async () => {
      const response = await api.get("/admin/exams/cmhhb0otp0001z5h4p7w4cqrp");
      const { group, ...restOfExam } = response.data.exam;
      const exam = {
        ...restOfExam,
        questions: group.questions,
      };
      setExam(exam);
      console.log(exam);
    };
    getExam();
    setTimeRemaining(mockExam.timeLimit * 60); // Convert to seconds

    // Load saved answers from IndexedDB
    loadSavedAnswers();

    // Register service worker
    registerServiceWorker();
  }, [examId, loadExamAnswers]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || examCompleted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleExamTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examCompleted, timeRemaining]);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered successfully");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }, []);

  // Load saved answers from IndexedDB
  const loadSavedAnswers = useCallback(async () => {
    try {
      const savedAnswers = await loadExamAnswers(examId);
      console.log("this is savedAns", savedAnswers);
      if (savedAnswers.length > 0) {
        setAnswers(savedAnswers);
      }
    } catch (error) {
      console.error("Failed to load saved answers:", error);
    }
  }, [examId, loadExamAnswers]);

  // Handle answer change
  const handleAnswerChange = useCallback(
    async (questionId: string, option: string, checked: boolean) => {
      setAnswers((prev) => {
        const existing = prev.find((a) => a.questionId === questionId);
        let updatedAnswers: string[];

        if (existing) {
          const currentAnswers = Array.isArray(existing.answer)
            ? existing.answer
            : [];

          if (checked) {
            updatedAnswers = [...new Set([...currentAnswers, option])];
          } else {
            updatedAnswers = currentAnswers.filter((a) => a !== option);
          }

          const newAnswers = prev.map((a) =>
            a.questionId === questionId
              ? { ...a, answer: updatedAnswers, timestamp: new Date() }
              : a
          );
          return newAnswers;
        } else {
          if (checked) {
            const newAnswers = [
              ...prev,
              { questionId, answer: [option], timestamp: new Date() },
            ];
            return newAnswers;
          }
          return prev;
        }
      });

      // 🟢 Now call saveAnswer only once, outside of setAnswers
      const existingAnswer = answers.find((a) => a.questionId === questionId);
      const updatedAnswer = existingAnswer
        ? checked
          ? [...new Set([...existingAnswer.answer, option])]
          : existingAnswer.answer.filter((a) => a !== option)
        : checked
        ? [option]
        : [];

      await saveAnswer(examId, questionId, updatedAnswer);
    },
    [examId, saveAnswer, answers]
  );

  // Navigation functions
  const goToNextQuestion = useCallback(() => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [exam, currentQuestionIndex]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const startExam = useCallback(() => {
    setExamStarted(true);
  }, []);

  const submitExam = useCallback(async () => {
    setExamCompleted(true);

    // Sync any remaining answers
    /*  if (isOnline) {
      await syncAllPendingAnswers();
    } */

    // Calculate score (in real app, this would be done server-side)
    const score = calculateScore();
    console.log("score is ", score);
    toast.success(`Exam submitted! Your score: ${score}%`);

    // Redirect to results page after a delay
    /* setTimeout(() => {
      router.push(`/exam/${examId}/results`);
    }, 3000); */
  }, [syncAllPendingAnswers, isOnline, examId, router, exam, answers]);

  const handleExamTimeout = useCallback(() => {
    setExamCompleted(true);
    toast.error("Time's up! Submitting your exam...");
    submitExam();
  }, [submitExam]);

  const calculateScore = useCallback(() => {
    let earnedPoints = 0;

    if (!exam) return;

    for (const question of exam.questions) {
      console.log("thisis anss", answers);
      const userAnswer = answers.find((a) => a.questionId === question.id);
      console.log("user ansmwer is ", userAnswer);
      // Only handle multiple-choice questions
      if (
        userAnswer &&
        Array.isArray(question.correctAnswer) &&
        Array.isArray(userAnswer.answer)
      ) {
        console.log("user ans exit");
        const isCorrect =
          question.correctAnswer.every((correct) =>
            userAnswer.answer.includes(correct)
          ) && userAnswer.answer.length === question.correctAnswer.length;

        if (isCorrect) {
          earnedPoints += question.points;
        }
      }
    }

    return earnedPoints;
  }, [exam, answers]);

  // Get current answer for question
  const getCurrentAnswer = useCallback(
    (questionId: string) => {
      const answer = answers.find((a) => a.questionId === questionId);
      return answer?.answer || "";
    },
    [answers]
  );

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  // Progress calculation
  const answeredQuestions = answers.length;
  const totalQuestions = exam?.questions.length || 0;
  const progress =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  if (!exam) {
    return (
      <OptimizedLayout title="Loading Exam...">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </OptimizedLayout>
    );
  }

  if (!examStarted) {
    return (
      <OptimizedLayout title="Exam Instructions">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">{exam.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-300">
                <p className="mb-4">{exam.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span>Time Limit: {exam.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Questions: {exam.questions.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Passing Score: {exam.passingScore}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>
                      Total Points:{" "}
                      {exam.questions.reduce((sum, q) => sum + q.points, 0)}
                    </span>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This exam supports offline functionality. Your answers will be
                  saved locally and synced when you're back online.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button
                  onClick={startExam}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </OptimizedLayout>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer(currentQuestion.id);

  return (
    <OptimizedLayout
      title={`Taking Exam: ${exam.title}`}
      actions={
        <div className="flex items-center space-x-4">
          {/* Sync Status Indicator */}
          <div
            className={`flex items-center space-x-2 text-sm ${getSyncStatusColor(
              syncStatus
            )}`}
          >
            {React.createElement(SyncStatusIcon, {
              className: `h-4 w-4 ${
                syncStatus === "syncing" ? "animate-spin" : ""
              }`,
            })}
            <span>{formatSyncStatus(syncStatus)}</span>
          </div>

          {/* Connectivity Status */}
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-2 font-mono">
            <Clock className="h-4 w-4" />
            <span
              className={timeRemaining < 300 ? "text-red-400" : "text-gray-300"}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Bar */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progress</span>
                <span>
                  {answeredQuestions}/{totalQuestions} questions answered
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-gray-100">
                {currentQuestion.question}
              </CardTitle>
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                {currentQuestion.points} pts
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === "multiple-choice" &&
              currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`option-${index}`}
                        checked={
                          Array.isArray(currentAnswer)
                            ? currentAnswer.includes(option)
                            : false
                        }
                        onCheckedChange={(checked) => {
                          handleAnswerChange(
                            currentQuestion.id,
                            option,
                            !!checked
                          );
                        }}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="text-gray-300"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/exam/${examId}/overview`)}
              className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
            >
              Save & Exit
            </Button>

            {currentQuestionIndex === exam.questions.length - 1 ? (
              <Button
                onClick={submitExam}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Exam
              </Button>
            ) : (
              <Button
                onClick={goToNextQuestion}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      </div>
    </OptimizedLayout>
  );
}

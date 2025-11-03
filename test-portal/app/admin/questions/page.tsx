"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  Tag,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Star,
  FileText,
  Code,
  Calculator,
  Globe,
} from "lucide-react";
import { getStatusColor, getDifficultyColor, getScoreColor } from "@/lib/utils";
import Link from "next/link";

interface Question {
  id: string;
  title: string;
  type:
    | "multiple-choice"
    | "true-false"
    | "short-answer"
    | "essay"
    | "coding"
    | "fill-blank";
  category: string;
  difficulty: "easy" | "medium" | "hard";
  status: "active" | "draft" | "archived";
  content: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  tags: string[];
  usageCount: number;
  averageScore: number;
  createdAt: string;
  lastUsed: string;
  timeLimit?: number; // in seconds
  points: number;
}

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Mock data for questions
  const questions: Question[] = [
    {
      id: "1",
      title: "What is the derivative of x²?",
      type: "multiple-choice",
      category: "Mathematics",
      difficulty: "easy",
      status: "active",
      content: "What is the derivative of x² with respect to x?",
      options: ["2x", "x²", "2x²", "x"],
      correctAnswer: 0,
      explanation:
        "The derivative of x² is 2x, using the power rule of differentiation.",
      tags: ["calculus", "derivatives", "algebra"],
      usageCount: 45,
      averageScore: 85,
      createdAt: "2024-01-01",
      lastUsed: "2024-01-15",
      timeLimit: 30,
      points: 5,
    },
    {
      id: "2",
      title: "Python list comprehension",
      type: "coding",
      category: "Programming",
      difficulty: "medium",
      status: "active",
      content:
        "Write a Python list comprehension to create a list of squares from 0 to 9.",
      correctAnswer: "[x**2 for x in range(10)]",
      explanation:
        "List comprehension provides a concise way to create lists. [x**2 for x in range(10)] generates squares of numbers 0 through 9.",
      tags: ["python", "list-comprehension", "programming"],
      usageCount: 32,
      averageScore: 72,
      createdAt: "2024-01-05",
      lastUsed: "2024-01-12",
      timeLimit: 120,
      points: 10,
    },
    {
      id: "3",
      title: "Photosynthesis process",
      type: "short-answer",
      category: "Biology",
      difficulty: "medium",
      status: "draft",
      content:
        "Explain the process of photosynthesis and its importance for life on Earth.",
      correctAnswer:
        "Photosynthesis is the process by which plants convert light energy into chemical energy...",
      explanation:
        "Photosynthesis involves chlorophyll capturing light energy to convert CO2 and water into glucose and oxygen.",
      tags: ["biology", "photosynthesis", "plants"],
      usageCount: 0,
      averageScore: 0,
      createdAt: "2024-01-10",
      lastUsed: "Never",
      timeLimit: 300,
      points: 15,
    },
    {
      id: "4",
      title: "Earth's atmosphere layers",
      type: "multiple-choice",
      category: "Geography",
      difficulty: "easy",
      status: "active",
      content: "Which layer of Earth's atmosphere contains the ozone layer?",
      options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
      correctAnswer: 1,
      explanation:
        "The ozone layer is located in the stratosphere, approximately 15-35km above Earth's surface.",
      tags: ["geography", "atmosphere", "earth-science"],
      usageCount: 28,
      averageScore: 91,
      createdAt: "2023-12-15",
      lastUsed: "2024-01-08",
      timeLimit: 45,
      points: 5,
    },
    {
      id: "5",
      title: "Database normalization",
      type: "essay",
      category: "Computer Science",
      difficulty: "hard",
      status: "archived",
      content:
        "Discuss the importance of database normalization and explain the first three normal forms with examples.",
      correctAnswer:
        "Database normalization is the process of organizing data to reduce redundancy...",
      explanation:
        "Normalization helps eliminate data redundancy and improve data integrity. 1NF, 2NF, and 3NF are the most common forms.",
      tags: ["database", "normalization", "computer-science"],
      usageCount: 15,
      averageScore: 68,
      createdAt: "2023-11-20",
      lastUsed: "2023-12-01",
      timeLimit: 600,
      points: 25,
    },
  ];

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType = typeFilter === "all" || question.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || question.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || question.difficulty === difficultyFilter;

    return matchesSearch && matchesType && matchesCategory && matchesDifficulty;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return <FileText className="h-4 w-4" />;
      case "coding":
        return <Code className="h-4 w-4" />;
      case "short-answer":
        return <BookOpen className="h-4 w-4" />;
      case "essay":
        return <FileText className="h-4 w-4" />;
      case "true-false":
        return <CheckCircle className="h-4 w-4" />;
      case "fill-blank":
        return <Edit className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return "border-blue-600 text-blue-400";
      case "coding":
        return "border-purple-600 text-purple-400";
      case "short-answer":
        return "border-green-600 text-green-400";
      case "essay":
        return "border-orange-600 text-orange-400";
      case "true-false":
        return "border-cyan-600 text-cyan-400";
      case "fill-blank":
        return "border-pink-600 text-pink-400";
      default:
        return "border-gray-600 text-gray-400";
    }
  };

  const allCategories = Array.from(new Set(questions.map((q) => q.category)));
  const allTypes = Array.from(new Set(questions.map((q) => q.type)));

  const actions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 bg-gray-900 border-gray-800 text-gray-100 pl-10"
        />
      </div>
      {/* <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
        <Copy className="h-4 w-4 mr-2" />
        Import
      </Button> */}
      <Link href="/questions/create">
        <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Question
        </Button>
      </Link>
    </div>
  );

  return (
    <PageLayout
      title="Questions"
      description="Create and manage assessment questions"
      actions={actions}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Questions
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {questions.length}
            </div>
            <p className="text-xs text-gray-500">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active Questions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {questions.filter((q) => q.status === "active").length}
            </div>
            <p className="text-xs text-gray-500">Ready to use</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Usage
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {Math.round(
                questions.reduce((acc, q) => acc + q.usageCount, 0) /
                  questions.length
              )}
            </div>
            <p className="text-xs text-gray-500">Times used</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Categories
            </CardTitle>
            <Tag className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {allCategories.length}
            </div>
            <p className="text-xs text-gray-500">Different topics</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="all">All Types</SelectItem>
                {allTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="grid gap-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getTypeIcon(question.type)}
                    <h3 className="text-lg font-medium text-gray-100">
                      {question.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getTypeColor(question.type)}`}
                    >
                      {question.type.replace("-", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(question.status)}`}
                    >
                      {question.status.toUpperCase()}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getDifficultyColor(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty.toUpperCase()}
                    </Badge>
                    {question.timeLimit && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {question.timeLimit}s
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 mb-4">
                    {question.content}
                  </p>

                  {/* Options for multiple-choice questions */}
                  {question.type === "multiple-choice" && question.options && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">Options:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-xs ${
                              index === question.correctAnswer
                                ? "bg-green-900 border border-green-700 text-green-300"
                                : "bg-gray-800 border border-gray-700 text-gray-300"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                            {index === question.correctAnswer && (
                              <CheckCircle className="inline h-3 w-3 ml-1 text-green-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-1">
                      Explanation:
                    </div>
                    <p className="text-xs text-gray-300">
                      {question.explanation}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <div className="flex gap-1">
                      {question.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-gray-600 text-gray-300 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-6 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{question.points} points</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Used {question.usageCount} times</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span className={getScoreColor(question.averageScore)}>
                        {question.averageScore > 0
                          ? `${question.averageScore}% avg score`
                          : "Not used yet"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created {question.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}

// Calendar icon component
function Calendar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

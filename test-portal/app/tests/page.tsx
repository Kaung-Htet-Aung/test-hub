"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  getStatusColor,
  getStatusIcon,
  getDifficultyColor,
  getScoreColor,
} from "@/lib/utils";

interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "active" | "completed" | "archived";
  duration: number; // in minutes
  questions: number;
  participants: number;
  averageScore: number;
  createdAt: string;
  lastModified: string;
  scheduledAt?: string;
  completedAt?: string;
  tags: string[];
}

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock data for tests
  const tests: Test[] = [
    {
      id: "1",
      title: "Mathematics Assessment",
      description:
        "Comprehensive math test covering algebra, geometry, and calculus",
      category: "Mathematics",
      difficulty: "medium",
      status: "active",
      duration: 60,
      questions: 25,
      participants: 45,
      averageScore: 78.5,
      createdAt: "2024-01-01",
      lastModified: "2024-01-15",
      tags: ["algebra", "geometry", "calculus"],
    },
    {
      id: "2",
      title: "Programming Fundamentals",
      description: "Basic programming concepts and problem-solving skills",
      category: "Programming",
      difficulty: "easy",
      status: "published",
      duration: 45,
      questions: 20,
      participants: 38,
      averageScore: 85.2,
      createdAt: "2024-01-05",
      lastModified: "2024-01-12",
      tags: ["programming", "algorithms", "problem-solving"],
    },
    {
      id: "3",
      title: "English Proficiency Test",
      description:
        "Advanced English language assessment for professional settings",
      category: "Languages",
      difficulty: "hard",
      status: "draft",
      duration: 90,
      questions: 40,
      participants: 0,
      averageScore: 0,
      createdAt: "2024-01-10",
      lastModified: "2024-01-16",
      tags: ["english", "grammar", "vocabulary"],
    },
    {
      id: "4",
      title: "Logical Reasoning",
      description: "Test logical thinking and problem-solving abilities",
      category: "Aptitude",
      difficulty: "medium",
      status: "completed",
      duration: 30,
      questions: 15,
      participants: 28,
      averageScore: 79.6,
      createdAt: "2023-12-15",
      lastModified: "2024-01-08",
      scheduledAt: "2024-01-10",
      completedAt: "2024-01-10",
      tags: ["logic", "reasoning", "aptitude"],
    },
    {
      id: "5",
      title: "Data Analysis Basics",
      description: "Introduction to data analysis and statistical concepts",
      category: "Data Science",
      difficulty: "medium",
      status: "archived",
      duration: 75,
      questions: 30,
      participants: 13,
      averageScore: 83.4,
      createdAt: "2023-11-20",
      lastModified: "2023-12-01",
      tags: ["data", "statistics", "analysis"],
    },
  ];

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || test.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || test.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const allCategories = Array.from(new Set(tests.map((t) => t.category)));

  const actions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 bg-gray-900 border-gray-800 text-gray-100 pl-10"
        />
      </div>
      <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
        <Copy className="h-4 w-4 mr-2" />
        Duplicate
      </Button>
      <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
        <Plus className="h-4 w-4 mr-2" />
        Create Test
      </Button>
    </div>
  );

  return (
    <PageLayout
      title="Tests"
      description="Create, manage, and monitor assessments"
      actions={actions}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Tests
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {tests.length}
            </div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active Tests
            </CardTitle>
            <Play className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {tests.filter((t) => t.status === "active").length}
            </div>
            <p className="text-xs text-gray-500">Currently running</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Participants
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {tests.reduce((acc, t) => acc + t.participants, 0)}
            </div>
            <p className="text-xs text-gray-500">Across all tests</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Score
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {Math.round(
                tests
                  .filter((t) => t.averageScore > 0)
                  .reduce((acc, t) => acc + t.averageScore, 0) /
                  tests.filter((t) => t.averageScore > 0).length
              )}
              %
            </div>
            <p className="text-xs text-gray-500">Overall average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32 bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-32 bg-gray-800 border-gray-700 text-gray-100">
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
          </div>
        </CardContent>
      </Card>

      {/* Tests List */}
      <div className="grid gap-4">
        {filteredTests.map((test) => (
          <Card key={test.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-100">
                      {test.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusIcon(test.status)}
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(test.status)}`}
                      >
                        {test.status.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getDifficultyColor(
                          test.difficulty
                        )}`}
                      >
                        {test.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {test.description}
                  </p>

                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        {test.questions} questions
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        {test.duration} minutes
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        {test.participants} participants
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        Created {test.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
                    <span className="text-xs text-gray-400">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {test.tags.map((tag, index) => (
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
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                  <div className="text-right">
                    <div
                      className={`text-lg font-medium ${getScoreColor(
                        test.averageScore
                      )}`}
                    >
                      {test.averageScore > 0 ? `${test.averageScore}%` : "N/A"}
                    </div>
                    <div className="text-xs text-gray-400">Avg Score</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <Settings className="h-4 w-4" />
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
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Schedule/Completion Info */}
              {(test.scheduledAt || test.completedAt) && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 pt-4 border-t border-gray-800 text-xs">
                  {test.scheduledAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        Scheduled: {test.scheduledAt}
                      </span>
                    </div>
                  )}
                  {test.completedAt && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        Completed: {test.completedAt}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}

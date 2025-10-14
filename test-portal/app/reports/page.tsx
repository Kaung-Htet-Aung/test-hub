"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReportExample } from "@/components/ReportExample";
import {
  FileText,
  Download,
  Filter,
  Search,
  Plus,
  Calendar,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Share,
  ArrowLeft,
} from "lucide-react";
import { getStatusColor, getStatusIcon } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  type: "test" | "user" | "system" | "custom";
  status: "completed" | "generating" | "failed";
  generatedAt: string;
  size: string;
  format: "pdf" | "excel" | "csv";
  description: string;
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [showExampleReport, setShowExampleReport] = useState(false);

  // Mock data for reports
  const reports: Report[] = [
    {
      id: "1",
      title: "Monthly Test Performance Report",
      type: "test",
      status: "completed",
      generatedAt: "2024-01-15",
      size: "2.4 MB",
      format: "pdf",
      description:
        "Comprehensive analysis of all test performances for January 2024",
    },
    {
      id: "2",
      title: "User Activity Summary",
      type: "user",
      status: "completed",
      generatedAt: "2024-01-14",
      size: "1.8 MB",
      format: "excel",
      description: "Detailed user activity and engagement metrics",
    },
    {
      id: "3",
      title: "System Health Report",
      type: "system",
      status: "generating",
      generatedAt: "2024-01-16",
      size: "Processing...",
      format: "pdf",
      description: "System performance and health monitoring report",
    },
    {
      id: "4",
      title: "Custom Assessment Analysis",
      type: "custom",
      status: "completed",
      generatedAt: "2024-01-13",
      size: "3.1 MB",
      format: "pdf",
      description: "Custom analysis for specific assessment criteria",
    },
    {
      id: "5",
      title: "Weekly Progress Report",
      type: "test",
      status: "failed",
      generatedAt: "2024-01-12",
      size: "Error",
      format: "csv",
      description: "Weekly progress tracking and analysis",
    },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || report.type === selectedType;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "completed" && report.status === "completed") ||
      (activeTab === "generating" && report.status === "generating") ||
      (activeTab === "failed" && report.status === "failed");

    return matchesSearch && matchesType && matchesTab;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "test":
        return <BarChart3 className="h-4 w-4" />;
      case "user":
        return <Users className="h-4 w-4" />;
      case "system":
        return <TrendingUp className="h-4 w-4" />;
      case "custom":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const actions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 bg-gray-900 border-gray-800 text-gray-100 pl-10"
        />
      </div>
      <Select value={dateRange} onValueChange={setDateRange}>
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
      <Button
        className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
        onClick={() => setShowExampleReport(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        View Example Report
      </Button>
    </div>
  );

  return (
    <>
      {showExampleReport ? (
        <div className="min-h-screen bg-gray-950">
          <div className="p-6">
            <Button
              variant="outline"
              className="mb-6 border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => setShowExampleReport(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </div>
          <ReportExample />
        </div>
      ) : (
        <PageLayout
          title="Reports"
          description="Generate, view, and manage comprehensive reports"
          actions={actions}
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Reports
                </CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-gray-100">
                  {reports.length}
                </div>
                <p className="text-xs text-gray-500">+15% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-gray-100">
                  {reports.filter((r) => r.status === "completed").length}
                </div>
                <p className="text-xs text-gray-500">Ready for download</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Generating
                </CardTitle>
                <Clock className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-gray-100">
                  {reports.filter((r) => r.status === "generating").length}
                </div>
                <p className="text-xs text-gray-500">In progress</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Storage Used
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-gray-100">7.3 MB</div>
                <p className="text-xs text-gray-500">Of 100 MB available</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex gap-4">
            {/* Filters */}
            <Card className="bg-gray-900 border-gray-800 w-64">
              <CardHeader>
                <CardTitle className="text-lg font-light text-gray-100">
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Report Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="test">Test Reports</SelectItem>
                      <SelectItem value="user">User Reports</SelectItem>
                      <SelectItem value="system">System Reports</SelectItem>
                      <SelectItem value="custom">Custom Reports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Format
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 bg-gray-800"
                      />
                      <span className="text-sm text-gray-300">PDF</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 bg-gray-800"
                      />
                      <span className="text-sm text-gray-300">Excel</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 bg-gray-800"
                      />
                      <span className="text-sm text-gray-300">CSV</span>
                    </label>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="flex-1">
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="bg-gray-900 border-gray-800">
                  <TabsTrigger
                    value="all"
                    className="text-gray-300 data-[state=active]:bg-gray-800"
                  >
                    All Reports
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="text-gray-300 data-[state=active]:bg-gray-800"
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger
                    value="generating"
                    className="text-gray-300 data-[state=active]:bg-gray-800"
                  >
                    Generating
                  </TabsTrigger>
                  <TabsTrigger
                    value="failed"
                    className="text-gray-300 data-[state=active]:bg-gray-800"
                  >
                    Failed
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="grid gap-4">
                    {filteredReports.map((report) => (
                      <Card
                        key={report.id}
                        className="bg-gray-900 border-gray-800"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(report.type)}
                                <span className="text-sm text-gray-400 capitalize">
                                  {report.type}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-100">
                                  {report.title}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                  {report.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">
                                      {report.generatedAt}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">
                                      {report.size}
                                    </span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getStatusColor(
                                      report.status
                                    )}`}
                                  >
                                    {report.status.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(report.status)}
                              {report.status === "generating" && (
                                <div className="w-16">
                                  <Progress value={65} className="h-2" />
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-gray-200"
                                  onClick={() => setShowExampleReport(true)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-gray-200"
                                >
                                  <Share className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-gray-200"
                                >
                                  <Download className="h-4 w-4" />
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="grid gap-4">
                    {filteredReports
                      .filter((r) => r.status === "completed")
                      .map((report) => (
                        <Card
                          key={report.id}
                          className="bg-gray-900 border-gray-800"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(report.type)}
                                  <span className="text-sm text-gray-400 capitalize">
                                    {report.type}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-100">
                                    {report.title}
                                  </h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {report.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.generatedAt}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.size}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getStatusColor(
                                        report.status
                                      )}`}
                                    >
                                      {report.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(report.status)}
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-gray-200"
                                    onClick={() => setShowExampleReport(true)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-gray-200"
                                  >
                                    <Share className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-gray-200"
                                  >
                                    <Download className="h-4 w-4" />
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
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="generating">
                  <div className="grid gap-4">
                    {filteredReports
                      .filter((r) => r.status === "generating")
                      .map((report) => (
                        <Card
                          key={report.id}
                          className="bg-gray-900 border-gray-800"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(report.type)}
                                  <span className="text-sm text-gray-400 capitalize">
                                    {report.type}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-100">
                                    {report.title}
                                  </h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {report.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.generatedAt}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.size}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getStatusColor(
                                        report.status
                                      )}`}
                                    >
                                      {report.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(report.status)}
                                <div className="w-16">
                                  <Progress value={65} className="h-2" />
                                </div>
                                <div className="flex items-center gap-1">
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
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="failed">
                  <div className="grid gap-4">
                    {filteredReports
                      .filter((r) => r.status === "failed")
                      .map((report) => (
                        <Card
                          key={report.id}
                          className="bg-gray-900 border-gray-800"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(report.type)}
                                  <span className="text-sm text-gray-400 capitalize">
                                    {report.type}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-100">
                                    {report.title}
                                  </h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {report.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.generatedAt}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.size}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getStatusColor(
                                        report.status
                                      )}`}
                                    >
                                      {report.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(report.status)}
                                <div className="flex items-center gap-1">
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
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                  <div className="grid gap-4">
                    {filteredReports
                      .filter((r) => r.status === "completed")
                      .map((report) => (
                        <Card
                          key={report.id}
                          className="bg-gray-900 border-gray-800"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(report.type)}
                                  <span className="text-sm text-gray-400 capitalize">
                                    {report.type}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-100">
                                    {report.title}
                                  </h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {report.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.generatedAt}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.size}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getStatusColor(
                                        report.status
                                      )}`}
                                    >
                                      {report.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(report.status)}
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-gray-200"
                                    onClick={() => setShowExampleReport(true)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-gray-200"
                                  >
                                    <Share className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-gray-200"
                                  >
                                    <Download className="h-4 w-4" />
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
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="generating" className="space-y-4">
                  <div className="grid gap-4">
                    {filteredReports
                      .filter((r) => r.status === "generating")
                      .map((report) => (
                        <Card
                          key={report.id}
                          className="bg-gray-900 border-gray-800"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(report.type)}
                                  <span className="text-sm text-gray-400 capitalize">
                                    {report.type}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-100">
                                    {report.title}
                                  </h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {report.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.generatedAt}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.size}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getStatusColor(
                                        report.status
                                      )}`}
                                    >
                                      {report.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(report.status)}
                                <div className="w-16">
                                  <Progress value={65} className="h-2" />
                                </div>
                                <div className="flex items-center gap-1">
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
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="failed" className="space-y-4">
                  <div className="grid gap-4">
                    {filteredReports
                      .filter((r) => r.status === "failed")
                      .map((report) => (
                        <Card
                          key={report.id}
                          className="bg-gray-900 border-gray-800"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(report.type)}
                                  <span className="text-sm text-gray-400 capitalize">
                                    {report.type}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-100">
                                    {report.title}
                                  </h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {report.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.generatedAt}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {report.size}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getStatusColor(
                                        report.status
                                      )}`}
                                    >
                                      {report.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(report.status)}
                                <div className="flex items-center gap-1">
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
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </PageLayout>
      )}
    </>
  );
}

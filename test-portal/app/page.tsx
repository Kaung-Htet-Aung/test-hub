// pages/exams.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Clock, Search, BookOpen, Eye, Play } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define types
type ExamStatus = "upcoming" | "ongoing" | "completed";

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalMarks: number;
  status: ExamStatus;
  date: string; // ISO string
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  progress?: number; // for partially completed exams (0-100)
}

// Mock data for testing
const mockExams: Exam[] = [
  {
    id: "1",
    title: "Mathematics Final Exam",
    subject: "Mathematics",
    duration: 120,
    totalMarks: 100,
    status: "upcoming",
    date: "2023-06-15T10:00:00",
    startTime: "2023-06-15T10:00:00",
    endTime: "2023-06-15T12:00:00",
  },
  {
    id: "2",
    title: "Physics Quiz",
    subject: "Physics",
    duration: 60,
    totalMarks: 50,
    status: "ongoing",
    date: "2023-06-10T14:00:00",
    startTime: "2023-06-10T14:00:00",
    endTime: "2023-06-10T15:00:00",
  },
  {
    id: "3",
    title: "Chemistry Test",
    subject: "Chemistry",
    duration: 90,
    totalMarks: 75,
    status: "completed",
    date: "2023-06-05T09:00:00",
    progress: 100,
  },
  {
    id: "4",
    title: "Biology Midterm",
    subject: "Biology",
    duration: 100,
    totalMarks: 80,
    status: "completed",
    date: "2023-05-28T11:00:00",
    progress: 100,
  },
  {
    id: "5",
    title: "English Literature Exam",
    subject: "English",
    duration: 120,
    totalMarks: 100,
    status: "upcoming",
    date: "2023-06-20T13:00:00",
    startTime: "2023-06-20T13:00:00",
    endTime: "2023-06-20T15:00:00",
  },
  {
    id: "6",
    title: "History Assessment",
    subject: "History",
    duration: 90,
    totalMarks: 70,
    status: "ongoing",
    date: "2023-06-12T15:30:00",
    startTime: "2023-06-12T15:30:00",
    endTime: "2023-06-12T17:00:00",
    progress: 30, // partially completed
  },
];

// API function to fetch exams
const fetchExams = async (): Promise<Exam[]> => {
  // In a real app, this would be an API call
  // const response = await fetch('/api/student/exams');
  // const data = await response.json();
  // return data;

  // For demo purposes, we'll return mock data after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockExams);
    }, 1000);
  });
};

// Helper function to calculate remaining time for ongoing exams
const calculateRemainingTime = (endTime: string): string => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Exam Card Component
const ExamCard = ({
  exam,
  onStartExam,
  onViewResult,
  onViewDetails,
}: {
  exam: Exam;
  onStartExam: (id: string) => void;
  onViewResult: (id: string) => void;
  onViewDetails: (id: string) => void;
}) => {
  const getBadgeVariant = (status: ExamStatus) => {
    switch (status) {
      case "upcoming":
        return "secondary";
      case "ongoing":
        return "default";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{exam.title}</CardTitle>
          <Badge variant={getBadgeVariant(exam.status)}>
            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          {exam.subject}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date:</span>
            <span>{formatDate(exam.date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span>{exam.duration} minutes</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Marks:</span>
            <span>{exam.totalMarks}</span>
          </div>

          {exam.status === "ongoing" && exam.endTime && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Time Left:
              </span>
              <span className="font-medium text-orange-600">
                {calculateRemainingTime(exam.endTime)}
              </span>
            </div>
          )}

          {exam.progress !== undefined && exam.status === "completed" && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span>{exam.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${exam.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {exam.status === "ongoing" && (
          <Button onClick={() => onStartExam(exam.id)} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start Exam
          </Button>
        )}
        {exam.status === "completed" && (
          <Button
            onClick={() => onViewResult(exam.id)}
            variant="outline"
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Result
          </Button>
        )}
        {exam.status === "upcoming" && (
          <Button
            onClick={() => onViewDetails(exam.id)}
            variant="outline"
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Loading Skeleton Component
const ExamCardSkeleton = () => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="flex-1">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

// Main Exam Page Component
const ExamPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExamStatus | "all">("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const router = useRouter();

  // Get unique subjects for filter dropdown
  const subjects = Array.from(new Set(exams.map((exam) => exam.subject)));

  // Fetch exams on component mount
  useEffect(() => {
    const getExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExams();
        setExams(data);
      } catch (err) {
        setError("Failed to fetch exams. Please try again later.");
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };

    getExams();
  }, []);

  // Filter exams based on search term and filters
  useEffect(() => {
    let result = [...exams];

    // Sort by date (newest first)
    result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (exam) =>
          exam.title.toLowerCase().includes(term) ||
          exam.subject.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((exam) => exam.status === statusFilter);
    }

    // Apply subject filter
    if (subjectFilter !== "all") {
      result = result.filter((exam) => exam.subject === subjectFilter);
    }

    setFilteredExams(result);
  }, [exams, searchTerm, statusFilter, subjectFilter]);

  // Group exams by status
  const upcomingExams = filteredExams.filter(
    (exam) => exam.status === "upcoming"
  );
  const ongoingExams = filteredExams.filter(
    (exam) => exam.status === "ongoing"
  );
  const completedExams = filteredExams.filter(
    (exam) => exam.status === "completed"
  );

  // Navigation handlers
  const handleStartExam = (examId: string) => {
    router.push(`/exam/${examId}`);
  };

  const handleViewResult = (examId: string) => {
    router.push(`/result/${examId}`);
  };

  const handleViewDetails = (examId: string) => {
    router.push(`/exam/${examId}/details`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Exams</h1>
        <p className="text-muted-foreground">
          View and manage all your assigned exams
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search exams by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as ExamStatus | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ExamCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredExams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl font-semibold mb-2">No exams found</h2>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" || subjectFilter !== "all"
              ? "Try adjusting your search or filters"
              : "You don't have any exams assigned yet"}
          </p>
        </div>
      )}

      {/* Exams List */}
      {!loading && filteredExams.length > 0 && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({filteredExams.length})</TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingExams.length})
            </TabsTrigger>
            <TabsTrigger value="ongoing">
              Ongoing ({ongoingExams.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedExams.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onStartExam={handleStartExam}
                  onViewResult={handleViewResult}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onStartExam={handleStartExam}
                  onViewResult={handleViewResult}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ongoing" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onStartExam={handleStartExam}
                  onViewResult={handleViewResult}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onStartExam={handleStartExam}
                  onViewResult={handleViewResult}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ExamPage;

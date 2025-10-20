"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getGroups } from "@/lib/getGroups";
import { getQuestionSets } from "@/lib/getQuestionSet";
import { useQueries } from "@tanstack/react-query";
// Zod schema for form validation
const testFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  batch: z.string().min(1, "Batch is required"),
  question: z.string().min(1, "Question is required"),

  difficulty: z.enum(["easy", "medium", "hard"]),
  timeLimit: z.number().min(1, "Time limit must be at least 1 minute"),
  passingScore: z
    .number()
    .min(0)
    .max(100, "Passing score must be between 0 and 100"),
  instructions: z.string().optional(),
  scheduledDateTime: z.string().min(1, "Scheduled date and time are required"),
  notifyBeforeStartMinutes: z
    .number()
    .min(1)
    .max(1440, "Notify before must be between 1 and 1440 minutes"),
});

type TestFormData = z.infer<typeof testFormSchema>;
interface BatchData {
  id: string;
  name: string;
}
// Constants
const TEST_CONSTANTS = {
  CATEGORIES: [
    "Mathematics",
    "Programming",
    "Languages",
    "Science",
    "History",
    "Arts",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
  ] as const,

  DEFAULT_VALUES: {
    TIME_LIMIT: 60,
    PASSING_SCORE: 70,
    NOTIFY_BEFORE_MINUTES: 30,
  } as const,
};

export default function CreateTestPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      title: "",
      description: "",
      batch: "",
      question: "",
      difficulty: "medium",
      timeLimit: TEST_CONSTANTS.DEFAULT_VALUES.TIME_LIMIT,
      passingScore: TEST_CONSTANTS.DEFAULT_VALUES.PASSING_SCORE,
      instructions: "",
      scheduledDateTime: "",
      notifyBeforeStartMinutes:
        TEST_CONSTANTS.DEFAULT_VALUES.NOTIFY_BEFORE_MINUTES,
    },
  });

  const onSubmit = async (data: TestFormData) => {
    setLoading(true);

    try {
      // API call to create test
      console.log(data);

      toast.success("Test created successfully!");
      router.push("/tests");
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  const results = useQueries({
    queries: [
      {
        queryKey: ["questionsets"],
        queryFn: getQuestionSets,
      },
      {
        queryKey: ["groups"],
        queryFn: getGroups,
      },
    ],
  });
  const isPending = results.some((query) => query.isPending);
  const error = results.some((query) => query.error);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>error</span>;
  }
  const questions = results[0].data;

  const batches: BatchData[] = results[1].data;
  return (
    <PageLayout
      title="Create Test"
      description="Create a new test with basic information"
      actions={
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Test Title *
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter test title"
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingScore" className="text-gray-300">
                    Passing Score (%)
                  </Label>
                  <Input
                    id="passingScore"
                    type="number"
                    {...register("passingScore", { valueAsNumber: true })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    min="0"
                    max="100"
                  />
                  {errors.passingScore && (
                    <p className="text-red-400 text-sm">
                      {errors.passingScore.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit" className="text-gray-300">
                    Time Limit (minutes)
                  </Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    {...register("timeLimit", { valueAsNumber: true })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    min="1"
                  />
                  {errors.timeLimit && (
                    <p className="text-red-400 text-sm">
                      {errors.timeLimit.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduledDateTime" className="text-gray-300">
                    Scheduled Date & Time *
                  </Label>
                  <Input
                    id="scheduledDateTime"
                    type="datetime-local"
                    {...register("scheduledDateTime")}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                  {errors.scheduledDateTime && (
                    <p className="text-red-400 text-sm">
                      {errors.scheduledDateTime.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="flex flex-col md:flex-row md:items-start md:gap-4">
                  {/* Notify Before */}
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor="notifyBeforeStartMinutes"
                      className="text-gray-300"
                    >
                      Notify Before (minutes)
                    </Label>
                    <Input
                      id="notifyBeforeStartMinutes"
                      type="number"
                      min={1}
                      max={1440}
                      {...register("notifyBeforeStartMinutes", {
                        valueAsNumber: true,
                      })}
                      className="bg-gray-800 border-gray-700 text-gray-100 h-10 w-full"
                    />
                    {errors.notifyBeforeStartMinutes && (
                      <p className="text-sm text-red-400">
                        {errors.notifyBeforeStartMinutes.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="flex-1 space-y-1 mt-4 md:mt-0">
                    <Label htmlFor="category" className="text-gray-300">
                      Batches
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("batch", value)}
                      defaultValue=""
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 h-10 w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
                        {batches.map((batch: BatchData) => (
                          <SelectItem key={batch.id} value={batch.name}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.batch && (
                      <p className="text-sm text-red-400">
                        {errors.batch.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1 space-y-1 mt-4 md:mt-0">
                    <Label htmlFor="question" className="text-gray-300">
                      Question Sets
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("question", value)}
                      defaultValue=""
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 h-10 w-full">
                        <SelectValue placeholder="Select Question Set" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
                        {batches.map((batch: BatchData) => (
                          <SelectItem key={batch.id} value={batch.name}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.question && (
                      <p className="text-sm text-red-400">
                        {errors.question.message}
                      </p>
                    )}
                  </div>

                  {/* Difficulty */}
                  <div className="flex-1 space-y-1 mt-4 md:mt-0">
                    <Label htmlFor="difficulty" className="text-gray-300">
                      Difficulty
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(
                          "difficulty",
                          value as "easy" | "medium" | "hard"
                        )
                      }
                      defaultValue="medium"
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 h-10 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter test description"
                  className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-gray-300">
                  Instructions
                </Label>
                <Textarea
                  id="instructions"
                  {...register("instructions")}
                  placeholder="Enter test instructions for participants"
                  className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[80px]"
                />
              </div>

              {/* Notification Settings */}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Creating..." : "Create Test"}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

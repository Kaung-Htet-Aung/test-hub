"use client";

import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  UseFormSetValue,
} from "react-hook-form";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  Wand2,
  Loader2,
  Edit,
  Save,
  X,
  Plus,
  Briefcase,
  Code,
  GraduationCap,
  Check,
  CheckCircle,
  Circle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useQuestionGenerationStore,
  type GeneratedQuestion,
} from "@/store/question-generation-store";
import { QuestionCard } from "@/components/questions/QuestionCard";
import api from "@/lib/api";
// TypeScript interfaces for form data
interface QuestionGenerationFormData {
  jobField: string;
  language: string;
  experienceLevel: "entry" | "junior" | "mid" | "senior" | "lead";
  numberOfQuestions: number;
  additionalInstructions?: string;
}

interface ManualQuestionData {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer" | "coding";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  correctAnswer: string[];
  options?: string[];
  explanation?: string;
}

interface ManualQuestionsFormFormData {
  title: string;
  questions: ManualQuestionData[];
}

const jobFields = [
  "Web Development",
  "Mobile Development",
  "Backend Development",
  "Frontend Development",
  "Full Stack Development",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "Game Development",
  "Embedded Systems",
  "Blockchain",
  "Desktop Applications",
];

const programmingLanguages = [
  "JavaScript",
  "Python",
  "Java",
  "TypeScript",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Scala",
  "R",
  "MATLAB",
  "SQL",
  "HTML/CSS",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Django",
  "Flask",
  "Spring Boot",
  ".NET",
];

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "junior", label: "Junior (2-4 years)" },
  { value: "mid", label: "Mid-level (4-7 years)" },
  { value: "senior", label: "Senior (7-10 years)" },
  { value: "lead", label: "Lead/Principal (10+ years)" },
];

export default function GenerateQuestionsPage() {
  const router = useRouter();
  const {
    formData,
    generatedQuestions,
    editingQuestions,
    manualQuestions,
    loading,
    showResults,
    isEditing,
    setGeneratedQuestions,
    setLoading,
    setShowResults,
    startEditing,
    cancelEditing,
    updateEditingQuestion,
    updateEditingOption,
  } = useQuestionGenerationStore();

  // AI Generation Form
  const aiForm = useForm<QuestionGenerationFormData>({
    defaultValues: {
      jobField: formData.jobField || "",
      language: formData.language || "",
      experienceLevel: "entry",
      numberOfQuestions: formData.numberOfQuestions || 5,
    },
  });

  // Manual Questions Form
  const manualForm = useForm<ManualQuestionsFormFormData>({
    defaultValues: {
      questions: manualQuestions,
      title: "",
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: manualForm.control,
    name: "questions",
  });

  const handleGenerate = async (data: QuestionGenerationFormData) => {
    setLoading(true);
    setShowResults(false);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate questions");
      }

      const questionsWithIds = result.questions.map(
        (q: { id?: string; [key: string]: unknown }, index: number) => ({
          ...q,
          id: `generated-${Date.now()}-${index}`,
        })
      );

      setGeneratedQuestions(questionsWithIds);
      setShowResults(true);
      toast.success(
        `Successfully generated ${result.questions.length} questions!`
      );
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate questions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestions = async () => {
    const questionsToSave = isEditing ? editingQuestions : generatedQuestions;
    console.warn("Saving questions:", questionsToSave);
    toast.success("Questions saved successfully!");
    router.push("/questions");
  };

  const handleStartEditing = () => {
    startEditing();
  };

  const handleCancelEditing = () => {
    cancelEditing();
  };

  const updateQuestion = (
    id: string,
    field: keyof GeneratedQuestion,
    value: string | number
  ) => {
    updateEditingQuestion(id, { [field]: value });
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    updateEditingOption(questionId, optionIndex, value);
  };

  const addManualQuestionHandler = () => {
    const newQuestion = {
      id: `manual-${Date.now()}`,
      question: "",
      type: "multiple-choice" as const,
      difficulty: "medium" as const,
      points: 1,
      correctAnswer: [],
      options: ["", "", "", ""],
      explanation: "",
    };
    appendQuestion(newQuestion);
  };

  const removeManualQuestionHandler = (index: number) => {
    if (questionFields.length > 1) {
      removeQuestion(index);
    }
  };

  const handleManualGenerate = async (data: ManualQuestionsFormFormData) => {
    const validQuestions = data.questions.filter(
      (q) => q.question.trim() !== "" && q.correctAnswer.length !== 0
    );
    //  console.log(validQuestions);
    if (validQuestions.length === 0) {
      toast.error("Please fill in at least one question with a correct answer");
      return;
    }
    const question = {
      title: data.title,
      questions: data.questions,
    };
    console.log("question frontend", question);
    try {
      setLoading(true);
      const response = await api.post("/admin/add-questions", question);
      const result = await response.data;
      console.log(result);
      if (!response) {
        throw new Error(result.error || "Failed to save questions");
      }
      toast.success(
        `Successfully saved ${validQuestions.length} questions to database!`
      );
      // Reset the form and redirect to questions page
      manualForm.reset();
    } catch (error) {
      console.error("Error saving questions:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save questions"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Generate Questions"
      description="Generate or create technical interview questions"
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Configuration Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-purple-400" />
              Question Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="ai" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Generate with AI
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Create Manually
                </TabsTrigger>
              </TabsList>

              {/* AI Generation Form */}
              <TabsContent value="ai" className="space-y-6">
                <Form {...aiForm}>
                  <form
                    onSubmit={aiForm.handleSubmit(handleGenerate)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Job Field */}
                      <FormField
                        control={aiForm.control}
                        name="jobField"
                        rules={{ required: "Job field is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300 flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              Job Field *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                                  <SelectValue placeholder="Select job field" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-800">
                                {jobFields.map((jobField) => (
                                  <SelectItem key={jobField} value={jobField}>
                                    {jobField}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Programming Language */}
                      <FormField
                        control={aiForm.control}
                        name="language"
                        rules={{ required: "Programming language is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300 flex items-center gap-2">
                              <Code className="h-4 w-4" />
                              Programming Language *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-800">
                                {programmingLanguages.map((language) => (
                                  <SelectItem key={language} value={language}>
                                    {language}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Experience Level */}
                      <FormField
                        control={aiForm.control}
                        name="experienceLevel"
                        rules={{ required: "Experience level is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300 flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              Experience Level *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                                  <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-800">
                                {experienceLevels.map((level) => (
                                  <SelectItem
                                    key={level.value}
                                    value={level.value}
                                  >
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Number of Questions */}
                      <FormField
                        control={aiForm.control}
                        name="numberOfQuestions"
                        rules={{
                          required: "Number of questions is required",
                          min: {
                            value: 1,
                            message: "Must generate at least 1 question",
                          },
                          max: {
                            value: 20,
                            message: "Maximum 20 questions allowed",
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Number of Questions *
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-800">
                                {Array.from(
                                  { length: 20 },
                                  (_, i) => i + 1
                                ).map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Additional Instructions */}
                    <FormField
                      control={aiForm.control}
                      name="additionalInstructions"
                      rules={{
                        maxLength: {
                          value: 500,
                          message:
                            "Instructions must be less than 500 characters",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">
                            Additional Instructions (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Add any specific requirements or topics to focus on..."
                              className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[80px]"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Provide specific topics or requirements for the
                            generated questions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* AI Generate Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating Questions...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Generate Questions with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              {/* Manual Creation Form */}
              <TabsContent value="manual" className="space-y-6">
                <Form {...manualForm}>
                  <form
                    onSubmit={manualForm.handleSubmit(handleManualGenerate)}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-100">
                        Create & Save Questions
                      </h3>
                      <Button
                        type="button"
                        onClick={addManualQuestionHandler}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                    <FormField
                      control={manualForm.control}
                      name="title" // <--- This is now correct
                      rules={{ required: "A title for the quiz is required." }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-100 text-lg">
                            Quiz Title *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Biology 101 Final Exam"
                              {...field}
                              className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-6">
                      {questionFields.map((field, questionIndex) => (
                        <ManualQuestion
                          key={field.id}
                          control={manualForm.control}
                          questionIndex={questionIndex}
                          setValue={manualForm.setValue}
                          onRemove={() =>
                            questionFields.length > 1 &&
                            removeManualQuestionHandler(questionIndex)
                          }
                        />
                      ))}
                    </div>

                    {/* Manual Generate Button */}
                    {questionFields.length > 0 && (
                      <div className="flex justify-center pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          {loading ? "Saving..." : "Save Questions"}
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {showResults && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-100">
                  {isEditing ? "Edit Questions" : "Generated Questions"}
                </CardTitle>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancelEditing}
                        className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveQuestions}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Questions
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setShowResults(false)}
                        className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                      >
                        Back to Generator
                      </Button>
                      <Button
                        onClick={handleStartEditing}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Questions
                      </Button>
                      <Button
                        onClick={handleSaveQuestions}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save All
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(isEditing ? editingQuestions : generatedQuestions).map(
                  (question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      isEditing={isEditing}
                      onUpdate={updateQuestion}
                      onUpdateOption={updateOption}
                    />
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

// Component for individual manual question
function ManualQuestion({
  control,
  questionIndex,
  setValue,
  onRemove,
}: {
  control: Control<ManualQuestionsFormFormData>;
  questionIndex: number;
  setValue: UseFormSetValue<ManualQuestionsFormFormData>;
  onRemove: () => void;
}) {
  const watchedType = useWatch({
    control,
    name: `questions.${questionIndex}.type`,
  });

  const watchedOptions = useWatch({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const watchedCorrectAnswer = useWatch({
    control,
    name: `questions.${questionIndex}.correctAnswer`,
    defaultValue: [],
  });

  const handleSetCorrectAnswer = (optionIndex: number) => {
    const optionValue = watchedOptions?.[optionIndex]?.trim();
    if (!optionValue) return;

    const currentAnswers: string[] = watchedCorrectAnswer || [];

    console.log("current ans", currentAnswers);
    // Toggle the option in/out of the array
    const updatedAnswers = currentAnswers.includes(optionValue)
      ? currentAnswers.filter((ans) => ans !== optionValue) // remove if exists
      : [...currentAnswers, optionValue]; // add if not
    console.log("updated ans", updatedAnswers);
    // Set the array back to the form
    setValue(`questions.${questionIndex}.correctAnswer`, updatedAnswers, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Optional toast
    if (currentAnswers.includes(optionValue)) {
      toast.info(`Option ${optionIndex + 1} removed from correct answers`);
    } else {
      toast.success(`Option ${optionIndex + 1} added as correct answer`);
    }
  };

  const isOptionCorrect = (optionIndex: number) => {
    // 1. Get the string value of the option at the specified index
    const optionValue = watchedOptions?.[optionIndex]?.trim();

    // If the option itself is empty, it can't be correct
    if (!optionValue) {
      return false;
    }

    // 2. Check if that string value exists in the array of correct answers
    const currentAnswers: string[] = watchedCorrectAnswer || [];
    return currentAnswers.includes(optionValue);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4 space-y-4">
        {/* Question Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-gray-100">
            Question {questionIndex + 1}
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Question Text */}
        <FormField
          control={control}
          name={`questions.${questionIndex}.question`}
          rules={{
            required: "Question is required",
            minLength: {
              value: 10,
              message: "Question must be at least 10 characters",
            },
            maxLength: {
              value: 2000,
              message: "Question must be less than 2000 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 text-sm">
                Question *
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter your question here..."
                  className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Question Properties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name={`questions.${questionIndex}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm">Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="multiple-choice">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`questions.${questionIndex}.difficulty`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm">
                  Difficulty
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`questions.${questionIndex}.points`}
            rules={{
              required: "Points are required",
              min: { value: 1, message: "Points must be at least 1" },
              max: { value: 10, message: "Points must be less than 10" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm">Points</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="bg-gray-900 border-gray-700 text-gray-100"
                    min="1"
                    max="10"
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 1)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Options for multiple-choice */}
        {watchedType === "multiple-choice" && (
          <div className="space-y-3">
            <FormLabel className="text-gray-300 text-sm font-medium">
              Options *
            </FormLabel>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-600 flex-shrink-0">
                    <span className="text-xs font-medium text-gray-400">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                  </div>

                  <div className="flex-1 relative">
                    <FormField
                      control={control}
                      name={`questions.${questionIndex}.options.${optionIndex}`}
                      rules={{
                        required: `Option ${optionIndex + 1} is required`,
                        minLength: {
                          value: 1,
                          message: "Option cannot be empty",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={`Enter option ${String.fromCharCode(
                                65 + optionIndex
                              )}`}
                              className={`bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 pr-10 transition-all duration-200 ${
                                isOptionCorrect(optionIndex)
                                  ? "border-green-500 bg-green-900/20 focus:border-green-400"
                                  : "focus:border-blue-500"
                              }`}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Correct answer indicator */}
                    {isOptionCorrect(optionIndex) && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetCorrectAnswer(optionIndex)}
                    disabled={!watchedOptions?.[optionIndex]?.trim()}
                    className={`
                      p-2 h-8 w-8 rounded-full transition-all duration-200 flex-shrink-0
                      ${
                        isOptionCorrect(optionIndex)
                          ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                          : watchedOptions?.[optionIndex]?.trim()
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-green-400 border-gray-600 hover:border-green-500"
                          : "bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed"
                      }
                      ${
                        watchedOptions?.[optionIndex]?.trim() &&
                        !isOptionCorrect(optionIndex)
                          ? "hover:scale-105 transform"
                          : ""
                      }
                    `}
                    title={
                      isOptionCorrect(optionIndex)
                        ? "Correct answer"
                        : "Set as correct answer"
                    }
                  >
                    {isOptionCorrect(optionIndex) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <FormDescription className="text-gray-400 text-xs flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Click the circle button to set the correct answer for this
              question
            </FormDescription>
          </div>
        )}

        {/* Correct Answer - Only show for non-multiple-choice questions */}
        {/*  {watchedType !== "multiple-choice" && (
          <FormField
            control={control}
            name={`questions.${questionIndex}.correctAnswer`}
            rules={{
              required: "Correct answer is required",
              minLength: {
                value: 1,
                message: "Correct answer is required",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Correct Answer *
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter the correct answer..."
                    className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[60px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )} */}

        {/* Explanation */}
        <FormField
          control={control}
          name={`questions.${questionIndex}.explanation`}
          rules={{
            maxLength: {
              value: 1000,
              message: "Explanation must be less than 1000 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 text-sm">
                Explanation (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Provide an explanation for the correct answer..."
                  className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[60px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

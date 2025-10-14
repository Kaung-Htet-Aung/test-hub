import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  FileText,
  Code,
  BookOpen,
  Star,
  X,
  Plus,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";
import type { GeneratedQuestion } from "@/store/question-generation-store";

export interface QuestionCardProps {
  question: GeneratedQuestion;
  index?: number;
  isEditing?: boolean;
  onUpdate?: (
    id: string,
    field: keyof GeneratedQuestion,
    value: string | number
  ) => void;
  onUpdateOption?: (
    questionId: string,
    optionIndex: number,
    value: string
  ) => void;
  onAddOption?: (questionId: string) => void;
  onRemoveOption?: (questionId: string, optionIndex: number) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
}

export function QuestionCard({
  question,
  isEditing = false,
  onUpdate,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onEdit,
  onDelete,
  onCopy,
}: QuestionCardProps) {
  const {
    id,
    question: questionText,
    type,
    difficulty,
    options,
    correctAnswer,
    explanation,
    points,
  } = question;
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return <FileText className="h-4 w-4" />;
      case "coding":
        return <Code className="h-4 w-4" />;
      case "short-answer":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
      default:
        return "border-gray-600 text-gray-400";
    }
  };

  if (isEditing) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 space-y-4">
          {/* Question Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium text-gray-100">Question</h3>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Question *</label>
            <Textarea
              value={questionText}
              onChange={(e) => onUpdate?.(id, "question", e.target.value)}
              placeholder="Enter your question here..."
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[80px]"
            />
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Type</label>
            <Select
              value={type}
              onValueChange={(value) => onUpdate?.(id, "type", value)}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                <SelectItem value="short-answer">Short Answer</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Difficulty</label>
            <Select
              value={difficulty}
              onValueChange={(value) => onUpdate?.(id, "difficulty", value)}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Points */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Points</label>
            <Input
              type="number"
              value={points}
              onChange={(e) =>
                onUpdate?.(id, "points", parseInt(e.target.value) || 1)
              }
              className="bg-gray-900 border-gray-700 text-gray-100"
              min="1"
              max="10"
            />
          </div>

          {/* Options for multiple-choice */}
          {type === "multiple-choice" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 text-sm">Options</label>
                {options && options.length < 8 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onAddOption?.(id)}
                    className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Option
                  </Button>
                )}
              </div>

              {options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) =>
                      onUpdateOption?.(id, optionIndex, e.target.value)
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 flex-1"
                  />
                  <Button
                    variant={option === correctAnswer ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate?.(id, "correctAnswer", option)}
                    className={
                      option === correctAnswer
                        ? "bg-green-600"
                        : "bg-gray-700 border-gray-600 text-gray-200"
                    }
                  >
                    Correct
                  </Button>
                  {options && options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveOption?.(id, optionIndex)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Correct Answer for non-multiple-choice */}
          {type !== "multiple-choice" && (
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Correct Answer *</label>
              <Textarea
                value={correctAnswer}
                onChange={(e) =>
                  onUpdate?.(id, "correctAnswer", e.target.value)
                }
                placeholder="Enter the correct answer..."
                className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[60px]"
              />
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Explanation</label>
            <Textarea
              value={explanation}
              onChange={(e) => onUpdate?.(id, "explanation", e.target.value)}
              placeholder="Explain the correct answer..."
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[60px]"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {getTypeIcon(type)}
              <h3 className="text-lg font-medium text-gray-100">
                {questionText.length > 60
                  ? `${questionText.substring(0, 60)}...`
                  : questionText}
              </h3>
              <Badge
                variant="outline"
                className={`text-xs ${getTypeColor(type)}`}
              >
                {type.replace("-", " ")}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${getDifficultyColor(difficulty)}`}
              >
                {difficulty.toUpperCase()}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">{points} points</span>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">{questionText}</p>

            {/* Options for multiple-choice questions */}
            {type === "multiple-choice" && options && (
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Options:</div>
                <div className="grid grid-cols-2 gap-2">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-xs ${
                        option === correctAnswer
                          ? "bg-green-900 border border-green-700 text-green-300"
                          : "bg-gray-800 border border-gray-700 text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                      {option === correctAnswer && (
                        <CheckCircle className="inline h-3 w-3 ml-1 text-green-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Correct Answer for non-multiple-choice */}
            {type !== "multiple-choice" && (
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-1">
                  Correct Answer:
                </div>
                <p className="text-xs text-gray-300 bg-gray-800 p-2 rounded border border-gray-700">
                  {correctAnswer}
                </p>
              </div>
            )}

            {/* Explanation */}
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-1">Explanation:</div>
              <p className="text-xs text-gray-300">{explanation}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 ml-6">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-200"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onCopy && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-200"
                onClick={onCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-200"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
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
  );
}

export interface QuestionData {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer" | "coding";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  correctAnswer: string[];
  options: string[];
  explanation?: string;
}
export interface ManualQuestionData {
  title: string;
  questions: QuestionData[];
}

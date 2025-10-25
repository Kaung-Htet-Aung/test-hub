import { PrismaClient } from "@prisma/client";

interface ManualQuestionData {
  question: string;
  type: "multiple-choice" | "short-answer" | "coding";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  correctAnswer: string;
  options: string[];
  explanation?: string;
}
const prisma = new PrismaClient();

export const addQuestions = async (questions: ManualQuestionData[]) => {
  return prisma.$transaction(async (tx) => {
    const group = await tx.questionGroup.create({
      data: { name: "Match Questions" },
    });

    const data = questions.map((q) => ({
      question: q.question,
      type: q.type,
      difficulty: q.difficulty,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
      points: q.points,
      groupId: group.id,
    }));

    await tx.question.createMany({
      data,
      skipDuplicates: true,
    });

    return group;
  });
};

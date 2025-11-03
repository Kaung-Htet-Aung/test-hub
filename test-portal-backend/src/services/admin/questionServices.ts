import { PrismaClient } from "@prisma/client";
import { ManualQuestionData } from "../../types/question-type";
const prisma = new PrismaClient();

export const getQuestionSetService = async () => {
  return prisma.questionGroup.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

export const addQuestionService = async (questionData: ManualQuestionData) => {
  return prisma.$transaction(async (tx) => {
    const group = await tx.questionGroup.create({
      data: { name: questionData.title },
    });
    const removeQuestionIds = questionData.questions.map(
      ({ id, ...rest }) => rest
    );

    const data = removeQuestionIds.map((q) => ({
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

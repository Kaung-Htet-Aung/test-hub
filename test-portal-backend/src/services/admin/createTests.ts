import { PrismaClient, Difficulty } from "@prisma/client";

export interface CreateTestInput {
  title: string;
  description?: string;
  instructions?: string;
  passingScore?: number;
  timeLimit?: number;
  scheduledDateTime: string | Date; // from form it's string; converted to Date in controller
  notifyBeforeStartMinutes?: number;
  groupId: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  batchId: string;
}

const prisma = new PrismaClient();

export const createTest = (data: CreateTestInput) => {
  return prisma.test.create({
    data: {
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      passingScore: data.passingScore,
      timeLimit: data.timeLimit,
      scheduledDateTime: new Date(data.scheduledDateTime),
      notifyBeforeStartMinutes: data.notifyBeforeStartMinutes,
      difficulty:
        (data.difficulty?.toUpperCase() as Difficulty) || Difficulty.MEDIUM,
      groupId: data.groupId,
      batchTests: {
        create: {
          batch: {
            connect: { id: data.batchId },
          },
        },
      },
    },
  });
};

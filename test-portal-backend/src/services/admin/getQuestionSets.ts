import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getQuestionSets = async () => {
  return prisma.questionGroup.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

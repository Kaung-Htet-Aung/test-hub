import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getParticipantByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

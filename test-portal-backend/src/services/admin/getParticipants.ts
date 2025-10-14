import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getParticipants = async () => {
  return prisma.user.findMany({
    where: {
      role: "PARTICIPANT",
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      batchMembers: {
        select: {
          joinedAt: true,
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      attempts: true,
    },
  });
};

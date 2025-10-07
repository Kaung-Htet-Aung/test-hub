import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getGroups = async () => {
  return prisma.group.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

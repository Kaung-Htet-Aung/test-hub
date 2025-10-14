import { Prisma, PrismaClient } from "@prisma/client";
interface Participant {
  name: string;
  email: string;
  phone: string;
  note: string;
  groupId: string;
}
const prisma = new PrismaClient();

export const addParticipant = async (data: Participant) => {
  const participant: any = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    note: data.note,
    batchMembers: {
      create: {
        batch: {
          connect: { id: data.groupId },
        },
      },
    },
  };
  return prisma.user.create({ data: participant });
};

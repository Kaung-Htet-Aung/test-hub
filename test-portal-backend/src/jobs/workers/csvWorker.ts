import { Worker } from "bullmq";
import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";
import { connection } from "../../utils/connection";

interface CSVRow {
  name: string;
  email: string;
  phone: string;
  note: string;
  groupId: string;
}

const prisma = new PrismaClient();
const worker = new Worker(
  "csvQueue",
  async (job) => {
    const { filePath, groupId } = job.data;
    const rows: CSVRow[] = [];
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });
    const chunkSize = 20;
    const total = rows.length;
    try {
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);

        for (let j = 0; j < chunk.length; j++) {
          chunk[j].groupId = groupId;
        }

        const createdUsers = await prisma.$transaction(
          // 1. Map over your input data array
          chunk.map((data) =>
            // 2. Return a prisma.user.create promise for each item
            prisma.user.upsert({
              where: {
                email: data.email,
              },
              update: {},
              create: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                note: data.note,
                // 3. This is the nested write that creates the relation
                groupMembers: {
                  create: {
                    group: {
                      connect: { id: data.groupId },
                    },
                  },
                },
              },
              // Optionally include the relation in the returned object
              include: {
                groupMembers: true,
              },
            })
          )
        );
      }
      return { success: true };
    } catch (e: any) {
      throw new Error(e.message || "CSV insert failed");
    }
  },
  { connection }
);
worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
export default worker;

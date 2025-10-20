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
  batchId: string;
}

const prisma = new PrismaClient();
const worker = new Worker(
  "csvQueue",
  async (job) => {
    const { filePath, batchId } = job.data;
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
          chunk[j].batchId = batchId;
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
                batchMembers: {
                  create: {
                    batch: {
                      connect: { id: data.batchId },
                    },
                  },
                },
              },
              // Optionally include the relation in the returned object
              include: {
                batchMembers: true,
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

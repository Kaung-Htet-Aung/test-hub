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
type Data = {
  name: string;
  email: string;
  phone: string;
  note: string;
  groupMembers: {
    create: {
      group: {
        connect: {
          id: string;
        };
      };
    };
  };
};

const prisma = new PrismaClient();
const worker = new Worker(
  "csvQueue",
  async (job) => {
    const { filePath } = job.data;
    const rows: CSVRow[] = [];
    const datas: Data[] = [];
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });
    const chunkSize = 500;
    try {
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);

        const createdUsers = await prisma.$transaction(
          // 1. Map over your input data array
          chunk.map((data) =>
            // 2. Return a prisma.user.create promise for each item
            prisma.user.create({
              data: {
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
        return { success: true, total: rows.length };
      }
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

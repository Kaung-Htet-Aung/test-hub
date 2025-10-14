import { PrismaClient } from "@prisma/client";

// 1. Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log(`\nStart seeding the Group table... 🚀`);

  // Optional: Clean up existing data to make the seed idempotent
  // NOTE: If GroupParticipant and GroupTest exist, you may need to delete them first
  // if you have cascading deletes not set up, or just delete Groups.
  // For this example, we'll assume no related data exists yet or you are resetting.
  await prisma.batch.deleteMany();
  console.log("Cleared existing Group data.");

  // 2. Insert data using createMany() for efficiency
  const groupData = [
    { name: "Freshman English 101" },
    { name: "Advanced Calculus (Section A)" },
    { name: "Software Engineering Capstone" },
    { name: "Introduction to Data Science" },
  ];

  const result = await prisma.batch.createMany({
    data: groupData,
    skipDuplicates: true, // Prevents errors if a record somehow already exists
  });

  // 3. Log the results
  console.log(`Seeding complete. Inserted ${result.count} new groups. ✅`);

  // Optional: You can get all the created groups to display them
  const allGroups = await prisma.batch.findMany();
  console.log("Current Groups in DB:", allGroups.map((g) => g.name).join(", "));
}

// 4. Execute the main function
main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

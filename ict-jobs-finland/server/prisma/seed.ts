import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  "postgresql://postgres:postgres@localhost:51214/template1";

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});



async function main() {
  console.log("Connecting to database...");

  const company = await prisma.company.create({
    data: {
      name: "Example ICT Company",
      description: "A Finnish technology company.",
      location: "Helsinki",
      website: "https://example.com",
    },
  });

  await prisma.job.createMany({
    data: [
      {
        title: "Junior Web Developer",
        companyId: company.id,
        location: "Helsinki",
        workMode: "Hybrid",
        description: "Junior web development position.",
        technologies: ["React", "TypeScript", "Node.js"],
        jobType: "Full-time",
        experienceLevel: "Junior",
        salary: "3000–4000 €/month",
        applicationUrl: "https://example.com/jobs",
      },
      {
        title: "ICT Support Trainee",
        companyId: company.id,
        location: "Espoo",
        workMode: "On-site",
        description: "ICT support internship for students.",
        technologies: ["Windows", "Microsoft 365", "Networking"],
        jobType: "Internship",
        experienceLevel: "Entry-level",
        salary: null,
        applicationUrl: "https://example.com/jobs",
      },
    ],
  });

  console.log("Seed completed successfully!");
  console.log(`Created company: ${company.name}`);
  console.log("Created 2 jobs.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
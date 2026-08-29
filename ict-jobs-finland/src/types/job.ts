export type JobType =
  | "Full-time"
  | "Part-time"
  | "Internship"
  | "Summer"
  | "Trainee";

export type ExperienceLevel =
  | "Internship"
  | "Junior"
  | "Entry-level"
  | "Mid"
  | "Senior";

export interface Company {
  id: string;
  name: string;
  description: string;
  location: string;
  website?: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  description: string;
  technologies: string[];
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salary?: string | null;
  applicationUrl: string;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
  company?: Company;
}
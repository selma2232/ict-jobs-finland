export type JobType =
  | "full-time"
  | "part-time"
  | "internship-amk"
  | "internship-vocational"
  | "summer"
  | "trainee";

export type ExperienceLevel =
  | "internship"
  | "junior"
  | "entry-level"
  | "mid"
  | "senior";

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
  salary?: string;
  publishedAt: string;
  applicationUrl: string;
}
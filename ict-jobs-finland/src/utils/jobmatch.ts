import type { Job } from "../types/job";
import type { UserProfile } from "../types/profile";

export interface JobMatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
}

export function calculateJobMatch(
  job: Job,
  profile: UserProfile
): JobMatchResult {
  const userSkills = profile.skills.map((skill) =>
    skill.toLowerCase()
  );

  const jobSkills = job.technologies.map((skill) =>
    skill.toLowerCase()
  );

  const matchedSkills = job.technologies.filter((skill) =>
    userSkills.includes(skill.toLowerCase())
  );

  const missingSkills = job.technologies.filter(
    (skill) => !userSkills.includes(skill.toLowerCase())
  );

  let score = 0;

  // Skills = 60 %
  if (jobSkills.length > 0) {
    const skillScore =
      (matchedSkills.length / jobSkills.length) * 60;

    score += skillScore;
  }

  // Location = 20 %
  if (
    profile.location.trim() === "" ||
    job.location.toLowerCase() ===
      profile.location.toLowerCase()
  ) {
    score += 20;
  }

  // Education / job type = 20 %
  const educationMatches =
    (profile.educationLevel === "amk" &&
      job.jobType === "internship-amk") ||
    (profile.educationLevel === "vocational" &&
      job.jobType === "internship-vocational");

  if (educationMatches) {
    score += 20;
  } else if (
    job.experienceLevel === "junior" &&
    profile.educationLevel
  ) {
    score += 10;
  }

  const reasons: string[] = [];

  if (matchedSkills.length > 0) {
    reasons.push(
      `Sinulla on ${matchedSkills.length}/${job.technologies.length} työpaikassa mainituista teknologioista.`
    );
  }

  if (profile.location.toLowerCase() === job.location.toLowerCase()) {
    reasons.push("Työpaikan sijainti vastaa profiilisi sijaintia.");
  }

  if (educationMatches) {
    reasons.push(
      "Koulutustasosi sopii tämän työpaikan harjoittelutyypille."
    );
  }

  return {
    score: Math.round(Math.min(score, 100)),
    matchedSkills,
    missingSkills,
    reasons,
  };
}
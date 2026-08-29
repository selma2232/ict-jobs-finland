import type { Job } from "../types/job";
import type { UserProfile } from "../types/profile";

export interface JobMatchBreakdown {
  skills: number;
  location: number;
  education: number;
  interests: number;
  bonus: number;
}

export interface JobMatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedInterests: string[];
  reasons: string[];
  warnings: string[];
  breakdown: JobMatchBreakdown;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function calculateJobMatch(
  job: Job,
  profile: UserProfile
): JobMatchResult {
  /*
   * ----------------------------------------
   * 1. NORMALISOIDAAN DATA
   * ----------------------------------------
   */

  const userSkills = Array.isArray(profile.skills)
    ? profile.skills.filter(Boolean)
    : [];

  const userInterests = Array.isArray(profile.interests)
    ? profile.interests.filter(Boolean)
    : [];

  const jobTechnologies = Array.isArray(job.technologies)
    ? job.technologies.filter(Boolean)
    : [];

  const jobTitle = normalize(job.title || "");
  const jobDescription = normalize(job.description || "");
  const jobLocation = normalize(job.location || "");
  const profileLocation = normalize(profile.location || "");

  /*
   * ----------------------------------------
   * 2. SKILL MATCH — 50 %
   * ----------------------------------------
   */

  const matchedSkills = jobTechnologies.filter((technology) => {
    const normalizedTechnology = normalize(technology);

    return userSkills.some((skill) => {
      const normalizedSkill = normalize(skill);

      return (
        normalizedSkill === normalizedTechnology ||
        normalizedSkill.includes(normalizedTechnology) ||
        normalizedTechnology.includes(normalizedSkill)
      );
    });
  });

  const missingSkills = jobTechnologies.filter(
    (technology) =>
      !matchedSkills.some(
        (matchedSkill) =>
          normalize(matchedSkill) === normalize(technology)
      )
  );

  let skillScore = 0;

  if (jobTechnologies.length > 0 && userSkills.length > 0) {
    skillScore =
      (matchedSkills.length / jobTechnologies.length) * 50;
  }

  /*
   * ----------------------------------------
   * 3. LOCATION MATCH — 15 %
   * ----------------------------------------
   */

  let locationScore = 0;

  if (profileLocation === "") {
    locationScore = 7.5;
  } else if (
    profileLocation === jobLocation ||
    jobLocation.includes(profileLocation) ||
    profileLocation.includes(jobLocation)
  ) {
    locationScore = 15;
  } else if (
    jobLocation.includes("remote") ||
    jobLocation.includes("etä") ||
    jobLocation.includes("hybrid")
  ) {
    locationScore = 10;
  }

  /*
   * ----------------------------------------
   * 4. EDUCATION / EXPERIENCE — 20 %
   * ----------------------------------------
   */

  let educationScore = 0;

  const educationLevel = normalize(
    profile.educationLevel || ""
  );

  const jobType = normalize(job.jobType || "");

  const experienceLevel = normalize(
    job.experienceLevel || ""
  );

  const isInternship =
    jobType === "internship" ||
    jobType.includes("intern");

  const isSummer =
    jobType === "summer" ||
    jobType.includes("kesä");

  const isTrainee =
    jobType === "trainee" ||
    jobType.includes("trainee");

  const isJunior =
    experienceLevel === "junior" ||
    experienceLevel.includes("entry");

  if (educationLevel === "amk" && isInternship) {
    educationScore = 20;
  } else if (
    educationLevel === "vocational" &&
    isInternship
  ) {
    educationScore = 20;
  } else if (
    educationLevel === "university" &&
    (isInternship || isTrainee)
  ) {
    educationScore = 18;
  } else if (isJunior && educationLevel) {
    educationScore = 15;
  } else if (isSummer && educationLevel) {
    educationScore = 12;
  } else if (educationLevel) {
    educationScore = 8;
  }

  /*
   * ----------------------------------------
   * 5. INTEREST MATCH — 15 %
   * ----------------------------------------
   */

  const matchedInterests = userInterests.filter((interest) => {
    const normalizedInterest = normalize(interest);

    if (!normalizedInterest) {
      return false;
    }

    return (
      jobTitle.includes(normalizedInterest) ||
      jobDescription.includes(normalizedInterest) ||
      jobTechnologies.some((technology) =>
        normalize(technology).includes(normalizedInterest)
      )
    );
  });

  let interestScore = 0;

  if (userInterests.length > 0) {
    interestScore = Math.min(
      (matchedInterests.length / userInterests.length) * 15,
      15
    );
  } else {
    interestScore = 7.5;
  }

  /*
   * ----------------------------------------
   * 6. PREMIUM BONUS — MAX 4 %
   * ----------------------------------------
   */

  let bonus = 0;

  if (
    matchedSkills.length >= 3 &&
    locationScore >= 15
  ) {
    bonus += 2;
  }

  if (
    matchedInterests.length >= 2 &&
    educationScore >= 18
  ) {
    bonus += 2;
  }

  /*
   * ----------------------------------------
   * 7. FINAL SCORE
   * ----------------------------------------
   */

  const rawScore =
    skillScore +
    locationScore +
    educationScore +
    interestScore +
    bonus;

  const score = Math.round(
    Math.min(Math.max(rawScore, 0), 100)
  );

  /*
   * ----------------------------------------
   * 8. REASONS
   * ----------------------------------------
   */

  const reasons: string[] = [];
  const warnings: string[] = [];

  if (matchedSkills.length > 0) {
    reasons.push(
      `Sinulla on ${matchedSkills.length}/${jobTechnologies.length} tässä työssä mainituista teknologioista.`
    );
  }

  if (
    matchedSkills.length === jobTechnologies.length &&
    jobTechnologies.length > 0
  ) {
    reasons.push(
      "Kaikki työpaikan ilmoituksessa mainitut teknologiat löytyvät osaamisestasi."
    );
  }

  if (locationScore === 15) {
    reasons.push(
      "Työpaikan sijainti vastaa profiilisi sijaintia."
    );
  } else if (locationScore === 10) {
    reasons.push(
      "Työpaikka tarjoaa etä- tai hybridimahdollisuuden."
    );
  }

  if (educationScore >= 18) {
    reasons.push(
      "Koulutustasosi sopii hyvin tämän työpaikan vaatimuksiin."
    );
  } else if (educationScore >= 12) {
    reasons.push(
      "Koulutustaustasi sopii kohtuullisen hyvin tähän tehtävään."
    );
  }

  if (matchedInterests.length > 0) {
    reasons.push(
      `Profiilisi kiinnostuksen kohteista ${matchedInterests.length} liittyy tähän työpaikkaan.`
    );
  }

  if (isJunior && educationLevel) {
    reasons.push(
      "Tehtävä sopii uransa alkuvaiheessa olevalle hakijalle."
    );
  }

  /*
   * ----------------------------------------
   * 9. WARNINGS
   * ----------------------------------------
   */

  if (missingSkills.length > 0) {
    warnings.push(
      `Puuttuvia teknologioita: ${missingSkills.join(", ")}.`
    );
  }

  if (
    profileLocation &&
    locationScore === 0
  ) {
    warnings.push(
      "Työpaikan sijainti ei vastaa profiilisi sijaintia."
    );
  }

  if (
    educationScore <= 8 &&
    educationLevel
  ) {
    warnings.push(
      "Koulutustaustasi ei täysin vastaa ilmoituksen painotusta."
    );
  }

  if (
    matchedSkills.length === 0 &&
    jobTechnologies.length > 0
  ) {
    warnings.push(
      "Työpaikan teknologioista ei löytynyt vielä suoria osumia osaamiseesi."
    );
  }

  /*
   * ----------------------------------------
   * 10. EMPTY PROFILE
   * ----------------------------------------
   */

  const profileHasData =
    userSkills.length > 0 ||
    userInterests.length > 0 ||
    profileLocation !== "" ||
    educationLevel !== "";

  if (!profileHasData) {
    return {
      score: 0,

      matchedSkills: [],

      missingSkills: jobTechnologies,

      matchedInterests: [],

      reasons: [
        "Täytä profiilisi, jotta henkilökohtainen sopivuus voidaan laskea.",
      ],

      warnings: [
        "Lisää koulutustaso, sijainti, osaaminen ja kiinnostuksen kohteet profiiliisi.",
      ],

      breakdown: {
        skills: 0,
        location: 0,
        education: 0,
        interests: 0,
        bonus: 0,
      },
    };
  }

  /*
   * ----------------------------------------
   * 11. RETURN
   * ----------------------------------------
   */

  return {
    score,

    matchedSkills,

    missingSkills,

    matchedInterests,

    reasons,

    warnings,

    breakdown: {
      skills: Math.round(skillScore * 10) / 10,
      location: Math.round(locationScore * 10) / 10,
      education: Math.round(educationScore * 10) / 10,
      interests: Math.round(interestScore * 10) / 10,
      bonus: Math.round(bonus * 10) / 10,
    },
  };
}
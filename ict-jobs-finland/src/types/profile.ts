export type EducationLevel =
  | "amk"
  | "vocational"
  | "university"
  | "graduated";

export interface UserProfile {
  name: string;
  educationLevel: EducationLevel;
  field: string;
  location: string;
  skills: string[];
  interests: string[];
}
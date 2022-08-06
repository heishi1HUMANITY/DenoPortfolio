type SkillType = "framework" | "lang" | "os" | "service" | "software";

export type SkillData = {
  id: string;
  title: string;
  body: string;
  type: SkillType;
};

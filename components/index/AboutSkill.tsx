/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { SkillData } from "../../types/skillData.ts";
import SkillSection from "./SkillSection.tsx";

type AboutSkillProps = {
  skills: SkillData[];
};

export default function AboutSkill(props: AboutSkillProps) {
  const skillTypes = [
    { key: "lang", title: "language" },
    { key: "framework", title: "software framework" },
    { key: "software" },
    { key: "os" },
    { key: "service" },
  ];
  return (
    <div class={tw`w-full flex flex-col gap-4`}>
      {skillTypes.map((type: { key: string; title?: string }) => {
        const selectedSkills = props.skills.filter((skill: SkillData) =>
          skill.type === type?.key ?? type
        );
        return (
          <SkillSection
            title={type?.title ?? type.key}
            skills={selectedSkills}
          />
        );
      })}
    </div>
  );
}

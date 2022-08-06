/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { SkillData } from "../../types/skillData.ts";
import SkillDataRow from "./SkillDataRow.tsx";

type SkillSectionProps = {
  title: string;
  skills: SkillData[];
};

export default function SkillSection(props: SkillSectionProps) {
  return (
    <div class={tw`w-full flex flex-col items-start`}>
      <h2 class={tw`md:text-2xl text-xl mb-4 antialiased dark:text-gray-100`}>
        {props.title}
      </h2>
      {props.skills.map((skill: SkillData) => {
        return <SkillDataRow skill={skill} />;
      })}
    </div>
  );
}

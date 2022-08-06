/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { SkillData } from "../../types/skillData.ts";

type SkillDataRowProps = {
  skill: SkillData;
};

export default function SkillDataRow(props: SkillDataRowProps) {
  const pStyle = tw`mb-1 antialiased dark:text-gray-100`;

  return (
    <div class={tw`w-full mb-2 border-b border-gray-600 dark:border-gray-100`}>
      <p class={tw`md:text-lg texe-base mx-4 ${pStyle}`}>
        {props.skill.title}
      </p>
      <p class={pStyle + tw` md:text-base text-sm mx-6 ${pStyle}`}>
        {props.skill.body}
      </p>
    </div>
  );
}

/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { format } from "datetime";

type ArticleHeaderProps = {
  title: string;
  updatedAt: Date;
};

export default function ArticleHeader(props: ArticleHeaderProps) {
  return (
    <div class={tw`w-full flex flex-col items-start gap-3`}>
      <h1 class={tw`md:text-5xl text-3xl antialiased`}>{props.title}</h1>
      <p class={tw`text-sm antialiased`}>
        最終更新 : {format(props.updatedAt, "yyyy-MM-dd")}
      </p>
    </div>
  );
}

/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { ArticleInfo } from "../../types/articleInfo.ts";
import { format } from "datetime";

type ArticleCardProps = {
  articleInfo: ArticleInfo;
};

export default function ArticleCard(props: ArticleCardProps) {
  return (
    <a
      href={`/p/${props.articleInfo.id}`}
      class={tw`rounded py-6 px-3 mx-2 my-4 shadow-md sm:w-64 w-full flex flex-col items-center justify-start transition ease-in-out duration-500 transform hover:scale-105 card`}
    >
      <img
        src={props.articleInfo?.thumbnail?.url ?? "/face.webp"}
        alt={`${props.articleInfo.title}サムネイル`}
        class={tw`h-24 w-full object-cover rounded`}
      />
      <div class={tw`w-full h-32 pt-6 flex flex-col`}>
        <h2 class={tw`text-base mb-1 antialiased dark:text-gray-100`}>
          {props.articleInfo.title}
        </h2>
        <div class={tw`h-full flex flex-col items-end justify-end`}>
          <p class={tw`text-sm antialiased dark:text-gray-100`}>
            最終更新日: {format(new Date(props.articleInfo.updatedAt), "yyyy-MM-dd")}
          </p>
        </div>
      </div>
    </a>
  );
}

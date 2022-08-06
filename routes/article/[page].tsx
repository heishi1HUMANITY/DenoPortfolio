/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { MicroCmsResponse } from "../../types/microCmsResponse.ts";
import { ArticleInfo } from "../../types/articleInfo.ts";
import Head from "../../components/Head.tsx";
import Header from "../../components/Header.tsx";
import ArticleCard from "../../components/article/ArticleCard.tsx";
import { logger } from '../../utils/accessLogger.ts';

export const handler: Handlers<ArticleInfo[]> = {
  async GET(req, ctx) {
    logger(ctx.remoteAddr as Deno.NetAddr, req.url);

    const { page } = ctx.params;

    if (isNaN(+page) || +page <= 0) {
      return new Response(null, { status: 404 });
    }

    const fetchResult = await fetch(
      `https://heishi1humanity.microcms.io/api/v1/posts?fields=id,title,thumbnail,publishedAt,updatedAt&orders=-publishedAt&limit=50&offset=${
        50 * (+page - 1)
      }`,
      {
        method: "GET",
        headers: {
          "X-MICROCMS-API-KEY": Deno.env.get("X-MICROCMS-API-KEY") ?? "",
        },
      },
    );
    const microcmsResponse: MicroCmsResponse<ArticleInfo> = await fetchResult
      .json();

    if (microcmsResponse.contents.length === 0) {
      return new Response(
        null,
        {
          status: 302,
          headers: {
            "location": `./${Math.ceil(microcmsResponse.totalCount / 50)}`,
          },
        },
      );
    }

    return ctx.render(microcmsResponse.contents);
  },
};

export default function article(props: PageProps<ArticleInfo[]>) {
  return (
    <div id="container" class={tw`w-full flex flex-col relative`}>
      <Head>
        <title>articles{1}-heishi1HUMANITY</title>
        <link rel="stylesheet" href="/article.css" />
        <meta name="description" content="heishi1HUMANITYの記事一覧" />
        <meta property="og:title" content="articles1-heishi1HUMANITY" />
        <meta property="og:url" content={props.url.toString()} />
        <meta
          property="og:image"
          content={`${props.url.origin.toString()}/face.webp`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="heishi1HUMANITYの記事一覧" />
      </Head>
      <Header />
      <main
        class={tw`mx-4 my-6 md:mx-24 sm:m-12 flex flex-wrap`}
      >
        {props.data.map((articleInfo: ArticleInfo) => (
          <ArticleCard articleInfo={articleInfo} />
        ))}
      </main>
    </div>
  );
}

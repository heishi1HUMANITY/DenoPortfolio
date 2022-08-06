/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { highlightText } from "https://deno.land/x/speed_highlight_js@1.1.7/src/index.js";
import { detectLanguage } from "https://deno.land/x/speed_highlight_js@1.1.7/src/detect.js";
import Head from "../../components/Head.tsx";
import Header from "../../components/Header.tsx";
import { MicroCmsResponse } from "../../types/microCmsResponse.ts";
import { ArticleData } from "../../types/articleData.ts";
import ArticleHeader from "../../components/p/ArticleHeader.tsx";
import ShareButton from "../../islands/ShareButton.tsx";
import { logger } from "../../utils/accessLogger.ts";

export const handler: Handlers<ArticleData[]> = {
  async GET(req, ctx) {
    logger(ctx.remoteAddr as Deno.NetAddr, req.url);

    const { id } = ctx.params;

    const fetchResult = await fetch(
      `https://heishi1humanity.microcms.io/api/v1/posts?fields=id,title,body,publishedAt,updatedAt,thumbnail,keyword&ids=${id}`,
      {
        method: "GET",
        headers: {
          "X-MICROCMS-API-KEY": Deno.env.get("X-MICROCMS-API-KEY") ?? "",
        },
      },
    );
    const microCmsResponse: MicroCmsResponse<ArticleData> = await fetchResult
      .json();

    if (microCmsResponse.contents.length === 0) {
      return new Response(
        null,
        {
          status: 404,
        },
      );
    }

    const codeBolcks = microCmsResponse.contents[0].body
      .split(/\<pre\>/g)
      .filter((v) => v.match(/^<code>/))
      .map((v) => v.split(/<\/code><\/pre>/g)[0].replace(/<.*>/g, ""));
    const highlightedCodeBlocks = (await Promise.all(
      codeBolcks
        .map((v) =>
          v
            .replaceAll("&amp;", "&")
            .replaceAll("&#x27;", "'")
            .replaceAll("&#x60;", "`")
            .replaceAll("&quot;", '"')
            .replaceAll("&lt;", "<")
            .replaceAll("&gt;", ">")
            .replaceAll("&nbsp;", " ")
        )
        .map((v) => highlightText(v, detectLanguage(v).toString(), false)),
    ))
      .map((v) => `<div class="shj-lang-[code-language]">${v}</div>`);
    codeBolcks.forEach((v, index) =>
      microCmsResponse.contents[0].body = microCmsResponse.contents[0].body
        .replace(v, highlightedCodeBlocks[index])
    );

    return ctx.render(microCmsResponse.contents);
  },
};

export default function page(props: PageProps<ArticleData[]>) {
  return (
    <div id="container" class={tw`w-full flex flex-col relative`}>
      <Head>
        <title>{props.data[0].title}-heishi1HUMANITY</title>
        <link rel="stylesheet" href="/p.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/speed-highlight/core@1.1.7/dist/themes/visual-studio-dark.css"
        />
        <meta name="description" content={props.data[0].title} />
        <meta name="keywords" content={props.data[0]?.keyword} />
        <meta
          property="og:title"
          content={`${props.data[0].title}-heishi1HUMANITY`}
        />
        <meta property="og:url" content={props.url.toString()} />
        <meta
          property="og:image"
          content={props.data[0].thumbnail?.url ??
            `${props.url.origin.toString()}/face.webp`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={props.data[0].title} />
      </Head>
      <Header />
      <main class={tw`mx-4 my-6 md:mx-24 sm:m-12 flex flex-col gap-5`}>
        <ArticleHeader
          title={props.data[0].title}
          updatedAt={new Date(props.data[0].updatedAt)}
        />
        <div dangerouslySetInnerHTML={{ __html: props.data[0].body }} />
        <ShareButton
          title={props.data[0].title}
          description={props.data[0].title}
        />
      </main>
    </div>
  );
}

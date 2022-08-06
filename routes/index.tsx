/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { MicroCmsResponse } from "../types/microCmsResponse.ts";
import { SkillData } from "../types/skillData.ts";
import Head from "../components/Head.tsx";
import AboutName from "../components/index/AboutName.tsx";
import AboutStatus from "../components/index/AboutStatus.tsx";
import AboutSkill from "../components/index/AboutSkill.tsx";
import Header from "../components/Header.tsx";
import { logger } from "../utils/accessLogger.ts";

export const handler: Handlers<SkillData[]> = {
  async GET(req, ctx) {
    logger(ctx.remoteAddr as Deno.NetAddr, req.url);

    const fetchResult = await fetch(
      "https://heishi1humanity.microcms.io/api/v1/skills?fields=id,title,body,type&limit=100&orders=createdAt",
      {
        method: "GET",
        headers: {
          "X-MICROCMS-API-KEY": Deno.env.get("X-MICROCMS-API-KEY") ?? "",
        },
      },
    );
    const microCmsResponse: MicroCmsResponse<SkillData> = await fetchResult
      .json();
    return ctx.render(microCmsResponse.contents);
  },
};

export default function index(props: PageProps<SkillData[]>) {
  return (
    <div id="container" class={tw`w-full flex flex-col relative`}>
      <Head>
        <title>heishi1HUMANITY</title>
        <meta name="description" content="heishi1HUMANITYのトップページ" />
        <meta property="og:title" content="heishi1HUMANITY" />
        <meta property="og:url" content={props.url.toString()} />
        <meta
          property="og:image"
          content={`${props.url.origin.toString()}/face.webp`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="heishi1HUMANITYのトップページ" />
      </Head>
      <Header />
      <main
        class={tw`mx-4 my-6 flex flex-col items-start md:mx-24 sm:m-12 gap-4`}
      >
        <AboutName />
        <AboutStatus />
        <AboutSkill skills={props.data} />
      </main>
    </div>
  );
}

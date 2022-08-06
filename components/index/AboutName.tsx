/** @jsx h */
import { h } from "preact";
import { tw } from "twind";

export default function AboutName() {
  return (
    <div class={tw`flex flex-row items-center gap-5 ad`}>
      <div class={tw`flex flex-col align-center items-start`}>
        <h1 class={tw`md:text-5xl text-4xl antialiased dark:text-gray-100`}>
          heishi1HUMANITY
        </h1>
        <p class={tw`text-sm antialiased dark:text-gray-100`}>(大西 悠太)</p>
      </div>
      <div class={tw`flex flex-col items-center justify-center`}>
        <img
          src="/face.webp"
          alt="顔写真"
          class={tw`sm:h-32 h-20 my-4 rounded-full`}
        />
        <p class={tw`text-xs antialiased text-gray-600 dark:text-gray-100`}>
          ※素顔ではありません
        </p>
      </div>
    </div>
  );
}

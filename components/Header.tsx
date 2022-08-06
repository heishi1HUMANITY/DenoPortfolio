/** @jsx h */
import { h } from "preact";
import { tw } from "twind";

export default function Header() {
  return (
    <header
      class={tw`w-full h-16 md:px-24 sm:px-12 px-3 shadow-md flex items-center justify-between`}
    >
      <a
        href="/"
        class={tw`text-xl cursor-pointer hover:opacity-50 antialiased dark:text-gray-100`}
      >
        heishi1HUMANITY
      </a>
      <a
        href="/article/1"
        class={tw`text-base cursor-pointer hover:opacity-50 antialiased dark:text-gray-100`}
      >
        article
      </a>
    </header>
  );
}

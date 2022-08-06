/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { difference } from "datetime";

export default function AboutStatus() {
  const pStyle = tw`md:text-lg text-base antialiased mb-1 dark:text-gray-100`;
  const aStyle =
    tw`border-b hover:opacity-50 break-all ml-2 border-gray-600 dark:text-gray-100 dark:border-gray-100`;

  const getAge = () => {
    const birthday = new Date("2000-02-28T00:00:00+09:00");
    const today = new Date();
    const diff = difference(birthday, today);
    return diff.years;
  };

  return (
    <div class={tw`flex flex-col align-cneter items-start`}>
      <p class={pStyle}>
        age:<span class={tw`ml-2`}>{getAge()}</span>
      </p>
      <p class={pStyle}>
        organization:<span class={tw`ml-2`}>株式会社インフィニットループ</span>
      </p>
      <p class={pStyle}>
        github:
        <a
          href="https://github.com/heishi1HUMANITY"
          target="_blanl"
          rel="noopener noreferrer"
          class={aStyle}
        >
          heishi1HUMANITY
        </a>
      </p>
      <p class={pStyle}>
        twitter:
        <a
          href="https://twitter.com/YutaOnishi2"
          target="_blanl"
          rel="noopener noreferrer"
          class={aStyle}
        >
          @YutaOnishi2
        </a>
      </p>
      <p class={pStyle}>
        twitter:
        <a
          href="https://www.facebook.com/i4mhuman1ty/"
          target="_blanl"
          rel="noopener noreferrer"
          class={aStyle}
        >
          大西 悠太 (Yuta Onishi)
        </a>
      </p>
    </div>
  );
}

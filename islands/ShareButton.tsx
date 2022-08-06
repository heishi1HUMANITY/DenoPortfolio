/** @jsx h */
import { h } from "preact";
import { tw } from "twind";

type ShareButtonProps = {
  title: string;
  description: string;
};

export default function ShareButton(props: ShareButtonProps) {
  const share = () => {
    const url = location.href;
    navigator.share({
      title: `${props.title}-heishi1HUMANITY`,
      text: props.description,
      url,
    });
  };
  return (
    <button
      class={tw`text-base antialiased md:w-auto w-full md:px-6 md:py-1 py-2 mb-6 border transition duration-300 ease-in-out border-gray-900 dark:border-white focus:outline-none hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black`}
      onClick={share}
    >
      共有
    </button>
  );
}

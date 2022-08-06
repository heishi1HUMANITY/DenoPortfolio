/** @jsx h */
import { ComponentChildren, h } from "preact";
import { Head as FreshHead } from "$fresh/runtime.ts";

type HeadProps = {
  children: ComponentChildren;
};

export default function Head(props: HeadProps) {
  return (
    <FreshHead>
      {props.children}
      <meta property="og:site_name" content="heishi1HUMANITY" />
      <link rel="stylesheet" href="/default.css" />
      <link rel="icon" type="image/webp" href="/face.webp" />
    </FreshHead>
  );
}

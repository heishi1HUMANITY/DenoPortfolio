import { ArticleThumbnailInfo } from "./articleThumbnailInfo.ts";

export type ArticleData = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  updatedAt: string;
  thumbnail?: ArticleThumbnailInfo;
  keyword?: string;
};

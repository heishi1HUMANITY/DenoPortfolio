import { ArticleThumbnailInfo } from "./articleThumbnailInfo.ts";

export type ArticleInfo = {
  id: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  thumbnail?: ArticleThumbnailInfo;
};

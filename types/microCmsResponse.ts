export type MicroCmsResponse<T> = {
  contents: Array<T>;
  limit: number;
  offset: number;
  totalCount: number;
};

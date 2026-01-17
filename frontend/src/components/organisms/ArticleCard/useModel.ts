import { Article } from "../../../types/article";

export const useModel = (article: Article) => {
  return {
    article,
    // Add any future data transformation here
  };
};

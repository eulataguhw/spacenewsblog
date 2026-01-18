import { useTranslation } from "react-i18next";
import { COMMENT_SECTION_KEYS } from "./constants";
import { Comment } from "@api/commentsApi";

export const useModel = (comments: Comment[]) => {
  const { t: translation } = useTranslation();

  const title = translation(COMMENT_SECTION_KEYS.TITLE, {
    count: comments.length,
  });
  const noComments = translation(COMMENT_SECTION_KEYS.NO_COMMENTS);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();

  return {
    title,
    noComments,
    formatDate,
  };
};

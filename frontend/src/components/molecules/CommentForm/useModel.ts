import { useTranslation } from "react-i18next";
import { COMMENT_FORM_KEYS } from "./constants";

export const useModel = () => {
  const { t: translation } = useTranslation();

  return {
    title: translation(COMMENT_FORM_KEYS.TITLE),
    usernameLabel: translation(COMMENT_FORM_KEYS.USERNAME_LABEL),
    commentLabel: translation(COMMENT_FORM_KEYS.COMMENT_LABEL),
    submitButton: translation(COMMENT_FORM_KEYS.SUBMIT_BUTTON),
    submittingButton: translation(COMMENT_FORM_KEYS.SUBMITTING_BUTTON),
    getCommentLengthText: (length: number, max: number) => `${length}/${max}`,
  };
};

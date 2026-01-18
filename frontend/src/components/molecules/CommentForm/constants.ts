export const COMMENT_FORM_KEYS = {
  TITLE: "commentForm.title",
  USERNAME_LABEL: "commentForm.usernameLabel",
  COMMENT_LABEL: "commentForm.commentLabel",
  SUBMIT_BUTTON: "commentForm.submitButton",
  SUBMITTING_BUTTON: "commentForm.submittingButton",
  VALIDATION: {
    USERNAME_REQUIRED: "commentForm.validation.usernameRequired",
    COMMENT_REQUIRED: "commentForm.validation.commentRequired",
    COMMENT_MAX_LENGTH: "commentForm.validation.commentMaxLength",
  },
} as const;

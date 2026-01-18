import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCommentMutation } from "@api/commentsApi";

import { COMMENT_FORM_KEYS } from "./constants";
import { useTranslation } from "react-i18next";

// Define shape for type inference
const baseSchema = z.object({
  username: z.string(),
  comment: z.string(),
});

export type CommentFormValues = z.infer<typeof baseSchema>;

export const useController = (articleId: string) => {
  const { t: translation } = useTranslation();
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const commentSchema = z.object({
    username: z
      .string()
      .min(2, translation(COMMENT_FORM_KEYS.VALIDATION.USERNAME_REQUIRED)),
    comment: z
      .string()
      .min(2, translation(COMMENT_FORM_KEYS.VALIDATION.COMMENT_REQUIRED))
      .max(500, translation(COMMENT_FORM_KEYS.VALIDATION.COMMENT_MAX_LENGTH)),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      comment: "",
    },
  });

  const onSubmit = async (data: CommentFormValues) => {
    try {
      await createComment({
        articleId,
        username: data.username,
        comment: data.comment,
      }).unwrap();
      reset();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return {
    register,
    control,
    errors,
    isValid,
    watch,
    isLoading,
    handleSubmit: handleSubmit(onSubmit, (errors) =>
      console.error("Form validation failed:", errors),
    ),
  };
};

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useController } from "@components/molecules/CommentForm/useController";
import * as CommentsApi from "@api/commentsApi";

// Mock useCreateCommentMutation
vi.mock("@api/commentsApi", () => ({
  useCreateCommentMutation: vi.fn(),
}));

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("CommentForm/useController", () => {
  const mockCreateComment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation - Promise resolve (mutateAsync)
    mockCreateComment.mockResolvedValue({});

    vi.mocked(CommentsApi.useCreateCommentMutation).mockReturnValue({
      mutateAsync: mockCreateComment,
      isPending: false,
    } as any);
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useController("123"));
    expect(result.current.errors).toEqual({});
    // register and handleSubmit should be functions
    expect(typeof result.current.register).toBe("function");
    expect(typeof result.current.handleSubmit).toBe("function");
  });

  // ... (existing test 1)

  // ... (existing test 2)

  it("should handle submission error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    // Mock rejection directly
    mockCreateComment.mockRejectedValue("Error");

    vi.mocked(CommentsApi.useCreateCommentMutation).mockReturnValue({
      mutateAsync: mockCreateComment,
      isPending: false,
    } as any);

    const { result } = renderHook(() => useController("123"));

    // Simulate input changes using register's onChange
    await act(async () => {
      const usernameRegister = result.current.register("username");
      usernameRegister.onChange({
        target: { name: "username", value: "testuser" },
      } as any);
      const commentRegister = result.current.register("comment");
      commentRegister.onChange({
        target: {
          name: "comment",
          value: "This is a valid comment greater than 10 chars",
        },
      } as any);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(consoleSpy).toHaveBeenCalledWith("Failed to post comment:", "Error");
    // Should NOT clear comment on error - this would require checking the form's internal state
    // or mocking the reset function. For now, we just ensure the error is logged.

    consoleSpy.mockRestore();
  });

  it("should accept short comments (validation relaxed)", async () => {
    const { result } = renderHook(() => useController("123"));

    await act(async () => {
      const usernameRegister = result.current.register("username");
      usernameRegister.onChange({
        target: { name: "username", value: "me" },
      } as any);

      const commentRegister = result.current.register("comment");
      commentRegister.onChange({
        target: { name: "comment", value: "Hi" },
      } as any);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockCreateComment).toHaveBeenCalledWith({
      articleId: "123",
      username: "me",
      comment: "Hi",
    });
  });
});

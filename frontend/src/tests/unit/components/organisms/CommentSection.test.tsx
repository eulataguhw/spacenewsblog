import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CommentSection } from "@components/organisms/CommentSection/CommentSection";

// Mock CommentForm to focus on CommentSection logic
vi.mock("@components/molecules/CommentForm/CommentForm", () => ({
  CommentForm: () => <div data-testid="mock-comment-form" />,
}));

describe("CommentSection", () => {
  const mockComments = [
    {
      id: "1",
      username: "User 1",
      comment: "Great article!",
      created_at: "2023-01-01T10:00:00Z",
    },
    {
      id: "2",
      username: "User 2",
      comment: "I learned a lot.",
      created_at: "2023-01-01T11:00:00Z",
    },
  ] as any;

  it("should render comment count and list of comments", () => {
    render(<CommentSection articleId="1" comments={mockComments} />);

    expect(screen.getByText(/comments \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("Great article!")).toBeInTheDocument();
    expect(screen.getByText("User 2")).toBeInTheDocument();
    expect(screen.getByText("I learned a lot.")).toBeInTheDocument();
  });

  it("should render empty state message when no comments", () => {
    render(<CommentSection articleId="1" comments={[]} />);
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
  });

  it("should show loading spinner when isLoading is true", () => {
    render(<CommentSection articleId="1" comments={[]} isLoading={true} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should always render the CommentForm", () => {
    render(<CommentSection articleId="1" comments={[]} />);
    expect(screen.getByTestId("mock-comment-form")).toBeInTheDocument();
  });
});

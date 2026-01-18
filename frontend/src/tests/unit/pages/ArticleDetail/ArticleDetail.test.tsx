import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ArticleDetail from "@pages/ArticleDetail/ArticleDetail";
import * as useControllerModule from "@pages/ArticleDetail/useController";
import { BrowserRouter } from "react-router-dom";

vi.mock("@pages/ArticleDetail/useController");
vi.mock("@components/organisms/CommentSection/CommentSection", () => ({
  CommentSection: () => <div data-testid="mock-comment-section" />,
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ArticleDetail Page", () => {
  const mockHandleBackClick = vi.fn();
  const mockArticle = {
    id: "1",
    title: "Space News",
    summary: "Large summary of space.",
    image_url: "http://example.com/image.jpg",
    source: "NASA",
    published_at: "2023-01-01T12:00:00Z",
    url: "http://nasa.gov",
  };

  beforeEach(() => {
    vi.mocked(useControllerModule.useController).mockReturnValue({
      id: "1",
      article: mockArticle as any,
      comments: [],
      isLoading: false,
      isCommentsLoading: false,
      isError: false,
      handleBackClick: mockHandleBackClick,
    });
  });

  it("should render article content when loaded", () => {
    renderWithRouter(<ArticleDetail />);

    expect(screen.getByText("Space News")).toBeInTheDocument();
    expect(screen.getByText("NASA")).toBeInTheDocument();
    expect(screen.getByText("Large summary of space.")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      mockArticle.image_url,
    );
    expect(
      screen.getByRole("link", { name: /read original article/i }),
    ).toHaveAttribute("href", mockArticle.url);
  });

  it("should show loading spinner when isLoading is true", () => {
    vi.mocked(useControllerModule.useController).mockReturnValue({
      isLoading: true,
      article: null,
      comments: [],
      isCommentsLoading: false,
      isError: false,
      handleBackClick: mockHandleBackClick,
      id: "1",
    });

    renderWithRouter(<ArticleDetail />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should show error message on failure", () => {
    vi.mocked(useControllerModule.useController).mockReturnValue({
      isError: true,
      article: null,
      comments: [],
      isLoading: false,
      isCommentsLoading: false,
      handleBackClick: mockHandleBackClick,
      id: "1",
    });

    renderWithRouter(<ArticleDetail />);
    expect(screen.getByText(/error loading article/i)).toBeInTheDocument();
  });

  it("should call handleBackClick when back button is pressed", () => {
    renderWithRouter(<ArticleDetail />);
    const backBtn = screen.getByText(/back to feed/i);
    fireEvent.click(backBtn);
    expect(mockHandleBackClick).toHaveBeenCalled();
  });
});

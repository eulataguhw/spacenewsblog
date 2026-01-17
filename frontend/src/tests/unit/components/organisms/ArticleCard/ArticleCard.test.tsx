import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ArticleCard } from "@components/organisms/ArticleCard/ArticleCard";
import { Article } from "@app-types/article";

const mockArticle: Article = {
  id: "1",
  title: "Test Article",
  summary: "This is a test summary",
  published_at: "2023-01-01T12:00:00Z",
  source: "SpaceNews",
  image_url: "https://example.com/image.jpg",
  created_at: "2023-01-01T12:00:00Z",
  updated_at: "2023-01-01T12:00:00Z",
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ArticleCard", () => {
  it("renders article information correctly", () => {
    renderWithRouter(<ArticleCard article={mockArticle} />);

    expect(screen.getByText("Test Article")).toBeInTheDocument();
    expect(screen.getByText("This is a test summary")).toBeInTheDocument();
    expect(screen.getByText("SpaceNews")).toBeInTheDocument();
  });

  it("navigates to detail page on click", () => {
    renderWithRouter(<ArticleCard article={mockArticle} />);
    fireEvent.click(screen.getByText("Test Article"));
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import ArticleDetail from "@pages/ArticleDetail/ArticleDetail";
import { BrowserRouter, useNavigate } from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: () => ({ id: "123" }),
  };
});

describe("ArticleDetail", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("renders article detail placeholder", () => {
    render(
      <BrowserRouter>
        <ArticleDetail />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Article Detail/i)).toBeInTheDocument();
    expect(screen.getByText(/123/)).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    render(
      <BrowserRouter>
        <ArticleDetail />
      </BrowserRouter>,
    );

    const backButton = screen.getByText(/Back to Feed/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

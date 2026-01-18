import { render, screen } from "@testing-library/react";
import { Typography } from "@components/atoms/Typography/Typography";
import { describe, it, expect } from "vitest";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        "test.key": "Translated Text",
      };
      return translations[key] || key;
    },
    i18n: {
      exists: (key: string) => key === "test.key",
    },
  }),
}));

describe("Typography", () => {
  it("renders translated text when key exists", () => {
    render(<Typography>test.key</Typography>);
    expect(screen.getByText("Translated Text")).toBeInTheDocument();
  });

  it("renders original text when key does not exist", () => {
    render(<Typography>Fallback Text</Typography>);
    expect(screen.getByText("Fallback Text")).toBeInTheDocument();
  });

  it("renders non-string children as is", () => {
    render(
      <Typography>
        <span>Child Span</span>
      </Typography>,
    );
    expect(screen.getByText("Child Span")).toBeInTheDocument();
  });

  it("passes standard MUI props", () => {
    render(
      <Typography variant="h1" component="h2">
        Header
      </Typography>,
    );
    const element = screen.getByRole("heading", { level: 2 });
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Header");
  });
});

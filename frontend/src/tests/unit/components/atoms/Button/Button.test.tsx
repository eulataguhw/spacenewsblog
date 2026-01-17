import { render, screen } from "@testing-library/react";
import { Button } from "@components/atoms/Button/Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies rounded style when prop is passed", () => {
    const { container } = render(<Button rounded>Rounded</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveStyle("border-radius: 50px");
  });

  it("applies default style when rounded is not passed", () => {
    const { container } = render(<Button>Default</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveStyle("border-radius: 8px");
  });
});

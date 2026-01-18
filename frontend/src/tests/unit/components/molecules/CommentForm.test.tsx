import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CommentForm } from "@components/molecules/CommentForm/CommentForm";
import * as useControllerModule from "@components/molecules/CommentForm/useController";

vi.mock("@components/molecules/CommentForm/useController");

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("CommentForm", () => {
  const mockHandleSubmit = vi.fn((fn) => (e: any) => {
    e?.preventDefault?.();
    fn({});
  });

  const mockRegister = vi.fn(() => ({
    name: "test",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }));

  const defaultMockValues = {
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    errors: {},
    isValid: true,
    isLoading: false,
    watch: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useControllerModule.useController).mockReturnValue(
      defaultMockValues as any,
    );
  });

  it("should render username and comment fields", () => {
    render(<CommentForm articleId="1" />);
    expect(
      screen.getByLabelText(/commentForm\.usernameLabel/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/commentForm\.commentLabel/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /commentForm\.submitButton/i }),
    ).toBeInTheDocument();
  });

  it("should display character count", () => {
    vi.mocked(useControllerModule.useController).mockReturnValue({
      ...defaultMockValues,
      watch: vi.fn().mockReturnValue("12345"),
    } as any);

    render(<CommentForm articleId="1" />);
    expect(screen.getByText("5/500")).toBeInTheDocument();
  });

  it("should show error messages", () => {
    vi.mocked(useControllerModule.useController).mockReturnValue({
      ...defaultMockValues,
      errors: {
        username: { message: "Invalid username" },
        comment: { message: "Comment too long" },
      },
      watch: vi.fn(),
    } as any);

    render(<CommentForm articleId="1" />);
    expect(screen.getByText("Invalid username")).toBeInTheDocument();
    expect(screen.getByText("Comment too long")).toBeInTheDocument();
  });

  it("should disable submit button when form is invalid or loading", () => {
    vi.mocked(useControllerModule.useController).mockReturnValue({
      ...defaultMockValues,
      isValid: false,
    } as any);

    render(<CommentForm articleId="1" />);
    expect(
      screen.getByRole("button", { name: /commentForm\.submitButton/i }),
    ).toBeDisabled();

    vi.mocked(useControllerModule.useController).mockReturnValue({
      ...defaultMockValues,
      isValid: true,
      isLoading: true,
    } as any);

    render(<CommentForm articleId="1" />);
    expect(
      screen.getByRole("button", { name: /commentForm\.submittingButton/i }),
    ).toBeDisabled();
  });
});

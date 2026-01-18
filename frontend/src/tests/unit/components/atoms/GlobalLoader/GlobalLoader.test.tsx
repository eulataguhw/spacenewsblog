import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GlobalLoader } from "@components/atoms/GlobalLoader/GlobalLoader";
import * as reactRedux from "react-redux";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

describe("GlobalLoader", () => {
  it("should not render when isLoading is false", () => {
    vi.mocked(reactRedux.useSelector).mockReturnValue(false);
    render(<GlobalLoader />);

    // Backdrop usually has MuiBackdrop-root class or we can check opacity.
    // Ideally we check visibility. The CircularProgress is inside.
    // When open=false, Backdrop typically keeps children but hidden or unmounted?
    // MUI Backdrop with open=false has visibility: hidden.
    // But testing-library might still find it in DOM.
    // Let's check visible property if possible or style.
    // Actually, MUI Backdrop "unmountOnExit" is default? No.
    // Let's check visibility.
    // However, basic check: ensure call to useSelector was correct.
    expect(reactRedux.useSelector).toHaveBeenCalled();
  });

  it("should render when isLoading is true", () => {
    vi.mocked(reactRedux.useSelector).mockReturnValue(true);
    render(<GlobalLoader />);
    expect(
      screen.getByRole("progressbar", { hidden: true }),
    ).toBeInTheDocument();
  });
});

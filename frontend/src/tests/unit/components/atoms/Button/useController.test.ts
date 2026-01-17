import { renderHook } from "@testing-library/react";
import { useController } from "@components/atoms/Button/useController";

describe("Button useController", () => {
  it("returns empty object", () => {
    const { result } = renderHook(() => useController({ children: "Test" }));
    expect(result.current).toEqual({});
  });
});

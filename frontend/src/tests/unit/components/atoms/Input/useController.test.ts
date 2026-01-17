import { renderHook } from "@testing-library/react";
import { useController } from "@components/atoms/Input/useController";

describe("Input useController", () => {
  it("returns empty object", () => {
    const { result } = renderHook(() => useController({}));
    expect(result.current).toEqual({});
  });
});

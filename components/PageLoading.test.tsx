import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { PageLoading } from "./PageLoading";

describe("PageLoading", () => {
  it("renders the brand name inside an aria-hidden overlay", () => {
    const { container } = render(<PageLoading />);
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();
    expect(overlay).toHaveTextContent("SynelWeb");
  });
});

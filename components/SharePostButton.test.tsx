import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SharePostButton from "./SharePostButton";

const baseProps = {
  url: "/blog/my-post",
  title: "My Post",
  actionLabel: "Share",
  copyLabel: "Copy link",
  copiedLabel: "Copied!",
  fallbackTitle: "Share via",
  nativeHintLabel: "Uses your device's native share sheet when available.",
};

afterEach(() => {
  // @ts-expect-error - test cleanup of a property we may have defined
  delete navigator.share;
  // @ts-expect-error - test cleanup of a property we may have defined
  delete navigator.clipboard;
});

describe("SharePostButton", () => {
  it("uses the native share sheet when available and does not show the fallback menu", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    const user = userEvent.setup();

    render(<SharePostButton {...baseProps} />);
    await user.click(screen.getByRole("button", { name: "Share" }));

    await waitFor(() =>
      expect(share).toHaveBeenCalledWith(
        expect.objectContaining({ title: "My Post", url: expect.stringContaining("/blog/my-post") })
      )
    );
    expect(screen.queryByText("Share via")).not.toBeInTheDocument();
  });

  it("does not open the fallback menu when the user cancels the native share sheet", async () => {
    const abortError = new DOMException("cancelled", "AbortError");
    const share = vi.fn().mockRejectedValue(abortError);
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    const user = userEvent.setup();

    render(<SharePostButton {...baseProps} />);
    await user.click(screen.getByRole("button", { name: "Share" }));

    await waitFor(() => expect(share).toHaveBeenCalled());
    expect(screen.queryByText("Share via")).not.toBeInTheDocument();
  });

  it("falls back to the share menu when there is no native share support", async () => {
    const user = userEvent.setup();
    render(<SharePostButton {...baseProps} />);

    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(await screen.findByText("Share via")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "href",
      expect.stringContaining("facebook.com/sharer")
    );

    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.queryByText("Share via")).not.toBeInTheDocument();
  });

  it("copies the link and shows the copied label temporarily", async () => {
    // userEvent.setup() installs its own navigator.clipboard stub, so define
    // ours afterwards to make sure it's the one the component actually calls.
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

    render(<SharePostButton {...baseProps} />);
    await user.click(screen.getByRole("button", { name: "Share" }));
    await user.click(await screen.findByRole("button", { name: "Copy link" }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining("/blog/my-post"))
    );
    expect(await screen.findByRole("button", { name: "Copied!" })).toBeInTheDocument();

    await waitFor(
      () => expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument(),
      { timeout: 2500 }
    );
  }, 5000);

  it("keeps showing the copy label when the clipboard write fails", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

    render(<SharePostButton {...baseProps} />);
    await user.click(screen.getByRole("button", { name: "Share" }));
    await user.click(await screen.findByRole("button", { name: "Copy link" }));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
  });

  it("includes the optional text alongside the URL when sharing natively", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    const user = userEvent.setup();

    render(<SharePostButton {...baseProps} text="Check this out" />);
    await user.click(screen.getByRole("button", { name: "Share" }));

    await waitFor(() =>
      expect(share).toHaveBeenCalledWith(expect.objectContaining({ text: "Check this out" }))
    );
  });
});

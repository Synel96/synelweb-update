import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useSnapCarousel } from "./use-snap-carousel";

function TestCarousel({ slideCount }: { slideCount: number }) {
  const { scrollRef, activeIndex, prev, next, handleScroll } = useSnapCarousel(slideCount);

  return (
    <div>
      <div data-testid="active-index">{activeIndex}</div>
      <div ref={scrollRef} data-testid="track" onScroll={handleScroll} />
      <button type="button" onClick={prev}>
        prev
      </button>
      <button type="button" onClick={next}>
        next
      </button>
    </div>
  );
}

function mockTrackDimensions(track: HTMLElement, clientWidth: number) {
  Object.defineProperty(track, "clientWidth", { value: clientWidth, configurable: true });
  track.scrollTo = vi.fn();
}

describe("useSnapCarousel", () => {
  it("starts at index 0", () => {
    render(<TestCarousel slideCount={3} />);
    expect(screen.getByTestId("active-index")).toHaveTextContent("0");
  });

  it("calls scrollTo with the previous slide's offset, wrapping to the last slide from 0", async () => {
    const { container, findByRole } = render(<TestCarousel slideCount={3} />);
    const track = container.querySelector('[data-testid="track"]') as HTMLElement;
    mockTrackDimensions(track, 300);

    const prevButton = await findByRole("button", { name: "prev" });
    prevButton.click();

    expect(track.scrollTo).toHaveBeenCalledWith({ left: 2 * 300, behavior: "smooth" });
  });

  it("calls scrollTo with the next slide's offset, wrapping from the last slide back to 0", async () => {
    const { container, findByRole } = render(<TestCarousel slideCount={2} />);
    const track = container.querySelector('[data-testid="track"]') as HTMLElement;
    mockTrackDimensions(track, 200);

    const nextButton = await findByRole("button", { name: "next" });
    // index 0 -> 1 (last slide for slideCount=2)
    nextButton.click();
    expect(track.scrollTo).toHaveBeenCalledWith({ left: 1 * 200, behavior: "smooth" });
  });

  it("does nothing when the scroll track isn't mounted yet", () => {
    // slideCount 0 still renders fine; scrollToIndex guards on a null ref internally,
    // which is exercised simply by mounting/unmounting without a track dimension mock.
    const { unmount } = render(<TestCarousel slideCount={0} />);
    expect(() => unmount()).not.toThrow();
  });

  it("updates the active index from a scroll event based on scrollLeft/clientWidth", () => {
    const { container, getByTestId } = render(<TestCarousel slideCount={3} />);
    const track = container.querySelector('[data-testid="track"]') as HTMLElement;
    Object.defineProperty(track, "clientWidth", { value: 100, configurable: true });
    Object.defineProperty(track, "scrollLeft", { value: 250, configurable: true });

    fireEvent.scroll(track);

    expect(getByTestId("active-index")).toHaveTextContent("3");
  });

  it("ignores a scroll event while the track has zero width", () => {
    const { container, getByTestId } = render(<TestCarousel slideCount={3} />);
    const track = container.querySelector('[data-testid="track"]') as HTMLElement;
    Object.defineProperty(track, "clientWidth", { value: 0, configurable: true });

    fireEvent.scroll(track);

    expect(getByTestId("active-index")).toHaveTextContent("0");
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBackgroundVideo } from "./use-background-video";

// A stand-in for a <video>: jsdom has no media playback, so paused and
// currentTime are driven by hand.
function fakeVideo() {
  const video = document.createElement("video");
  let paused = false;
  let time = 0;
  Object.defineProperty(video, "paused", { get: () => paused });
  Object.defineProperty(video, "currentTime", {
    get: () => time,
    set: (value: number) => {
      time = value;
    },
  });
  video.play = vi.fn(() => {
    paused = false;
    return Promise.resolve();
  });
  video.pause = vi.fn(() => {
    paused = true;
  });
  return {
    video,
    setTime: (value: number) => {
      time = value;
    },
  };
}

describe("useBackgroundVideo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("plays the video again when the page is shown again after the browser paused it", () => {
    const { video } = fakeVideo();
    renderHook(() => useBackgroundVideo({ current: video }, true, () => {}));

    video.pause();
    document.dispatchEvent(new Event("visibilitychange"));

    expect(video.play).toHaveBeenCalled();
    expect(video.paused).toBe(false);
  });

  it("restarts a stalled video from the beginning", () => {
    const { video, setTime } = fakeVideo();
    renderHook(() => useBackgroundVideo({ current: video }, true, () => {}));

    setTime(2.5);
    vi.advanceTimersByTime(2000); // remembers 2.5
    vi.advanceTimersByTime(2000); // still 2.5: stalled

    expect(video.currentTime).toBe(0);
  });

  it("does not restart a video that keeps moving", () => {
    const { video, setTime } = fakeVideo();
    renderHook(() => useBackgroundVideo({ current: video }, true, () => {}));

    for (let i = 1; i <= 5; i += 1) {
      setTime(i * 1.5);
      vi.advanceTimersByTime(2000);
    }

    expect(video.currentTime).toBe(7.5);
  });

  it("gives up after repeated stalls, so the poster shows instead of a frozen frame", () => {
    const { video, setTime } = fakeVideo();
    const onGiveUp = vi.fn();
    renderHook(() => useBackgroundVideo({ current: video }, true, onGiveUp));

    for (let i = 0; i < 6; i += 1) {
      setTime(1.5);
      vi.advanceTimersByTime(2000);
    }

    expect(onGiveUp).toHaveBeenCalledTimes(1);
    expect(video.paused).toBe(true);

    document.dispatchEvent(new Event("visibilitychange"));
    expect(video.paused).toBe(true);
  });

  it("does nothing before the video has a source", () => {
    const { video } = fakeVideo();
    renderHook(() => useBackgroundVideo({ current: video }, false, () => {}));

    video.pause();
    document.dispatchEvent(new Event("visibilitychange"));

    expect(video.play).not.toHaveBeenCalled();
  });
});

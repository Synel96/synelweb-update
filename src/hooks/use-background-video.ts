import { useEffect, type RefObject } from "react";

// Restarts before the watchdog gives up and leaves the poster showing.
const MAX_STALLS = 3;
const CHECK_INTERVAL_MS = 2000;
// After the page is shown again the browser often needs a moment to bring the
// video back (it may have dropped the decoder or the buffer while hidden), so
// it can sit still for a few seconds without anything being wrong. Counting
// that as a stall used to jump the video back to the start, again and again,
// and then swap it for the poster: a flicker every time you came back.
const RESUME_GRACE_MS = 6000;

// Keeps a muted, looping background video playing while it is on screen:
//
// - The browser can pause it on its own: a locked screen, a switch to another
//   app or tab, a battery saver (iOS especially). It doesn't start it again by
//   itself, so the hero would stay frozen on that frame - wherever it was on
//   that device. So whenever the page is shown again, play it again.
// - Off screen it is paused, so a scrolled-away video costs no CPU or battery,
//   and it plays again once it is back in view.
// - A playing video whose time stops moving has stalled (a decoder hiccup, or
//   a damaged copy in the cache that ends early without "ended", so the loop
//   never restarts it): restart it from the beginning. If it keeps stalling,
//   this device can't play it: hide it, so the poster behind it shows instead
//   of a frozen frame (`onGiveUp`). Not moving while it is still loading data
//   or seeking, or just after the page was shown again, is not a stall.
//
// `active`: whether the video has a source yet.
export function useBackgroundVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  active: boolean,
  onGiveUp: () => void
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!active || !video) return;

    let inView = true;
    let gaveUp = false;
    let lastTime = -1;
    let stalls = 0;
    let graceUntil = 0;
    const play = () => {
      if (inView && !gaveUp && document.visibilityState === "visible") {
        void video.play().catch(() => {});
      }
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            inView = Boolean(entry?.isIntersecting);
            if (inView) play();
            else video.pause();
          });
    observer?.observe(video);

    let wasHidden = document.visibilityState !== "visible";
    const resume = () => {
      const visible = document.visibilityState === "visible";
      if (visible && wasHidden) {
        // Back from another tab/app or a minimised window: start the stall
        // watch afresh, after giving the browser time to resume.
        graceUntil = Date.now() + RESUME_GRACE_MS;
        lastTime = -1;
        stalls = 0;
      }
      wasHidden = !visible;
      play();
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    window.addEventListener("focus", resume);

    const timer = window.setInterval(() => {
      const loading =
        video.seeking ||
        (video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA &&
          video.networkState === HTMLMediaElement.NETWORK_LOADING);
      if (
        video.paused ||
        !inView ||
        document.visibilityState !== "visible" ||
        loading ||
        Date.now() < graceUntil
      ) {
        lastTime = -1;
        return;
      }
      if (lastTime < 0) {
        // First look since a (re)start: just remember where it is.
        lastTime = video.currentTime;
        return;
      }
      if (video.currentTime === lastTime) {
        stalls += 1;
        lastTime = -1;
        if (stalls >= MAX_STALLS) {
          gaveUp = true;
          window.clearInterval(timer);
          video.pause();
          onGiveUp();
          return;
        }
        video.currentTime = 0;
        void video.play().catch(() => {});
        return;
      }
      stalls = 0;
      lastTime = video.currentTime;
    }, CHECK_INTERVAL_MS);

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("focus", resume);
      window.clearInterval(timer);
    };
    // onGiveUp is left out on purpose: a new function each render would
    // restart the watchdog every time the page re-renders.
  }, [videoRef, active]);
}

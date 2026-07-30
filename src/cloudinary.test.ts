import { describe, expect, it } from "vitest";
import {
  cloudinaryImageUrl,
  cloudinarySizedImageUrl,
  cloudinaryVideoUrl,
  isCloudinaryImageUrl,
  withCloudinaryAutoParams,
} from "./cloudinary";

const CLOUD_NAME = "dmwulp3dl";

describe("cloudinaryVideoUrl", () => {
  it("builds a video upload URL, stripping leading slashes", () => {
    expect(cloudinaryVideoUrl("/demo/video.mp4")).toBe(
      `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/demo/video.mp4`
    );
  });

  it("works without a leading slash too", () => {
    expect(cloudinaryVideoUrl("demo/video.mp4")).toBe(
      `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/demo/video.mp4`
    );
  });
});

describe("cloudinaryImageUrl", () => {
  it("builds an image upload URL with f_auto,q_auto applied", () => {
    expect(cloudinaryImageUrl("demo/pic.jpg")).toBe(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/demo/pic.jpg`
    );
  });
});

describe("isCloudinaryImageUrl", () => {
  it("recognizes an /image/upload/ URL", () => {
    expect(
      isCloudinaryImageUrl(`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/pic.jpg`)
    ).toBe(true);
  });

  it("recognizes an /image/fetch/ URL", () => {
    expect(
      isCloudinaryImageUrl(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/https://x.com/a.png`
      )
    ).toBe(true);
  });

  it("rejects a non-Cloudinary URL", () => {
    expect(isCloudinaryImageUrl("https://example.com/pic.jpg")).toBe(false);
  });
});

describe("cloudinarySizedImageUrl", () => {
  it("inserts sizing transformations right after the version segment", () => {
    const url = cloudinarySizedImageUrl(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1700000000/demo/pic.jpg`,
      800,
      16 / 10
    );
    expect(url).toBe(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_auto,w_800,h_500,dpr_auto,f_auto,q_auto/v1700000000/demo/pic.jpg`
    );
  });

  it("clamps the width to a minimum of 240", () => {
    const url = cloudinarySizedImageUrl(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/pic.jpg`,
      10
    );
    expect(url).toContain("w_240");
  });

  it("merges with (and overrides) existing transformations instead of duplicating them", () => {
    const url = cloudinarySizedImageUrl(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_100/demo/pic.jpg`,
      400,
      2
    );
    // Old w_100 must be replaced, not duplicated alongside the new w_400.
    expect(url).toContain("w_400");
    expect(url).not.toContain("w_100");
    expect((url.match(/w_\d+/g) ?? []).length).toBe(1);
  });

  it("returns the trimmed URL unchanged when it isn't a recognizable Cloudinary URL", () => {
    expect(cloudinarySizedImageUrl("  https://example.com/pic.jpg  ", 400)).toBe(
      "https://example.com/pic.jpg"
    );
  });
});

describe("withCloudinaryAutoParams", () => {
  it("returns an empty string for blank input", () => {
    expect(withCloudinaryAutoParams("   ")).toBe("");
  });

  it("adds f_auto,q_auto right after the version segment of a Cloudinary upload URL", () => {
    expect(
      withCloudinaryAutoParams(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1700000000/demo/pic.jpg`
      )
    ).toBe(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/v1700000000/demo/pic.jpg`
    );
  });

  it("preserves a plain folder name (no version segment) instead of merging into it", () => {
    expect(
      withCloudinaryAutoParams(`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/demo/pic.jpg`)
    ).toBe(`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/demo/pic.jpg`);
  });

  it("still merges into a real transformation segment even without a version segment", () => {
    expect(
      withCloudinaryAutoParams(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_100/pic.jpg`
      )
    ).toBe(`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_100,f_auto,q_auto/pic.jpg`);
  });

  it("preserves a folder name containing an underscore that isn't a known transformation prefix", () => {
    expect(
      withCloudinaryAutoParams(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/user_uploads/pic.jpg`
      )
    ).toBe(`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/user_uploads/pic.jpg`);
  });

  it("leaves a non-Cloudinary URL untouched (aside from trimming)", () => {
    expect(withCloudinaryAutoParams("  https://example.com/pic.jpg  ")).toBe(
      "https://example.com/pic.jpg"
    );
  });

  it("returns the URL unchanged when there is no remainder after the upload segment", () => {
    expect(withCloudinaryAutoParams(`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`)).toBe(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`
    );
  });
});

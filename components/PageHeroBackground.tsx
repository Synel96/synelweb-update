import { cloudinaryWidthLimitedImageUrl } from "@/src/cloudinary";

const PAGE_HERO_BACKGROUND_SOURCE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1785435017/file_00000000ab7c81f4a2ae6d50ec63ad13_lakyk6.png";

const WIDTHS = [768, 1280, 1920, 2560];

const PAGE_HERO_BACKGROUND_URL = cloudinaryWidthLimitedImageUrl(PAGE_HERO_BACKGROUND_SOURCE, 1920);
const PAGE_HERO_BACKGROUND_SRCSET = WIDTHS.map(
  (width) => `${cloudinaryWidthLimitedImageUrl(PAGE_HERO_BACKGROUND_SOURCE, width)} ${width}w`
).join(", ");

// A full-screen image fixed behind the page. Browsers drop the decoded copy of
// images in a tab you leave (minimised window, other tab or app) and decode
// them again when you come back; for a large image that could paint a frame
// or two without it, a dark flash over the whole page. So: an image sized
// for the screen rather than the full original (much faster to decode), and
// decoded together with the rest of the page rather than painted in later.
export function PageHeroBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-(--background)" aria-hidden="true">
      <img
        src={PAGE_HERO_BACKGROUND_URL}
        srcSet={PAGE_HERO_BACKGROUND_SRCSET}
        sizes="100vw"
        alt=""
        className="h-full w-full object-cover object-[center_70%]"
        loading="eager"
        decoding="sync"
      />
      <div className="absolute inset-0 bg-[rgba(11,15,25,0.35)]" />
    </div>
  );
}

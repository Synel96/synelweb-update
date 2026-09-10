import { withCloudinaryAutoParams } from "@/src/cloudinary";

const PAGE_HERO_BACKGROUND_URL = withCloudinaryAutoParams(
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1785435017/file_00000000ab7c81f4a2ae6d50ec63ad13_lakyk6.png"
);

export function PageHeroBackground() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <img
        src={PAGE_HERO_BACKGROUND_URL}
        alt=""
        className="h-full w-full object-cover object-[center_70%]"
        loading="eager"
      />
      <div className="absolute inset-0 bg-[rgba(11,15,25,0.35)]" />
    </div>
  );
}

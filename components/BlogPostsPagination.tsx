import type { TFunction } from "i18next";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type BlogPostsPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  t: TFunction;
};

function getPageRange(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("ellipsis");

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) pages.push("ellipsis");
  pages.push(totalPages);

  return pages;
}

function translationOrFallback(t: TFunction, key: string, fallback: string) {
  const translated = t(key, { defaultValue: fallback });
  if (typeof translated !== "string") return fallback;

  // In some production i18n setups missing keys can come back namespaced.
  if (translated === key || translated.endsWith(`:${key}`)) {
    return fallback;
  }

  return translated;
}

export default function BlogPostsPagination({
  currentPage,
  totalPages,
  onPageChange,
  t,
}: BlogPostsPaginationProps) {
  if (totalPages <= 1) return null;

  const previousLabel = translationOrFallback(t, "blogPage.pagination.previous", "Previous");
  const nextLabel = translationOrFallback(t, "blogPage.pagination.next", "Next");
  const pageLabelPrefix = translationOrFallback(t, "blogPage.pagination.page", "Page");
  const pages = getPageRange(currentPage, totalPages);

  return (
    <Pagination className="mt-10" data-reveal>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-label={previousLabel}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            {previousLabel}
          </PaginationPrevious>
        </PaginationItem>

        {pages.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${item}`}>
              <PaginationLink
                isActive={item === currentPage}
                onClick={() => onPageChange(item)}
                aria-label={`${pageLabelPrefix} ${item}`}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            aria-label={nextLabel}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            {nextLabel}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

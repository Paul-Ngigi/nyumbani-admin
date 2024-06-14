"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { FC } from "react";

interface PaginationProps {
  pages: number;
}

const EPagination: FC<PaginationProps> = ({ pages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const renderPaginationLinks = () => {
    if (pages <= 0) {
      // Handle the case where pages is not a valid positive number
      console.error("Invalid value for 'pages'");
      return null;
    }

    return [...Array(pages > 5 ? 5 : pages)].map((_, index) => (
      <PaginationItem key={index}>
        <PaginationLink
          isActive={currentPage === index + 1}
          href={`${pathname}?${new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            page: String(index + 1),
          }).toString()}`}
        >
          {index + 1}
        </PaginationLink>
      </PaginationItem>
    ));
  };

  return (
    <div className="w-full">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`${pathname}?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: String(currentPage > 1 ? currentPage - 1 : currentPage),
              }).toString()}`}
            />
          </PaginationItem>

          {renderPaginationLinks()}

          <PaginationItem>
            <PaginationNext
              href={`${pathname}?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: String(
                  currentPage < pages ? currentPage + 1 : currentPage
                ),
              }).toString()}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default EPagination;

/**
 * @file sort-select.tsx
 * @description 정렬 선택 컴포넌트
 *
 * 상품 목록 정렬 옵션을 선택하는 컴포넌트
 */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const SORT_OPTIONS = [
  { value: "created_desc", label: "최신순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름순" },
] as const;

export function SortSelect() {
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "created_desc";

  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label ||
    "최신순";

  const createSortUrl = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    // 페이지는 1로 리셋
    params.delete("page");
    return `/products?${params.toString()}`;
  };

  return (
    <div className="relative group">
      <Button
        variant="outline"
        className="flex items-center gap-2 min-w-[140px] justify-between"
      >
        <span>{currentLabel}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {/* 드롭다운 메뉴 */}
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        <div className="py-1">
          {SORT_OPTIONS.map((option) => {
            const isActive = option.value === currentSort;
            return (
              <Link
                key={option.value}
                href={createSortUrl(option.value)}
                className={`
                  block px-4 py-2 text-sm transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}


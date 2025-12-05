/**
 * @file category-filter.tsx
 * @description 카테고리 필터 컴포넌트
 *
 * 상품 목록 페이지에서 카테고리별 필터링을 위한 컴포넌트
 */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORY_NAMES } from "@/lib/types/product";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: null, label: "전체" },
  { value: "electronics", label: CATEGORY_NAMES.electronics },
  { value: "clothing", label: CATEGORY_NAMES.clothing },
  { value: "books", label: CATEGORY_NAMES.books },
  { value: "food", label: CATEGORY_NAMES.food },
  { value: "sports", label: CATEGORY_NAMES.sports },
  { value: "beauty", label: CATEGORY_NAMES.beauty },
  { value: "home", label: CATEGORY_NAMES.home },
] as const;

export function CategoryFilter() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const createCategoryUrl = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    // 페이지는 1로 리셋
    params.delete("page");
    return `/products?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => {
        const isActive =
          (category.value === null && currentCategory === null) ||
          category.value === currentCategory;

        return (
          <Link
            key={category.value || "all"}
            href={createCategoryUrl(category.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}


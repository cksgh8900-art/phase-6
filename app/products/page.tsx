/**
 * @file page.tsx
 * @description 상품 목록 페이지
 *
 * Grid 레이아웃으로 상품을 표시하며, 카테고리 필터, 정렬, 페이지네이션 기능 제공
 */

import { Suspense } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { CategoryFilter } from "@/components/products/category-filter";
import { SortSelect } from "@/components/products/sort-select";
import { Pagination } from "@/components/products/pagination";
import { getProducts } from "@/lib/supabase/queries/products";
import type { ProductCategory, SortOption } from "@/lib/types/product";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // 쿼리 파라미터 파싱
  const category = (params.category as ProductCategory) || null;
  const sort = (params.sort as SortOption) || "created_desc";
  const page = parseInt(params.page || "1", 10);

  // 상품 데이터 조회
  const { products, total, totalPages } = await getProducts({
    category,
    sort,
    page,
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            상품 목록
          </h1>

          {/* 필터 및 정렬 컨트롤 */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <Suspense fallback={<div className="h-10 w-full" />}>
              <CategoryFilter />
            </Suspense>
            <Suspense fallback={<div className="h-10 w-40" />}>
              <SortSelect />
            </Suspense>
          </div>

          {/* 결과 개수 표시 */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            총 {total}개의 상품
          </p>
        </div>

        {/* 상품 Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
                />
              ))}
            </div>
          }
        >
          <ProductGrid products={products} />
        </Suspense>

        {/* 페이지네이션 */}
        <Suspense fallback={null}>
          <Pagination currentPage={page} totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}


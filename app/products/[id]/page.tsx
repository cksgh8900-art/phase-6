/**
 * @file page.tsx
 * @description 상품 상세 페이지
 *
 * 상품의 상세 정보를 표시하는 페이지 (재고, 가격, 설명 포함)
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/supabase/queries/products";
import { formatPrice, CATEGORY_NAMES } from "@/lib/types/product";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  // 상품 데이터 조회
  const product = await getProductById(id);

  // 상품이 없으면 404
  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock_quantity === 0;
  const categoryName =
    product.category && CATEGORY_NAMES[product.category]
      ? CATEGORY_NAMES[product.category]
      : product.category || "기타";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              상품 목록으로
            </Button>
          </Link>
        </div>

        {/* 상품 상세 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 이미지 영역 */}
          <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            <Package className="w-32 h-32 text-gray-400 dark:text-gray-500" />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-2xl">품절</span>
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="flex flex-col gap-6">
            {/* 카테고리 */}
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {categoryName}
              </span>
            </div>

            {/* 상품명 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {product.name}
            </h1>

            {/* 가격 */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* 재고 상태 */}
            <div className="flex items-center gap-4">
              {isOutOfStock ? (
                <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                  품절
                </span>
              ) : (
                <span className="text-lg text-gray-700 dark:text-gray-300">
                  재고:{" "}
                  <span className="font-semibold">
                    {product.stock_quantity}개
                  </span>
                </span>
              )}
            </div>

            {/* 구분선 */}
            <hr className="border-gray-200 dark:border-gray-700" />

            {/* 상품 설명 */}
            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  상품 설명
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="mt-auto pt-6">
              <AddToCartButton
                productId={product.id}
                stockQuantity={product.stock_quantity}
                disabled={isOutOfStock}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

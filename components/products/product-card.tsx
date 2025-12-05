/**
 * @file product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 상품 정보를 카드 형태로 표시하는 재사용 가능한 컴포넌트
 */

import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { formatPrice, CATEGORY_NAMES } from "@/lib/types/product";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const categoryName =
    product.category && CATEGORY_NAMES[product.category]
      ? CATEGORY_NAMES[product.category]
      : product.category || "기타";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
    >
      {/* 이미지 영역 (플레이스홀더) */}
      <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">품절</span>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* 카테고리 */}
        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
          {categoryName}
        </span>

        {/* 상품명 */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* 설명 (선택적) */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* 가격 및 재고 */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(product.price)}
          </span>
          {!isOutOfStock && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              재고 {product.stock_quantity}개
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}


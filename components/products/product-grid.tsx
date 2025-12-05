/**
 * @file product-grid.tsx
 * @description 상품 Grid 레이아웃 컴포넌트
 *
 * 상품 목록을 Grid 형태로 표시하는 컴포넌트
 */

import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types/product";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          상품이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}


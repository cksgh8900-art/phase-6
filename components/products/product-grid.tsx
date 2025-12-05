/**
 * @file product-grid.tsx
 * @description 상품 Grid 레이아웃 컴포넌트
 *
 * 상품 목록을 Grid 형태로 표시하는 컴포넌트
 */

import { ProductCard } from "./product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";
import type { Product } from "@/lib/types/product";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="상품이 없습니다"
        description="현재 등록된 상품이 없습니다."
      />
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


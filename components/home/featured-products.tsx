/**
 * @file featured-products.tsx
 * @description 인기 상품 미리보기 컴포넌트
 *
 * 홈페이지에 표시되는 인기 상품 섹션
 */

import Link from "next/link";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types/product";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            인기 상품
          </h2>
          <Link href="/products">
            <Button variant="outline" className="flex items-center gap-2">
              전체 보기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}


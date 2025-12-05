/**
 * @file page.tsx
 * @description 홈페이지
 *
 * 프로모션 배너, 카테고리 진입, 인기 상품 미리보기를 포함하는 메인 페이지
 */

import { HeroBanner } from "@/components/home/hero-banner";
import { CategorySection } from "@/components/home/category-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { getFeaturedProducts } from "@/lib/supabase/queries/products";

export default async function Home() {
  // 인기 상품 8개 조회
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <main className="min-h-screen">
      <HeroBanner />
      <CategorySection />
      <FeaturedProducts products={featuredProducts} />
    </main>
  );
}

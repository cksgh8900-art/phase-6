/**
 * @file hero-banner.tsx
 * @description 프로모션 배너 컴포넌트
 *
 * 홈페이지 상단에 표시되는 프로모션 배너
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section 
      className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-16 md:py-24"
      aria-label="프로모션 배너"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            특별한 쇼핑 경험을 시작하세요
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-blue-100 dark:text-blue-200 max-w-2xl mx-auto">
            최신 트렌드와 품질 좋은 상품들을 한 곳에서 만나보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 dark:focus:ring-offset-blue-800"
                aria-label="상품 목록으로 이동"
              >
                쇼핑하기
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


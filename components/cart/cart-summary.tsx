/**
 * @file cart-summary.tsx
 * @description 장바구니 요약 컴포넌트
 *
 * 장바구니 총 금액 및 주문하기 버튼을 포함하는 요약 컴포넌트
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/types/product";
import type { CartSummary } from "@/lib/types/cart";
import { ShoppingBag } from "lucide-react";

interface CartSummaryProps {
  summary: CartSummary;
}

export function CartSummary({ summary }: CartSummaryProps) {
  if (summary.items.length === 0) {
    return (
      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">
          장바구니가 비어있습니다.
        </p>
        <Link href="/products" className="block mt-4">
          <Button className="w-full">쇼핑하러 가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        주문 요약
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">상품 개수</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {summary.totalItems}개
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">상품 금액</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {formatPrice(summary.totalPrice)}
          </span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              총 주문 금액
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(summary.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      <Link href="/checkout" className="block">
        <Button size="lg" className="w-full flex items-center justify-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          주문하기
        </Button>
      </Link>
    </div>
  );
}


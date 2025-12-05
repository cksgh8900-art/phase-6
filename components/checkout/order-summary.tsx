/**
 * @file order-summary.tsx
 * @description 주문 요약 컴포넌트
 *
 * 주문 페이지에 표시되는 주문할 상품 목록 및 총 금액
 */

import { formatPrice } from "@/lib/types/product";
import type { CartSummary } from "@/lib/types/cart";
import { Package } from "lucide-react";

interface OrderSummaryProps {
  summary: CartSummary;
}

export function OrderSummary({ summary }: OrderSummaryProps) {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        주문 상품
      </h2>

      <div className="space-y-4 mb-6">
        {summary.items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
          >
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
              <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatPrice(item.product.price)} × {item.quantity}개
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
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
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
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
    </div>
  );
}


/**
 * @file page.tsx
 * @description 주문 페이지
 *
 * 배송지 입력 및 주문 생성을 위한 페이지
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartSummary } from "@/lib/supabase/queries/cart";
import { OrderSummary } from "@/components/checkout/order-summary";
import { CheckoutPaymentFlow } from "@/components/checkout/checkout-payment-flow";

export default async function CheckoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const summary = await getCartSummary(userId);

  if (summary.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          주문하기
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 배송지 입력 폼 및 결제위젯 */}
          <div className="lg:col-span-2">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <CheckoutPaymentFlow summary={summary} />
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <OrderSummary summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}


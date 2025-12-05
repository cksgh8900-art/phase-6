/**
 * @file page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니 아이템을 표시하고 관리하는 페이지
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartSummary } from "@/lib/supabase/queries/cart";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart } from "lucide-react";

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const summary = await getCartSummary(userId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          장바구니
        </h1>

        {summary.items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="장바구니가 비어있습니다"
            description="원하는 상품을 장바구니에 담아보세요."
            action={{
              label: "쇼핑하러 가기",
              href: "/products",
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 장바구니 아이템 목록 */}
            <div className="lg:col-span-2 space-y-4">
              {summary.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* 장바구니 요약 */}
            <div className="lg:col-span-1">
              <CartSummary summary={summary} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


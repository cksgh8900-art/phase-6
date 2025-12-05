/**
 * @file page.tsx
 * @description 주문 내역 페이지
 *
 * 사용자의 주문 목록을 표시하는 페이지 (Phase 5에서 상세 구현 예정)
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrders } from "@/lib/supabase/queries/orders";
import Link from "next/link";
import { formatPrice } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await getOrders(userId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              홈으로
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            주문 내역
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Package className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              주문 내역이 없습니다
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              아직 주문한 상품이 없습니다.
            </p>
            <Link href="/products">
              <Button>쇼핑하러 가기</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        주문번호: {order.id.slice(0, 8)}
                      </p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


/**
 * @file page.tsx
 * @description 주문 완료 페이지
 *
 * 주문 완료 후 주문 상세 정보를 표시하는 페이지
 */

import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Package, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/supabase/queries/orders";
import { formatPrice } from "@/lib/types/product";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const order = await getOrderById(id, userId);

  if (!order) {
    notFound();
  }

  const getStatusIcon = () => {
    switch (order.status) {
      case "delivered":
        return <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />;
      case "shipped":
        return <Package className="w-10 h-10 text-purple-600 dark:text-purple-400" />;
      case "confirmed":
        return <CheckCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />;
      case "pending":
        return <Package className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />;
      case "cancelled":
        return <Package className="w-10 h-10 text-gray-600 dark:text-gray-400" />;
      default:
        return <Package className="w-10 h-10 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusBgColor = () => {
    switch (order.status) {
      case "delivered":
        return "bg-green-100 dark:bg-green-900";
      case "shipped":
        return "bg-purple-100 dark:bg-purple-900";
      case "confirmed":
        return "bg-blue-100 dark:bg-blue-900";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900";
      case "cancelled":
        return "bg-gray-100 dark:bg-gray-800";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link href="/orders">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              주문 내역으로
            </Button>
          </Link>
        </div>

        {/* 주문 상태 헤더 */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${getStatusBgColor()} rounded-full mb-4`}>
            {getStatusIcon()}
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            주문 상세
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <p className="text-gray-600 dark:text-gray-400">
              주문번호: {order.id.slice(0, 8)}
            </p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            주문일: {new Date(order.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* 주문 정보 */}
        <div className="space-y-6 mb-8">
          {/* 주문 상품 목록 */}
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                주문 상품
              </h2>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatPrice(item.price)} × {item.quantity}개
                    </p>
                  </div>
                  <p className="font-semibold text-lg text-gray-900 dark:text-gray-100 ml-4">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 배송지 정보 */}
          {order.shipping_address && (
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  배송지 정보
                </h2>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[80px]">받는 분:</span>
                  <span>{order.shipping_address.recipientName}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[80px]">전화번호:</span>
                  <span>{order.shipping_address.recipientPhone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[80px]">주소:</span>
                  <span>
                    ({order.shipping_address.postalCode}){" "}
                    {order.shipping_address.address}{" "}
                    {order.shipping_address.detailAddress}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 주문 요청사항 */}
          {order.order_note && (
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  주문 요청사항
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                {order.order_note}
              </p>
            </div>
          )}

          {/* 주문 금액 */}
          <div className="p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                총 주문 금액
              </span>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(order.total_amount)}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">주문 상태:</span>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="flex-1">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              쇼핑 계속하기
            </Button>
          </Link>
          <Link href="/orders" className="flex-1">
            <Button className="w-full">주문 내역 보기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


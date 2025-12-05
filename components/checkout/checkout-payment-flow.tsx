/**
 * @file checkout-payment-flow.tsx
 * @description 주문 및 결제 플로우 컴포넌트
 *
 * 배송지 입력 → 주문 생성 → 결제위젯 표시 플로우를 관리하는 컴포넌트
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShippingForm, type ShippingFormValues } from "./shipping-form";
import { PaymentWidget } from "./payment-widget";
import { createOrder } from "@/lib/actions/order-actions";
import type { CartSummary } from "@/lib/types/cart";

interface CheckoutPaymentFlowProps {
  summary: CartSummary;
}

export function CheckoutPaymentFlow({ summary }: CheckoutPaymentFlowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleShippingSubmit = async (data: ShippingFormValues) => {
    setError(null);

    startTransition(async () => {
      const result = await createOrder({
        shippingAddress: {
          postalCode: data.postalCode,
          address: data.address,
          detailAddress: data.detailAddress,
          recipientName: data.recipientName,
          recipientPhone: data.recipientPhone,
        },
        orderNote: data.orderNote || undefined,
      });

      if (result.success && result.orderId) {
        setOrderId(result.orderId);
        setShowPayment(true);
      } else {
        setError(result.error || "주문 생성에 실패했습니다.");
      }
    });
  };

  const handlePaymentRequest = () => {
    // 결제 요청이 시작되면 로딩 상태로 전환
    // 실제 결제는 Toss Payments 위젯에서 처리
  };

  if (showPayment && orderId) {
    // 결제위젯 표시
    const orderName =
      summary.items.length === 1
        ? summary.items[0].product.name
        : `${summary.items[0].product.name} 외 ${summary.items.length - 1}개`;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            결제하기
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            주문이 생성되었습니다. 아래에서 결제를 진행해주세요.
          </p>
        </div>
        <PaymentWidget
          orderId={orderId}
          amount={summary.totalPrice}
          orderName={orderName}
          onPaymentRequest={handlePaymentRequest}
        />
      </div>
    );
  }

  // 배송지 입력 폼 표시
  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      <ShippingForm onSubmit={handleShippingSubmit} isSubmitting={isPending} />
    </div>
  );
}


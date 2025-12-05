/**
 * @file checkout-form-wrapper.tsx
 * @description 주문 폼 래퍼 컴포넌트
 *
 * Server Action을 클라이언트 컴포넌트에서 호출하기 위한 래퍼
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ShippingForm } from "./shipping-form";
import { type ShippingFormValues } from "@/lib/schemas/shipping.schema";
import { createOrder } from "@/lib/actions/order-actions";
import { isApiSuccess } from "@/lib/types/api";

export function CheckoutFormWrapper() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ShippingFormValues) => {
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

      if (isApiSuccess(result) && result.data && "orderId" in result.data) {
        router.push(`/orders/${result.data.orderId}`);
      } else {
        setError("주문 생성에 실패했습니다.");
      }
    });
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      <ShippingForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}


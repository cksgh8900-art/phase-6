/**
 * @file page.tsx
 * @description 결제 성공 콜백 페이지
 *
 * Toss Payments 결제 성공 후 리다이렉트되는 페이지
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { confirmOrder } from "@/lib/actions/payment-actions";
import { getOrderById } from "@/lib/supabase/queries/orders";
import { isApiError } from "@/lib/types/api";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    paymentKey?: string;
    amount?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const { orderId, amount } = params;

  if (!orderId) {
    redirect("/checkout");
  }

  // 주문 상태 확인 및 업데이트
  const order = await getOrderById(orderId, userId);

  if (!order) {
    redirect("/orders");
  }

  // 결제 금액 검증
  if (amount && parseFloat(amount) !== order.total_amount) {
    // 결제 금액이 일치하지 않으면 에러 처리
    redirect(`/checkout/payment/fail?orderId=${orderId}&message=결제 금액이 일치하지 않습니다.`);
  }

  // 주문 상태가 pending이면 confirmed로 업데이트
  if (order.status === "pending") {
    const result = await confirmOrder(orderId);

    if (isApiError(result)) {
      redirect(`/checkout/payment/fail?orderId=${orderId}&message=${encodeURIComponent(result.error || "주문 확인에 실패했습니다.")}`);
    }
  }

  // 주문 완료 페이지로 리다이렉트
  redirect(`/orders/${orderId}`);
}


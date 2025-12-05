/**
 * @file payment-widget.tsx
 * @description Toss Payments 결제위젯 컴포넌트
 *
 * Toss Payments 위젯을 표시하고 결제를 처리하는 컴포넌트
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { useUser } from "@clerk/nextjs";

interface PaymentWidgetProps {
  orderId: string;
  amount: number;
  orderName: string;
  onPaymentRequest: () => void;
}

export function PaymentWidget({
  orderId,
  amount,
  orderName,
  onPaymentRequest,
}: PaymentWidgetProps) {
  const { user } = useUser();
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;

  useEffect(() => {
    if (!clientKey) {
      setError("결제 설정이 올바르지 않습니다.");
      return;
    }

    async function initPaymentWidget() {
      try {
        const paymentWidget = await loadPaymentWidget(clientKey, user?.id || "anonymous");
        paymentWidgetRef.current = paymentWidget;

        // 결제 수단 위젯 렌더링 (금액은 여기서 설정)
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: amount },
          { variantKey: "DEFAULT" }
        );

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
        setIsReady(true);
      } catch (err) {
        console.error("Error initializing payment widget:", err);
        setError("결제위젯을 불러오는데 실패했습니다.");
      }
    }

    initPaymentWidget();

    // 정리 함수는 필요시 추가
    // Toss Payments SDK는 자동으로 정리됨
  }, [clientKey, user?.id, amount]);

  const handlePayment = async () => {
    if (!paymentWidgetRef.current || !user) {
      return;
    }

    try {
      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/checkout/payment/success`,
        failUrl: `${window.location.origin}/checkout/payment/fail`,
        customerEmail: user.emailAddresses[0]?.emailAddress,
        customerName: user.fullName || user.firstName || "고객",
      });

      onPaymentRequest();
    } catch (err) {
      console.error("Error requesting payment:", err);
      setError("결제 요청에 실패했습니다.");
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div id="payment-widget" className="min-h-[400px]" />
      {!isReady && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">결제위젯을 불러오는 중...</p>
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={!isReady}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isReady ? `${amount.toLocaleString()}원 결제하기` : "로딩 중..."}
      </button>
    </div>
  );
}


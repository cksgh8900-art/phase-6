/**
 * @file page.tsx
 * @description 결제 실패 콜백 페이지
 *
 * Toss Payments 결제 실패 후 리다이렉트되는 페이지
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface PaymentFailPageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
  }>;
}

export default async function PaymentFailPage({
  searchParams,
}: PaymentFailPageProps) {
  const params = await searchParams;
  const { code, message, orderId } = params;

  const errorMessage =
    message || code
      ? `${message || ""} ${code ? `(코드: ${code})` : ""}`.trim()
      : "결제에 실패했습니다.";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            결제에 실패했습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{errorMessage}</p>
        </div>

        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            결제가 완료되지 않았습니다. 다시 시도하거나 다른 결제 방법을 선택해주세요.
          </p>
          {orderId && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              주문번호: {orderId.slice(0, 8)}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {orderId && (
            <Link href={`/checkout`} className="flex-1">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                결제 다시 시도
              </Button>
            </Link>
          )}
          <Link href="/cart" className="flex-1">
            <Button className="w-full">장바구니로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


/**
 * @file error.tsx
 * @description 글로벌 에러 바운더리
 *
 * 예상치 못한 에러가 발생했을 때 표시되는 페이지
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (예: Sentry, LogRocket 등)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            문제가 발생했습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            예상치 못한 오류가 발생했습니다.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            문제가 계속되면 고객센터로 문의해주세요.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              오류 코드: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


/**
 * @file error-state.tsx
 * @description 에러 상태 표시 컴포넌트
 *
 * 에러가 발생했을 때 표시되는 컴포넌트
 */

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export function ErrorState({
  title = "문제가 발생했습니다",
  message = "예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  errorCode,
  onRetry,
  showHomeButton = true,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      {errorCode && process.env.NODE_ENV === "development" && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          오류 코드: {errorCode}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        )}
        {showHomeButton && (
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              홈으로
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}


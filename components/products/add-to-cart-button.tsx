/**
 * @file add-to-cart-button.tsx
 * @description 장바구니 담기 버튼 컴포넌트
 *
 * 상품 상세 페이지에서 사용하는 장바구니 담기 버튼
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/actions/cart-actions";
import { isApiError } from "@/lib/types/api";

interface AddToCartButtonProps {
  productId: string;
  stockQuantity: number;
  disabled?: boolean;
}

export function AddToCartButton({
  productId,
  stockQuantity,
  disabled = false,
}: AddToCartButtonProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!isLoaded || !user) {
      router.push("/sign-in");
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result = await addToCart(productId, 1);

      if (isApiError(result)) {
        setMessage(result.error || "장바구니 추가에 실패했습니다.");
      } else {
        setMessage("장바구니에 추가되었습니다.");
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    });
  };

  const isOutOfStock = stockQuantity === 0;
  const isDisabled = disabled || isOutOfStock || isPending;

  return (
    <div>
      <Button
        size="lg"
        className="w-full flex items-center justify-center gap-2"
        disabled={isDisabled}
        onClick={handleAddToCart}
        aria-label={
          isOutOfStock
            ? "품절된 상품입니다"
            : isPending
              ? "장바구니에 추가하는 중"
              : "장바구니에 담기"
        }
        aria-busy={isPending}
      >
        <ShoppingCart className="w-5 h-5" aria-hidden="true" />
        {isOutOfStock
          ? "품절"
          : isPending
            ? "처리 중..."
            : "장바구니에 담기"}
      </Button>
      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-xs mt-2 text-center ${
            message.includes("추가되었습니다")
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}


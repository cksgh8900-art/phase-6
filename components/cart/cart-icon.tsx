/**
 * @file cart-icon.tsx
 * @description 장바구니 아이콘 컴포넌트
 *
 * 네비게이션에 표시되는 장바구니 아이콘 및 개수 표시
 */

"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

export function CartIcon() {
  const { user, isLoaded } = useUser();
  const supabase = useClerkSupabaseClient();
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) {
      setIsLoading(false);
      return;
    }

    async function fetchCartCount() {
      try {
        const { data, error } = await supabase
          .from("cart_items")
          .select("quantity")
          .eq("clerk_id", user.id);

        if (error) {
          console.error("Error fetching cart count:", error);
          return;
        }

        const count = (data || []).reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setItemCount(count);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCartCount();

    // 주기적으로 업데이트 (5초마다)
    const interval = setInterval(fetchCartCount, 5000);

    return () => clearInterval(interval);
  }, [user, isLoaded, supabase]);

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="장바구니"
    >
      <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      {!isLoading && itemCount > 0 && (
        <span 
          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 dark:bg-red-600 rounded-full"
          aria-label={`장바구니에 ${itemCount}개 상품`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}


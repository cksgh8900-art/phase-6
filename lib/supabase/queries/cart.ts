/**
 * @file cart.ts
 * @description 장바구니 조회 관련 Supabase 쿼리 함수
 *
 * Server Component에서 사용할 장바구니 조회 함수들
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { CartItemWithProduct, CartSummary } from "@/lib/types/cart";
import type { Product } from "@/lib/types/product";

/**
 * 사용자 장바구니 조회 (상품 정보 포함)
 */
export async function getCartItems(
  clerkId: string
): Promise<CartItemWithProduct[]> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }

    // 타입 변환
    return (data || []).map((item: any) => ({
      ...item,
      product: item.product as Product,
    })) as CartItemWithProduct[];
  } catch (err) {
    console.error("Unexpected error in getCartItems:", err);
    return [];
  }
}

/**
 * 장바구니 요약 정보 조회
 */
export async function getCartSummary(
  clerkId: string
): Promise<CartSummary> {
  const items = await getCartItems(clerkId);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    items,
    totalItems,
    totalPrice,
  };
}

/**
 * 장바구니 아이템 개수 조회
 */
export async function getCartItemCount(clerkId: string): Promise<number> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity", { count: "exact", head: true })
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error fetching cart item count:", error);
      return 0;
    }

    // 실제로는 count를 사용하지만, quantity 합계를 계산해야 함
    const items = await getCartItems(clerkId);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  } catch (err) {
    console.error("Unexpected error in getCartItemCount:", err);
    return 0;
  }
}


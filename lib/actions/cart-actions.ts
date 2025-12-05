/**
 * @file cart-actions.ts
 * @description 장바구니 관련 Server Actions
 *
 * Next.js 15 Server Actions를 사용한 장바구니 CRUD 작업
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ApiResponse } from "@/lib/types/api";

/**
 * 장바구니에 상품 추가
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<ApiResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    // 상품 존재 및 재고 확인
    const supabase = createClerkSupabaseClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, stock_quantity, is_active")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return { success: false, error: "상품을 찾을 수 없습니다." };
    }

    if (!product.is_active) {
      return { success: false, error: "판매 중지된 상품입니다." };
    }

    // 기존 장바구니 아이템 확인
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("clerk_id", userId)
      .eq("product_id", productId)
      .single();

    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    // 재고 확인
    if (newQuantity > product.stock_quantity) {
      return {
        success: false,
        error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // UPSERT (기존 아이템이 있으면 수량 업데이트, 없으면 추가)
    const { error } = await supabase.from("cart_items").upsert({
      clerk_id: userId,
      product_id: productId,
      quantity: newQuantity,
    });

    if (error) {
      console.error("Error adding to cart:", error);
      return { success: false, error: "장바구니 추가에 실패했습니다." };
    }

    revalidatePath("/cart");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in addToCart:", err);
    return { success: false, error: "오류가 발생했습니다." };
  }
}

/**
 * 장바구니 아이템 수량 변경
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<ApiResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    if (quantity <= 0) {
      return { success: false, error: "수량은 1개 이상이어야 합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템 및 상품 정보 조회
    const { data: cartItem, error: cartError } = await supabase
      .from("cart_items")
      .select("*, product:products(stock_quantity)")
      .eq("id", cartItemId)
      .eq("clerk_id", userId)
      .single();

    if (cartError || !cartItem) {
      return { success: false, error: "장바구니 아이템을 찾을 수 없습니다." };
    }

    // 재고 확인
    const product = cartItem.product as any;
    if (quantity > product.stock_quantity) {
      return {
        success: false,
        error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // 수량 업데이트
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error updating cart item:", error);
      return { success: false, error: "수량 변경에 실패했습니다." };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in updateCartItemQuantity:", err);
    return { success: false, error: "오류가 발생했습니다." };
  }
}

/**
 * 장바구니 아이템 삭제
 */
export async function removeFromCart(cartItemId: string): Promise<ApiResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error removing from cart:", error);
      return { success: false, error: "장바구니에서 제거에 실패했습니다." };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in removeFromCart:", err);
    return { success: false, error: "오류가 발생했습니다." };
  }
}

/**
 * 장바구니 전체 비우기
 */
export async function clearCart(): Promise<ApiResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error: "장바구니 비우기에 실패했습니다." };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in clearCart:", err);
    return { success: false, error: "오류가 발생했습니다." };
  }
}


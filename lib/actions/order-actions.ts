/**
 * @file order-actions.ts
 * @description 주문 관련 Server Actions
 *
 * Next.js 15 Server Actions를 사용한 주문 생성 및 관리
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getCartItems } from "@/lib/supabase/queries/cart";
import type { CreateOrderInput } from "@/lib/types/order";
import type { ApiResponse } from "@/lib/types/api";
import { revalidatePath } from "next/cache";

interface CreateOrderResponse {
  orderId: string;
  totalAmount: number;
}

/**
 * 주문 생성
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<ApiResponse<CreateOrderResponse>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템 조회
    const cartItems = await getCartItems(userId);

    if (cartItems.length === 0) {
      return { success: false, error: "장바구니가 비어있습니다." };
    }

    // 총 금액 계산 및 검증
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    // 주문 생성
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        clerk_id: userId,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: input.shippingAddress,
        order_note: input.orderNote || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return { success: false, error: "주문 생성에 실패했습니다." };
    }

    // 주문 아이템 생성
    const orderItems = orderItemsData.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // 주문은 생성되었지만 아이템 생성 실패 시 주문 삭제
      await supabase.from("orders").delete().eq("id", order.id);
      return { success: false, error: "주문 아이템 생성에 실패했습니다." };
    }

    // 장바구니 비우기
    await supabase.from("cart_items").delete().eq("clerk_id", userId);

    revalidatePath("/cart");
    revalidatePath("/checkout");

    return {
      success: true,
      data: {
        orderId: order.id,
        totalAmount,
      },
    };
  } catch (err) {
    console.error("Unexpected error in createOrder:", err);
    return { success: false, error: "오류가 발생했습니다." };
  }
}


/**
 * @file payment-actions.ts
 * @description 결제 관련 Server Actions
 *
 * 주문 상태 업데이트 및 결제 검증 관련 Server Actions
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 결제 완료 후 주문 상태 업데이트
 */
export async function confirmOrder(orderId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 주문이 해당 사용자의 것인지 확인
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, clerk_id, status")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (orderError || !order) {
      return { success: false, error: "주문을 찾을 수 없습니다." };
    }

    // 이미 확인된 주문인지 확인
    if (order.status !== "pending") {
      return {
        success: false,
        error: `이미 처리된 주문입니다. (상태: ${order.status})`,
      };
    }

    // 주문 상태를 confirmed로 업데이트
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", orderId)
      .eq("clerk_id", userId);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return { success: false, error: "주문 상태 업데이트에 실패했습니다." };
    }

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in confirmOrder:", err);
    return { success: false, error: "오류가 발생했습니다." };
  }
}


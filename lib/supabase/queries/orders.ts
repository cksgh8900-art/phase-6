/**
 * @file orders.ts
 * @description 주문 조회 관련 Supabase 쿼리 함수
 *
 * Server Component에서 사용할 주문 조회 함수들
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { Order, OrderItem, OrderWithItems } from "@/lib/types/order";

/**
 * 사용자 주문 목록 조회
 */
export async function getOrders(clerkId: string): Promise<Order[]> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    return (data as Order[]) ?? [];
  } catch (err) {
    console.error("Unexpected error in getOrders:", err);
    return [];
  }
}

/**
 * 주문 상세 조회 (주문 아이템 포함)
 */
export async function getOrderById(
  orderId: string,
  clerkId: string
): Promise<OrderWithItems | null> {
  try {
    const supabase = createClerkSupabaseClient();

    // 주문 조회
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", clerkId)
      .single();

    if (orderError) {
      if (orderError.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching order:", orderError);
      return null;
    }

    // 주문 아이템 조회
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return {
        ...(order as Order),
        items: [],
      };
    }

    return {
      ...(order as Order),
      items: (items as OrderItem[]) ?? [],
    };
  } catch (err) {
    console.error("Unexpected error in getOrderById:", err);
    return null;
  }
}


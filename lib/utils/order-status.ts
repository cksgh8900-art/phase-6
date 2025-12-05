/**
 * @file order-status.ts
 * @description 주문 상태 관련 유틸리티 함수
 */

import type { Order } from "@/lib/types/order";

export const ORDER_STATUS_LABELS: Record<Order["status"], string> = {
  pending: "대기 중",
  confirmed: "확인됨",
  shipped: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
};

export function getOrderStatusLabel(status: Order["status"]): string {
  return ORDER_STATUS_LABELS[status] || status;
}


/**
 * @file order-status-badge.tsx
 * @description 주문 상태 배지 컴포넌트
 *
 * 주문 상태에 따라 색상이 다른 배지를 표시하는 컴포넌트
 */

import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/types/order";
import { getOrderStatusLabel } from "@/lib/utils/order-status";

interface OrderStatusBadgeProps {
  status: Order["status"];
  className?: string;
}

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <Badge className={`${STATUS_COLORS[status]} ${className || ""}`}>
      {getOrderStatusLabel(status)}
    </Badge>
  );
}


/**
 * @file cart-item.tsx
 * @description 장바구니 아이템 컴포넌트
 *
 * 장바구니에 표시되는 개별 상품 아이템
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/types/product";
import type { CartItemWithProduct } from "@/lib/types/cart";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "@/lib/actions/cart-actions";
import { useState, useTransition } from "react";

interface CartItemProps {
  item: CartItemWithProduct;
}

export function CartItem({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock_quantity) {
      alert(`재고가 부족합니다. (현재 재고: ${item.product.stock_quantity}개)`);
      return;
    }

    setQuantity(newQuantity);
    startTransition(async () => {
      const result = await updateCartItemQuantity(item.id, newQuantity);
      if (!result.success) {
        setQuantity(item.quantity); // 롤백
        alert(result.error);
      }
    });
  };

  const handleRemove = () => {
    if (!confirm("장바구니에서 제거하시겠습니까?")) return;

    startTransition(async () => {
      const result = await removeFromCart(item.id);
      if (!result.success) {
        alert(result.error);
      }
    });
  };

  const itemTotal = item.product.price * quantity;
  const isOutOfStock = item.product.stock_quantity === 0;

  return (
    <div className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      {/* 상품 이미지 */}
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
          <Package className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
      </Link>

      {/* 상품 정보 */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              href={`/products/${item.product.id}`}
              className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatPrice(item.product.price)} / 개
            </p>
          </div>

          {/* 삭제 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isPending}
            className="flex-shrink-0"
            aria-label="장바구니에서 제거"
          >
            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
          </Button>
        </div>

        {/* 수량 조절 및 총액 */}
        <div className="flex items-center justify-between mt-auto">
          {/* 수량 조절 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isPending || quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={
                isPending ||
                quantity >= item.product.stock_quantity ||
                isOutOfStock
              }
              className="h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
            {isOutOfStock && (
              <span className="text-xs text-red-600 dark:text-red-400">
                품절
              </span>
            )}
          </div>

          {/* 총액 */}
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(itemTotal)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatPrice(item.product.price)} × {quantity}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


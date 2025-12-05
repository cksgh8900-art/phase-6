/**
 * @file cart.ts
 * @description 장바구니 관련 TypeScript 타입 정의
 *
 * Supabase cart_items 테이블 스키마를 기반으로 한 타입 정의
 */

import type { Product } from "./product";

export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // JOIN으로 가져올 상품 정보
  product?: Product;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface CartSummary {
  items: CartItemWithProduct[];
  totalItems: number;
  totalPrice: number;
}


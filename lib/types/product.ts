/**
 * @file product.ts
 * @description 상품 관련 TypeScript 타입 정의
 *
 * Supabase products 테이블 스키마를 기반으로 한 타입 정의
 */

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductCategory =
  | "electronics"
  | "clothing"
  | "books"
  | "food"
  | "sports"
  | "beauty"
  | "home"
  | null;

export type SortOption =
  | "price_asc"
  | "price_desc"
  | "created_desc"
  | "name_asc";

export interface ProductQueryParams {
  category?: ProductCategory;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * 카테고리 한글 이름 매핑
 */
export const CATEGORY_NAMES: Record<string, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
};

/**
 * 가격을 천 단위 구분 형식으로 포맷팅
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}


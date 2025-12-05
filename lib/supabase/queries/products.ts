/**
 * @file products.ts
 * @description 상품 조회 관련 Supabase 쿼리 함수
 *
 * Server Component에서 사용할 상품 조회 함수들
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type {
  Product,
  ProductQueryParams,
  ProductListResponse,
  SortOption,
} from "@/lib/types/product";

const PRODUCTS_PER_PAGE = 12;

/**
 * 상품 목록 조회
 */
export async function getProducts(
  params: ProductQueryParams = {}
): Promise<ProductListResponse> {
  try {
    const {
      category,
      sort = "created_desc",
      page = 1,
      limit = PRODUCTS_PER_PAGE,
    } = params;

    const supabase = createClerkSupabaseClient();

    // 쿼리 빌더 시작
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("is_active", true);

    // 카테고리 필터
    if (category) {
      query = query.eq("category", category);
    }

    // 정렬
    switch (sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "created_desc":
        query = query.order("created_at", { ascending: false });
        break;
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      // 에러 메시지 추출 시도
      let errorMessage = "";
      let errorCode = "";
      
      try {
        errorMessage = (error as any)?.message || String(error) || "";
        errorCode = (error as any)?.code || (error as any)?.statusCode || "";
      } catch (e) {
        errorMessage = String(error);
      }

      // 테이블이 없는 경우에 대한 특별 처리
      const isTableNotFound = 
        errorMessage.includes("Could not find the table") ||
        errorMessage.includes("relation") ||
        errorMessage.includes("does not exist") ||
        errorCode === "PGRST116" ||
        errorCode === "42P01";

      if (isTableNotFound) {
        // 개발 환경에서만 상세 로그 출력
        if (process.env.NODE_ENV === "development") {
          console.group("⚠️ Products Table Not Found");
          console.warn("The 'products' table does not exist in Supabase.");
          console.info("To fix this:");
          console.info("1. Open Supabase Dashboard > SQL Editor");
          console.info("2. Copy and run the SQL from: supabase/migrations/db.sql");
          console.info("3. Refresh this page");
          console.groupEnd();
        }
        // 빈 결과 반환 (페이지 크래시 방지)
        return {
          products: [],
          total: 0,
          page: params.page || 1,
          totalPages: 0,
        };
      }

      // 기타 에러의 경우 개발 환경에서만 상세 로깅
      if (process.env.NODE_ENV === "development") {
        console.group("❌ Error fetching products");
        try {
          const errorKeys = Object.keys(error || {});
          console.error("Error keys:", errorKeys);
          
          const errorInfo: Record<string, any> = {};
          if (error && typeof error === 'object') {
            for (const key in error) {
              try {
                errorInfo[key] = (error as any)[key];
              } catch (e) {
                errorInfo[key] = '[Unable to access]';
              }
            }
          }
          console.error("Error details:", errorInfo);
          console.error("Error message:", errorMessage);
          console.error("Error code:", errorCode);
        } catch (logError) {
          console.error("Failed to log error details:", logError);
          console.error("Raw error:", error);
        }
        console.groupEnd();
      }

      // 개발 환경에서는 에러를 throw하지 않고 빈 결과 반환
      return {
        products: [],
        total: 0,
        page: params.page || 1,
        totalPages: 0,
      };
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      products: (data as Product[]) ?? [],
      total,
      page,
      totalPages,
    };
  } catch (err) {
    console.error("Unexpected error in getProducts:", err);
    // 에러 발생 시 빈 결과 반환
    return {
      products: [],
      total: 0,
      page: params.page || 1,
      totalPages: 0,
    };
  }
}

/**
 * 인기 상품 조회 (최신순 상위 N개)
 */
export async function getFeaturedProducts(
  limit: number = 8
): Promise<Product[]> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      // 에러 메시지 추출 시도
      let errorMessage = "";
      let errorCode = "";
      
      try {
        errorMessage = (error as any)?.message || String(error) || "";
        errorCode = (error as any)?.code || (error as any)?.statusCode || "";
      } catch (e) {
        errorMessage = String(error);
      }

      // 테이블이 없는 경우에 대한 특별 처리
      const isTableNotFound = 
        errorMessage.includes("Could not find the table") ||
        errorMessage.includes("relation") ||
        errorMessage.includes("does not exist") ||
        errorCode === "PGRST116" ||
        errorCode === "42P01";

      if (isTableNotFound) {
        // 개발 환경에서만 상세 로그 출력
        if (process.env.NODE_ENV === "development") {
          console.group("⚠️ Products Table Not Found");
          console.warn("The 'products' table does not exist in Supabase.");
          console.info("To fix this:");
          console.info("1. Open Supabase Dashboard > SQL Editor");
          console.info("2. Copy and run the SQL from: supabase/migrations/db.sql");
          console.info("3. Refresh this page");
          console.groupEnd();
        }
        // 빈 배열 반환 (페이지 크래시 방지)
        return [];
      }

      // 기타 에러의 경우 개발 환경에서만 상세 로깅
      if (process.env.NODE_ENV === "development") {
        console.group("❌ Error fetching featured products");
        try {
          const errorKeys = Object.keys(error || {});
          console.error("Error keys:", errorKeys);
          
          const errorInfo: Record<string, any> = {};
          if (error && typeof error === 'object') {
            for (const key in error) {
              try {
                errorInfo[key] = (error as any)[key];
              } catch (e) {
                errorInfo[key] = '[Unable to access]';
              }
            }
          }
          console.error("Error details:", errorInfo);
          console.error("Error message:", errorMessage);
          console.error("Error code:", errorCode);
        } catch (logError) {
          console.error("Failed to log error details:", logError);
          console.error("Raw error:", error);
        }
        console.groupEnd();
      }

      // 개발 환경에서는 에러를 throw하지 않고 빈 배열 반환
      return [];
    }

    return (data as Product[]) ?? [];
  } catch (err) {
    // 예상치 못한 에러 처리
    console.error("❌ Unexpected error in getFeaturedProducts:", err);
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    } else {
      console.error("Error object:", JSON.stringify(err, null, 2));
    }
    // 에러 발생 시 빈 배열 반환하여 페이지가 크래시되지 않도록 함
    return [];
  }
}

/**
 * 상품 상세 조회
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 상품을 찾을 수 없음
        return null;
      }
      console.error("Error fetching product:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(
        `Failed to fetch product: ${error.message || "Unknown error"}`
      );
    }

    return data as Product;
  } catch (err) {
    console.error("Unexpected error in getProductById:", err);
    return null;
  }
}

/**
 * 카테고리별 상품 개수 조회
 */
export async function getProductCountsByCategory(): Promise<
  Record<string, number>
> {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching product counts:", error);
    return {};
  }

  const counts: Record<string, number> = {};
  (data ?? []).forEach((item) => {
    const category = item.category || "uncategorized";
    counts[category] = (counts[category] || 0) + 1;
  });

  return counts;
}


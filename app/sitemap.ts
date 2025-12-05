/**
 * @file sitemap.ts
 * @description sitemap.xml 생성 파일
 *
 * Next.js 15의 sitemap.ts를 사용하여 동적/정적 페이지를 포함한 sitemap 생성
 */

import { MetadataRoute } from "next";
import { getProducts } from "@/lib/supabase/queries/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  try {
    // 동적 페이지 (상품) - 최대 1000개까지 가져오기
    const { products } = await getProducts({ limit: 1000 });
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : product.created_at
          ? new Date(product.created_at)
          : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // 에러 발생 시 정적 페이지만 반환
    return staticPages;
  }
}


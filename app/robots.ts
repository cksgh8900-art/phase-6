/**
 * @file robots.ts
 * @description robots.txt 생성 파일
 *
 * Next.js 15의 robots.ts를 사용하여 검색 엔진 크롤러 규칙 설정
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout/payment/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


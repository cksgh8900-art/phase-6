/**
 * @file category-section.tsx
 * @description 카테고리 진입 섹션 컴포넌트
 *
 * 홈페이지에서 주요 카테고리로 진입할 수 있는 섹션
 */

import Link from "next/link";
import { CATEGORY_NAMES } from "@/lib/types/product";
import {
  Smartphone,
  Shirt,
  Book,
  UtensilsCrossed,
  Dumbbell,
  Sparkles,
  Home,
} from "lucide-react";

const CATEGORIES = [
  {
    value: "electronics",
    label: CATEGORY_NAMES.electronics,
    icon: Smartphone,
    color: "bg-blue-500",
  },
  {
    value: "clothing",
    label: CATEGORY_NAMES.clothing,
    icon: Shirt,
    color: "bg-pink-500",
  },
  {
    value: "books",
    label: CATEGORY_NAMES.books,
    icon: Book,
    color: "bg-green-500",
  },
  {
    value: "food",
    label: CATEGORY_NAMES.food,
    icon: UtensilsCrossed,
    color: "bg-orange-500",
  },
  {
    value: "sports",
    label: CATEGORY_NAMES.sports,
    icon: Dumbbell,
    color: "bg-red-500",
  },
  {
    value: "beauty",
    label: CATEGORY_NAMES.beauty,
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    value: "home",
    label: CATEGORY_NAMES.home,
    icon: Home,
    color: "bg-yellow-500",
  },
] as const;

export function CategorySection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          카테고리별 쇼핑
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.value}
                href={`/products?category=${category.value}`}
                className="group flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}


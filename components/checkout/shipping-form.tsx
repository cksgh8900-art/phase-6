/**
 * @file shipping-form.tsx
 * @description 배송지 입력 폼 컴포넌트
 *
 * 주문 시 배송지 정보를 입력하는 폼 (react-hook-form + Zod)
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  shippingFormSchema,
  type ShippingFormValues,
} from "@/lib/schemas/shipping.schema";

interface ShippingFormProps {
  onSubmit: (data: ShippingFormValues) => void;
  isSubmitting?: boolean;
}

export function ShippingForm({ onSubmit, isSubmitting = false }: ShippingFormProps) {
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      recipientName: "",
      recipientPhone: "",
      postalCode: "",
      address: "",
      detailAddress: "",
      orderNote: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 받는 분 정보 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            받는 분 정보
          </h3>

          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름 *</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>전화번호 *</FormLabel>
                <FormControl>
                  <Input placeholder="010-1234-5678" {...field} />
                </FormControl>
                <FormDescription>
                  하이픈(-)을 포함하여 입력해주세요.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 배송지 주소 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            배송지 주소
          </h3>

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>우편번호 *</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주소 *</FormLabel>
                <FormControl>
                  <Input placeholder="서울시 강남구 테헤란로 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="detailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상세주소 *</FormLabel>
                <FormControl>
                  <Input placeholder="101동 101호" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 주문 요청사항 */}
        <FormField
          control={form.control}
          name="orderNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>주문 요청사항 (선택)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="배송 시 요청사항을 입력해주세요."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                배송 시 요청사항이 있으시면 입력해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "주문 처리 중..." : "주문하기"}
        </Button>
      </form>
    </Form>
  );
}


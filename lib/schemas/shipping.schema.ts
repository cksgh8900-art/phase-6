/**
 * @file shipping.schema.ts
 * @description 배송지 정보 Zod 스키마
 *
 * 주문 시 배송지 정보 검증을 위한 스키마
 */

import * as z from "zod";

export const shippingFormSchema = z.object({
  recipientName: z.string().min(2, "받는 분 이름을 입력해주세요."),
  recipientPhone: z
    .string()
    .min(10, "전화번호를 올바르게 입력해주세요.")
    .regex(/^[0-9-]+$/, "전화번호는 숫자와 하이픈(-)만 입력 가능합니다."),
  postalCode: z.string().min(5, "우편번호를 입력해주세요."),
  address: z.string().min(5, "주소를 입력해주세요."),
  detailAddress: z.string().min(2, "상세주소를 입력해주세요."),
  orderNote: z.string().optional(),
});

export type ShippingFormValues = z.infer<typeof shippingFormSchema>;


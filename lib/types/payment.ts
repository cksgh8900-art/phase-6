/**
 * @file payment.ts
 * @description 결제 관련 TypeScript 타입 정의
 *
 * Toss Payments 결제 관련 타입 정의
 */

export interface PaymentRequest {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
}

export interface PaymentSuccessParams {
  orderId: string;
  paymentKey: string;
  amount: string;
}

export interface PaymentFailParams {
  code: string;
  message: string;
  orderId?: string;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  paymentKey?: string;
  error?: string;
}


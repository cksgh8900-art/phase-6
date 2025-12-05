/**
 * @file api.ts
 * @description 공통 API 응답 타입 정의
 *
 * Server Actions 및 API Routes에서 사용하는 공통 응답 타입
 */

/**
 * 성공 응답 타입
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * 실패 응답 타입
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * API 응답 타입 (성공 또는 실패)
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API 에러 타입
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  statusCode?: number;
}

/**
 * API 응답이 성공인지 확인하는 타입 가드
 */
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * API 응답이 실패인지 확인하는 타입 가드
 */
export function isApiError(
  response: ApiResponse
): response is ApiErrorResponse {
  return response.success === false;
}


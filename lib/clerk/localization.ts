/**
 * @file lib/clerk/localization.ts
 * @description Clerk 한국어 로컬라이제이션 설정
 *
 * 이 파일은 Clerk 컴포넌트의 한국어 번역을 관리합니다.
 * 기본 koKR 로컬라이제이션을 확장하여 커스텀 메시지를 추가할 수 있습니다.
 *
 * 참고: Clerk 로컬라이제이션은 실험적 기능입니다.
 * 문제가 발생하면 Clerk 지원팀에 문의하세요.
 *
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 */

import { koKR } from "@clerk/localizations";

/**
 * Clerk 한국어 로컬라이제이션 설정
 *
 * 기본 koKR 로컬라이제이션을 사용하며, 필요시 커스텀 메시지를 추가할 수 있습니다.
 *
 * @example
 * ```tsx
 * import { clerkLocalization } from '@/lib/clerk/localization';
 *
 * <ClerkProvider localization={clerkLocalization}>
 *   {children}
 * </ClerkProvider>
 * ```
 */
export const clerkLocalization = {
  ...koKR,
  
  // 커스텀 에러 메시지 (필요시 추가)
  unstable__errors: {
    ...koKR.unstable__errors,
    // 예시: 접근이 허용되지 않은 도메인에 대한 커스텀 메시지
    // not_allowed_access: "접근이 허용되지 않습니다. 문의사항이 있으시면 관리자에게 연락해주세요.",
  },
  
  // 기타 커스텀 메시지는 필요시 추가
  // signIn: {
  //   ...koKR.signIn,
  //   title: "커스텀 로그인 제목",
  // },
};


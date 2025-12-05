# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하는 방법을 설명합니다.

## 개요

Clerk는 `@clerk/localizations` 패키지를 통해 여러 언어를 지원합니다. 이 프로젝트는 **한국어(ko-KR)** 로컬라이제이션을 사용합니다.

## 현재 설정

### 1. 패키지 설치

`@clerk/localizations` 패키지가 이미 설치되어 있습니다:

```json
{
  "dependencies": {
    "@clerk/localizations": "^3.26.3"
  }
}
```

### 2. 로컬라이제이션 설정

**파일**: `lib/clerk/localization.ts`

```typescript
import { koKR } from "@clerk/localizations";

export const clerkLocalization = {
  ...koKR,
  // 커스텀 메시지 추가 가능
};
```

### 3. ClerkProvider 설정

**파일**: `app/layout.tsx`

```tsx
import { clerkLocalization } from "@/lib/clerk/localization";

<ClerkProvider localization={clerkLocalization}>
  <html lang="ko">
    {children}
  </html>
</ClerkProvider>
```

## 지원되는 언어

Clerk는 다음 언어를 지원합니다. 필요시 `lib/clerk/localization.ts`에서 다른 언어로 변경할 수 있습니다:

- 한국어: `koKR` (현재 사용 중)
- 영어: `enUS`, `enGB`
- 일본어: `jaJP`
- 중국어: `zhCN`, `zhTW`
- 기타: [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization) 참고

## 커스텀 메시지 추가

특정 메시지를 커스터마이징하려면 `lib/clerk/localization.ts` 파일을 수정하세요:

### 예시 1: 에러 메시지 커스터마이징

```typescript
export const clerkLocalization = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access: "접근이 허용되지 않습니다. 관리자에게 문의해주세요.",
  },
};
```

### 예시 2: 로그인 페이지 커스터마이징

```typescript
export const clerkLocalization = {
  ...koKR,
  signIn: {
    ...koKR.signIn,
    title: "커스텀 로그인 제목",
    subtitle: "커스텀 부제목",
  },
};
```

### 예시 3: 버튼 텍스트 변경

```typescript
export const clerkLocalization = {
  ...koKR,
  signIn: {
    ...koKR.signIn,
    socialButtonsBlockButton: "소셜 로그인",
  },
};
```

## 적용 범위

### 적용되는 컴포넌트

다음 Clerk 컴포넌트들이 한국어로 표시됩니다:

- `SignIn` - 로그인 컴포넌트
- `SignUp` - 회원가입 컴포넌트
- `UserButton` - 사용자 버튼
- `UserProfile` - 사용자 프로필
- `UserProfileModal` - 사용자 프로필 모달
- 기타 모든 Clerk UI 컴포넌트

### 적용되지 않는 부분

⚠️ **주의**: 로컬라이제이션은 **Clerk 컴포넌트**에만 적용됩니다.

- **Clerk Account Portal** (호스팅된 사용자 관리 페이지)는 여전히 영어로 표시됩니다
- 커스텀 페이지나 직접 작성한 텍스트는 로컬라이제이션 대상이 아닙니다

## 현재 사용 중인 컴포넌트

프로젝트에서 사용 중인 Clerk 컴포넌트:

### Navbar (`components/Navbar.tsx`)

```tsx
<SignedOut>
  <SignInButton mode="modal">
    <Button>로그인</Button>
  </SignInButton>
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

이 컴포넌트들은 `clerkLocalization` 설정에 따라 한국어로 표시됩니다.

## 문제 해결

### 로컬라이제이션이 적용되지 않는 경우

1. **패키지 확인**: `@clerk/localizations` 패키지가 설치되어 있는지 확인
2. **import 확인**: `lib/clerk/localization.ts`에서 올바르게 import하고 있는지 확인
3. **ClerkProvider 확인**: `app/layout.tsx`에서 `localization` prop을 전달하고 있는지 확인
4. **브라우저 캐시**: 브라우저 캐시를 지우고 다시 시도

### 특정 메시지가 변경되지 않는 경우

1. **키 확인**: 올바른 키를 사용하고 있는지 확인
2. **타입 확인**: TypeScript 타입 오류가 없는지 확인
3. **재시작**: 개발 서버를 재시작

### 실험적 기능 관련 이슈

⚠️ Clerk 로컬라이제이션은 현재 **실험적(experimental)** 기능입니다.

문제가 발생하면:
1. [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization) 확인
2. [Clerk 지원팀](https://clerk.com/contact/support)에 문의

## 참고 자료

- [Clerk 공식 문서 - 로컬라이제이션](https://clerk.com/docs/guides/customizing-clerk/localization)
- [@clerk/localizations 패키지](https://www.npmjs.com/package/@clerk/localizations)
- [Clerk 컴포넌트 개요](https://clerk.com/docs/reference/nextjs/overview)

## 다음 단계

### 추가 개선 가능 사항

1. **더 많은 커스텀 메시지 추가**: 프로젝트 브랜드에 맞게 메시지 커스터마이징
2. **다국어 지원**: 사용자 설정에 따라 언어 전환 기능 추가
3. **에러 메시지 개선**: 더 친절하고 명확한 한국어 에러 메시지 작성

### 예시: 다국어 지원 구현

```typescript
// lib/clerk/localization.ts
import { koKR, enUS } from "@clerk/localizations";

export const getLocalization = (locale: string) => {
  switch (locale) {
    case "ko":
      return koKR;
    case "en":
      return enUS;
    default:
      return koKR;
  }
};
```

---

**마지막 업데이트**: 2025-01-03  
**현재 언어**: 한국어 (ko-KR)


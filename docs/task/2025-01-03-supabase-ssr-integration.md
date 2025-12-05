# Supabase @supabase/ssr 통합 작업 완료 문서

**작업 일자**: 2025-01-03  
**작업 내용**: Supabase 공식 문서 기준으로 @supabase/ssr 패키지를 사용하도록 업데이트

## 작업 목표

[Supabase 공식 문서](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)와 최신 모범 사례를 기반으로 Next.js 프로젝트에 Supabase를 올바르게 연결했습니다.

## 작업 내용

### 1. @supabase/ssr 패키지 설치

**패키지**: `@supabase/ssr@0.8.0`

```bash
pnpm add @supabase/ssr
```

### 2. Supabase 클라이언트 파일 업데이트

#### 2.1 서버 클라이언트 (`lib/supabase/server.ts`)

**변경 사항**:
- `@supabase/supabase-js`의 `createClient` → `@supabase/ssr`의 `createServerClient`로 변경
- `cookies()` 함수를 통한 쿠키 관리 추가
- 함수를 `async`로 변경 (Supabase 공식 문서 권장)
- Clerk 토큰을 `Authorization` 헤더로 전달

**주요 개선점**:
- 쿠키 기반 세션 관리 지원
- Server Component에서 쿠키 읽기/쓰기 처리
- Next.js 15 App Router와 완전 호환

```typescript
export async function createClerkSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) { /* ... */ }
      },
      global: {
        headers: {
          async Authorization() {
            const token = await (await auth()).getToken();
            return token ? `Bearer ${token}` : "";
          },
        },
      },
    }
  );
}
```

#### 2.2 클라이언트 컴포넌트 (`lib/supabase/clerk-client.ts`)

**변경 사항**:
- `@supabase/supabase-js`의 `createClient` → `@supabase/ssr`의 `createBrowserClient`로 변경
- Clerk 토큰을 `Authorization` 헤더로 전달

**주요 개선점**:
- 브라우저 환경 최적화
- 쿠키 관리 자동화
- SSR과의 일관성 유지

#### 2.3 공개 데이터 클라이언트 (`lib/supabase/client.ts`)

**변경 사항**:
- `@supabase/supabase-js`의 `createClient` → `@supabase/ssr`의 `createBrowserClient`로 변경

**용도**: 인증 불필요한 공개 데이터 접근용

### 3. 예제 페이지 업데이트

#### 3.1 Server Component (`app/tasks-example/page.tsx`)

**변경 사항**:
- `createClerkSupabaseClient()` 호출에 `await` 추가

```typescript
// 이전
const supabase = createClerkSupabaseClient();

// 변경 후
const supabase = await createClerkSupabaseClient();
```

#### 3.2 Server Action (`app/tasks-example/actions.ts`)

**변경 사항**:
- `createClerkSupabaseClient()` 호출에 `await` 추가

### 4. Clerk 통합 유지

모든 클라이언트에서 Clerk 토큰을 `Authorization` 헤더로 전달하도록 구현하여:
- RLS 정책에서 `auth.jwt()->>'sub'`로 Clerk user ID 확인 가능
- Supabase Auth 없이도 Clerk 인증 사용 가능
- 네이티브 통합 방식 유지 (2025년 권장)

## 적용된 모범 사례

### 1. @supabase/ssr 패키지 사용

- ✅ Supabase 공식 문서 권장 방식
- ✅ 쿠키 기반 세션 관리
- ✅ Server/Client 환경 분리
- ✅ Next.js 15 App Router 완전 지원

### 2. 비동기 함수 패턴

- ✅ 서버 클라이언트 함수를 `async`로 구현
- ✅ `cookies()` 함수의 비동기 처리 지원
- ✅ Next.js 15의 비동기 요청 API와 일치

### 3. Clerk 통합 유지

- ✅ Clerk 토큰을 Authorization 헤더로 전달
- ✅ RLS 정책에서 Clerk user ID 확인 가능
- ✅ Supabase Auth 불필요 (Clerk 사용)

## 파일 변경 사항

### 수정된 파일

1. **`lib/supabase/server.ts`**
   - `createClient` → `createServerClient` (`@supabase/ssr`)
   - `cookies()` 통합
   - `async` 함수로 변경
   - Clerk 토큰을 Authorization 헤더로 전달

2. **`lib/supabase/clerk-client.ts`**
   - `createClient` → `createBrowserClient` (`@supabase/ssr`)
   - Clerk 토큰을 Authorization 헤더로 전달

3. **`lib/supabase/client.ts`**
   - `createClient` → `createBrowserClient` (`@supabase/ssr`)

4. **`app/tasks-example/page.tsx`**
   - `await createClerkSupabaseClient()` 사용

5. **`app/tasks-example/actions.ts`**
   - `await createClerkSupabaseClient()` 사용

### 패키지 추가

- `@supabase/ssr@0.8.0`

## 참고 자료

- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase SSR 가이드](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Clerk Supabase 통합](https://clerk.com/docs/guides/development/integrations/databases/supabase)

## 다음 단계

### 즉시 확인 가능
1. 개발 서버 실행 (`pnpm dev`)
2. `/tasks-example` 페이지 접근 및 테스트
3. 데이터 조회/생성 기능 확인

### 향후 개선 사항
1. Middleware에서 세션 새로고침 처리 (필요시)
2. 에러 처리 개선
3. 타입 안전성 강화

## 주의사항

### 서버 컴포넌트에서 async 함수 사용

`createClerkSupabaseClient()`는 이제 `async` 함수이므로:
- Server Component에서 `await` 사용 필수
- Server Action에서도 `await` 사용 필수
- Client Component는 변경 없음 (Hook이므로)

### Clerk 토큰 전달 방식

현재는 `Authorization` 헤더로 Clerk 토큰을 전달하고 있습니다. Supabase RLS 정책에서:
- `auth.jwt()->>'sub'`로 Clerk user ID 확인
- `auth.role()`로 역할 확인 (필요시)

## 테스트 체크리스트

- [x] 린터 오류 없음
- [ ] 개발 서버 정상 실행
- [ ] `/tasks-example` 페이지 접근 가능
- [ ] 데이터 조회 기능 작동
- [ ] 데이터 생성 기능 작동
- [ ] Clerk 인증 상태 확인

---

**작업 완료 시간**: 2025-01-03  
**작업자**: AI Assistant (Claude)


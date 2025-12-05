# 환경변수 가이드

## 개요

이 문서는 Vercel 배포 시 필요한 환경변수 설정 가이드를 제공합니다.

## 필수 환경변수 목록

### Clerk 인증

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk 공개 키 (프론트엔드용) | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk 비밀 키 (서버용) | `sk_test_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | 로그인 페이지 URL | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | 로그인 후 리다이렉트 URL | `/` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | 회원가입 후 리다이렉트 URL | `/` |

### Supabase 데이터베이스

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 (프론트엔드용) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 역할 키 (서버용) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_STORAGE_BUCKET` | Supabase Storage 버킷 이름 | `uploads` |

### Toss Payments 결제

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` | Toss Payments 클라이언트 키 (테스트 모드) | `test_ck_...` |

---

## Vercel 대시보드에서 환경변수 설정하기

### 1. 프로젝트 선택

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. 배포할 프로젝트 선택

### 2. 환경변수 설정

1. 프로젝트 페이지에서 **Settings** 탭 클릭
2. 좌측 메뉴에서 **Environment Variables** 클릭
3. **Add New** 버튼 클릭

### 3. 각 환경변수 추가

각 환경변수를 다음 형식으로 추가:

- **Key**: 환경변수 이름 (예: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
- **Value**: 환경변수 값
- **Environment**: 적용할 환경 선택
  - **Production**: 프로덕션 환경
  - **Preview**: 프리뷰 환경 (PR 등)
  - **Development**: 개발 환경

### 4. 환경변수 값 확인

#### Clerk 키 확인

1. [Clerk Dashboard](https://dashboard.clerk.com/) 접속
2. 프로젝트 선택 → **API Keys** 메뉴
3. **Publishable Key** 및 **Secret Key** 복사

#### Supabase 키 확인

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → **Settings** → **API**
3. 다음 값들 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

#### Toss Payments 키 확인

1. [Toss Payments 개발자센터](https://developers.tosspayments.com/) 접속
2. 테스트 모드 클라이언트 키 복사 → `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`

---

## 환경변수 보안 주의사항

### 절대 공개하지 말아야 할 키

- `CLERK_SECRET_KEY`: 서버 사이드 전용, 모든 권한 보유
- `SUPABASE_SERVICE_ROLE_KEY`: 서버 사이드 전용, RLS 우회 가능
- 프로덕션 Toss Payments 키 (실제 결제 처리 가능)

### 공개해도 되는 키

- `NEXT_PUBLIC_*` 접두사가 붙은 키들은 클라이언트 사이드에서 사용되므로 공개됨
- 하지만 여전히 남용을 방지하기 위해 보안을 유지해야 함

---

## 환경별 설정

### 프로덕션 환경

- 모든 환경변수 설정 필수
- Toss Payments는 테스트 모드로 운영 (실제 결제는 프로덕션 키 필요)
- Supabase RLS 정책 검토 필요

### 프리뷰 환경 (Preview)

- 프로덕션과 동일한 환경변수 사용 가능
- 또는 별도의 테스트 환경변수 사용 가능

### 개발 환경

- 로컬 `.env.local` 파일 사용
- Vercel 환경변수와 동기화 불필요

---

## 환경변수 확인 방법

### 배포 후 확인

1. Vercel 대시보드 → 프로젝트 → **Deployments**
2. 최신 배포 클릭 → **Runtime Logs** 확인
3. 환경변수 관련 에러 확인

### 로컬에서 확인

```bash
# 환경변수 확인 (개발 서버 실행 시)
pnpm dev

# 빌드 시 환경변수 확인
pnpm build
```

---

## 문제 해결

### 환경변수가 적용되지 않는 경우

1. **재배포 필요**: 환경변수 추가/수정 후 재배포 필요
2. **변수명 확인**: 대소문자 및 언더스코어 정확히 입력
3. **환경 선택 확인**: Production/Preview/Development 올바르게 선택
4. **빌드 로그 확인**: 빌드 로그에서 환경변수 로드 에러 확인

### 일반적인 에러

- `NEXT_PUBLIC_*` 변수가 `undefined`: 변수명 확인 및 재배포
- 인증 실패: Clerk/Supabase 키 확인
- 결제 위젯 로드 실패: Toss Payments 키 확인

---

## 참고 자료

- [Vercel 환경변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js 환경변수 문서](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Clerk 환경변수 가이드](https://clerk.com/docs/quickstarts/nextjs)
- [Supabase 환경변수 가이드](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)


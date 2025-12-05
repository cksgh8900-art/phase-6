# 문제 해결 가이드

## 일반적인 문제

### 데이터베이스 연결 오류

#### 증상
```
Could not find the table 'public.products' in the schema cache
```

#### 해결 방법
1. Supabase Dashboard → **SQL Editor** 접속
2. `supabase/migrations/db.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기
4. **Run** 클릭하여 실행
5. 성공 메시지 확인

### 인증 오류

#### 증상
- 로그인 후에도 인증되지 않음
- "로그인이 필요합니다" 메시지가 계속 표시됨

#### 해결 방법
1. Clerk Dashboard에서 세션 확인
2. Clerk와 Supabase 통합 설정 확인:
   - Clerk Dashboard → **Integrations** → **Supabase**
   - Supabase Dashboard → **Settings** → **Authentication** → **Providers**
3. 환경변수 확인:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 결제위젯 로드 실패

#### 증상
- 결제위젯이 표시되지 않음
- "결제 설정이 올바르지 않습니다" 메시지 표시

#### 해결 방법
1. 환경변수 확인:
   ```bash
   NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test_ck_...
   ```
2. Toss Payments 개발자센터에서 테스트 키 확인
3. Vercel 배포 시 환경변수 설정 확인

### 빌드 오류

#### 증상
```
Export 'createClerkSupabaseClient' doesn't exist
```

#### 해결 방법
- Client Component에서는 `useClerkSupabaseClient` hook 사용
- Server Component에서는 `createClerkSupabaseClient` 함수 사용
- 파일 상단의 `"use client"` 지시어 확인

### 데이터 로딩 실패

#### 증상
- 페이지가 로드되지 않음
- 빈 화면 또는 에러 메시지 표시

#### 해결 방법
1. 브라우저 콘솔 확인 (F12)
2. 네트워크 탭에서 실패한 요청 확인
3. Supabase 연결 상태 확인
4. 환경변수 확인

## 에러 코드별 해결 방법

### PGRST116
- **의미**: 테이블 또는 행을 찾을 수 없음
- **해결**: 데이터베이스 스키마 확인 및 마이그레이션 실행

### 42P01
- **의미**: 테이블이 존재하지 않음
- **해결**: 마이그레이션 파일 실행

### 23505
- **의미**: 고유 제약 조건 위반
- **해결**: 중복 데이터 확인 및 제거

## 성능 이슈

### 페이지 로딩이 느림

#### 해결 방법
1. 이미지 최적화 확인
2. 데이터베이스 쿼리 최적화
3. 불필요한 데이터 페칭 제거
4. Lighthouse 성능 점수 확인

### 빌드 시간이 오래 걸림

#### 해결 방법
1. 불필요한 의존성 제거
2. 코드 스플리팅 확인
3. 정적 페이지 생성 활용

## 환경변수 문제

### 환경변수가 적용되지 않음

#### 해결 방법
1. `.env.local` 파일 확인 (로컬 개발)
2. Vercel 대시보드에서 환경변수 확인 (배포)
3. 서버 재시작
4. 빌드 재실행

### 환경변수 값이 undefined

#### 해결 방법
1. 변수명 확인 (대소문자, 언더스코어)
2. `NEXT_PUBLIC_` 접두사 확인 (클라이언트 사이드)
3. 환경변수 재설정 후 재배포

## 데이터베이스 문제

### 마이그레이션 실패

#### 해결 방법
1. SQL 문법 오류 확인
2. 기존 데이터와의 충돌 확인
3. 단계별로 마이그레이션 실행

### 데이터 불일치

#### 해결 방법
1. 데이터 무결성 확인
2. 외래 키 제약 조건 확인
3. 트랜잭션 롤백 확인

## 배포 문제

### Vercel 배포 실패

#### 해결 방법
1. 빌드 로그 확인
2. 환경변수 설정 확인
3. Node.js 버전 확인
4. 의존성 설치 오류 확인

### 배포 후 기능이 동작하지 않음

#### 해결 방법
1. 환경변수 확인
2. 데이터베이스 연결 확인
3. 외부 서비스 연동 확인 (Clerk, Supabase, Toss Payments)
4. 런타임 로그 확인

## 추가 지원

문제가 해결되지 않으면:
1. 에러 메시지 전체 복사
2. 브라우저 콘솔 로그 확인
3. 네트워크 요청 확인
4. Supabase 로그 확인
5. Vercel 로그 확인

## 유용한 명령어

```bash
# 로컬 빌드 테스트
pnpm build

# 타입 체크
pnpm tsc --noEmit

# 린터 실행
pnpm lint

# 개발 서버 실행
pnpm dev
```


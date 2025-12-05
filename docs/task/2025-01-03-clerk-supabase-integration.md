# Clerk + Supabase 통합 작업 완료 문서

**작업 일자**: 2025-01-03  
**작업 내용**: Clerk와 Supabase를 최신 모범 사례에 맞게 통합

## 작업 목표

[Clerk 공식 문서](https://clerk.com/docs/guides/development/integrations/databases/supabase)와 웹 검색을 통해 확인한 2025년 최신 모범 사례를 기반으로 Clerk와 Supabase를 통합했습니다.

## 작업 내용

### 1. 환경 변수 예제 파일 생성

- `.env.example` 파일 생성 시도 (globalignore에 의해 차단됨)
- 대신 통합 가이드 문서에 환경 변수 설정 방법 추가

### 2. Clerk-Supabase 통합 설정 가이드 작성

**파일**: `docs/CLERK_SUPABASE_INTEGRATION.md`

다음 내용을 포함:
- Clerk와 Supabase 네이티브 통합 개요
- 단계별 설정 가이드 (Clerk Dashboard, Supabase Dashboard)
- 환경 변수 설정 방법
- 프로젝트 구조 설명
- 각 Supabase 클라이언트 파일의 용도
- 사용 예제 (Client Component, Server Component, Server Action)
- RLS 정책 설정 가이드
- 문제 해결 팁

### 3. Supabase 클라이언트 코드 개선

**파일**: `lib/supabase/clerk-client.ts`

- `useAuth()`에서 `useSession()`으로 변경
- Clerk 공식 문서의 권장 방식과 일치하도록 수정
- 문서 주석 업데이트 및 예제 코드 개선

**변경 사항**:
```typescript
// 이전
const { getToken } = useAuth();

// 개선 후
const { session } = useSession();
return (await session?.getToken()) ?? null;
```

**파일**: `lib/supabase/server.ts`

- 이미 문서 권장 방식과 일치하므로 변경 없음
- `auth().getToken()` 사용 유지

### 4. 사용 예제 페이지 및 컴포넌트 생성

#### 4.1 예제 페이지
**파일**: `app/tasks-example/page.tsx`
- Server Component에서 Clerk 인증 확인
- Clerk 토큰이 포함된 Supabase 클라이언트 사용
- 작업 목록 조회 및 표시

#### 4.2 작업 추가 폼
**파일**: `app/tasks-example/add-task-form.tsx`
- Client Component로 구현
- Server Action을 호출하여 데이터 생성
- 폼 제출 후 페이지 새로고침

#### 4.3 Server Action
**파일**: `app/tasks-example/actions.ts`
- `createTask` Server Action 구현
- Clerk 인증 확인
- Supabase를 통한 데이터 생성
- `revalidatePath`를 사용한 데이터 새로고침

### 5. 데이터베이스 마이그레이션 파일 생성

**파일**: `supabase/migrations/20250103000000_create_tasks_table.sql`

`tasks` 테이블 생성:
- `id`: UUID (Primary Key)
- `name`: 작업 이름 (TEXT, NOT NULL)
- `user_id`: Clerk 사용자 ID (TEXT, NOT NULL, DEFAULT auth.jwt()->>'sub')
- `created_at`: 생성 시간 (TIMESTAMP WITH TIME ZONE)

**RLS 정책**:
- 개발 단계: 비활성화 (프로젝트 규칙 준수)
- 프로덕션: 활성화 필요 (문서에 정책 예제 포함)

**인덱스**:
- `user_id` 인덱스 (사용자별 조회 최적화)
- `created_at` 인덱스 (정렬 최적화)

## 적용된 모범 사례

### 1. 네이티브 통합 방식 (2025년 권장)

- ✅ JWT 템플릿 불필요
- ✅ Clerk 세션 토큰을 Supabase 요청에 자동 포함
- ✅ `accessToken` 옵션을 통한 토큰 전달

### 2. 코드 구조

- ✅ 환경별 클라이언트 분리 (`clerk-client.ts`, `server.ts`, `service-role.ts`, `client.ts`)
- ✅ Server Actions 우선 사용 (API Routes 대신)
- ✅ 타입 안전성 보장

### 3. 보안

- ✅ RLS 정책 설정 가이드 제공
- ✅ 개발 환경에서는 RLS 비활성화 (프로젝트 규칙)
- ✅ 프로덕션 배포 전 RLS 활성화 필요 명시

## 파일 변경 사항

### 생성된 파일
1. `docs/CLERK_SUPABASE_INTEGRATION.md` - 통합 설정 가이드
2. `app/tasks-example/page.tsx` - 예제 페이지 (Server Component)
3. `app/tasks-example/add-task-form.tsx` - 예제 폼 (Client Component)
4. `app/tasks-example/actions.ts` - Server Actions
5. `supabase/migrations/20250103000000_create_tasks_table.sql` - Tasks 테이블 마이그레이션
6. `docs/task/2025-01-03-clerk-supabase-integration.md` - 작업 완료 문서 (본 문서)

### 수정된 파일
1. `lib/supabase/clerk-client.ts` - `useSession()` 사용으로 변경

## 다음 단계

### 즉시 수행 가능
1. Supabase Dashboard에서 마이그레이션 실행
2. Clerk Dashboard에서 Supabase 통합 활성화
3. Supabase Dashboard에서 Clerk를 Third-Party Auth Provider로 설정
4. 환경 변수 설정 (`.env.local`)
5. `/tasks-example` 페이지 테스트

### 향후 작업
1. 프로덕션 배포 전 RLS 정책 활성화
2. 추가 RLS 정책 설정 (필요시)
3. 사용자 동기화 로직 확인 및 개선 (필요시)

## 참고 자료

- [Clerk 공식 문서 - Supabase 통합](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase 공식 문서 - Third-Party Auth](https://supabase.com/docs/guides/auth/third-party/overview)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)

## 테스트 체크리스트

- [ ] Clerk 로그인 후 `/tasks-example` 페이지 접근 가능
- [ ] 작업 목록이 올바르게 표시됨
- [ ] 새 작업 추가 기능 작동
- [ ] 각 사용자는 자신의 작업만 볼 수 있음 (RLS 활성화 시)
- [ ] 로그아웃 후 접근 불가 확인

---

**작업 완료 시간**: 2025-01-03  
**작업자**: AI Assistant (Claude)


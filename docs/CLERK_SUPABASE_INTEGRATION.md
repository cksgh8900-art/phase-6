# Clerk + Supabase 통합 가이드

이 문서는 Clerk와 Supabase를 통합하는 방법을 설명합니다. 이 프로젝트는 **네이티브 통합 방식**(2025년 4월 이후 권장)을 사용합니다.

## 목차

1. [개요](#개요)
2. [설정 단계](#설정-단계)
3. [프로젝트 구조](#프로젝트-구조)
4. [사용 방법](#사용-방법)
5. [RLS 정책 설정](#rls-정책-설정)

## 개요

Clerk와 Supabase의 네이티브 통합을 통해:

- ✅ JWT 템플릿 불필요 (2025년 4월 이후 권장 방식)
- ✅ Clerk 세션 토큰을 Supabase 요청에 자동으로 포함
- ✅ Row Level Security (RLS) 정책으로 데이터 보안 관리
- ✅ 클라이언트 및 서버 컴포넌트 모두 지원

## 설정 단계

### 1. Clerk에서 Supabase 통합 활성화

1. [Clerk Dashboard](https://dashboard.clerk.com)에 로그인
2. **Integrations** → **Supabase** 메뉴로 이동
3. **Activate Supabase integration** 클릭
4. 표시되는 **Clerk domain**을 복사 (예: `your-app.clerk.accounts.dev`)

### 2. Supabase에서 Clerk를 Third-Party Auth Provider로 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Authentication** → **Providers** 메뉴로 이동
4. **Add provider** 클릭
5. **Clerk** 선택
6. 1단계에서 복사한 **Clerk domain**을 입력
7. **Save** 클릭

> 💡 **참고**: 이 설정은 Supabase가 Clerk의 JWT 토큰을 검증할 수 있게 합니다.

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

각 값은 각각의 Dashboard에서 확인할 수 있습니다:

- **Clerk**: [Dashboard → API Keys](https://dashboard.clerk.com/apikeys)
- **Supabase**: [Project Settings → API](https://supabase.com/dashboard/project/_/settings/api)

## 프로젝트 구조

프로젝트는 다양한 사용 사례에 맞춰 Supabase 클라이언트를 분리했습니다:

```
lib/supabase/
├── clerk-client.ts    # Client Component용 Hook
├── server.ts          # Server Component/Server Action용
├── service-role.ts    # 관리자 권한 작업용 (RLS 우회)
└── client.ts          # 인증 불필요한 공개 데이터용
```

### 각 파일의 용도

#### `clerk-client.ts` - Client Component

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();
  
  // Clerk 토큰이 자동으로 포함된 요청
  const { data } = await supabase.from('tasks').select('*');
}
```

#### `server.ts` - Server Component / Server Action

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export default async function MyPage() {
  // async 함수이므로 await 사용 필수
  const supabase = await createClerkSupabaseClient();
  
  // 서버 사이드에서 Clerk 토큰 사용
  const { data } = await supabase.from('tasks').select('*');
  
  return <div>...</div>;
}
```

> ⚠️ **주의**: `createClerkSupabaseClient()`는 `async` 함수이므로 Server Component와 Server Action에서 반드시 `await`를 사용해야 합니다.

#### `service-role.ts` - 관리자 작업

```tsx
import { getServiceRoleClient } from '@/lib/supabase/service-role';

// RLS를 우회하여 모든 데이터 접근
export async function syncUsers() {
  const supabase = getServiceRoleClient();
  const { data } = await supabase.from('users').select('*');
}
```

#### `client.ts` - 공개 데이터

```tsx
import { supabase } from '@/lib/supabase/client';

// 인증 불필요한 공개 데이터 접근
const { data } = await supabase.from('public_posts').select('*');
```

## 사용 방법

### Client Component에서 사용

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function TasksPage() {
  const supabase = useClerkSupabaseClient();
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    async function fetchTasks() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      setTasks(data || []);
    }

    fetchTasks();
  }, [isLoaded, user, supabase]);

  async function createTask(name: string) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ name });

    if (error) {
      console.error('Error creating task:', error);
      return;
    }

    // 데이터 새로고침
    window.location.reload();
  }

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Component에서 사용

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function TasksPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // async 함수이므로 await 사용 필수
  const supabase = await createClerkSupabaseClient();
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
  }

  return (
    <div>
      <h1>Tasks</h1>
      {tasks?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Action에서 사용

```tsx
'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createTask(name: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // async 함수이므로 await 사용 필수
  const supabase = await createClerkSupabaseClient();
  const { error } = await supabase
    .from('tasks')
    .insert({ name });

  if (error) {
    throw new Error('Failed to create task');
  }

  revalidatePath('/tasks');
}
```

## RLS 정책 설정

> ⚠️ **주의**: 이 프로젝트는 개발 단계에서 RLS를 비활성화합니다. 프로덕션 환경에서는 반드시 RLS를 활성화하고 적절한 정책을 설정하세요.

### 개발 환경 (RLS 비활성화)

현재 마이그레이션 파일(`supabase/migrations/setup_schema.sql`)에서:

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

### 프로덕션 환경 (RLS 활성화)

프로덕션 배포 전 다음 정책을 설정하세요:

```sql
-- RLS 활성화
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 작업만 조회 가능
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (auth.jwt()->>'sub' = user_id);

-- 사용자는 자신의 작업만 생성 가능
CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt()->>'sub' = user_id);

-- 사용자는 자신의 작업만 수정 가능
CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (auth.jwt()->>'sub' = user_id)
WITH CHECK (auth.jwt()->>'sub' = user_id);

-- 사용자는 자신의 작업만 삭제 가능
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (auth.jwt()->>'sub' = user_id);
```

> 💡 **참고**: `auth.jwt()->>'sub'`는 Clerk의 사용자 ID를 반환합니다.

## 문제 해결

### "Unauthorized" 에러

1. Clerk Dashboard에서 Supabase 통합이 활성화되어 있는지 확인
2. Supabase Dashboard에서 Clerk provider가 올바르게 설정되어 있는지 확인
3. 환경 변수가 올바르게 설정되어 있는지 확인

### RLS 정책 에러

- 개발 중: RLS를 비활성화 (현재 설정)
- 프로덕션: RLS 정책을 올바르게 설정했는지 확인

### 토큰 관련 에러

- Clerk 세션이 만료되지 않았는지 확인
- `useClerkSupabaseClient()` 또는 `createClerkSupabaseClient()`를 올바른 컴포넌트에서 사용하는지 확인

## 기술 스택

이 프로젝트는 다음과 같은 최신 기술을 사용합니다:

- **@supabase/ssr**: Supabase 공식 SSR 패키지 (쿠키 기반 세션 관리)
- **Next.js 15**: App Router 사용
- **React 19**: 최신 React 기능 활용
- **Clerk**: 인증 제공자

## 참고 자료

- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase SSR 가이드](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Clerk 공식 문서 - Supabase 통합](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase 공식 문서 - Third-Party Auth](https://supabase.com/docs/guides/auth/third-party/overview)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)


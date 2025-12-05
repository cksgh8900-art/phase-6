"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * Clerk 공식 문서 권장 방식 (2025년 4월 이후):
 * - accessToken 옵션을 사용하여 Clerk 토큰 전달
 * - Supabase가 Clerk를 Third-Party Auth Provider로 설정되어 있어야 함
 *
 * 설정 방법:
 * 1. Clerk Dashboard > Integrations > Supabase > Activate
 * 2. Supabase Dashboard > Authentication > Providers > Clerk 추가
 * 3. Clerk domain 입력
 *
 * @see https://clerk.com/docs/guides/development/integrations/databases/supabase
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 * import { useUser } from '@clerk/nextjs';
 *
 * export default function MyComponent() {
 *   const supabase = useClerkSupabaseClient();
 *   const { user, isLoaded } = useUser();
 *
 *   useEffect(() => {
 *     if (!isLoaded || !user) return;
 *
 *     async function fetchData() {
 *       const { data } = await supabase.from('table').select('*');
 *     }
 *     fetchData();
 *   }, [isLoaded, user]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { session } = useSession();

  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        // Clerk 공식 문서 권장 방식: accessToken 콜백 사용
        // Supabase가 Clerk JWT를 자동으로 검증
        accessToken: async () => {
          return (await session?.getToken()) ?? null;
        },
      }
    );
  }, [session]);

  return supabase;
}

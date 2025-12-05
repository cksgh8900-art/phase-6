import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component용)
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
 * // Server Component
 * import { createClerkSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = createClerkSupabaseClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export function createClerkSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required"
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    // Clerk 공식 문서 권장 방식: accessToken 콜백 사용
    // Supabase가 Clerk JWT를 자동으로 검증
    // 인증이 없어도 접근 가능하도록 null 반환 허용
    accessToken: async () => {
      try {
        const authResult = await auth();
        return authResult.getToken() ?? null;
      } catch (error) {
        // 인증이 없어도 공개 데이터는 접근 가능
        return null;
      }
    },
  });
}

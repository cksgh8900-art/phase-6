import { createBrowserClient } from "@supabase/ssr";

/**
 * 공개 데이터 접근용 Supabase 클라이언트 (Client Component용)
 *
 * 인증이 불필요한 공개 데이터에 사용합니다.
 * RLS 정책이 `to anon`으로 설정된 데이터만 접근 가능합니다.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { supabase } from '@/lib/supabase/client';
 *
 * export default function PublicData() {
 *   const { data } = await supabase.from('public_posts').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

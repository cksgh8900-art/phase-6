/**
 * @file app/tasks-example/actions.ts
 * @description 작업 관련 Server Actions
 *
 * Server Action을 통해 데이터베이스 작업을 수행합니다.
 * Clerk 인증이 자동으로 포함된 Supabase 클라이언트를 사용합니다.
 *
 * @dependencies
 * - @clerk/nextjs/server: 서버 사이드 Clerk 인증
 * - @/lib/supabase/server: Clerk 인증된 Supabase 클라이언트
 * - next/cache: revalidatePath
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 새로운 작업을 생성합니다.
 *
 * @param name - 작업 이름
 * @throws {Error} 인증되지 않은 사용자이거나 작업 생성에 실패한 경우
 */
export async function createTask(name: string) {
  // 인증 확인
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: 로그인이 필요합니다.");
  }

  // Clerk 토큰이 포함된 Supabase 클라이언트 생성
  const supabase = createClerkSupabaseClient();

  // 작업 생성
  // user_id는 데이터베이스에서 default로 auth.jwt()->>'sub'를 사용하도록 설정되어야 합니다
  const { error } = await supabase.from("tasks").insert({
    name,
    user_id: userId, // 명시적으로 Clerk user ID 전달
  });

  if (error) {
    console.error("Error creating task:", error);
    throw new Error(`작업 생성에 실패했습니다: ${error.message}`);
  }

  // 페이지 데이터 새로고침
  revalidatePath("/tasks-example");
}


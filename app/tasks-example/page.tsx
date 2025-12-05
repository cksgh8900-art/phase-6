/**
 * @file app/tasks-example/page.tsx
 * @description Clerk + Supabase 통합 예제 페이지
 *
 * 이 페이지는 Server Component에서 Clerk와 Supabase를 사용하는 예제를 보여줍니다.
 *
 * 주요 기능:
 * 1. Server Component에서 Supabase 데이터 조회
 * 2. Server Action을 통한 데이터 생성
 * 3. Clerk 인증 상태 확인
 *
 * @dependencies
 * - @clerk/nextjs/server: 서버 사이드 Clerk 인증
 * - @/lib/supabase/server: Clerk 인증된 Supabase 클라이언트
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { AddTaskForm } from "./add-task-form";

export default async function TasksExamplePage() {
  // Clerk 인증 확인
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Clerk 토큰이 포함된 Supabase 클라이언트 생성
  const supabase = createClerkSupabaseClient();

  // 작업 목록 조회
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">작업 목록 예제</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Server Component에서 Clerk와 Supabase를 사용하는 예제입니다.
        </p>
      </div>

      <div className="mb-6">
        <AddTaskForm />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">내 작업</h2>

        {tasks && tasks.length > 0 ? (
          <div className="grid gap-4">
            {tasks.map((task: any) => (
              <div
                key={task.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-lg">{task.name}</h3>
                {task.created_at && (
                  <p className="text-sm text-gray-500 mt-1">
                    생성일: {new Date(task.created_at).toLocaleString("ko-KR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">작업이 없습니다. 위에서 새 작업을 추가해보세요.</p>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">💡 참고사항</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>이 페이지는 Server Component로 렌더링됩니다.</li>
          <li>
            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
              createClerkSupabaseClient()
            </code>
            를 사용하여 Clerk 토큰이 자동으로 포함된 Supabase 클라이언트를 생성합니다.
          </li>
          <li>새 작업 추가는 Server Action을 통해 처리됩니다.</li>
          <li>
            데이터베이스에 <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">tasks</code>{" "}
            테이블이 필요합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}


/**
 * @file app/tasks-example/add-task-form.tsx
 * @description 작업 추가 폼 컴포넌트 (Client Component)
 *
 * Server Action을 사용하여 새로운 작업을 추가하는 클라이언트 컴포넌트입니다.
 *
 * @dependencies
 * - react: useState
 * - @/app/tasks-example/actions: createTask Server Action
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createTask } from "./actions";

export function AddTaskForm() {
  const [taskName, setTaskName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!taskName.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createTask(taskName.trim());
      setTaskName("");
      router.refresh(); // Server Component 데이터 새로고침
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("작업 추가에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="새 작업을 입력하세요..."
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting || !taskName.trim()}>
        {isSubmitting ? "추가 중..." : "추가"}
      </Button>
    </form>
  );
}


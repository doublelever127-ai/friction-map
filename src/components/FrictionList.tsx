"use client";

import { EmptyState } from "@/components/EmptyState";
import type { FrictionLog } from "@/types/friction";

type FrictionListProps = {
  logs: FrictionLog[];
  onDelete: (id: string) => void;
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "날짜를 확인할 수 없습니다";
  }

  return dateFormatter.format(date);
}

export function FrictionList({ logs, onDelete }: FrictionListProps) {
  if (logs.length === 0) {
    return <EmptyState />;
  }

  const sortedLogs = [...logs].sort(
    (leftLog, rightLog) =>
      new Date(rightLog.createdAt).getTime() -
      new Date(leftLog.createdAt).getTime(),
  );

  return (
    <div className="grid gap-4">
      {sortedLogs.map((log) => (
        <article
          key={log.id}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="break-words text-base font-medium leading-7 text-slate-950 dark:text-slate-50">
                {log.text}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {formatCreatedAt(log.createdAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDelete(log.id)}
              className="self-start rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus:ring-slate-600"
              aria-label={`${log.text} 기록 삭제`}
            >
              삭제
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-200">
              감정: {log.emotion}
            </span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200">
              영역: {log.domain}
            </span>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-800 dark:bg-violet-950 dark:text-violet-200">
              단계: {log.stage}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              강도: {log.intensity}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

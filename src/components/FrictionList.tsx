"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SoftEmptyState } from "@/components/ui/SoftEmptyState";
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

const initialVisibleCount = 5;

function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "날짜를 확인할 수 없습니다";
  }

  return dateFormatter.format(date);
}

export function FrictionList({ logs, onDelete }: FrictionListProps) {
  const [showAll, setShowAll] = useState(false);
  const listHeader = (
    <div className="flex flex-col gap-3 rounded-3xl border border-[var(--line-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          최근 마찰 기록
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          기록은 평가가 아니라 패턴을 보기 위한 재료입니다.
        </p>
      </div>
      <Badge variant="subtle">전체 {logs.length}개</Badge>
    </div>
  );

  if (logs.length === 0) {
    return (
      <div className="grid gap-4">
        {listHeader}
        <SoftEmptyState
          title="아직 기록된 마찰이 없습니다"
          description="거창한 기록이 아니어도 괜찮습니다. ‘또 미뤘다’, ‘답장이 부담됐다’ 같은 한 줄이면 충분합니다."
        />
      </div>
    );
  }

  const sortedLogs = [...logs].sort(
    (leftLog, rightLog) =>
      new Date(rightLog.createdAt).getTime() -
      new Date(leftLog.createdAt).getTime(),
  );
  const hasMoreLogs = sortedLogs.length > initialVisibleCount;
  const visibleLogs = showAll
    ? sortedLogs
    : sortedLogs.slice(0, initialVisibleCount);

  return (
    <div className="grid gap-4">
      {listHeader}

      <div className="grid gap-3">
        {visibleLogs.map((log) => (
          <article
            key={log.id}
            className="rounded-3xl border border-[var(--line-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)]/35"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="break-words text-lg font-semibold leading-8 text-[var(--foreground)]">
                  {log.text}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="emotion">{log.emotion}</Badge>
                  <Badge variant="domain">{log.domain}</Badge>
                  <Badge variant="stage">{log.stage}</Badge>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(log.id)}
                className="self-start"
                aria-label={`${log.text} 기록 삭제`}
              >
                삭제
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-[var(--line-soft)] pt-4 text-xs leading-5 text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <span>{formatCreatedAt(log.createdAt)}</span>
              <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 font-medium text-[var(--text-muted)]">
                강도 {log.intensity}
              </span>
            </div>
          </article>
        ))}
      </div>

      {hasMoreLogs ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "접기" : `전체 보기 (${sortedLogs.length}개)`}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

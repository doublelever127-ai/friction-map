import {
  countByDomain,
  countByEmotion,
  countByStage,
  getLogsWithinDays,
  getTopDomainStageEntry,
  getTopEntries,
  type TopFrictionEntry,
} from "@/lib/frictionStats";
import type { FrictionLog } from "@/types/friction";

type WeeklyReportProps = {
  logs: FrictionLog[];
};

type TopListProps = {
  title: string;
  entries: TopFrictionEntry<string>[];
};

function TopList({ title, entries }: TopListProps) {
  return (
    <div className="border-t border-[var(--line-soft)] pt-4">
      <h3 className="text-sm font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <ol className="mt-3 grid gap-2">
        {entries.map((entry, index) => (
          <li
            key={entry.label}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="min-w-0 text-[var(--text-muted)]">
              {index + 1}. {entry.label}
            </span>
            <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-strong)]">
              {entry.count}회
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function WeeklyReport({ logs }: WeeklyReportProps) {
  const weeklyLogs = getLogsWithinDays(logs, 7);

  if (weeklyLogs.length === 0) {
    return (
      <section
        aria-labelledby="weekly-report-heading"
        className="rounded-3xl border border-[var(--line-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6"
      >
        <p className="text-sm font-medium text-[var(--accent-strong)]">
          주간 리포트
        </p>
        <h2
          id="weekly-report-heading"
          className="mt-1 text-2xl font-semibold text-[var(--foreground)]"
        >
          이번 주의 마찰
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
          이번 주 기록이 아직 없습니다. 막힌 순간이 생기면 한 줄만
          남겨보세요.
        </p>
      </section>
    );
  }

  const topDomains = getTopEntries(countByDomain(weeklyLogs), 3);
  const topStages = getTopEntries(countByStage(weeklyLogs), 3);
  const topEmotions = getTopEntries(countByEmotion(weeklyLogs), 3);
  const observation = getTopDomainStageEntry(weeklyLogs);

  return (
    <section
      aria-labelledby="weekly-report-heading"
      className="rounded-3xl border border-[var(--line-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[var(--accent-strong)]">
            주간 리포트
          </p>
          <h2
            id="weekly-report-heading"
            className="mt-1 text-2xl font-semibold text-[var(--foreground)]"
          >
            이번 주의 마찰
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            리포트는 평가가 아니라 관찰해볼 패턴을 부드럽게 정리한
            것입니다.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-3 lg:min-w-40">
          <p className="text-sm font-medium text-[var(--accent-strong)]">
            이번 주 기록 수
          </p>
          <p className="mt-1 text-3xl font-semibold text-[var(--accent-strong)]">
            {weeklyLogs.length}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <TopList title="이번 주 자주 나타난 생활 영역" entries={topDomains} />
        <TopList title="이번 주 자주 나타난 마찰 단계" entries={topStages} />
        <TopList
          title="이번 주 자주 함께 나타난 감정"
          entries={topEmotions}
        />
      </div>

      <div className="mt-6 border-t border-[var(--line-soft)] pt-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          다음 주에 관찰해볼 마찰 하나
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {observation
            ? `다음 주에는 ‘${observation.domain} × ${observation.stage}’이 반복되는지 가볍게 관찰해볼 수 있습니다.`
            : "다음 주에는 새로 남긴 기록에서 반복되는 조합이 있는지 가볍게 관찰해볼 수 있습니다."}
        </p>
      </div>
    </section>
  );
}

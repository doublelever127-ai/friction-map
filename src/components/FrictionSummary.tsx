import {
  countByDomain,
  countByEmotion,
  countByStage,
  getTopEntries,
  type TopFrictionEntry,
} from "@/lib/frictionStats";
import type { FrictionLog } from "@/types/friction";

type FrictionSummaryProps = {
  logs: FrictionLog[];
};

type SummaryCardProps = {
  title: string;
  entries: TopFrictionEntry<string>[];
};

function SummaryCard({ title, entries }: SummaryCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-semibold leading-6 text-slate-950 dark:text-slate-50">
        {title}
      </h3>
      <ol className="mt-4 grid gap-3">
        {entries.map((entry, index) => (
          <li
            key={entry.label}
            className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 dark:bg-slate-950"
          >
            <span className="min-w-0 text-sm font-medium text-slate-800 dark:text-slate-200">
              {index + 1}. {entry.label}
            </span>
            <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200">
              {entry.count}회
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}

export function FrictionSummary({ logs }: FrictionSummaryProps) {
  if (logs.length === 0) {
    return (
      <section
        aria-labelledby="friction-summary-heading"
        className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <h2
          id="friction-summary-heading"
          className="text-2xl font-semibold text-slate-950 dark:text-slate-50"
        >
          반복 마찰 요약
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          아직 요약할 기록이 없습니다
        </p>
      </section>
    );
  }

  const topDomains = getTopEntries(countByDomain(logs), 3);
  const topStages = getTopEntries(countByStage(logs), 3);
  const topEmotions = getTopEntries(countByEmotion(logs), 3);

  return (
    <section aria-labelledby="friction-summary-heading" className="grid gap-4">
      <div>
        <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
          반복 마찰 요약
        </p>
        <h2
          id="friction-summary-heading"
          className="mt-1 text-2xl font-semibold text-slate-950 dark:text-slate-50"
        >
          자주 나타난 패턴
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          요약은 확정이 아니라 패턴을 보기 위한 힌트입니다.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SummaryCard
          title="이번 기록에서 자주 나타난 생활 영역"
          entries={topDomains}
        />
        <SummaryCard
          title="이번 기록에서 자주 나타난 마찰 단계"
          entries={topStages}
        />
        <SummaryCard
          title="이번 기록에서 자주 함께 나타난 감정"
          entries={topEmotions}
        />
      </div>
    </section>
  );
}

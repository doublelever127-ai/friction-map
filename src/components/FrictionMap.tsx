import {
  frictionDomainOptions,
  frictionStageOptions,
} from "@/lib/frictionOptions";
import { getHeatmapCount } from "@/lib/frictionStats";
import { Badge } from "@/components/ui/Badge";
import { SoftEmptyState } from "@/components/ui/SoftEmptyState";
import type {
  FrictionDomain,
  FrictionLog,
  FrictionStage,
} from "@/types/friction";

type FrictionMapProps = {
  logs: FrictionLog[];
};

type HeatmapLevel = {
  label: string;
  helper: string;
  className: string;
};

type HeatmapEntry = {
  domain: FrictionDomain;
  stage: FrictionStage;
  count: number;
};

const shortStageLabels: Record<FrictionStage, string> = {
  "시작 전 마찰": "시작 전",
  "전환 마찰": "전환",
  "지속 마찰": "지속",
  "완성 마찰": "완성",
  "회복 마찰": "회복",
  "관계 마찰": "관계",
  "결정 마찰": "결정",
};

const stageGuide: Record<FrictionStage, string> = {
  "시작 전 마찰": "시작하기 전부터 버거웠던 위치",
  "전환 마찰": "다른 일로 넘어가는 순간의 위치",
  "지속 마찰": "이어가던 중에 멈춘 위치",
  "완성 마찰": "마무리 앞에서 막힌 위치",
  "회복 마찰": "다시 회복하고 돌아오는 위치",
  "관계 마찰": "사람과 연결된 순간의 위치",
  "결정 마찰": "고르거나 정하는 순간의 위치",
};

const heatmapLegend = [
  { count: "0", label: "기록 없음" },
  { count: "1", label: "가끔 보임" },
  { count: "2~3", label: "자주 보임" },
  { count: "4 이상", label: "반복됨" },
] as const;

function getCellClassName(count: number): string {
  if (count === 0) {
    return "border-[var(--line-soft)] bg-[var(--surface-soft)] text-[var(--text-subtle)]";
  }

  if (count === 1) {
    return "border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_8px_20px_rgba(82,111,90,0.10)] dark:shadow-none";
  }

  if (count <= 3) {
    return "border-[var(--accent)]/35 bg-[var(--accent)]/22 text-[var(--accent-strong)] shadow-[0_10px_24px_rgba(82,111,90,0.14)] dark:shadow-none";
  }

  return "border-[var(--accent-strong)] bg-[var(--accent)] text-white shadow-[0_14px_32px_rgba(82,111,90,0.20)] dark:text-[#171512] dark:shadow-none";
}

function getHeatmapLevel(count: number): HeatmapLevel {
  if (count === 0) {
    return {
      label: "0",
      helper: "없음",
      className: getCellClassName(count),
    };
  }

  if (count === 1) {
    return {
      label: "1",
      helper: "가끔",
      className: getCellClassName(count),
    };
  }

  if (count <= 3) {
    return {
      label: String(count),
      helper: "자주",
      className: getCellClassName(count),
    };
  }

  return {
    label: String(count),
    helper: "반복",
    className: getCellClassName(count),
  };
}

function getHeatmapEntries(logs: readonly FrictionLog[]): HeatmapEntry[] {
  return frictionDomainOptions.flatMap((domain) =>
    frictionStageOptions.map((stage) => ({
      domain,
      stage,
      count: getHeatmapCount(logs, domain, stage),
    })),
  );
}

function getTopHeatmapEntries(logs: readonly FrictionLog[]): HeatmapEntry[] {
  return getHeatmapEntries(logs)
    .filter((entry) => entry.count > 0)
    .sort(
      (left, right) =>
        right.count - left.count ||
        left.domain.localeCompare(right.domain, "ko") ||
        left.stage.localeCompare(right.stage, "ko"),
    )
    .slice(0, 3);
}

function getLatestLog(logs: readonly FrictionLog[]): FrictionLog | null {
  return [...logs].sort(
    (leftLog, rightLog) =>
      new Date(rightLog.createdAt).getTime() -
      new Date(leftLog.createdAt).getTime(),
  )[0] ?? null;
}

function getPrimaryEntry(
  logs: readonly FrictionLog[],
  topEntries: readonly HeatmapEntry[],
): HeatmapEntry | null {
  const latestLog = getLatestLog(logs);

  if (!latestLog) {
    return null;
  }

  if (logs.length === 1) {
    return {
      domain: latestLog.domain,
      stage: latestLog.stage,
      count: 1,
    };
  }

  return topEntries[0] ?? {
    domain: latestLog.domain,
    stage: latestLog.stage,
    count: 1,
  };
}

function FrictionMapFocus({
  entry,
  totalCount,
}: {
  entry: HeatmapEntry;
  totalCount: number;
}) {
  const isFirstPoint = totalCount === 1;

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-[var(--accent)]/25 bg-[radial-gradient(circle_at_18%_18%,rgba(111,143,122,0.2),transparent_9rem),linear-gradient(145deg,var(--accent-soft),var(--surface))] p-3.5">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="status">
          {isFirstPoint ? "방금 찍힌 위치" : "가장 자주 보이는 위치"}
        </Badge>
        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-strong)]">
          {entry.count}회
        </span>
      </div>

      <div className="mt-3 grid grid-cols-[5rem_1fr] items-center gap-3">
        <div
          className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.35rem] border border-[var(--accent)]/25 bg-[linear-gradient(145deg,var(--surface),var(--accent-soft))]"
          aria-hidden="true"
        >
          <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-[var(--accent)]/35" />
          <span className="absolute bottom-3 right-3 h-3 w-3 rounded-full bg-[var(--accent)]/25" />
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(82,111,90,0.22)] dark:text-[#171512]">
            여기
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium leading-5 text-[var(--accent-strong)]">
            {isFirstPoint
              ? "이번 기록은 여기에서 막혔어요"
              : "지금 먼저 볼 위치예요"}
          </p>
          <h3 className="mt-0.5 text-[2rem] font-semibold leading-tight tracking-normal text-[var(--foreground)]">
            {entry.domain} · {shortStageLabels[entry.stage]}
          </h3>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            {isFirstPoint
              ? "지도에 첫 점이 찍혔어요."
              : `전체 ${totalCount}개 중 ${entry.count}번 보였어요.`}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
        <div className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] p-2.5">
          <p className="text-xs text-[var(--text-muted)]">어느 쪽?</p>
          <p className="mt-0.5 text-lg font-semibold text-[var(--foreground)]">
            {entry.domain}
          </p>
        </div>
        <div className="flex items-center">
          <span className="h-0.5 w-4 rounded-full bg-[var(--accent)]/45" />
        </div>
        <div className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] p-2.5">
          <p className="text-xs text-[var(--text-muted)]">어디서?</p>
          <p className="mt-0.5 text-lg font-semibold text-[var(--foreground)]">
            {shortStageLabels[entry.stage]}
          </p>
        </div>
      </div>

      <p className="mt-2 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] px-3 py-2 text-xs leading-5 text-[var(--foreground)]">
        {stageGuide[entry.stage]}
      </p>
    </section>
  );
}

function CompactTopLocations({
  logs,
  topEntries,
}: {
  logs: FrictionLog[];
  topEntries: HeatmapEntry[];
}) {
  if (logs.length === 1) {
    return null;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {topEntries.map((entry, index) => (
        <div
          key={`${entry.domain}-${entry.stage}`}
          className="min-w-0 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-3 py-3"
          title={`${entry.domain} × ${entry.stage}: ${entry.count}회`}
        >
          <p className="text-xs font-semibold text-[var(--accent-strong)]">
            {index + 1}번째 위치
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
            {entry.domain} · {shortStageLabels[entry.stage]}
          </p>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {entry.count}회
          </p>
        </div>
      ))}
    </div>
  );
}

function RecordedLocationCards({ logs }: { logs: FrictionLog[] }) {
  const recordedDomains = frictionDomainOptions
    .map((domain) => {
      const stages = frictionStageOptions
        .map((stage) => ({
          stage,
          count: getHeatmapCount(logs, domain, stage),
        }))
        .filter((entry) => entry.count > 0);

      return {
        domain,
        count: stages.reduce((total, entry) => total + entry.count, 0),
        stages,
      };
    })
    .filter((entry) => entry.count > 0);

  return (
    <details className="group rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-2.5 text-sm font-semibold text-[var(--foreground)]">
        기록된 위치 더 보기
        <span className="text-xs font-medium text-[var(--text-muted)] group-open:hidden">
          펼치기
        </span>
        <span className="hidden text-xs font-medium text-[var(--text-muted)] group-open:inline">
          접기
        </span>
      </summary>

      <div className="grid gap-3 border-t border-[var(--line-soft)] p-3">
        <div className="flex flex-wrap gap-2">
          {heatmapLegend.slice(1).map((item) => (
            <Badge key={item.count} variant="subtle">
              {item.count}: {item.label}
            </Badge>
          ))}
        </div>
        <p className="text-xs leading-5 text-[var(--text-muted)]">
          기록이 있는 위치만 보여줍니다. 아직 기록이 없는 위치는 숨겨두어
          더 빨리 살펴볼 수 있게 했어요.
        </p>

        <div className="grid gap-3">
          {recordedDomains.map((domainEntry) => (
            <section
              key={domainEntry.domain}
              className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-[var(--foreground)]">
                  {domainEntry.domain}
                </h4>
                <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
                  {domainEntry.count}회
                </span>
              </div>

              <div className="mt-3 grid gap-2">
                {domainEntry.stages.map(({ stage, count }) => {
                  const level = getHeatmapLevel(count);

                  return (
                    <div
                      key={`${domainEntry.domain}-${stage}`}
                      role="img"
                      className={`min-w-0 rounded-xl border px-3 py-2.5 transition ${level.className}`}
                      aria-label={`${domainEntry.domain} × ${stage}: ${count}회`}
                      title={`${domainEntry.domain} × ${stage}: ${count}회`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 text-sm font-semibold leading-5">
                          {shortStageLabels[stage]}
                        </span>
                        <span className="text-lg font-semibold leading-5">
                          {count}회
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-medium leading-4 opacity-75">
                        {stageGuide[stage]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </details>
  );
}

export function FrictionMap({ logs }: FrictionMapProps) {
  const topEntries = getTopHeatmapEntries(logs);
  const primaryEntry = getPrimaryEntry(logs, topEntries);

  if (logs.length === 0 || !primaryEntry) {
    return (
      <SoftEmptyState
        title="아직 지도가 비어 있어요"
        description="막힌 순간을 하나 남기면 여기에 첫 위치가 표시됩니다."
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <FrictionMapFocus
        entry={primaryEntry}
        totalCount={logs.length}
      />

      <CompactTopLocations logs={logs} topEntries={topEntries} />

      <RecordedLocationCards logs={logs} />
    </div>
  );
}

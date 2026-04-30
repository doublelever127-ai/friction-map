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
  latestLog,
  totalCount,
}: {
  entry: HeatmapEntry;
  latestLog: FrictionLog | null;
  totalCount: number;
}) {
  const isFirstPoint = totalCount === 1;

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[var(--accent)]/25 bg-[radial-gradient(circle_at_18%_18%,rgba(111,143,122,0.22),transparent_12rem),linear-gradient(145deg,var(--accent-soft),var(--surface))] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="status">
          {isFirstPoint ? "방금 찍힌 위치" : "가장 자주 보이는 위치"}
        </Badge>
        <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
          {entry.count}회
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-[var(--accent-strong)]">
          {isFirstPoint
            ? "이번 기록은 여기에서 막혔어요"
            : "지금 가장 먼저 볼 위치예요"}
        </p>
        <h3 className="mt-2 text-3xl font-semibold leading-tight text-[var(--foreground)]">
          {entry.domain} · {shortStageLabels[entry.stage]}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          {isFirstPoint
            ? "아직 패턴을 판단하는 단계가 아니라, 지도에 첫 점을 찍은 상태입니다."
            : `전체 ${totalCount}개 기록 중 이 위치가 ${entry.count}번 보였습니다.`}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
        <div className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">어느 쪽 일?</p>
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
            {entry.domain}
          </p>
        </div>
        <div className="flex items-center">
          <span className="h-0.5 w-5 rounded-full bg-[var(--accent)]/45" />
        </div>
        <div className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">어디에서 막힘?</p>
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
            {shortStageLabels[entry.stage]}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">
          지도 해석
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--foreground)]">
          {stageGuide[entry.stage]}
        </p>
        {isFirstPoint && latestLog ? (
          <p className="mt-3 border-t border-[var(--line-soft)] pt-3 text-sm leading-6 text-[var(--text-muted)]">
            “{latestLog.text}”
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function FrictionMap({ logs }: FrictionMapProps) {
  const topEntries = getTopHeatmapEntries(logs);
  const latestLog = getLatestLog(logs);
  const primaryEntry = getPrimaryEntry(logs, topEntries);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {logs.length === 0 || !primaryEntry ? (
        <SoftEmptyState
          title="아직 지도가 비어 있어요"
          description="막힌 순간을 하나 남기면 여기에 첫 위치가 표시됩니다."
        />
      ) : (
        <>
          <FrictionMapFocus
            entry={primaryEntry}
            latestLog={latestLog}
            totalCount={logs.length}
          />

          <section className="grid gap-3">
            <div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                자주 막힌 위치
              </h3>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                기록이 쌓이면 먼저 살펴볼 만한 위치가 순서대로 보입니다.
              </p>
            </div>

            {logs.length === 1 ? (
              <div className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-6 text-[var(--text-muted)]">
                지금은 첫 위치만 찍혀 있어요. 비슷한 기록이 쌓이면 다른
                위치와 비교해서 볼 수 있습니다.
              </div>
            ) : (
              <div className="grid min-w-0 gap-3 sm:grid-cols-3">
                {topEntries.map((entry, index) => (
                  <div
                    key={`${entry.domain}-${entry.stage}`}
                    className="min-w-0 overflow-hidden rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-4"
                    title={`${entry.domain} × ${entry.stage}: ${entry.count}회`}
                  >
                    <Badge variant="status">{index + 1}번째 위치</Badge>
                    <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                      {entry.domain} × {shortStageLabels[entry.stage]}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {entry.count}회 보인 위치입니다.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex flex-col gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-[var(--foreground)]">
                전체 지도 범례
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                저장된 기록 {logs.length}개
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {heatmapLegend.map((item) => (
                <Badge key={item.count} variant="subtle">
                  {item.count}: {item.label}
                </Badge>
              ))}
            </div>
            <p className="text-xs leading-5 text-[var(--text-muted)]">
              숫자가 높을수록 같은 위치에서 더 자주 막혔다는 뜻입니다.
            </p>
          </div>

          <p className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)] px-3 py-2 text-xs leading-5 text-[var(--text-muted)] sm:hidden">
            전체 표는 가로로 밀어 더 볼 수 있습니다.
          </p>
          <div className="min-w-0 max-w-full overflow-hidden rounded-2xl [contain:layout_paint]">
            <div
              className="w-full max-w-full overflow-x-auto overscroll-x-contain pb-1"
              role="region"
              aria-label="마찰 지도 전체 표"
              tabIndex={0}
            >
              <table className="w-[820px] max-w-none border-separate border-spacing-2 text-left">
                <caption className="sr-only">
                  어느 쪽 일과 어느 순간에 막혔는지 보여주는 기록 개수
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="w-24 px-2 py-2 text-xs font-medium text-[var(--text-muted)]"
                    >
                      영역
                    </th>
                    {frictionStageOptions.map((stage) => (
                      <th
                        key={stage}
                        scope="col"
                        title={stage}
                        className="w-24 px-2 py-2 text-center text-xs font-medium leading-5 text-[var(--text-muted)]"
                      >
                        <span aria-hidden="true">
                          {shortStageLabels[stage]}
                        </span>
                        <span className="sr-only">{stage}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {frictionDomainOptions.map((domain) => (
                    <tr key={domain}>
                      <th
                        scope="row"
                        className="px-2 py-2 text-sm font-semibold text-[var(--foreground)]"
                      >
                        {domain}
                      </th>
                      {frictionStageOptions.map((stage) => {
                        const count = getHeatmapCount(logs, domain, stage);
                        const level = getHeatmapLevel(count);

                        return (
                          <td key={`${domain}-${stage}`} className="p-0">
                            <div
                              role="img"
                              className={`flex h-16 min-w-22 flex-col items-center justify-center rounded-xl border text-center transition hover:scale-[1.02] ${level.className}`}
                              aria-label={`${domain} × ${stage}: ${count}회`}
                              title={`${domain} × ${stage}: ${count}회`}
                            >
                              <span className="text-xl font-semibold leading-6">
                                {level.label}
                              </span>
                              <span className="mt-0.5 text-[11px] font-medium leading-4 opacity-75">
                                {level.helper}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

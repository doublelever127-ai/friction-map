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

export function FrictionMap({ logs }: FrictionMapProps) {
  const topEntries = getTopHeatmapEntries(logs);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          id="friction-map-heading"
          className="text-2xl font-semibold text-[var(--foreground)]"
        >
          마찰 지도
        </h2>
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          어떤 일에서, 어떤 순간에 자주 막히는지 지도처럼 볼 수 있어요.
        </p>
      </div>

      <section className="grid gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            자주 막힌 위치
          </h3>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
            먼저 살펴볼 만한 일의 종류와 막힌 순간입니다.
          </p>
        </div>

        {topEntries.length === 0 ? (
          <SoftEmptyState
            title="아직 자주 막힌 위치가 없습니다"
            description="기록이 쌓이면 먼저 살펴볼 만한 위치가 여기에 나타납니다."
            className="py-6"
          />
        ) : (
          <div className="grid min-w-0 gap-3 sm:grid-cols-3">
            {topEntries.map((entry, index) => (
              <div
                key={`${entry.domain}-${entry.stage}`}
                className="min-w-0 overflow-hidden rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-4"
                title={`${entry.domain} × ${entry.stage}: ${entry.count}회`}
              >
                <Badge variant="status">Top {index + 1}</Badge>
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
            범례
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            현재 저장된 기록 {logs.length}개
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

      {logs.length === 0 ? (
        <SoftEmptyState
          title="아직 지도가 비어 있어요"
          description="막힌 순간을 하나 남기면 여기에 표시됩니다."
        />
      ) : (
        <>
          <p className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)] px-3 py-2 text-xs leading-5 text-[var(--text-muted)] sm:hidden">
            가로로 밀어 더 볼 수 있습니다.
          </p>
          <div className="w-full max-w-full overflow-x-auto overscroll-x-contain pb-1">
            <table className="min-w-[820px] border-separate border-spacing-2 text-left">
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
                      <span aria-hidden="true">{shortStageLabels[stage]}</span>
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
        </>
      )}
    </div>
  );
}

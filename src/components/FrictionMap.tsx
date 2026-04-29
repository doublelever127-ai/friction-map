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
  { count: "1", label: "가끔 나타남" },
  { count: "2~3", label: "자주 나타남" },
  { count: "4 이상", label: "반복 신호" },
] as const;

function getCellClassName(count: number): string {
  if (count === 0) {
    return "border-slate-100 bg-slate-50/70 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-600";
  }

  if (count === 1) {
    return "border-teal-100 bg-teal-50 text-teal-800 shadow-sm shadow-teal-100/60 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200 dark:shadow-none";
  }

  if (count <= 3) {
    return "border-teal-200 bg-teal-100 text-teal-900 shadow-sm shadow-teal-100 dark:border-teal-800 dark:bg-teal-900 dark:text-teal-100 dark:shadow-none";
  }

  return "border-teal-300 bg-teal-200 text-teal-950 shadow-md shadow-teal-200/70 dark:border-teal-500 dark:bg-teal-700 dark:text-white dark:shadow-none";
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
          className="text-2xl font-semibold text-slate-950 dark:text-slate-50"
        >
          마찰 지도
        </h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          반복해서 막히는 위치를 생활 영역과 행동 단계로 나눠 보는
          화면입니다.
        </p>
      </div>

      {logs.length === 0 ? (
        <SoftEmptyState
          title="아직 지도가 비어 있습니다"
          description="마찰 기록이 쌓이면 반복해서 막히는 위치가 여기에 나타납니다."
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {topEntries.map((entry, index) => (
              <div
                key={`${entry.domain}-${entry.stage}`}
                className="rounded-lg border border-teal-100 bg-teal-50/70 p-4 dark:border-teal-900 dark:bg-teal-950/40"
              >
                <Badge variant="status">Top {index + 1}</Badge>
                <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-slate-50">
                  {entry.domain} × {shortStageLabels[entry.stage]}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {entry.count}회 나타난 위치입니다.
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                현재 저장된 기록 {logs.length}개
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                숫자가 높을수록 같은 위치에서 더 자주 나타났다는 뜻입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {heatmapLegend.map((item) => (
                <Badge key={item.count} variant="subtle">
                  {item.count}: {item.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
            <table className="min-w-[820px] border-separate border-spacing-2 text-left">
              <caption className="sr-only">
                생활 영역과 마찰 단계 조합별 기록 개수
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-24 px-2 py-2 text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    영역
                  </th>
                  {frictionStageOptions.map((stage) => (
                    <th
                      key={stage}
                      scope="col"
                      title={stage}
                      className="w-24 px-2 py-2 text-center text-xs font-medium leading-5 text-slate-600 dark:text-slate-300"
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
                      className="px-2 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
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

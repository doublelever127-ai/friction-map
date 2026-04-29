import {
  frictionDomainOptions,
  frictionStageOptions,
} from "@/lib/frictionOptions";
import { getHeatmapCount } from "@/lib/frictionStats";
import type { FrictionLog } from "@/types/friction";

type FrictionMapProps = {
  logs: FrictionLog[];
};

function getCellClassName(count: number): string {
  if (count === 0) {
    return "border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600";
  }

  if (count === 1) {
    return "border-teal-100 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200";
  }

  if (count <= 3) {
    return "border-teal-200 bg-teal-100 text-teal-900 dark:border-teal-800 dark:bg-teal-900 dark:text-teal-100";
  }

  return "border-teal-300 bg-teal-200 text-teal-950 dark:border-teal-600 dark:bg-teal-700 dark:text-white";
}

export function FrictionMap({ logs }: FrictionMapProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
          마찰 지도/요약 영역
        </p>
        <h2
          id="friction-map-heading"
          className="text-2xl font-semibold text-slate-950 dark:text-slate-50"
        >
          마찰 지도
        </h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          반복해서 막히는 위치를 지도처럼 보는 화면입니다.
        </p>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          마찰이 자주 나타난 위치를 생활 영역과 행동 단계의 조합으로
          살펴봅니다.
        </p>
      </div>

      <div className="border-y border-teal-100 bg-teal-50 px-1 py-3 dark:border-teal-900 dark:bg-teal-950/60">
        <p className="text-sm font-medium text-teal-900 dark:text-teal-100">
          현재 저장된 기록 {logs.length}개
        </p>
        <p className="mt-1 text-sm leading-6 text-teal-800 dark:text-teal-200">
          숫자가 높을수록 같은 위치에서 마찰이 더 자주 나타났다는 뜻입니다.
        </p>
      </div>

      <div className="overflow-x-auto pb-1">
        <table className="min-w-[760px] border-separate border-spacing-2 text-left">
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
                  className="w-24 px-2 py-2 text-xs font-medium leading-5 text-slate-600 dark:text-slate-300"
                >
                  {stage}
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

                  return (
                    <td key={`${domain}-${stage}`} className="p-0">
                      <div
                        className={`flex h-12 min-w-20 items-center justify-center rounded-md border text-sm font-semibold transition ${getCellClassName(
                          count,
                        )}`}
                        aria-label={`${domain}, ${stage}: ${count}개`}
                        title={`${domain} / ${stage}: ${count}개`}
                      >
                        {count}
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
  );
}

"use client";

import { ExperimentStatusControl } from "@/components/ExperimentStatusControl";
import type {
  FrictionExperiment,
  FrictionExperimentStatus,
  FrictionLog,
} from "@/types/friction";

type ExperimentListProps = {
  experiments: FrictionExperiment[];
  logs: FrictionLog[];
  onDelete: (experimentId: string) => void;
  onStatusChange: (
    experimentId: string,
    status: FrictionExperimentStatus,
  ) => void;
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "날짜를 확인할 수 없습니다";
  }

  return dateFormatter.format(date);
}

export function ExperimentList({
  experiments,
  logs,
  onDelete,
  onStatusChange,
}: ExperimentListProps) {
  if (experiments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">
          아직 작은 실험 카드가 없습니다
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          반복되는 마찰 하나를 골라, 3~7일 동안 가볍게 관찰할 실험으로
          바꿔보세요.
        </p>
      </div>
    );
  }

  const logsById = new Map(logs.map((log) => [log.id, log]));
  const sortedExperiments = [...experiments].sort(
    (leftExperiment, rightExperiment) =>
      new Date(rightExperiment.createdAt).getTime() -
      new Date(leftExperiment.createdAt).getTime(),
  );

  return (
    <div className="grid gap-4">
      {sortedExperiments.map((experiment) => {
        const linkedLog = logsById.get(experiment.frictionLogId);

        return (
          <article
            key={experiment.id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                  {experiment.durationDays}일 작은 실험
                </p>
                <h3 className="mt-1 break-words text-xl font-semibold leading-7 text-slate-950 dark:text-slate-50">
                  {experiment.title}
                </h3>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <ExperimentStatusControl
                  id={`experiment-status-${experiment.id}`}
                  status={experiment.status}
                  onChange={(status) => onStatusChange(experiment.id, status)}
                />

                <button
                  type="button"
                  onClick={() => onDelete(experiment.id)}
                  className="self-start rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus:ring-slate-600 sm:self-end"
                  aria-label={`${experiment.title} 실험 삭제`}
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-md bg-slate-50 px-3 py-3 dark:bg-slate-950">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                연결된 마찰 기록
              </p>
              <p className="mt-1 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                {linkedLog?.text ??
                  "연결된 마찰 기록을 찾을 수 없습니다. 실험 카드는 그대로 유지됩니다."}
              </p>
            </div>

            <dl className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  원인 가설
                </dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {experiment.hypothesis}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  작은 실험
                </dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {experiment.action}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  성공 기준
                </dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {experiment.successCriteria}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  예상대로 안 됐을 때 해석
                </dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {experiment.failureInterpretation}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  현재 상태
                </dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {experiment.status}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  생성일
                </dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {formatDateTime(experiment.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  수정일
                </dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {formatDateTime(experiment.updatedAt)}
                </dd>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}

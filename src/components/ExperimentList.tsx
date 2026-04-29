"use client";

import {
  ExperimentStatusControl,
  getExperimentStatusLabel,
} from "@/components/ExperimentStatusControl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SoftEmptyState } from "@/components/ui/SoftEmptyState";
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

type ExperimentDetailProps = {
  label: string;
  children: string;
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

function ExperimentDetail({ label, children }: ExperimentDetailProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
        {children}
      </dd>
    </div>
  );
}

export function ExperimentList({
  experiments,
  logs,
  onDelete,
  onStatusChange,
}: ExperimentListProps) {
  if (experiments.length === 0) {
    return (
      <SoftEmptyState
        title="아직 작게 바꿔보기 카드가 없습니다"
        description="반복되는 막힘이 보이면, 다음에 덜 버겁게 해볼 작은 방법을 정해보세요."
        className="bg-white shadow-sm dark:bg-slate-900"
      />
    );
  }

  const logsById = new Map(logs.map((log) => [log.id, log]));
  const sortedExperiments = [...experiments].sort(
    (leftExperiment, rightExperiment) =>
      new Date(rightExperiment.createdAt).getTime() -
      new Date(leftExperiment.createdAt).getTime(),
  );

  return (
    <div className="grid min-w-0 gap-4">
      {sortedExperiments.map((experiment) => {
        const linkedLog = logsById.get(experiment.frictionLogId);

        return (
          <article
            key={experiment.id}
            className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="status">
                    {getExperimentStatusLabel(experiment.status)}
                  </Badge>
                  <Badge variant="subtle">{experiment.durationDays}일</Badge>
                </div>
                <h3 className="mt-3 break-words text-xl font-semibold leading-7 text-slate-950 dark:text-slate-50">
                  {experiment.title}
                </h3>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(experiment.id)}
                className="shrink-0 self-start sm:self-auto"
                aria-label={`${experiment.title} 카드 삭제`}
              >
                삭제
              </Button>
            </div>

            <div className="mt-5 min-w-0 overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/70 p-4 dark:border-teal-900 dark:bg-teal-950/40">
              <p className="text-xs font-semibold text-teal-800 dark:text-teal-200">
                연결된 기록
              </p>
              {linkedLog ? (
                <>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-900 dark:text-slate-100">
                    {linkedLog.text}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="domain">{linkedLog.domain}</Badge>
                    <Badge variant="stage">{linkedLog.stage}</Badge>
                    <Badge variant="emotion">{linkedLog.emotion}</Badge>
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  연결된 기록을 찾을 수 없습니다. 이 카드는 그대로
                  유지됩니다.
                </p>
              )}
            </div>

            <dl className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
              <ExperimentDetail label="왜 그랬을까요?">
                {experiment.hypothesis}
              </ExperimentDetail>
              <ExperimentDetail label="다음에 작게 바꿔볼 것">
                {experiment.action}
              </ExperimentDetail>
              <ExperimentDetail label="어떻게 확인할까요?">
                {experiment.successCriteria}
              </ExperimentDetail>
              <ExperimentDetail label="잘 안 됐을 때 어떻게 볼까요?">
                {experiment.failureInterpretation}
              </ExperimentDetail>
            </dl>

            <div className="mt-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex flex-col gap-3">
                <ExperimentStatusControl
                  id={`experiment-status-${experiment.id}`}
                  status={experiment.status}
                  onChange={(status) => onStatusChange(experiment.id, status)}
                />
                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  지금 상태는 평가가 아니라 어디까지 해봤는지 가볍게 표시하는
                  용도입니다.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-1 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:justify-between">
              <span>생성일 {formatDateTime(experiment.createdAt)}</span>
              <span>수정일 {formatDateTime(experiment.updatedAt)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  ExperimentStatusControl,
  getExperimentStatusLabel,
} from "@/components/ExperimentStatusControl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChoiceChip } from "@/components/ui/ChoiceChip";
import { SoftEmptyState } from "@/components/ui/SoftEmptyState";
import type {
  FrictionExperiment,
  FrictionExperimentReviewFeeling,
  FrictionExperimentStatus,
  FrictionLog,
  UpdateFrictionExperimentReviewInput,
} from "@/types/friction";

type ExperimentListProps = {
  experiments: FrictionExperiment[];
  logs: FrictionLog[];
  onDelete: (experimentId: string) => void;
  onStatusChange: (
    experimentId: string,
    status: FrictionExperimentStatus,
  ) => void;
  onReviewSave: (
    experimentId: string,
    review: UpdateFrictionExperimentReviewInput,
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

const reviewFeelingOptions = [
  "생각보다 가벼웠어요",
  "조금 버거웠어요",
  "상황이 달랐어요",
  "아직 해보지 못했어요",
] as const satisfies readonly FrictionExperimentReviewFeeling[];

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "날짜를 확인할 수 없습니다";
  }

  return dateFormatter.format(date);
}

function ExperimentDetail({ label, children }: ExperimentDetailProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)] p-4">
      <dt className="text-sm font-semibold text-[var(--foreground)]">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm leading-6 text-[var(--text-muted)]">
        {children}
      </dd>
    </div>
  );
}

function ExperimentReviewForm({
  experiment,
  onSave,
}: {
  experiment: FrictionExperiment;
  onSave: (review: UpdateFrictionExperimentReviewInput) => void;
}) {
  const [reviewFeeling, setReviewFeeling] =
    useState<FrictionExperimentReviewFeeling>(
      experiment.reviewFeeling ?? "아직 해보지 못했어요",
    );
  const [reviewNote, setReviewNote] = useState(experiment.reviewNote ?? "");
  const [nextAdjustment, setNextAdjustment] = useState(
    experiment.nextAdjustment ?? "",
  );
  const [message, setMessage] = useState("");

  function handleSave() {
    onSave({
      reviewFeeling,
      reviewNote: reviewNote.trim(),
      nextAdjustment: nextAdjustment.trim(),
    });
    setMessage("돌아보기를 저장했습니다.");
  }

  return (
    <section className="mt-5 rounded-3xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-semibold text-[var(--foreground)]">
          해보니 어땠나요?
        </h4>
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          판정하는 곳이 아니라, 다음 시도를 더 작게 조정하는 곳입니다.
        </p>
      </div>

      <fieldset className="mt-4 space-y-3">
        <legend className="text-sm font-medium text-[var(--foreground)]">
          지금 가장 가까운 느낌
        </legend>
        <div className="flex flex-wrap gap-2">
          {reviewFeelingOptions.map((option) => (
            <ChoiceChip
              key={option}
              selected={reviewFeeling === option}
              onClick={() => {
                setReviewFeeling(option);
                setMessage("");
              }}
              className="justify-start text-left"
            >
              {option}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-3">
        <label
          htmlFor={`experiment-review-note-${experiment.id}`}
          className="grid gap-2"
        >
          <span className="text-sm font-medium text-[var(--foreground)]">
            짧게 남기기
          </span>
          <textarea
            id={`experiment-review-note-${experiment.id}`}
            value={reviewNote}
            onChange={(event) => {
              setReviewNote(event.target.value);
              setMessage("");
            }}
            rows={3}
            placeholder="예: 운동복을 입는 건 생각보다 괜찮았지만, 퇴근 직후에는 조금 버거웠다"
            className="min-h-24 w-full resize-y rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--text-subtle)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15"
          />
        </label>

        <label
          htmlFor={`experiment-next-adjustment-${experiment.id}`}
          className="grid gap-2"
        >
          <span className="text-sm font-medium text-[var(--foreground)]">
            다음엔 어떻게 더 작게 해볼까요?
          </span>
          <textarea
            id={`experiment-next-adjustment-${experiment.id}`}
            value={nextAdjustment}
            onChange={(event) => {
              setNextAdjustment(event.target.value);
              setMessage("");
            }}
            rows={3}
            placeholder="예: 운동복을 입는 것도 크면, 운동복을 꺼내두기만 해본다"
            className="min-h-24 w-full resize-y rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--text-subtle)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" size="sm" onClick={handleSave}>
          돌아보기 저장
        </Button>
        {experiment.reviewedAt ? (
          <p className="text-xs leading-5 text-[var(--text-muted)]">
            마지막 저장 {formatDateTime(experiment.reviewedAt)}
          </p>
        ) : null}
      </div>

      {message ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm leading-6 text-[var(--accent-strong)]"
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}

export function ExperimentList({
  experiments,
  logs,
  onDelete,
  onStatusChange,
  onReviewSave,
}: ExperimentListProps) {
  if (experiments.length === 0) {
    return (
      <SoftEmptyState
        title="아직 시도 카드가 없습니다"
        description="반복되는 막힘이 보이면, 다음에 덜 버겁게 해볼 작은 방법을 정해보세요."
        className="shadow-[var(--shadow-soft)]"
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
            className="min-w-0 overflow-hidden rounded-[1.5rem] border border-[var(--line-soft)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] sm:p-5"
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="flex min-w-0 flex-wrap gap-2">
                <Badge variant="status">
                  {getExperimentStatusLabel(experiment.status)}
                </Badge>
                <Badge variant="subtle">{experiment.durationDays}일</Badge>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(experiment.id)}
                className="shrink-0 self-start px-2.5 text-xs"
                aria-label={`${experiment.title} 카드 삭제`}
              >
                삭제
              </Button>
            </div>

            <h3 className="mt-3 line-clamp-2 min-w-0 break-words text-lg font-semibold leading-6 text-[var(--foreground)]">
              {experiment.title}
            </h3>

            {linkedLog ? (
              <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-[var(--text-muted)]">
                {linkedLog.text}
              </p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                연결된 기록은 없어졌지만, 이 시도 카드는 그대로 남아 있어요.
              </p>
            )}

            <div className="mt-4 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-3.5">
              <p className="text-xs font-semibold text-[var(--accent-strong)]">
                다음에 작게 해볼 것
              </p>
              <p className="mt-1 line-clamp-3 break-words text-sm leading-6 text-[var(--foreground)]">
                {experiment.action}
              </p>
            </div>

            <details className="group mt-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[var(--foreground)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)]/15">
                <span>카드 내용 더 보기</span>
                <span className="text-xs font-medium text-[var(--text-muted)] group-open:hidden">
                  펼치기
                </span>
                <span className="hidden text-xs font-medium text-[var(--text-muted)] group-open:inline">
                  접기
                </span>
              </summary>

              <div className="grid gap-3 border-t border-[var(--line-soft)] p-3.5">
                <div className="min-w-0 overflow-hidden rounded-2xl border border-[var(--accent)]/20 bg-[var(--surface)] p-3.5">
                  <p className="text-xs font-semibold text-[var(--accent-strong)]">
                    연결된 기록
                  </p>
                  {linkedLog ? (
                    <>
                      <p className="mt-2 break-words text-sm leading-6 text-[var(--foreground)]">
                        {linkedLog.text}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="domain">{linkedLog.domain}</Badge>
                        <Badge variant="stage">{linkedLog.stage}</Badge>
                        <Badge variant="emotion">{linkedLog.emotion}</Badge>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      연결된 기록을 찾을 수 없습니다. 이 카드는 그대로
                      유지됩니다.
                    </p>
                  )}
                </div>

                <dl className="grid min-w-0 gap-3">
                  <ExperimentDetail label="왜 그랬을까요?">
                    {experiment.hypothesis}
                  </ExperimentDetail>
                  <ExperimentDetail label="어떻게 확인할까요?">
                    {experiment.successCriteria}
                  </ExperimentDetail>
                  <ExperimentDetail label="잘 안 됐을 때 어떻게 볼까요?">
                    {experiment.failureInterpretation}
                  </ExperimentDetail>
                </dl>

                <div className="flex flex-col gap-1 border-t border-[var(--line-soft)] pt-3 text-xs leading-5 text-[var(--text-muted)] sm:flex-row sm:justify-between">
                  <span>생성일 {formatDateTime(experiment.createdAt)}</span>
                  <span>수정일 {formatDateTime(experiment.updatedAt)}</span>
                </div>
              </div>
            </details>

            <details className="group mt-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[var(--foreground)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)]/15">
                <span>상태와 돌아보기</span>
                <span className="text-xs font-medium text-[var(--text-muted)] group-open:hidden">
                  열기
                </span>
                <span className="hidden text-xs font-medium text-[var(--text-muted)] group-open:inline">
                  접기
                </span>
              </summary>

              <div className="border-t border-[var(--line-soft)] p-3.5">
                <ExperimentStatusControl
                  id={`experiment-status-${experiment.id}`}
                  status={experiment.status}
                  onChange={(status) => onStatusChange(experiment.id, status)}
                />
                <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
                  지금 상태는 평가가 아니라 어디까지 해봤는지 가볍게 표시하는
                  용도입니다.
                </p>

                <ExperimentReviewForm
                  experiment={experiment}
                  onSave={(review) => onReviewSave(experiment.id, review)}
                />
              </div>
            </details>
          </article>
        );
      })}
    </div>
  );
}

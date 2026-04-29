"use client";

import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChoiceChip } from "@/components/ui/ChoiceChip";
import { SoftEmptyState } from "@/components/ui/SoftEmptyState";
import type {
  CreateFrictionExperimentInput,
  FrictionLog,
} from "@/types/friction";

type ExperimentBuilderProps = {
  logs: FrictionLog[];
  onCreate: (input: CreateFrictionExperimentInput) => void;
};

type ExperimentStepProps = {
  step: string;
  title: string;
  description?: string;
  children: ReactNode;
};

const durationOptions = [3, 5, 7] as const;
const defaultDurationDays: CreateFrictionExperimentInput["durationDays"] = 5;

const inputClassName =
  "h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-950";

const textareaClassName =
  "min-h-24 w-full min-w-0 resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-950";

function getLogOptionLabel(log: FrictionLog): string {
  if (log.text.length <= 42) {
    return log.text;
  }

  return `${log.text.slice(0, 42)}...`;
}

function ExperimentStep({
  step,
  title,
  description,
  children,
}: ExperimentStepProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mb-4 flex flex-col gap-2">
        <Badge variant="subtle">{step}</Badge>
        <div>
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function SelectedFrictionPreview({ log }: { log: FrictionLog }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-teal-100 bg-teal-50/70 p-4 dark:border-teal-900 dark:bg-teal-950/40">
      <p className="text-xs font-semibold text-teal-800 dark:text-teal-200">
        선택한 기록
      </p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-900 dark:text-slate-100">
        {log.text}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="domain">{log.domain}</Badge>
        <Badge variant="stage">{log.stage}</Badge>
        <Badge variant="emotion">{log.emotion}</Badge>
      </div>
    </div>
  );
}

export function ExperimentBuilder({ logs, onCreate }: ExperimentBuilderProps) {
  const [frictionLogId, setFrictionLogId] = useState(logs[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [action, setAction] = useState("");
  const [durationDays, setDurationDays] =
    useState<CreateFrictionExperimentInput["durationDays"]>(
      defaultDurationDays,
    );
  const [successCriteria, setSuccessCriteria] = useState("");
  const [failureInterpretation, setFailureInterpretation] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const selectedFrictionLogId = logs.some((log) => log.id === frictionLogId)
    ? frictionLogId
    : (logs[0]?.id ?? "");
  const selectedLog =
    logs.find((log) => log.id === selectedFrictionLogId) ?? null;

  useEffect(() => {
    if (logs.length === 0) {
      setFrictionLogId("");
      return;
    }

    const selectedLogStillExists = logs.some((log) => log.id === frictionLogId);

    if (!selectedLogStillExists) {
      setFrictionLogId(logs[0].id);
    }
  }, [frictionLogId, logs]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");

    const trimmedTitle = title.trim();
    const trimmedHypothesis = hypothesis.trim();
    const trimmedAction = action.trim();
    const trimmedSuccessCriteria = successCriteria.trim();
    const trimmedFailureInterpretation = failureInterpretation.trim();

    if (
      !selectedFrictionLogId ||
      !trimmedTitle ||
      !trimmedHypothesis ||
      !trimmedAction ||
      !trimmedSuccessCriteria ||
      !trimmedFailureInterpretation
    ) {
      setFormMessage(
        "아직 비어 있는 항목이 있습니다. 지금 떠오르는 만큼만 차분히 채워주세요.",
      );
      return;
    }

    if (!durationOptions.includes(durationDays)) {
      setFormMessage("기간은 3일, 5일, 7일 중에서 골라주세요.");
      return;
    }

    onCreate({
      frictionLogId: selectedFrictionLogId,
      title: trimmedTitle,
      hypothesis: trimmedHypothesis,
      action: trimmedAction,
      durationDays,
      successCriteria: trimmedSuccessCriteria,
      failureInterpretation: trimmedFailureInterpretation,
    });

    setTitle("");
    setHypothesis("");
    setAction("");
    setDurationDays(defaultDurationDays);
    setSuccessCriteria("");
    setFailureInterpretation("");
    setFormMessage("");
  }

  if (logs.length === 0) {
    return (
      <section className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-5 dark:border-slate-800">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
            먼저 기록이 필요합니다
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            작게 바꿔보기는 기록 하나를 골라, 다음에 덜 버겁게 해볼 작은
            방법을 정하는 방식입니다.
          </p>
        </div>

        <SoftEmptyState
          title="작게 바꿔볼 기록이 아직 없습니다"
          description="먼저 오늘 막혔던 순간을 한 줄로 남기면, 그 기록을 바탕으로 작은 방법을 정할 수 있습니다."
        />
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-5 dark:border-slate-800">
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
          시도 카드 만들기
        </h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          바로 해결하지 않아도 괜찮아요. 다음에 덜 버겁게 해볼 작은
          방법만 정합니다.
        </p>
      </div>

      <div className="grid gap-4">
        <ExperimentStep
          step="1단계"
          title="어떤 막힘을 볼까요?"
          description="이미 남긴 기록 하나를 골라 출발점으로 삼습니다."
        >
          <label htmlFor="experiment-log" className="flex min-w-0 flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              연결할 기록
            </span>
            <select
              id="experiment-log"
              value={selectedFrictionLogId}
              onChange={(event) => setFrictionLogId(event.target.value)}
              className={inputClassName}
            >
              {logs.map((log) => (
                <option key={log.id} value={log.id}>
                  {getLogOptionLabel(log)}
                </option>
              ))}
            </select>
          </label>

          {selectedLog ? <SelectedFrictionPreview log={selectedLog} /> : null}

          <label htmlFor="experiment-title" className="flex min-w-0 flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              카드 이름
            </span>
            <input
              id="experiment-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="예: 운동 시작 덜 버겁게 하기"
              className={inputClassName}
            />
          </label>
        </ExperimentStep>

        <ExperimentStep
          step="2단계"
          title="왜 그랬을까요?"
          description="확정하지 않고 지금 떠오르는 생각을 적어봅니다."
        >
          <label htmlFor="experiment-hypothesis" className="flex min-w-0 flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              왜 그랬을까요?
            </span>
            <textarea
              id="experiment-hypothesis"
              value={hypothesis}
              onChange={(event) => setHypothesis(event.target.value)}
              placeholder="예: 시작 단위가 너무 커서 부담이 생긴 것 같다"
              rows={3}
              className={textareaClassName}
            />
          </label>
        </ExperimentStep>

        <ExperimentStep
          step="3단계"
          title="다음에 무엇을 작게 바꿔볼까요?"
          description="기간과 행동 단위를 작게 정해 가볍게 확인해봅니다."
        >
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-slate-900 dark:text-slate-100">
              며칠 동안 해볼까요?
            </legend>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map((option) => (
                <ChoiceChip
                  key={option}
                  selected={durationDays === option}
                  onClick={() => setDurationDays(option)}
                >
                  {option}일
                </ChoiceChip>
              ))}
            </div>
          </fieldset>

          <label htmlFor="experiment-action" className="flex min-w-0 flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              다음에 작게 바꿔볼 것
            </span>
            <textarea
              id="experiment-action"
              value={action}
              onChange={(event) => setAction(event.target.value)}
              placeholder="예: 5일 동안 운동을 목표로 하지 않고 운동복만 입어본다"
              rows={3}
              className={textareaClassName}
            />
          </label>
        </ExperimentStep>

        <ExperimentStep
          step="4단계"
          title="어떻게 확인할까요?"
          description="무엇을 보면 충분할지 먼저 정합니다."
        >
          <label htmlFor="experiment-success" className="flex min-w-0 flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              어떻게 확인할까요?
            </span>
            <textarea
              id="experiment-success"
              value={successCriteria}
              onChange={(event) => setSuccessCriteria(event.target.value)}
              placeholder="예: 실제 운동 여부가 아니라 운동복을 입었는지만 본다"
              rows={3}
              className={textareaClassName}
            />
          </label>

          <label
            htmlFor="experiment-interpretation"
            className="flex min-w-0 flex-col gap-2"
          >
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              잘 안 됐을 때 어떻게 볼까요?
            </span>
            <textarea
              id="experiment-interpretation"
              value={failureInterpretation}
              onChange={(event) =>
                setFailureInterpretation(event.target.value)
              }
              placeholder="예: 방법이 아직 컸다는 신호로 보고 더 작게 조정한다"
              rows={3}
              className={textareaClassName}
            />
          </label>
        </ExperimentStep>

        {formMessage ? (
          <p
            className="rounded-lg bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:bg-teal-950 dark:text-teal-100"
            role="status"
            aria-live="polite"
          >
            {formMessage}
          </p>
        ) : null}

        <Button type="submit" className="w-full">
          시도 카드 만들기
        </Button>
      </div>
    </form>
  );
}

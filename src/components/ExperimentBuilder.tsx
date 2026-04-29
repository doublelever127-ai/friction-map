"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type {
  CreateFrictionExperimentInput,
  FrictionLog,
} from "@/types/friction";

type ExperimentBuilderProps = {
  logs: FrictionLog[];
  onCreate: (input: CreateFrictionExperimentInput) => void;
};

const durationOptions = [3, 5, 7] as const;
const defaultDurationDays: CreateFrictionExperimentInput["durationDays"] = 5;

function getLogOptionLabel(log: FrictionLog): string {
  if (log.text.length <= 42) {
    return log.text;
  }

  return `${log.text.slice(0, 42)}...`;
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
      setFormMessage("실험 기간은 3일, 5일, 7일 중에서 골라주세요.");
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

  const hasLogs = logs.length > 0;

  if (!hasLogs) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-5 dark:border-slate-800">
          <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
            작은 실험 만들기
          </p>
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
            실험 카드
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            직접 세운 가설을 작게 확인해보는 자리입니다.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 dark:border-slate-700 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
            실험으로 바꿀 마찰 기록이 아직 없습니다
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            먼저 오늘 막혔던 순간을 한 줄로 기록하면, 그 기록을 작은
            실험으로 바꿀 수 있습니다.
          </p>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-5 dark:border-slate-800">
        <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
          작은 실험 만들기
        </p>
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
          실험 카드
        </h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          조언을 자동으로 만드는 곳이 아니라, 직접 세운 가설을 작게
          확인해보는 자리입니다.
        </p>
      </div>

      <div className="grid gap-5">
          <label htmlFor="experiment-log" className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              연결할 마찰 기록
            </span>
            <select
              id="experiment-log"
              value={selectedFrictionLogId}
              onChange={(event) => setFrictionLogId(event.target.value)}
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:ring-teal-900"
            >
              {logs.map((log) => (
                <option key={log.id} value={log.id}>
                  {getLogOptionLabel(log)}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="experiment-title" className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              실험 이름
            </span>
            <input
              id="experiment-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="예: 운동 시작 마찰 줄이기"
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-900"
            />
          </label>

          <label htmlFor="experiment-hypothesis" className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              원인 가설
            </span>
            <textarea
              id="experiment-hypothesis"
              value={hypothesis}
              onChange={(event) => setHypothesis(event.target.value)}
              placeholder="예: 시작 단위가 너무 커서 부담이 생긴 것 같다"
              rows={3}
              className="min-h-24 resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-900"
            />
          </label>

          <label htmlFor="experiment-action" className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              3~7일 동안 해볼 작은 실험
            </span>
            <textarea
              id="experiment-action"
              value={action}
              onChange={(event) => setAction(event.target.value)}
              placeholder="예: 5일 동안 운동을 목표로 하지 않고 운동복만 입어본다"
              rows={3}
              className="min-h-24 resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-900"
            />
          </label>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-slate-900 dark:text-slate-100">
              실험 기간
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {durationOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  <input
                    type="radio"
                    name="durationDays"
                    value={option}
                    checked={durationDays === option}
                    onChange={() => setDurationDays(option)}
                    className="accent-teal-700"
                  />
                  {option}일
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor="experiment-success" className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              성공 기준
            </span>
            <textarea
              id="experiment-success"
              value={successCriteria}
              onChange={(event) => setSuccessCriteria(event.target.value)}
              placeholder="예: 실제 운동 여부가 아니라 운동복을 입었는지만 본다"
              rows={3}
              className="min-h-24 resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-900"
            />
          </label>

          <label
            htmlFor="experiment-interpretation"
            className="flex flex-col gap-2"
          >
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              예상대로 안 됐을 때 해석
            </span>
            <textarea
              id="experiment-interpretation"
              value={failureInterpretation}
              onChange={(event) =>
                setFailureInterpretation(event.target.value)
              }
              placeholder="예: 실험 단위가 아직 컸다는 신호로 보고 더 작게 조정한다"
              rows={3}
              className="min-h-24 resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-900"
            />
          </label>

          {formMessage ? (
            <p
              className="rounded-lg bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:bg-teal-950 dark:text-teal-100"
              role="status"
              aria-live="polite"
            >
              {formMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="h-12 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 dark:bg-teal-600 dark:hover:bg-teal-500 dark:focus:ring-offset-slate-900"
          >
            실험 카드 저장
          </button>
        </div>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ExperimentBuilder } from "@/components/ExperimentBuilder";
import { ExperimentList } from "@/components/ExperimentList";
import { FrictionForm } from "@/components/FrictionForm";
import { FrictionList } from "@/components/FrictionList";
import { FrictionMap } from "@/components/FrictionMap";
import { FrictionSummary } from "@/components/FrictionSummary";
import { SampleFrictionPreview } from "@/components/SampleFrictionPreview";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WeeklyReport } from "@/components/WeeklyReport";
import { Badge } from "@/components/ui/Badge";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  createExperiment,
  loadExperiments,
  saveExperiments,
} from "@/lib/experimentStorage";
import { loadFrictionLogs, saveFrictionLogs } from "@/lib/frictionStorage";
import type {
  CreateFrictionExperimentInput,
  CreateFrictionLogInput,
  FrictionExperiment,
  FrictionExperimentStatus,
  FrictionLog,
} from "@/types/friction";

const flowSteps = [
  {
    step: "01",
    title: "기록하기",
    description: "자꾸 막히는 순간을 한 줄로 남깁니다.",
  },
  {
    step: "02",
    title: "패턴 보기",
    description: "생활 영역과 단계별 반복 위치를 살펴봅니다.",
  },
  {
    step: "03",
    title: "작게 바꿔보기",
    description: "다음에 덜 버겁게 해볼 조건을 정합니다.",
  },
] as const;

const logSavedFeedbackMessage =
  "기록이 지도에 표시됐어요. 비슷한 순간이 쌓이면 자주 막히는 위치가 보입니다.";

function createLog(input: CreateFrictionLogInput): FrictionLog {
  return {
    ...input,
    id:
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
}

export default function Home() {
  const [logs, setLogs] = useState<FrictionLog[]>([]);
  const [experiments, setExperiments] = useState<FrictionExperiment[]>([]);
  const [logFeedbackMessage, setLogFeedbackMessage] = useState("");
  const hasNoLogs = logs.length === 0;
  const hasOneLog = logs.length === 1;
  const hasEarlyExperimentLogs = logs.length > 0 && logs.length < 3;
  const hasPatternReadyLogs = logs.length >= 3;
  const activeExperimentCount = experiments.filter(
    (experiment) => experiment.status === "진행 중",
  ).length;

  useEffect(() => {
    setLogs(loadFrictionLogs());
    setExperiments(loadExperiments());
  }, []);

  useEffect(() => {
    if (!logFeedbackMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLogFeedbackMessage("");
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [logFeedbackMessage]);

  function handleCreateLog(input: CreateFrictionLogInput) {
    setLogs((currentLogs) => {
      const nextLogs = [createLog(input), ...currentLogs];

      saveFrictionLogs(nextLogs);
      return nextLogs;
    });
    setLogFeedbackMessage(logSavedFeedbackMessage);
  }

  function handleDeleteLog(id: string) {
    setLogs((currentLogs) => {
      const nextLogs = currentLogs.filter((log) => log.id !== id);

      saveFrictionLogs(nextLogs);
      return nextLogs;
    });
  }

  function handleCreateExperiment(input: CreateFrictionExperimentInput) {
    setExperiments((currentExperiments) => {
      const nextExperiments = [
        createExperiment(input),
        ...currentExperiments,
      ];

      saveExperiments(nextExperiments);
      return nextExperiments;
    });
  }

  function handleExperimentStatusChange(
    experimentId: string,
    status: FrictionExperimentStatus,
  ) {
    setExperiments((currentExperiments) => {
      const nextExperiments = currentExperiments.map((experiment) => {
        if (experiment.id !== experimentId) {
          return experiment;
        }

        return {
          ...experiment,
          status,
          updatedAt: new Date().toISOString(),
        };
      });

      saveExperiments(nextExperiments);
      return nextExperiments;
    });
  }

  function handleDeleteExperiment(experimentId: string) {
    setExperiments((currentExperiments) => {
      const nextExperiments = currentExperiments.filter(
        (experiment) => experiment.id !== experimentId,
      );

      saveExperiments(nextExperiments);
      return nextExperiments;
    });
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-100 via-teal-50/40 to-slate-50 px-4 py-5 text-slate-950 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-semibold leading-8 text-slate-950 dark:text-slate-50">
              마찰지도
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              자꾸 막히는 순간을 한 줄로 남기는 앱
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="rounded-lg border border-white/70 bg-white/80 p-6 shadow-sm shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-3xl">
              <Badge variant="status">한 줄 기록으로 시작하기</Badge>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
                오늘 어디서 막혔나요?
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
                미뤘던 일, 부담스러운 답장, 시작하지 못한 순간을 가볍게 한
                줄로 남겨보세요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                여기서는 하려고 했지만 이상하게 막혔던 순간을 마찰이라고
                부릅니다.
              </p>
              <p className="mt-5 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-base font-medium leading-7 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
                할 일을 더 늘리지 않습니다. 자주 막히는 순간을 찾아, 다음에
                덜 버겁게 만듭니다.
              </p>
            </div>

            <div className="grid gap-3">
              {flowSteps.map((step) => (
                <article
                  key={step.title}
                  className="rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                    {step.step}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-slate-950 dark:text-slate-50">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5">
          <SectionHeader
            title="오늘 막힌 순간"
            description="가볍게 한 줄을 남기면, 아래에서 자주 막히는 위치를 차분히 볼 수 있습니다."
          />

          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]">
            <SectionCard
              title="막혔던 순간"
              description="한 줄로 시작해도 충분합니다. 지금 막힌 위치를 작은 기록으로 남겨보세요."
              className="min-w-0"
            >
              <FrictionForm onCreate={handleCreateLog} />
              {logFeedbackMessage ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-5 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 shadow-sm shadow-teal-100/50 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100 dark:shadow-none"
                >
                  {logFeedbackMessage}
                </div>
              ) : null}
            </SectionCard>

            <div className="grid min-w-0 gap-4">
              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                <StatCard
                  label="마찰 기록"
                  value={`${logs.length}개`}
                  description="저장된 한 줄 기록"
                />
                <StatCard
                  label="작게 바꿔보기"
                  value={`${experiments.length}개`}
                  description="직접 정한 작은 방법"
                />
                <StatCard
                  label="해보는 중"
                  value={`${activeExperimentCount}개`}
                  description="지금 가볍게 해보는 카드"
                />
              </div>

              {hasNoLogs ? <SampleFrictionPreview /> : null}
            </div>
          </div>
        </section>

        <section
          className={`grid gap-5 ${
            hasPatternReadyLogs
              ? "rounded-lg border border-teal-100 bg-white/70 p-4 shadow-sm shadow-teal-100/50 dark:border-teal-900 dark:bg-slate-900/50 dark:shadow-none sm:p-5"
              : ""
          }`}
        >
          <SectionHeader
            title="자주 막힌 위치"
            description={
              hasOneLog
                ? "첫 기록이 지도에 표시되었습니다. 아직 판단하지 말고 어느 위치에 놓였는지 가볍게 확인해보세요."
                : hasPatternReadyLogs
                  ? "기록이 쌓이기 시작했습니다. 반복 요약과 마찰 지도에서 자주 막힌 위치를 살펴보세요."
                  : "기록이 쌓이면 어느 쪽 일에서, 어느 순간에 자주 막히는지 보입니다."
            }
          />

          {hasOneLog ? (
            <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
              첫 마찰이 지도에 표시됐어요. 비슷한 기록이 쌓이면 반복되는
              위치가 더 선명해집니다. 지금은 패턴을 정하는 단계가 아니라
              관찰을 시작하는 단계입니다.
            </div>
          ) : null}

          {hasPatternReadyLogs ? (
            <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
              기록이 3개 이상 쌓였습니다. 자주 보이는 생활 영역이나 마찰
              단계를 골라 작게 바꿔볼 방법으로 이어가볼 수 있습니다.
            </div>
          ) : null}

          <WeeklyReport logs={logs} />
          <FrictionSummary logs={logs} />

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
            <FrictionMap logs={logs} />
          </section>
        </section>

        <section className="grid gap-5">
          <SectionHeader
            title="작게 바꿔보기"
            description="바로 해결하지 않아도 괜찮습니다. 자주 막히는 순간 하나를 골라, 다음에 덜 버겁게 해볼 작은 방법을 정해보세요."
          />

          {hasNoLogs ? (
            <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              작게 바꿔보기는 기록 하나를 고른 뒤 시작할 수 있습니다. 먼저
              오늘 막혔던 순간을 한 줄로 남겨보세요.
            </div>
          ) : null}

          {hasEarlyExperimentLogs ? (
            <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
              지금 바로 작게 바꿔봐도 되고, 비슷한 기록이 조금 더 쌓인 뒤
              골라도 괜찮습니다.
            </div>
          ) : null}

          {hasPatternReadyLogs ? (
            <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
              반복 요약이나 마찰 지도에서 자주 막힌 위치를 살펴보고, 그중
              하나를 다음에 덜 버겁게 해볼 방법으로 바꿔볼 수 있습니다.
            </div>
          ) : null}

          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
            <ExperimentBuilder
              logs={logs}
              onCreate={handleCreateExperiment}
            />

            <ExperimentList
              experiments={experiments}
              logs={logs}
              onDelete={handleDeleteExperiment}
              onStatusChange={handleExperimentStatusChange}
            />
          </div>
        </section>

        <section className="grid gap-5">
          <SectionHeader
            title="최근 기록"
            description="방금 남긴 기록과 이전 기록을 조용히 다시 훑어볼 수 있습니다."
          />
          <FrictionList logs={logs} onDelete={handleDeleteLog} />
        </section>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ExperimentBuilder } from "@/components/ExperimentBuilder";
import { ExperimentList } from "@/components/ExperimentList";
import { FrictionForm } from "@/components/FrictionForm";
import { FrictionList } from "@/components/FrictionList";
import { FrictionMap } from "@/components/FrictionMap";
import { FrictionSummary } from "@/components/FrictionSummary";
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
    description: "막혔던 순간을 한 줄로 남깁니다.",
  },
  {
    step: "02",
    title: "패턴 보기",
    description: "생활 영역과 단계별 반복 위치를 살펴봅니다.",
  },
  {
    step: "03",
    title: "실험하기",
    description: "작게 확인해볼 가설과 실험으로 바꿉니다.",
  },
] as const;

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
  const activeExperimentCount = experiments.filter(
    (experiment) => experiment.status === "진행 중",
  ).length;

  useEffect(() => {
    setLogs(loadFrictionLogs());
    setExperiments(loadExperiments());
  }, []);

  function handleCreateLog(input: CreateFrictionLogInput) {
    setLogs((currentLogs) => {
      const nextLogs = [createLog(input), ...currentLogs];

      saveFrictionLogs(nextLogs);
      return nextLogs;
    });
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
              내가 자주 막히는 순간을 발견하는 생활 디버깅 도구
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="rounded-lg border border-white/70 bg-white/80 p-6 shadow-sm shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-3xl">
              <Badge variant="status">기록하기 / 패턴 보기 / 실험하기</Badge>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
                오늘 어디서 막혔나요?
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
                거창한 기록이 아니어도 괜찮습니다. 한 줄의 마찰이 쌓이면
                반복되는 패턴이 보입니다.
              </p>
              <p className="mt-5 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-base font-medium leading-7 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
                할 일을 더 늘리지 않습니다. 당신을 막는 마찰을 발견합니다.
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
            title="기록하기"
            description="오늘 하려고 했지만 막혔던 순간을 먼저 한 줄로 남겨보세요."
          />

          <div className="grid gap-5 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]">
            <SectionCard
              title="막혔던 순간"
              description="한 줄로 시작해도 충분합니다. 지금 막힌 위치를 작은 기록으로 남겨보세요."
            >
              <FrictionForm onCreate={handleCreateLog} />
            </SectionCard>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                <StatCard
                  label="마찰 기록"
                  value={`${logs.length}개`}
                  description="저장된 한 줄 기록"
                />
                <StatCard
                  label="작은 실험"
                  value={`${experiments.length}개`}
                  description="직접 세운 실험 카드"
                />
                <StatCard
                  label="진행 중"
                  value={`${activeExperimentCount}개`}
                  description="지금 관찰 중인 실험"
                />
              </div>

              <WeeklyReport logs={logs} />
            </div>
          </div>
        </section>

        <section className="grid gap-5">
          <SectionHeader
            title="패턴 보기"
            description="요약은 확정이 아니라 패턴을 보기 위한 힌트입니다."
          />

          <FrictionSummary logs={logs} />

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
            <FrictionMap logs={logs} />
          </section>
        </section>

        <section className="grid gap-5">
          <SectionHeader
            title="작은 실험 카드"
            description="반복되는 마찰 하나를 골라, 정답이 아니라 가볍게 확인해볼 실험으로 바꿔보세요."
          />

          <div className="grid gap-5 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
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

        <section>
          <FrictionList logs={logs} onDelete={handleDeleteLog} />
        </section>
      </div>
    </main>
  );
}

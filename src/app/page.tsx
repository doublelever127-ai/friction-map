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
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        <header className="rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                마찰지도 v0.2
              </p>
              <h1 className="mt-2 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
                마찰지도
              </h1>
              <p className="mt-4 text-xl font-medium leading-8 text-slate-800 dark:text-slate-200">
                할 일을 더 늘리지 않습니다. 당신을 막는 마찰을 발견합니다.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                오늘 하려고 했지만 막혔던 순간을 한 줄로 남겨보세요.
                기록이 쌓이면 반복되는 마찰의 위치가 보입니다.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
          <section
            aria-labelledby="friction-log-heading"
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-5 dark:border-slate-800">
              <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                마찰 기록 영역
              </p>
              <h2
                id="friction-log-heading"
                className="text-2xl font-semibold text-slate-950 dark:text-slate-50"
              >
                막혔던 순간
              </h2>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                한 줄로 시작해도 충분합니다. 지금 막힌 위치를 작은 기록으로
                남겨보세요.
              </p>
            </div>

            <FrictionForm onCreate={handleCreateLog} />
          </section>

          <aside
            aria-labelledby="friction-map-heading"
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <FrictionMap logs={logs} />
          </aside>
        </section>

        <FrictionSummary logs={logs} />

        <WeeklyReport logs={logs} />

        <section aria-labelledby="experiment-heading" className="grid gap-5">
          <div>
            <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
              작은 실험
            </p>
            <h2
              id="experiment-heading"
              className="mt-1 text-2xl font-semibold text-slate-950 dark:text-slate-50"
            >
              작은 실험 카드
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              반복되는 마찰 하나를 골라, 정답이 아니라 가볍게 확인해볼
              실험으로 바꿔보세요.
            </p>
          </div>

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

        <section aria-labelledby="friction-list-heading" className="grid gap-4">
          <div>
            <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
              마찰 기록
            </p>
            <h2
              id="friction-list-heading"
              className="mt-1 text-2xl font-semibold text-slate-950 dark:text-slate-50"
            >
              기록 목록
            </h2>
          </div>

          <FrictionList logs={logs} onDelete={handleDeleteLog} />
        </section>
      </div>
    </main>
  );
}

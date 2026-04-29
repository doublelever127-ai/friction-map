"use client";

import { useEffect, useState } from "react";
import { BottomNav, type AppTab } from "@/components/BottomNav";
import { ExperimentBuilder } from "@/components/ExperimentBuilder";
import { ExperimentList } from "@/components/ExperimentList";
import { FrictionForm } from "@/components/FrictionForm";
import { FrictionList } from "@/components/FrictionList";
import { FrictionMap } from "@/components/FrictionMap";
import { FrictionSummary } from "@/components/FrictionSummary";
import { SampleFrictionPreview } from "@/components/SampleFrictionPreview";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WeeklyReport } from "@/components/WeeklyReport";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  clearExperiments,
  createExperiment,
  loadExperiments,
  saveExperiments,
} from "@/lib/experimentStorage";
import {
  clearFrictionLogs,
  loadFrictionLogs,
  saveFrictionLogs,
} from "@/lib/frictionStorage";
import type {
  CreateFrictionExperimentInput,
  CreateFrictionLogInput,
  FrictionExperiment,
  FrictionExperimentStatus,
  FrictionLog,
} from "@/types/friction";

const logSavedFeedbackMessage =
  "기록됐어요. 지도에 표시됐습니다.";

const screenIntros: Record<
  AppTab,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  record: {
    eyebrow: "남기기",
    title: "오늘 어디서 막혔나요?",
    description:
      "미뤘던 일, 부담스러운 답장, 시작하지 못한 순간을 한 줄만 남겨보세요.",
  },
  map: {
    eyebrow: "지도",
    title: "자주 막힌 위치",
    description:
      "어떤 일에서, 어떤 순간에 자주 막히는지 지도처럼 볼 수 있어요.",
  },
  experiment: {
    eyebrow: "시도",
    title: "작게 바꿔보기",
    description:
      "바로 해결하지 않아도 괜찮아요. 다음에 덜 버겁게 해볼 작은 방법을 정해보세요.",
  },
  manage: {
    eyebrow: "내 기록",
    title: "내 기록",
    description:
      "내가 남긴 기록을 확인하고 정리할 수 있어요. 기록은 이 기기 안에 저장됩니다.",
  },
};

function createLog(input: CreateFrictionLogInput): FrictionLog {
  return {
    ...input,
    id:
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
}

function RecentRecordPreview({
  logs,
  onOpenManage,
}: {
  logs: FrictionLog[];
  onOpenManage: () => void;
}) {
  if (logs.length === 0) {
    return (
      <SectionCard
        title="첫 기록을 기다리고 있어요"
        description="한 줄을 남기면 최근 기록과 지도에 바로 반영됩니다."
        contentClassName="mt-4 pt-4"
      >
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          예시 칩을 눌러 시작해도 실제 저장은 되지 않습니다. 내용을 확인한 뒤
          기록하기 버튼을 눌렀을 때만 저장됩니다.
        </p>
      </SectionCard>
    );
  }

  const visibleLogs = [...logs]
    .sort(
      (leftLog, rightLog) =>
        new Date(rightLog.createdAt).getTime() -
        new Date(leftLog.createdAt).getTime(),
    )
    .slice(0, 2);

  return (
    <SectionCard
      title="방금 남긴 기록"
      description="최근 기록은 관리 화면에서 더 자세히 볼 수 있습니다."
      contentClassName="mt-4 pt-4"
    >
      <div className="grid gap-3">
        {visibleLogs.map((log) => (
          <article
            key={log.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50"
          >
            <p className="break-words text-sm font-semibold leading-6 text-slate-950 dark:text-slate-50">
              {log.text}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="emotion">{log.emotion}</Badge>
              <Badge variant="domain">{log.domain}</Badge>
              <Badge variant="stage">{log.stage}</Badge>
            </div>
          </article>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onOpenManage}
        className="mt-4 w-full"
      >
        최근 기록 보기
      </Button>
    </SectionCard>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>("record");
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
  const currentIntro = screenIntros[activeTab];

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

  function handleClearAllData() {
    clearFrictionLogs();
    clearExperiments();
    setLogs([]);
    setExperiments([]);
    setLogFeedbackMessage("");
    setActiveTab("record");
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-100 via-teal-50/40 to-slate-50 px-4 pb-28 pt-5 text-slate-950 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
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

        <section className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-none sm:p-7">
          <Badge variant="status">{currentIntro.eyebrow}</Badge>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            {currentIntro.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">
            {currentIntro.description}
          </p>

          {activeTab === "record" ? (
            <>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                여기서는 하려고 했지만 이상하게 막혔던 순간을 마찰이라고
                부릅니다.
              </p>
              <p className="mt-4 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-medium leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
                할 일을 더 늘리지 않습니다. 자주 막히는 순간을 찾아, 다음에
                덜 버겁게 만듭니다.
              </p>
            </>
          ) : null}
        </section>

        {activeTab === "record" ? (
          <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
            <SectionCard
              title="막힌 순간 남기기"
              description="정확히 고르지 않아도 괜찮습니다. 지금 가장 가까운 느낌으로 시작해보세요."
              className="min-w-0"
            >
              <FrictionForm onCreate={handleCreateLog} />
              {logFeedbackMessage ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-5 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 shadow-sm shadow-teal-100/50 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100 dark:shadow-none"
                >
                  <p>{logFeedbackMessage}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab("map")}
                    className="mt-3 w-full bg-white/80 dark:bg-slate-900/80 sm:w-auto"
                  >
                    지도에서 보기
                  </Button>
                </div>
              ) : null}
            </SectionCard>

            <aside className="grid min-w-0 gap-4">
              <div className="grid grid-cols-3 gap-3">
                <StatCard
                  label="기록"
                  value={`${logs.length}개`}
                  description="남긴 막힘"
                />
                <StatCard
                  label="시도"
                  value={`${experiments.length}개`}
                  description="작게 바꾸기"
                />
                <StatCard
                  label="진행"
                  value={`${activeExperimentCount}개`}
                  description="해보는 중"
                />
              </div>

              <RecentRecordPreview
                logs={logs}
                onOpenManage={() => setActiveTab("manage")}
              />
            </aside>
          </section>
        ) : null}

        {activeTab === "map" ? (
          <section className="grid min-w-0 gap-5">
            <SectionHeader
              title="자주 막힌 위치"
              description={
                hasOneLog
                  ? "첫 기록이 지도에 표시되었습니다. 아직은 관찰을 시작한 단계예요."
                  : hasPatternReadyLogs
                    ? "반복해서 보이는 위치를 살펴보세요. 바로 고치지 않아도 괜찮습니다."
                    : "기록이 쌓이면 어떤 일에서, 어떤 순간에 자주 막히는지 보입니다."
              }
            />

            {hasNoLogs ? <SampleFrictionPreview /> : null}

            {hasOneLog ? (
              <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
                아직은 관찰을 시작한 단계예요. 비슷한 기록이 쌓이면 자주
                막히는 위치가 더 선명해집니다.
              </div>
            ) : null}

            {hasPatternReadyLogs ? (
              <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
                반복해서 보이는 위치를 살펴보세요. 바로 고치지 않아도
                괜찮습니다.
              </div>
            ) : null}

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
              <FrictionMap logs={logs} />
            </section>

            <FrictionSummary logs={logs} />
            <WeeklyReport logs={logs} />
          </section>
        ) : null}

        {activeTab === "experiment" ? (
          <section className="grid min-w-0 gap-5">
            <SectionHeader
              title="작게 바꿔보기"
              description="바로 해결하지 않아도 괜찮아요. 다음에 덜 버겁게 해볼 작은 방법을 정해보세요."
            />

            {hasNoLogs ? (
              <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                <p>
                  아직 시도할 기록이 없어요. 먼저 막힌 순간을 하나
                  남겨보세요.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab("record")}
                  className="mt-3 w-full sm:w-auto"
                >
                  남기러 가기
                </Button>
              </div>
            ) : null}

            {hasEarlyExperimentLogs ? (
              <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
                지금 바로 시도해봐도 되고, 비슷한 기록이 조금 더 쌓인 뒤
                골라도 괜찮아요.
              </div>
            ) : null}

            {hasPatternReadyLogs ? (
              <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100">
                지도에서 자주 보이는 위치를 골라 작게 시도해볼 수 있어요.
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
        ) : null}

        {activeTab === "manage" ? (
          <section className="grid min-w-0 gap-5">
            <SectionHeader
              title="전체 기록"
              description="내가 남긴 기록을 확인하고 정리할 수 있어요."
            />
            <FrictionList logs={logs} onDelete={handleDeleteLog} />

            <SectionHeader
              title="기록 관리"
              description="기록 관리, 내보내기, 개인정보 안내를 한곳에서 확인할 수 있습니다."
            />
            <SettingsPanel
              logs={logs}
              experiments={experiments}
              onClearAllData={handleClearAllData}
            />
          </section>
        ) : null}
      </div>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}

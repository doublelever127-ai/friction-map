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
  UpdateFrictionExperimentReviewInput,
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
  review: {
    eyebrow: "돌아보기",
    title: "돌아보기",
    description:
      "해보니 어땠는지 살펴보고, 다음 시도를 더 작게 조정합니다.",
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
  onOpenReview,
}: {
  logs: FrictionLog[];
  onOpenReview: () => void;
}) {
  if (logs.length === 0) {
    return (
      <SectionCard
        title="첫 기록을 기다리고 있어요"
        description="한 줄을 남기면 최근 기록과 지도에 바로 반영됩니다."
        contentClassName="mt-4 pt-4"
      >
        <p className="text-sm leading-6 text-[var(--text-muted)]">
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
      description="최근 기록은 돌아보기 화면에서 더 자세히 볼 수 있습니다."
      contentClassName="mt-4 pt-4"
    >
      <div className="grid gap-3">
        {visibleLogs.map((log) => (
          <article
            key={log.id}
            className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)] p-4"
          >
            <p className="break-words text-sm font-semibold leading-6 text-[var(--foreground)]">
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
        onClick={onOpenReview}
        className="mt-4 w-full"
      >
        돌아보기로 가기
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
  const hasEarlyExperimentLogs = logs.length > 0 && logs.length < 3;
  const hasPatternReadyLogs = logs.length >= 3;
  const activeExperimentCount = experiments.filter(
    (experiment) => experiment.status === "진행 중",
  ).length;
  const currentIntro =
    activeTab === "map"
      ? {
          eyebrow: "지도",
          title: "마찰 지도",
          description:
            logs.length <= 1
              ? "방금 남긴 기록이 어느 위치에 찍혔는지 핀으로 보여줍니다."
              : "어떤 일에서, 어떤 순간에 자주 막히는지 핀으로 볼 수 있어요.",
        }
      : screenIntros[activeTab];

  useEffect(() => {
    setLogs(loadFrictionLogs());
    setExperiments(loadExperiments());
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0 });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [activeTab]);

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

  function handleExperimentReviewSave(
    experimentId: string,
    review: UpdateFrictionExperimentReviewInput,
  ) {
    setExperiments((currentExperiments) => {
      const now = new Date().toISOString();
      const nextExperiments = currentExperiments.map((experiment) => {
        if (experiment.id !== experimentId) {
          return experiment;
        }

        return {
          ...experiment,
          ...review,
          reviewedAt: now,
          updatedAt: now,
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
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(201,130,115,0.18),transparent_28rem),linear-gradient(180deg,var(--background),var(--surface-muted))] px-4 pb-32 pt-5 text-[var(--foreground)] transition-colors sm:px-6">
      <div className="mx-auto flex w-full max-w-[460px] flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold leading-8 text-[var(--foreground)]">
              마찰지도
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
              자꾸 막히는 순간을 한 줄로 남기는 앱
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section
          className={`overflow-hidden border border-[var(--line-soft)] bg-[linear-gradient(145deg,var(--surface),var(--surface-soft))] shadow-[var(--shadow-float)] backdrop-blur ${
            activeTab === "map"
              ? "rounded-[1.25rem] p-3 sm:p-4"
              : "rounded-[2rem] p-5 sm:p-7"
          }`}
        >
          <Badge variant="status">{currentIntro.eyebrow}</Badge>
          <h1
            className={`font-semibold leading-tight text-[var(--foreground)] ${
              activeTab === "map"
                ? "mt-2 text-xl sm:text-2xl"
                : "mt-4 text-3xl sm:text-4xl"
            }`}
          >
            {currentIntro.title}
          </h1>
          <p
            className={`text-[var(--text-muted)] ${
              activeTab === "map"
                ? "mt-1.5 text-sm leading-5"
                : "mt-3 text-base leading-7"
            }`}
          >
            {currentIntro.description}
          </p>

          {activeTab === "record" ? (
            <>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                여기서는 하려고 했지만 이상하게 막혔던 순간을 마찰이라고
                부릅니다.
              </p>
              <p className="mt-4 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-3 text-sm font-medium leading-6 text-[var(--accent-strong)]">
                할 일을 더 늘리지 않습니다. 자주 막히는 순간을 찾아, 다음에
                덜 버겁게 만듭니다.
              </p>
            </>
          ) : null}
        </section>

        {activeTab === "record" ? (
          <section className="grid min-w-0 gap-4">
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
                  className="mt-5 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-3 text-sm leading-6 text-[var(--accent-strong)] shadow-[0_10px_24px_rgba(82,111,90,0.10)] dark:shadow-none"
                >
                  <p>{logFeedbackMessage}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab("map")}
                    className="mt-3 w-full sm:w-auto"
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
                onOpenReview={() => setActiveTab("review")}
              />
            </aside>
          </section>
        ) : null}

        {activeTab === "map" ? (
          <section className="grid min-w-0 max-w-full gap-3 overflow-hidden">
            {hasNoLogs ? <SampleFrictionPreview /> : null}

            <section className="min-w-0 overflow-hidden rounded-[1.5rem] border border-[var(--line-soft)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)] sm:p-4">
              <FrictionMap logs={logs} />
            </section>

            {logs.length > 0 ? (
              <details className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] shadow-[var(--shadow-soft)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
                  요약과 주간 리포트 보기
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    선택
                  </span>
                </summary>
                <div className="grid gap-5 border-t border-[var(--line-soft)] p-4">
                  <FrictionSummary logs={logs} />
                  <WeeklyReport logs={logs} />
                </div>
              </details>
            ) : null}
          </section>
        ) : null}

        {activeTab === "experiment" ? (
          <section className="grid min-w-0 gap-5">
            <SectionHeader
              title="작게 바꿔보기"
              description="바로 해결하지 않아도 괜찮아요. 다음에 덜 버겁게 해볼 작은 방법을 정해보세요."
            />

            {hasNoLogs ? (
              <div className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--text-muted)] shadow-[var(--shadow-soft)]">
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
              <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-3 text-sm leading-6 text-[var(--accent-strong)]">
                지금 바로 시도해봐도 되고, 비슷한 기록이 조금 더 쌓인 뒤
                골라도 괜찮아요.
              </div>
            ) : null}

            {hasPatternReadyLogs ? (
              <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-3 text-sm leading-6 text-[var(--accent-strong)]">
                지도에서 자주 보이는 위치를 골라 작게 시도해볼 수 있어요.
              </div>
            ) : null}

            <div className="grid min-w-0 gap-5">
              <ExperimentBuilder
                logs={logs}
                onCreate={handleCreateExperiment}
              />

              {experiments.length > 0 ? (
                <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-3 text-sm leading-6 text-[var(--accent-strong)]">
                  <p>
                    만든 시도 카드는 돌아보기 화면에서 상태를 바꾸고 다시
                    살펴볼 수 있습니다.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab("review")}
                    className="mt-3 w-full sm:w-auto"
                  >
                    돌아보러 가기
                  </Button>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {activeTab === "review" ? (
          <section className="grid min-w-0 gap-5">
            <SectionHeader
              title="시도 돌아보기"
              description="해보니 어땠는지 살펴보고, 다음에는 더 작게 조정할지 확인합니다."
            />
            <ExperimentList
              experiments={experiments}
              logs={logs}
              onDelete={handleDeleteExperiment}
              onStatusChange={handleExperimentStatusChange}
              onReviewSave={handleExperimentReviewSave}
            />

            <SectionHeader
              title="내 기록"
              description="내가 남긴 기록을 확인하고 정리할 수 있어요. 기록은 이 기기 안에 저장됩니다."
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

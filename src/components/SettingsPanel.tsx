"use client";

import { useState } from "react";
import packageInfo from "../../package.json";
import type { FrictionExperiment, FrictionLog } from "@/types/friction";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";

type SettingsPanelProps = {
  logs: FrictionLog[];
  experiments: FrictionExperiment[];
  onClearAllData: () => void;
};

function formatDateForFileName(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function SettingsPanel({
  logs,
  experiments,
  onClearAllData,
}: SettingsPanelProps) {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [message, setMessage] = useState("");
  const hasData = logs.length > 0 || experiments.length > 0;

  function handleExportData() {
    if (!hasData) {
      setMessage("내보낼 기록이 아직 없습니다. 첫 기록이 생기면 파일로 저장할 수 있습니다.");
      return;
    }

    const exportedAt = new Date();
    const exportData = {
      appName: "마찰지도",
      appVersion: packageInfo.version,
      exportedAt: exportedAt.toISOString(),
      storage: {
        logsKey: "friction-map.logs.v1",
        experimentsKey: "friction-map.experiments.v1",
      },
      logs,
      experiments,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `friction-map-export-${formatDateForFileName(
      exportedAt,
    )}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage("내 기록을 JSON 파일로 준비했습니다.");
  }

  function handleClearData() {
    onClearAllData();
    setIsConfirmingClear(false);
    setMessage("이 기기 안의 기록을 비웠습니다.");
  }

  return (
    <SectionCard
      title="내 기록 관리"
      description="마찰지도는 기록을 기기 안에 저장합니다. 필요할 때 모든 기록을 지우거나 파일로 저장할 수 있습니다."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">
            기록 내보내기
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            마찰 기록과 작게 바꿔보기 카드를 하나의 JSON 파일로 저장합니다.
            서버로 보내지 않고 이 기기에서 파일을 만듭니다.
          </p>
          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={handleExportData}
              className="w-full sm:w-auto"
            >
              기록 내보내기
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">
            모든 기록 삭제
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            삭제하면 이 기기 안의 마찰 기록과 작게 바꿔보기 카드가
            사라집니다. 필요한 경우 먼저 내보내기를 해두세요.
          </p>

          {isConfirmingClear ? (
            <div className="mt-4 rounded-lg border border-rose-200 bg-white p-3 dark:border-rose-900 dark:bg-slate-900">
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                삭제하면 이 기기 안의 기록이 사라집니다. 계속할까요?
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="danger"
                  onClick={handleClearData}
                  disabled={!hasData}
                  className="w-full sm:w-auto"
                >
                  네, 삭제합니다
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsConfirmingClear(false)}
                  className="w-full sm:w-auto"
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <Button
                variant="danger"
                onClick={() => {
                  if (!hasData) {
                    setMessage("지울 기록이 아직 없습니다.");
                    return;
                  }
                  setIsConfirmingClear(true);
                }}
                className="w-full sm:w-auto"
              >
                모든 기록 삭제
              </Button>
            </div>
          )}
        </section>
      </div>

      {message ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-5 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-100"
        >
          {message}
        </p>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">
            개인정보 안내
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            <li>기록은 이 기기 안에 저장됩니다.</li>
            <li>서버로 전송하지 않습니다.</li>
            <li>로그인 계정을 만들지 않습니다.</li>
            <li>광고나 분석 SDK를 사용하지 않습니다.</li>
            <li>사용자는 기록을 삭제하거나 내보낼 수 있습니다.</li>
          </ul>
          <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-500">
            개인정보처리방침 초안은 문서로 준비되어 있으며, Play Store 등록 전
            누구나 볼 수 있는 공개 주소로 연결할 예정입니다.
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">
            앱 정보
          </h3>
          <dl className="mt-3 grid gap-3 text-sm">
            <div>
              <dt className="text-slate-500 dark:text-slate-500">앱 이름</dt>
              <dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                마찰지도
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-500">버전</dt>
              <dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                v{packageInfo.version}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-500">문의 이메일</dt>
              <dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                출시 전 등록 예정
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </SectionCard>
  );
}

"use client";

export type AppTab = "record" | "map" | "experiment" | "review";

type BottomNavProps = {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
};

const navItems: Array<{
  id: AppTab;
  label: string;
  description: string;
}> = [
  {
    id: "record",
    label: "남기기",
    description: "오늘 막힘",
  },
  {
    id: "map",
    label: "지도",
    description: "막힌 위치",
  },
  {
    id: "experiment",
    label: "시도",
    description: "작은 방법",
  },
  {
    id: "review",
    label: "돌아보기",
    description: "살펴보기",
  },
];

function joinClassNames(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="주요 화면"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-12px_32px_rgba(15,23,42,0.10)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-none"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto grid max-w-3xl grid-cols-4 gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange(item.id)}
              className={joinClassNames(
                "flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950",
                isActive
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-200 dark:bg-teal-500 dark:text-slate-950 dark:shadow-none"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100",
              )}
            >
              <span className="text-sm font-semibold leading-5">
                {item.label}
              </span>
              <span
                className={joinClassNames(
                  "mt-0.5 text-[11px] leading-4",
                  isActive
                    ? "text-teal-50 dark:text-slate-900"
                    : "text-slate-400 dark:text-slate-500",
                )}
              >
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] px-3 py-2"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-auto mx-auto grid max-w-[460px] grid-cols-4 gap-1.5 rounded-[1.65rem] border border-[var(--line-soft)] bg-[var(--surface)]/95 p-2 shadow-[0_-18px_55px_rgba(54,45,35,0.14)] backdrop-blur dark:shadow-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange(item.id)}
              className={joinClassNames(
                "flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition duration-150 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-2 focus:ring-offset-[var(--background)]",
                isActive
                  ? "bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_10px_24px_rgba(82,111,90,0.14)] dark:shadow-none"
                  : "text-[var(--text-subtle)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
              )}
            >
              <span className="text-sm font-semibold leading-5">
                {item.label}
              </span>
              <span
                className={joinClassNames(
                  "mt-0.5 text-[11px] leading-4",
                  isActive
                    ? "text-[var(--accent-strong)]/80"
                    : "text-[var(--text-subtle)]",
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

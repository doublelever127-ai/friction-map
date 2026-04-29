import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  className?: string;
};

function joinClassNames(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function StatCard({
  label,
  value,
  description,
  className,
}: StatCardProps) {
  return (
    <div
      className={joinClassNames(
        "rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        className,
      )}
    >
      <p className="text-sm font-medium leading-5 text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 break-words text-2xl font-semibold leading-8 text-slate-950 dark:text-slate-50">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}

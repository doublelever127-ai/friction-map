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
        "rounded-3xl border border-[var(--line-soft)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <p className="text-sm font-medium leading-5 text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-2 break-words text-2xl font-semibold leading-8 text-[var(--foreground)]">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

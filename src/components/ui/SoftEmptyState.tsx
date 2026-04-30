import type { ReactNode } from "react";

type SoftEmptyStateProps = {
  title: string;
  description: ReactNode;
  children?: ReactNode;
  className?: string;
};

function joinClassNames(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function SoftEmptyState({
  title,
  description,
  children,
  className,
}: SoftEmptyStateProps) {
  return (
    <div
      className={joinClassNames(
        "rounded-3xl border border-dashed border-[var(--line-soft)] bg-[var(--surface-soft)] px-5 py-8 text-center",
        className,
      )}
    >
      <h3 className="text-xl font-semibold leading-7 text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
        {description}
      </p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

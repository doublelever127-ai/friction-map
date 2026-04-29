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
        "rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-950",
        className,
      )}
    >
      <h3 className="text-xl font-semibold leading-7 text-slate-950 dark:text-slate-50">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

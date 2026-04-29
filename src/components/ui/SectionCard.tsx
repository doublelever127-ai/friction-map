import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

type SectionCardProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

function joinClassNames(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function SectionCard({
  title,
  description,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <section
      className={joinClassNames(
        "rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6",
        className,
      )}
    >
      <SectionHeader title={title} description={description} />
      <div
        className={joinClassNames(
          "mt-5 border-t border-slate-100 pt-5 dark:border-slate-800",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

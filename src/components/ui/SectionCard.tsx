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
        "rounded-3xl border border-[var(--line-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6",
        className,
      )}
    >
      <SectionHeader title={title} description={description} />
      <div
        className={joinClassNames(
          "mt-5 border-t border-[var(--line-soft)] pt-5",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

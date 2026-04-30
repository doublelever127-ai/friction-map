import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BadgeVariant =
  | "neutral"
  | "emotion"
  | "domain"
  | "stage"
  | "status"
  | "subtle";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  neutral:
    "border-[var(--line-soft)] bg-[var(--surface-soft)] text-[var(--text-muted)]",
  emotion:
    "border-[var(--coral)]/30 bg-[var(--coral-soft)] text-[var(--coral)]",
  domain:
    "border-[#8ca8b0]/30 bg-[#edf4f4] text-[#52727b] dark:border-[#8ca8b0]/30 dark:bg-[#223134] dark:text-[#aac5ca]",
  stage:
    "border-[#c6a36c]/30 bg-[#f8efdf] text-[#8a6a35] dark:border-[#c6a36c]/30 dark:bg-[#332a1c] dark:text-[#ddc08a]",
  status:
    "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent-strong)] dark:text-[var(--accent-strong)]",
  subtle:
    "border-[var(--line-soft)] bg-[var(--surface)] text-[var(--text-muted)]",
};

function joinClassNames(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function Badge({
  children,
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={joinClassNames(
        "inline-flex min-h-7 max-w-full items-center rounded-full border px-2.5 py-1 text-left text-xs font-semibold leading-4 break-words whitespace-normal",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

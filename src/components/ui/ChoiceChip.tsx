import type { ButtonHTMLAttributes, ReactNode } from "react";

type ChoiceChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  selected?: boolean;
};

function joinClassNames(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function ChoiceChip({
  children,
  selected = false,
  className,
  type = "button",
  ...props
}: ChoiceChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={joinClassNames(
        "inline-flex min-h-11 max-w-full items-center justify-center rounded-full border px-4 py-2.5 text-left text-sm font-semibold leading-5 whitespace-normal transition duration-150 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-2 focus:ring-offset-[var(--background)]",
        selected
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_8px_22px_rgba(82,111,90,0.12)] dark:shadow-none"
          : "border-[var(--line-soft)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

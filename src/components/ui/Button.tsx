import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--accent-strong)] bg-[var(--accent-strong)] text-white shadow-[0_12px_28px_rgba(82,111,90,0.22)] hover:brightness-95 dark:border-[var(--accent)] dark:bg-[var(--accent)] dark:text-[#171512] dark:shadow-none",
  secondary:
    "border-[var(--line-soft)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-muted)] dark:hover:bg-[var(--surface-muted)]",
  ghost:
    "border-transparent bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
  danger:
    "border-[var(--coral)]/30 bg-[var(--coral-soft)] text-[var(--coral)] hover:brightness-95",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-5 text-sm",
};

function joinClassNames(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={joinClassNames(
        "inline-flex max-w-full items-center justify-center rounded-2xl border text-center font-semibold transition duration-150 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

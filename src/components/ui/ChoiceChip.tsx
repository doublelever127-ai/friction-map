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
        "inline-flex min-h-10 items-center justify-center rounded-full border px-3.5 py-2 text-sm font-medium leading-5 transition focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 dark:focus:ring-teal-800 dark:focus:ring-offset-slate-950",
        selected
          ? "border-teal-600 bg-teal-50 text-teal-800 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-100"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

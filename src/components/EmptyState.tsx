export function EmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--line-soft)] bg-[var(--surface-soft)] px-5 py-10 text-center">
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          아직 기록된 마찰이 없습니다
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          거창한 기록이 아니어도 괜찮습니다. ‘또 미뤘다’, ‘답장이
          부담됐다’ 같은 한 줄이면 충분합니다.
        </p>
      </div>
    </div>
  );
}

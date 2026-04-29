export function EmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">
          아직 기록된 마찰이 없습니다
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          거창한 기록이 아니어도 괜찮습니다. ‘또 미뤘다’, ‘답장이
          부담됐다’ 같은 한 줄이면 충분합니다.
        </p>
      </div>
    </div>
  );
}

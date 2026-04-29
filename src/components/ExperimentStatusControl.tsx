"use client";

import type { FrictionExperimentStatus } from "@/types/friction";

type ExperimentStatusControlProps = {
  id: string;
  status: FrictionExperimentStatus;
  onChange: (status: FrictionExperimentStatus) => void;
};

const statusOptions = [
  "진행 전",
  "진행 중",
  "관찰 완료",
  "보류",
] as const satisfies readonly FrictionExperimentStatus[];

function isExperimentStatus(value: string): value is FrictionExperimentStatus {
  return statusOptions.some((status) => status === value);
}

export function ExperimentStatusControl({
  id,
  status,
  onChange,
}: ExperimentStatusControlProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        현재 관찰 위치
      </span>
      <select
        id={id}
        value={status}
        onChange={(event) => {
          if (isExperimentStatus(event.target.value)) {
            onChange(event.target.value);
          }
        }}
        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:ring-teal-900"
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

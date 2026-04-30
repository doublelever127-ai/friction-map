"use client";

import { ChoiceChip } from "@/components/ui/ChoiceChip";
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

const statusLabels: Record<FrictionExperimentStatus, string> = {
  "진행 전": "아직 안 함",
  "진행 중": "해보는 중",
  "관찰 완료": "살펴봄",
  보류: "잠시 멈춤",
};

export function getExperimentStatusLabel(
  status: FrictionExperimentStatus,
): string {
  return statusLabels[status];
}

function isExperimentStatus(value: string): value is FrictionExperimentStatus {
  return statusOptions.some((status) => status === value);
}

export function ExperimentStatusControl({
  id,
  status,
  onChange,
}: ExperimentStatusControlProps) {
  return (
    <fieldset className="flex flex-col gap-2" id={id}>
      <legend className="text-xs font-semibold text-[var(--text-muted)]">
        지금 상태
      </legend>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <ChoiceChip
            key={option}
            selected={status === option}
            onClick={() => {
              if (isExperimentStatus(option)) {
                onChange(option);
              }
            }}
            className="min-h-11 px-3.5 py-2 text-sm"
          >
            {getExperimentStatusLabel(option)}
          </ChoiceChip>
        ))}
      </div>
    </fieldset>
  );
}

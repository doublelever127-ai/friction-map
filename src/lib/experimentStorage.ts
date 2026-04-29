import type {
  CreateFrictionExperimentInput,
  FrictionExperiment,
  FrictionExperimentStatus,
} from "@/types/friction";

export const STORAGE_KEY = "friction-map.experiments.v1";

const DEFAULT_STATUS: FrictionExperimentStatus = "진행 전";

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isExperimentDuration(
  value: unknown,
): value is FrictionExperiment["durationDays"] {
  return value === 3 || value === 5 || value === 7;
}

function isExperimentStatus(
  value: unknown,
): value is FrictionExperimentStatus {
  return (
    value === "진행 전" ||
    value === "진행 중" ||
    value === "관찰 완료" ||
    value === "보류"
  );
}

function readRequiredString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function readTimestamp(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function normalizeExperiment(value: unknown): FrictionExperiment | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readRequiredString(value.id);
  const frictionLogId = readRequiredString(value.frictionLogId);
  const title = readRequiredString(value.title);
  const hypothesis = readRequiredString(value.hypothesis);
  const action = readRequiredString(value.action);
  const successCriteria = readRequiredString(value.successCriteria);
  const failureInterpretation = readRequiredString(value.failureInterpretation);

  if (
    !id ||
    !frictionLogId ||
    title === null ||
    hypothesis === null ||
    action === null ||
    successCriteria === null ||
    failureInterpretation === null ||
    !isExperimentDuration(value.durationDays)
  ) {
    return null;
  }

  const now = new Date().toISOString();
  const createdAt = readTimestamp(value.createdAt, now);

  return {
    id,
    frictionLogId,
    title,
    hypothesis,
    action,
    durationDays: value.durationDays,
    successCriteria,
    failureInterpretation,
    status: isExperimentStatus(value.status) ? value.status : DEFAULT_STATUS,
    createdAt,
    updatedAt: readTimestamp(value.updatedAt, createdAt || now),
  };
}

function createExperimentId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

export function loadExperiments(): FrictionExperiment[] {
  const storage = getLocalStorage();

  if (!storage) {
    return [];
  }

  const rawExperiments = storage.getItem(STORAGE_KEY);

  if (!rawExperiments) {
    return [];
  }

  try {
    const parsedExperiments: unknown = JSON.parse(rawExperiments);

    if (!Array.isArray(parsedExperiments)) {
      return [];
    }

    return parsedExperiments
      .map(normalizeExperiment)
      .filter((experiment): experiment is FrictionExperiment =>
        Boolean(experiment),
      );
  } catch {
    return [];
  }
}

export function saveExperiments(experiments: FrictionExperiment[]): void {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(experiments));
}

export function createExperiment(
  input: CreateFrictionExperimentInput,
): FrictionExperiment {
  const now = new Date().toISOString();

  return {
    ...input,
    id: createExperimentId(),
    status: DEFAULT_STATUS,
    createdAt: now,
    updatedAt: now,
  };
}

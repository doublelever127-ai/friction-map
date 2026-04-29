import type {
  CreateFrictionExperimentInput,
  FrictionExperiment,
} from "@/types/friction";

export const STORAGE_KEY = "friction-map.experiments.v1";

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

function isExperiment(value: unknown): value is FrictionExperiment {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.frictionLogId === "string" &&
    typeof value.title === "string" &&
    typeof value.hypothesis === "string" &&
    typeof value.action === "string" &&
    typeof value.durationDays === "number" &&
    Number.isFinite(value.durationDays) &&
    typeof value.successCriteria === "string" &&
    typeof value.failureInterpretation === "string" &&
    typeof value.createdAt === "string"
  );
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

    return parsedExperiments.filter(isExperiment);
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
  const experiment: FrictionExperiment = {
    ...input,
    id: createExperimentId(),
    createdAt: new Date().toISOString(),
  };

  saveExperiments([...loadExperiments(), experiment]);

  return experiment;
}

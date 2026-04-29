import { frictionDomainOptions, frictionEmotionOptions, frictionStageOptions } from "@/lib/frictionOptions";
import type {
  CreateFrictionLogInput,
  FrictionDomain,
  FrictionEmotion,
  FrictionLog,
  FrictionStage,
} from "@/types/friction";

export const STORAGE_KEY = "friction-map.logs.v1";

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

function isFrictionEmotion(value: unknown): value is FrictionEmotion {
  return frictionEmotionOptions.includes(value as FrictionEmotion);
}

function isFrictionDomain(value: unknown): value is FrictionDomain {
  return frictionDomainOptions.includes(value as FrictionDomain);
}

function isFrictionStage(value: unknown): value is FrictionStage {
  return frictionStageOptions.includes(value as FrictionStage);
}

function isFrictionLog(value: unknown): value is FrictionLog {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    isFrictionEmotion(value.emotion) &&
    isFrictionDomain(value.domain) &&
    isFrictionStage(value.stage) &&
    typeof value.intensity === "number" &&
    Number.isFinite(value.intensity) &&
    typeof value.createdAt === "string"
  );
}

function createFrictionId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

export function loadFrictionLogs(): FrictionLog[] {
  const storage = getLocalStorage();

  if (!storage) {
    return [];
  }

  const rawLogs = storage.getItem(STORAGE_KEY);

  if (!rawLogs) {
    return [];
  }

  try {
    const parsedLogs: unknown = JSON.parse(rawLogs);

    if (!Array.isArray(parsedLogs)) {
      return [];
    }

    return parsedLogs.filter(isFrictionLog);
  } catch {
    return [];
  }
}

export function saveFrictionLogs(logs: FrictionLog[]): void {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function createFrictionLog(input: CreateFrictionLogInput): FrictionLog {
  const log: FrictionLog = {
    ...input,
    id: createFrictionId(),
    createdAt: new Date().toISOString(),
  };

  saveFrictionLogs([...loadFrictionLogs(), log]);

  return log;
}

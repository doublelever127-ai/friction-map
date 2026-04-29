import {
  frictionDomainOptions,
  frictionEmotionOptions,
  frictionStageOptions,
} from "@/lib/frictionOptions";
import type {
  FrictionDomain,
  FrictionEmotion,
  FrictionLog,
  FrictionStage,
} from "@/types/friction";

export type FrictionCountMap<T extends string> = Record<T, number>;

export type TopFrictionEntry<T extends string> = {
  label: T;
  count: number;
};

export type FrictionHeatmapEntry = {
  domain: FrictionDomain;
  stage: FrictionStage;
  count: number;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function createCountMap<T extends string>(
  options: readonly T[],
): FrictionCountMap<T> {
  return options.reduce((countMap, option) => {
    countMap[option] = 0;
    return countMap;
  }, {} as FrictionCountMap<T>);
}

export function countByDomain(
  logs: readonly FrictionLog[],
): FrictionCountMap<FrictionDomain> {
  const countMap = createCountMap(frictionDomainOptions);

  for (const log of logs) {
    countMap[log.domain] += 1;
  }

  return countMap;
}

export function countByStage(
  logs: readonly FrictionLog[],
): FrictionCountMap<FrictionStage> {
  const countMap = createCountMap(frictionStageOptions);

  for (const log of logs) {
    countMap[log.stage] += 1;
  }

  return countMap;
}

export function countByEmotion(
  logs: readonly FrictionLog[],
): FrictionCountMap<FrictionEmotion> {
  const countMap = createCountMap(frictionEmotionOptions);

  for (const log of logs) {
    countMap[log.emotion] += 1;
  }

  return countMap;
}

export function getHeatmapCount(
  logs: readonly FrictionLog[],
  domain: FrictionDomain,
  stage: FrictionStage,
): number {
  return logs.filter((log) => log.domain === domain && log.stage === stage)
    .length;
}

export function getTopEntries<T extends string>(
  countMap: FrictionCountMap<T>,
  limit: number,
): TopFrictionEntry<T>[] {
  const safeLimit = Math.max(0, Math.floor(limit));

  return (Object.entries(countMap) as [T, number][])
    .filter(([, count]) => count > 0)
    .sort(
      ([leftLabel, leftCount], [rightLabel, rightCount]) =>
        rightCount - leftCount || leftLabel.localeCompare(rightLabel, "ko"),
    )
    .slice(0, safeLimit)
    .map(([label, count]) => ({ label, count }));
}

export function getLogsWithinDays(
  logs: readonly FrictionLog[],
  days: number,
  now: Date = new Date(),
): FrictionLog[] {
  const nowTime = now.getTime();
  const safeDays = Math.max(0, days);

  if (!Number.isFinite(nowTime) || safeDays === 0) {
    return [];
  }

  const startTime = nowTime - safeDays * DAY_IN_MS;

  return logs.filter((log) => {
    const createdTime = new Date(log.createdAt).getTime();

    return (
      Number.isFinite(createdTime) &&
      createdTime >= startTime &&
      createdTime <= nowTime
    );
  });
}

export function getTopDomainStageEntry(
  logs: readonly FrictionLog[],
): FrictionHeatmapEntry | null {
  let topEntry: FrictionHeatmapEntry | null = null;

  for (const domain of frictionDomainOptions) {
    for (const stage of frictionStageOptions) {
      const count = getHeatmapCount(logs, domain, stage);

      if (!topEntry || count > topEntry.count) {
        topEntry = { domain, stage, count };
      }
    }
  }

  if (!topEntry || topEntry.count === 0) {
    return null;
  }

  return topEntry;
}

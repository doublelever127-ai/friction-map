import type {
  FrictionDomain,
  FrictionEmotion,
  FrictionStage,
} from "@/types/friction";

export const frictionEmotionOptions = [
  "귀찮음",
  "불안",
  "짜증",
  "피로",
  "부담",
  "지루함",
  "막막함",
] as const satisfies readonly FrictionEmotion[];

export const frictionDomainOptions = [
  "일",
  "공부",
  "건강",
  "관계",
  "돈",
  "집안일",
  "디지털",
  "창작",
] as const satisfies readonly FrictionDomain[];

export const frictionStageOptions = [
  "시작 전 마찰",
  "전환 마찰",
  "지속 마찰",
  "완성 마찰",
  "회복 마찰",
  "관계 마찰",
  "결정 마찰",
] as const satisfies readonly FrictionStage[];

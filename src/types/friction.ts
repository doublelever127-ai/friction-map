export type FrictionEmotion =
  | "귀찮음"
  | "불안"
  | "짜증"
  | "피로"
  | "부담"
  | "지루함"
  | "막막함";

export type FrictionDomain =
  | "일"
  | "공부"
  | "건강"
  | "관계"
  | "돈"
  | "집안일"
  | "디지털"
  | "창작";

export type FrictionStage =
  | "시작 전 마찰"
  | "전환 마찰"
  | "지속 마찰"
  | "완성 마찰"
  | "회복 마찰"
  | "관계 마찰"
  | "결정 마찰";

export type FrictionLog = {
  id: string;
  text: string;
  emotion: FrictionEmotion;
  domain: FrictionDomain;
  stage: FrictionStage;
  intensity: number;
  createdAt: string;
};

export type CreateFrictionLogInput = Pick<
  FrictionLog,
  "text" | "emotion" | "domain" | "stage" | "intensity"
>;

export type FrictionExperimentStatus =
  | "진행 전"
  | "진행 중"
  | "관찰 완료"
  | "보류";

export type FrictionExperiment = {
  id: string;
  frictionLogId: string;
  title: string;
  hypothesis: string;
  action: string;
  durationDays: 3 | 5 | 7;
  successCriteria: string;
  failureInterpretation: string;
  status: FrictionExperimentStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateFrictionExperimentInput = Pick<
  FrictionExperiment,
  | "frictionLogId"
  | "title"
  | "hypothesis"
  | "action"
  | "durationDays"
  | "successCriteria"
  | "failureInterpretation"
>;

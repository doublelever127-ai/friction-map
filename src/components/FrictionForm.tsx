"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  frictionDomainOptions,
  frictionEmotionOptions,
  frictionStageOptions,
} from "@/lib/frictionOptions";
import { Button } from "@/components/ui/Button";
import { ChoiceChip } from "@/components/ui/ChoiceChip";
import type {
  CreateFrictionLogInput,
  FrictionDomain,
  FrictionEmotion,
  FrictionStage,
} from "@/types/friction";

type QuickExample = {
  text: string;
  emotion: FrictionEmotion;
  domain: FrictionDomain;
  stage: FrictionStage;
  intensity: number;
};

const quickExamples = [
  {
    text: "답장을 계속 미루고 있다",
    emotion: "부담",
    domain: "관계",
    stage: "완성 마찰",
    intensity: 4,
  },
  {
    text: "책상에 앉자마자 유튜브를 봤다",
    emotion: "지루함",
    domain: "디지털",
    stage: "지속 마찰",
    intensity: 3,
  },
  {
    text: "운동하려고 했는데 또 미뤘다",
    emotion: "부담",
    domain: "건강",
    stage: "시작 전 마찰",
    intensity: 4,
  },
  {
    text: "뭐부터 해야 할지 몰라 멈췄다",
    emotion: "막막함",
    domain: "공부",
    stage: "전환 마찰",
    intensity: 3,
  },
] as const satisfies readonly QuickExample[];

const intensityOptions = [
  { value: 1, label: "낮음" },
  { value: 2, label: "조금" },
  { value: 3, label: "보통" },
  { value: 4, label: "큼" },
  { value: 5, label: "매우 큼" },
] as const;

type FrictionFormProps = {
  onCreate: (input: CreateFrictionLogInput) => void;
};

export function FrictionForm({ onCreate }: FrictionFormProps) {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState<FrictionEmotion>(
    frictionEmotionOptions[0],
  );
  const [domain, setDomain] = useState<FrictionDomain>(
    frictionDomainOptions[0],
  );
  const [stage, setStage] = useState<FrictionStage>(frictionStageOptions[0]);
  const [intensity, setIntensity] = useState(3);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setErrorMessage(
        "한 줄만 남겨도 충분합니다. 막혔던 순간을 적어주세요.",
      );
      return;
    }

    onCreate({
      text: trimmedText,
      emotion,
      domain,
      stage,
      intensity,
    });

    setText("");
    setIntensity(3);
    setErrorMessage("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
          막힌 순간 남기기
        </h3>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          정확히 고르지 않아도 괜찮습니다. 지금 가장 가까운 느낌을
          골라보세요.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-inner dark:border-slate-800 dark:bg-slate-950/60">
        <label htmlFor="friction-text" className="sr-only">
          막혔던 순간
        </label>
        <textarea
          id="friction-text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (errorMessage) {
              setErrorMessage("");
            }
          }}
          placeholder="예: 운동하려고 했는데 또 미뤘다"
          rows={5}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? "friction-text-error" : undefined}
          className="min-h-36 w-full resize-y rounded-xl border border-transparent bg-white px-4 py-4 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-950"
        />
        {errorMessage ? (
          <p
            id="friction-text-error"
            className="mt-2 px-1 text-sm text-teal-800 dark:text-teal-200"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            빠른 예시
          </p>
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            예시는 시작을 돕는 힌트입니다. 고른 뒤 얼마든지 바꿀 수
            있습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickExamples.map((example) => (
            <ChoiceChip
              key={example.text}
              selected={text === example.text}
              onClick={() => {
                setText(example.text);
                setEmotion(example.emotion);
                setDomain(example.domain);
                setStage(example.stage);
                setIntensity(example.intensity);
                setErrorMessage("");
              }}
              className="justify-start text-left"
            >
              {example.text}
            </ChoiceChip>
          ))}
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-900 dark:text-slate-100">
          그때 느낌
        </legend>
        <div className="flex flex-wrap gap-2">
          {frictionEmotionOptions.map((option) => (
            <ChoiceChip
              key={option}
              selected={emotion === option}
              onClick={() => setEmotion(option)}
            >
              {option}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-900 dark:text-slate-100">
          어느 쪽 일이었나요?
        </legend>
        <div className="flex flex-wrap gap-2">
          {frictionDomainOptions.map((option) => (
            <ChoiceChip
              key={option}
              selected={domain === option}
              onClick={() => setDomain(option)}
            >
              {option}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-900 dark:text-slate-100">
          어디에서 막혔나요?
        </legend>
        <div className="flex flex-wrap gap-2">
          {frictionStageOptions.map((option) => (
            <ChoiceChip
              key={option}
              selected={stage === option}
              onClick={() => setStage(option)}
            >
              {option}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="flex w-full items-center justify-between gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">
          얼마나 버거웠나요?
          <span className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-800 dark:bg-teal-950 dark:text-teal-100">
            {intensity}
          </span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {intensityOptions.map((option) => (
            <label
              key={option.value}
              className="flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 transition has-checked:border-teal-600 has-checked:bg-teal-50 has-checked:text-teal-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:has-checked:border-teal-500 dark:has-checked:bg-teal-950 dark:has-checked:text-teal-100"
            >
              <input
                type="radio"
                name="friction-intensity"
                value={option.value}
                checked={intensity === option.value}
                onChange={() => setIntensity(option.value)}
                className="sr-only"
              />
              <span className="text-base font-semibold">{option.value}</span>
              <span className="text-xs">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Button type="submit" className="w-full sm:w-auto">
        막힌 순간 기록하기
      </Button>
    </form>
  );
}

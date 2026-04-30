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

function getShortStageLabel(stage: FrictionStage) {
  return stage.replace(" 마찰", "");
}

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-[1.6rem] border border-[var(--line-soft)] bg-[var(--surface-soft)] p-3 shadow-inner">
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
          rows={2}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? "friction-text-error" : undefined}
          className="min-h-24 w-full resize-y rounded-2xl border border-transparent bg-[var(--surface)] px-4 py-4 text-base leading-7 text-[var(--foreground)] outline-none transition placeholder:text-[var(--text-subtle)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15"
        />
        {errorMessage ? (
          <p
            id="friction-text-error"
            className="mt-2 px-1 text-sm text-[var(--accent-strong)]"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--foreground)]">
            빠른 예시
          </p>
          <p className="text-xs leading-5 text-[var(--text-muted)]">
            눌러도 바로 저장되지 않습니다. 필요하면 아래에서 바꿀 수 있어요.
          </p>
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              className="shrink-0 justify-start whitespace-nowrap text-left"
            >
              {example.text}
            </ChoiceChip>
          ))}
        </div>
      </div>

      <details className="group rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)]">
        <summary className="flex cursor-pointer list-none flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            느낌과 위치 조정하기
          </span>
          <span className="text-xs leading-5 text-[var(--text-muted)]">
            {emotion} · {domain} · {getShortStageLabel(stage)} · 버거움 {intensity}
          </span>
        </summary>

        <div className="grid gap-5 border-t border-[var(--line-soft)] px-4 py-4">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-[var(--foreground)]">
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
            <legend className="text-sm font-medium text-[var(--foreground)]">
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
            <legend className="text-sm font-medium text-[var(--foreground)]">
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
            <legend className="flex w-full items-center justify-between gap-3 text-sm font-medium text-[var(--foreground)]">
              얼마나 버거웠나요?
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm text-[var(--accent-strong)]">
                {intensity}
              </span>
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {intensityOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] px-3 py-2 text-center text-sm font-medium text-[var(--text-muted)] transition has-checked:border-[var(--accent)] has-checked:bg-[var(--accent-soft)] has-checked:text-[var(--accent-strong)]"
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
        </div>
      </details>

      <Button type="submit" className="w-full sm:w-auto">
        막힌 순간 기록하기
      </Button>
    </form>
  );
}

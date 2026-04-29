"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  frictionDomainOptions,
  frictionEmotionOptions,
  frictionStageOptions,
} from "@/lib/frictionOptions";
import type {
  CreateFrictionLogInput,
  FrictionDomain,
  FrictionEmotion,
  FrictionStage,
} from "@/types/friction";

const intensityOptions = [1, 2, 3, 4, 5] as const;

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
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
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label htmlFor="friction-text" className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          막혔던 순간
        </span>
        <textarea
          id="friction-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="예: 운동하려고 했는데 또 미뤘다"
          rows={4}
          className="min-h-28 resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-900"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label htmlFor="friction-emotion" className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
            감정
          </span>
          <select
            id="friction-emotion"
            value={emotion}
            onChange={(event) =>
              setEmotion(event.target.value as FrictionEmotion)
            }
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:ring-teal-900"
          >
            {frictionEmotionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="friction-domain" className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
            생활 영역
          </span>
          <select
            id="friction-domain"
            value={domain}
            onChange={(event) =>
              setDomain(event.target.value as FrictionDomain)
            }
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:ring-teal-900"
          >
            {frictionDomainOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="friction-stage" className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
            마찰 단계
          </span>
          <select
            id="friction-stage"
            value={stage}
            onChange={(event) => setStage(event.target.value as FrictionStage)}
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:ring-teal-900"
          >
            {frictionStageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="flex w-full items-center justify-between gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">
          마찰 강도
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {intensity}
          </span>
        </legend>
        <div className="grid grid-cols-5 gap-2">
          {intensityOptions.map((option) => (
            <label
              key={option}
              className="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 text-sm font-medium text-slate-700 transition has-checked:border-teal-600 has-checked:bg-teal-50 has-checked:text-teal-800 dark:border-slate-700 dark:text-slate-300 dark:has-checked:border-teal-500 dark:has-checked:bg-teal-950 dark:has-checked:text-teal-100"
            >
              <input
                type="radio"
                name="friction-intensity"
                value={option}
                checked={intensity === option}
                onChange={() => setIntensity(option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>가벼움</span>
          <span>큼</span>
        </div>
      </fieldset>

      <button
        type="submit"
        className="h-12 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 dark:bg-teal-600 dark:hover:bg-teal-500 dark:focus:ring-offset-slate-900"
      >
        기록 저장
      </button>
    </form>
  );
}

import { Badge } from "@/components/ui/Badge";

const sampleLogs = [
  {
    text: "운동하려고 했는데 또 미뤘다",
    emotion: "부담",
    domain: "건강",
    stage: "시작 전 마찰",
  },
  {
    text: "카톡 답장을 계속 미루고 있다",
    emotion: "부담",
    domain: "관계",
    stage: "완성 마찰",
  },
  {
    text: "책상에 앉자마자 유튜브를 봤다",
    emotion: "지루함",
    domain: "디지털",
    stage: "지속 마찰",
  },
] as const;

export function SampleFrictionPreview() {
  return (
    <section className="rounded-lg border border-teal-100 bg-white/85 p-5 shadow-sm shadow-teal-100/40 dark:border-teal-900 dark:bg-slate-900/85 dark:shadow-none">
      <div className="flex flex-col gap-2">
        <Badge variant="status">예시로 둘러보기</Badge>
        <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
          기록이 쌓이면 이렇게 보입니다
        </h3>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          아래 예시는 화면을 이해하기 위한 미리보기입니다. 실제 기록으로
          저장되지는 않습니다.
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        {sampleLogs.map((sample) => (
          <article
            key={`${sample.domain}-${sample.stage}`}
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60"
          >
            <p className="break-words text-sm font-semibold leading-6 text-slate-950 dark:text-slate-50">
              {sample.text}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="emotion">{sample.emotion}</Badge>
              <Badge variant="domain">{sample.domain}</Badge>
              <Badge variant="stage">{sample.stage}</Badge>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

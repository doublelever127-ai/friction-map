import Link from "next/link";

const updatedAt = "2026-04-29";

export const metadata = {
  title: "개인정보처리방침 | 마찰지도",
  description: "마찰지도 앱의 개인정보 저장 방식과 기록 관리 안내",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(201,130,115,0.18),transparent_28rem),linear-gradient(180deg,var(--background),var(--surface-muted))] px-4 py-6 text-[var(--foreground)] sm:px-6">
      <article className="mx-auto max-w-[720px] rounded-[2rem] border border-[var(--line-soft)] bg-[var(--surface)]/90 p-6 shadow-[var(--shadow-float)] backdrop-blur sm:p-8">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--accent-strong)] underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
        >
          마찰지도로 돌아가기
        </Link>

        <header className="mt-6 border-b border-[var(--line-soft)] pb-6">
          <p className="text-sm font-medium text-[var(--text-muted)]">
            최종 업데이트: {updatedAt}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-[var(--foreground)]">
            마찰지도 개인정보처리방침
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--text-muted)]">
            마찰지도는 자꾸 막히는 순간을 한 줄로 남기고, 반복되는 패턴을
            보는 개인 기록 앱입니다. 정신건강 치료, 심리 진단, 의료 상담,
            처방을 제공하지 않습니다.
          </p>
        </header>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[var(--text-muted)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              1. 저장되는 정보
            </h2>
            <p className="mt-3">
              마찰지도는 사용자가 앱 안에서 직접 입력한 내용을 기기 안에
              저장합니다.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>막힌 순간에 대한 한 줄 기록</li>
              <li>그때 느낌, 생활 영역, 막힌 위치, 버거움 정도</li>
              <li>작게 바꿔보기 카드에 사용자가 직접 적은 내용</li>
              <li>카드 상태와 기록 생성 및 수정 시각</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              2. 저장 위치
            </h2>
            <p className="mt-3">
              현재 버전의 기록은 사용자의 기기 안에 저장됩니다. 첫 출시
              버전에서는 서버 저장, 로그인 계정, 데이터베이스, 광고 SDK, 분석
              SDK, AI API를 사용하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              3. 사용 목적
            </h2>
            <p className="mt-3">
              앱은 사용자가 입력한 기록을 기록 목록, 자주 막힌 위치 지도,
              반복 요약, 작게 바꿔보기 카드 표시를 위해 사용합니다. 기록은
              사용자를 평가하거나 진단하기 위한 목적으로 사용되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              4. 제3자 제공
            </h2>
            <p className="mt-3">
              마찰지도는 첫 출시 버전에서 사용자의 기록을 제3자에게 제공하지
              않습니다. 사용자의 기록을 외부 서버나 광고, 분석 서비스로
              전송하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              5. 기록 삭제와 내보내기
            </h2>
            <p className="mt-3">
              사용자는 앱 안의 내 기록 관리 영역에서 모든 기록을 삭제하거나
              JSON 파일로 내보낼 수 있습니다. 삭제하면 이 기기 안의 기록이
              사라지며, 앱에서 복구할 수 없습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              6. 향후 변경
            </h2>
            <p className="mt-3">
              향후 서버 저장, 로그인, 백업, 분석, AI 기능을 추가하게 되면
              개인정보처리방침과 Google Play Data Safety 항목을 먼저
              갱신합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              7. 문의
            </h2>
            <p className="mt-3">
              개인정보와 앱 사용에 관한 문의 이메일은 Play Store 등록 전
              실제 지원 주소로 교체할 예정입니다.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

import ComplexScene from "@/components/ComplexScene";
import GoalBar from "@/components/GoalBar";
import { complexProgress, formatPercent, formatPines } from "@/lib/calc";
import { complex as c } from "@/mock";

// ⑤ 단지 정원: 모든 숫자는 단지 전체 합계. 동별·세대별 비교나 순위는 없다.
export default function ComplexPage() {
  const progress = complexProgress(c);
  const stats = [
    { label: "함께하는 집", value: `${c.participatingHouseholds.toLocaleString("ko-KR")}세대` },
    { label: "이번 주 새로 자란 소나무", value: `${formatPines(c.pinesThisWeek)}그루` },
  ];

  return (
    <main className="flex min-h-[calc(100dvh_-_var(--spacing-tabbar))] flex-col gap-4 px-gutter pt-2 pb-5">
      <header className="flex h-11 items-center">
        <h1 className="text-xl font-bold tracking-tight">우리 단지 정원</h1>
      </header>

      <div className="relative -mx-gutter min-h-52 flex-1">
        <ComplexScene progress={progress} className="absolute inset-0 size-full" />
      </div>

      <section>
        <h2 className="text-[22px] leading-snug font-bold tracking-tight">
          이번 겨울, 소나무 {formatPines(c.goalPines)}그루를 키워요
        </h2>
        <p className="mt-1.5 text-[15px] font-semibold tabular-nums">
          지금 {formatPines(c.currentPines)}그루 · <span className="text-garden">{formatPercent(progress, 0)}</span>
        </p>
        <div className="mt-2.5">
          <GoalBar fill={progress} valueText={`목표의 ${formatPercent(progress, 0)}`} />
        </div>
      </section>

      <dl className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="card px-4 py-3">
            <dt className="text-xs text-ink-soft">{s.label}</dt>
            <dd className="mt-0.5 text-lg font-bold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-sm leading-relaxed text-ink-soft">
        집집마다 아낀 전기를 소나무로 바꿔 모아요. 목표를 채우면 단지에 진짜 나무를 심어요.
      </p>

      <button type="button" className="h-12 rounded-2xl bg-garden text-[15px] font-semibold text-white">
        우리 단지 정원 공유하기
      </button>
    </main>
  );
}

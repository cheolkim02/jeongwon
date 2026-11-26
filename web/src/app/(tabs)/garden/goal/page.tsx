import Link from "next/link";
import { Footnote } from "@/components/ActionBar";
import { GOAL_OPTIONS } from "@/config/constants";
import { formatPercent } from "@/lib/calc";
import { household as h } from "@/mock";
import GardenPage from "../page";

// ⑥ 목표 고르기: 정원 화면 위로 아래에서 올라오는 시트. 선택은 라디오(CSS :checked)로만 보여 준다
export default function GoalSheetPage() {
  return (
    <>
      <div aria-hidden inert>
        <GardenPage />
      </div>
      <Link href="/garden" aria-label="닫기" className="fixed inset-0 z-40 bg-ink/40" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-title"
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-phone rounded-t-[28px] bg-paper px-gutter pt-3"
      >
        <div aria-hidden className="mx-auto h-1 w-10 rounded-full bg-ink/15" />
        <h2 id="goal-title" className="mt-5 text-xl font-bold tracking-tight">
          이번 달 목표를 골라 주세요
        </h2>
        <p className="mt-1 text-sm text-ink-soft">작년 같은 달과 비교하고, 날씨 차이는 빼고 계산해요.</p>

        <fieldset className="mt-4 flex flex-col gap-2">
          <legend className="sr-only">이번 달 목표</legend>
          {GOAL_OPTIONS.map((o) => (
            <label
              key={o.rate}
              className="flex cursor-pointer items-center gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-ink/5 has-checked:ring-2 has-checked:ring-garden"
            >
              <input
                type="radio"
                name="goal"
                defaultChecked={o.rate === h.goalRate}
                className="size-5 accent-garden"
              />
              <span className="text-lg font-bold tabular-nums">{formatPercent(o.rate, 0)}</span>
              <span className="text-sm text-ink-soft">{o.note}</span>
            </label>
          ))}
        </fieldset>

        <div className="mt-5 flex gap-2">
          <button type="button" className="h-12 flex-1 rounded-2xl bg-card text-[15px] font-semibold shadow-card">
            자동으로 정해 줘
          </button>
          <Link
            href="/garden"
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-garden text-[15px] font-semibold text-white"
          >
            이걸로 할게요
          </Link>
        </div>
        <div className="mt-3">
          <Footnote />
        </div>
      </section>
    </>
  );
}

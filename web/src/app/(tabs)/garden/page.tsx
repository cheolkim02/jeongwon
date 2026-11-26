import Link from "next/link";
import GoalBar from "@/components/GoalBar";
import Miniature from "@/components/Miniature";
import { PlantIcon } from "@/components/icons";
import { STAGE_LABEL, formatKwh, formatPercent, gardenProgress, monthResult, type GardenStage } from "@/lib/calc";
import { floorPlan84 as plan, household as h } from "@/mock";

const STAGES: GardenStage[] = ["seed", "sprout", "sapling", "tree"];

// ③ 정원: 내 목표로만 자라고, 시들거나 줄지 않는다(FR-B4). 순위 없음.
export default function GardenPage() {
  const g = gardenProgress(h);
  const month = `${h.asOf.month}월`;
  const goal = formatPercent(h.goalRate, 0);
  // 못 채운 달은 빈칸 없이 그냥 넘어간다
  const trees = h.pastMonths.filter((m) => monthResult(m).achieved);
  const lastTree = trees.at(-1);

  return (
    <main className="flex min-h-[calc(100dvh_-_var(--spacing-tabbar))] flex-col gap-3.5 px-gutter pt-2 pb-5">
      <header className="flex h-11 items-center">
        <h1 className="text-xl font-bold tracking-tight">우리 집 정원</h1>
      </header>

      <div className="relative min-h-44 flex-1 overflow-hidden rounded-card bg-[#efe8db]">
        <Miniature
          plan={plan}
          stage={g.stage}
          focus={{ ...plan.plant, z: 0.9, w: 6.2, h: 4.4 }}
          label={`발코니 화분의 ${STAGE_LABEL[g.stage]}`}
          className="absolute inset-0 size-full"
        />
      </div>

      <ol className="grid grid-cols-4 gap-1.5" aria-label="정원 단계">
        {STAGES.map((s) => {
          const now = s === g.stage;
          return (
            <li
              key={s}
              aria-current={now ? "step" : undefined}
              className={`flex flex-col items-center rounded-2xl py-1.5 text-xs ${now ? "bg-card font-bold text-garden shadow-card" : "text-ink-soft"}`}
            >
              <PlantIcon stage={s} className={`size-8 ${now ? "" : "opacity-40"}`} />
              {STAGE_LABEL[s]}
            </li>
          );
        })}
      </ol>

      <section className="card px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-[15px] font-bold">
              {month} 목표 · 작년 {month}보다 {goal} 아끼기
            </h2>
            <p className="mt-0.5 text-xs text-ink-soft">약 {formatKwh(g.goalKwh)} · 날씨 차이는 빼고 계산해요</p>
          </div>
          <Link href="/garden/goal" className="shrink-0 pt-0.5 text-xs font-semibold text-garden">
            목표 바꾸기
          </Link>
        </div>
        <div className="mt-3 border-t border-ink/5 pt-3">
          <p className="text-[15px] font-semibold tabular-nums">
            {month} {h.asOf.day}일까지 <span className="text-garden">{formatPercent(g.rate)}</span> 아꼈어요
          </p>
          <div className="mt-2.5">
            <GoalBar fill={g.barFill} goal={g.barGoal} valueText={`목표 ${goal}, 지금 ${formatPercent(g.rate)}`} />
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            {g.onTrack ? "이대로면 월말에 나무가 돼요" : "남은 날 조금만 더 아끼면 나무가 돼요"}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold">내가 키운 나무</h2>
        <ul className="mt-2 flex gap-2">
          {trees.map((m) => (
            <li key={m.month} className="card flex w-16 flex-col items-center py-1.5 text-xs font-semibold">
              <PlantIcon stage="tree" className="size-9" />
              {m.month}월
            </li>
          ))}
          <li className="flex w-16 flex-col items-center rounded-[20px] border border-dashed border-garden/30 py-1.5 text-xs text-ink-soft">
            <PlantIcon stage={g.stage} className="size-9" />
            {month}
          </li>
        </ul>
      </section>

      {lastTree && (
        <Link
          href="/garden/card"
          className="flex h-12 items-center justify-center rounded-2xl bg-garden text-[15px] font-semibold text-white"
        >
          {lastTree.month}월 정원 카드 보기
        </Link>
      )}
    </main>
  );
}

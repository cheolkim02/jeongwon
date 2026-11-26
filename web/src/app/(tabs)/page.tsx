import Link from "next/link";
import GoalBar from "@/components/GoalBar";
import { BellIcon, ChevronIcon, PlantBadge } from "@/components/icons";
import Miniature from "@/components/Miniature";
import {
  billForecast,
  checkupCount,
  electricitySaving,
  formatPercent,
  formatWon,
  gardenProgress,
  leakCheck,
} from "@/lib/calc";
import { floorPlan84, household as h } from "@/mock";

// ① 우리 집(홈)
export default function Home() {
  const count = checkupCount(h);
  const bill = billForecast(h);
  const elec = electricitySaving(h);
  const garden = gardenProgress(h);
  const leak = leakCheck(h);
  const month = `${h.asOf.month}월`;
  const chips = [
    { label: "전기", won: bill.electricity, dot: "bg-electric" },
    { label: "수도", won: bill.water, dot: "bg-water" },
    { label: "난방", won: bill.heating, dot: "bg-heat" },
  ];

  return (
    <main className="flex min-h-[calc(100dvh_-_var(--spacing-tabbar))] flex-col gap-4 px-gutter pt-2 pb-5">
      <header className="flex h-11 items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-garden">정원</span>
        <button type="button" aria-label="알림, 새 알림 있음" className="-mr-2 p-2 text-ink">
          <BellIcon className="size-6" />
        </button>
      </header>

      <section>
        <p className="text-[15px] text-ink-soft">좋은 아침이에요</p>
        <h1 className="mt-1 text-[25px] leading-[1.35] font-bold tracking-tight text-balance">
          {count ? `우리 집에 살펴볼 곳이 ${count}곳 있어요` : "우리 집은 지금 괜찮아요"}
        </h1>
      </section>

      {/* 미니어처는 폭 가득, 남는 높이를 모두 쓴다(스크롤 없이 한 화면) */}
      <div className="relative -mx-gutter min-h-60 flex-1">
        <Miniature
          plan={floorPlan84}
          stage={garden.stage}
          glowRoom={leak.detected ? h.leak.roomId : undefined}
          bubble={{ text: "새벽에도 물이 흘러요", href: "/checkup/leak" }}
          className="absolute inset-0 size-full"
        />
      </div>

      <section className="card px-5 py-4">
        <h2 className="text-sm font-semibold text-ink-soft">{month} 예상 요금</h2>
        <p className="mt-0.5 text-[30px] leading-tight font-bold tabular-nums">
          <span className="mr-1 text-lg font-semibold text-ink-soft">약</span>
          {formatWon(bill.total)}
        </p>
        <ul className="mt-3 grid grid-cols-3 gap-1.5">
          {chips.map((c) => (
            <li key={c.label} className="rounded-2xl bg-paper px-3 py-2">
              <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                <span aria-hidden className={`size-1.5 rounded-full ${c.dot}`} />
                {c.label}
              </span>
              <span className="mt-0.5 block text-sm font-semibold whitespace-nowrap tabular-nums">
                {formatWon(c.won)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          전기는 작년 {month}보다{" "}
          <b className="font-semibold text-garden">{formatPercent(Math.abs(elec.rate))}</b>{" "}
          {elec.rate >= 0 ? "덜" : "더"} 쓰고 있어요
        </p>
      </section>

      <Link href="/garden" className="card flex items-center gap-3.5 px-4 py-3.5">
        <PlantBadge stage={garden.stage} className="size-11 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold tabular-nums">
            목표 {formatPercent(h.goalRate, 0)} · 지금 {formatPercent(garden.rate)} 아끼는 중
          </p>
          <div className="mt-2.5">
            <GoalBar
              fill={garden.barFill}
              goal={garden.barGoal}
              valueText={`목표 ${formatPercent(h.goalRate, 0)}, 지금 ${formatPercent(garden.rate)}`}
            />
          </div>
        </div>
        <ChevronIcon className="size-5 text-ink-soft" />
      </Link>
    </main>
  );
}

import Link from "next/link";
import ActionBar from "@/components/ActionBar";
import FlowBars from "@/components/FlowBars";
import Miniature from "@/components/Miniature";
import { BackIcon } from "@/components/icons";
import { SEOUL_TOILET_LEAK_NO_RELIEF_SINCE } from "@/config/constants";
import { formatLiters, formatWon, gardenProgress, leakCheck, recentDays } from "@/lib/calc";
import { floorPlan84 as plan, household as h } from "@/mock";

const TODO = [
  "변기 물탱크에 식용색소를 몇 방울 넣고 10분 기다려 보세요. 변기 물 색이 바뀌면 새는 거예요.",
  "집 안 수도를 모두 잠그고, 수도 계량기의 별 모양 표시가 돌아가는지 보세요.",
];

// ② 검진 상세: 유형, 근거 그래프, 월 손실액, 해 볼 일(FR-A6)
export default function LeakPage() {
  const leak = leakCheck(h);
  const room = plan.rooms.find((r) => r.id === h.leak.roomId)!;
  const flows = h.leak.nightMinFlowLph;

  return (
    <>
      <main className="flex flex-col gap-3 px-gutter pt-2 pb-4">
        <header className="relative flex h-11 items-center justify-center">
          <Link href="/checkup" aria-label="뒤로 가기" className="absolute left-0 -ml-2 p-2">
            <BackIcon className="size-6" />
          </Link>
          <h1 className="text-[17px] font-semibold">우리 집 검진</h1>
        </header>

        <div className="relative h-30 overflow-hidden rounded-card bg-[#efe8db]">
          <Miniature
            plan={plan}
            stage={gardenProgress(h).stage}
            glowRoom={room.id}
            focus={{ x: room.x + room.w / 2, y: room.y + room.d * 0.4, z: 0.5, w: 8, h: 2.75 }}
            label={`${room.name} 확대 그림`}
            className="absolute inset-0 size-full"
          />
        </div>

        <section>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-glow/15 px-2.5 py-1 text-xs font-semibold text-glow-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-glow" />
            누수 의심 · {room.name}
          </p>
          <h2 className="mt-2 text-[22px] leading-snug font-bold tracking-tight">
            새벽 {leak.hour}시에도 물이 흐르고 있어요
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            물을 쓰지 않는 새벽에도 {leak.days}일째 시간당 약 {formatLiters(leak.flowLph)}가 흐르고 있어요. 가장
            흔한 원인은 변기 누수예요.
          </p>
        </section>

        <section className="card px-4 pt-3.5 pb-3">
          <h3 className="flex items-baseline justify-between text-sm font-semibold">
            새벽 최소 유량<span className="text-xs font-normal text-ink-soft">L/시간 · 최근 {flows.length}일</span>
          </h3>
          <div className="mt-1">
            <FlowBars
              values={flows}
              days={recentDays(h.asOf, flows.length)}
              highlightFrom={flows.length - leak.days}
              usual={leak.usualLph}
            />
          </div>
        </section>

        <section className="card px-4 py-3">
          <p className="text-[15px] font-semibold">
            이대로면 이번 달 <span className="text-glow-ink">약 {formatWon(leak.monthlyLossWon)}</span>이 더
            나와요
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            서울에서는 {SEOUL_TOILET_LEAK_NO_RELIEF_SINCE}년부터 변기 누수로 더 나온 수도요금을 감면해 주지 않아요
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold">해 볼 일</h3>
          <ol className="mt-2 flex flex-col gap-2">
            {TODO.map((t, i) => (
              <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed">
                <span className="grid size-5 shrink-0 translate-y-0.5 place-items-center rounded-full bg-garden/10 text-[11px] font-bold text-garden">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </section>
      </main>

      <ActionBar>
        <button type="button" className="h-11 flex-1 rounded-2xl bg-card text-[15px] font-semibold shadow-card">
          확인했어요
        </button>
        <button type="button" className="h-11 flex-[2] rounded-2xl bg-garden text-[15px] font-semibold text-white">
          my HILLS로 A/S 접수하기
        </button>
      </ActionBar>
    </>
  );
}

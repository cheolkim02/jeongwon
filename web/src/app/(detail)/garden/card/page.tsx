import Link from "next/link";
import ActionBar from "@/components/ActionBar";
import Miniature from "@/components/Miniature";
import { BackIcon } from "@/components/icons";
import { PINE_AGE_YEARS } from "@/config/constants";
import { formatKwh, formatPercent, formatPines, formatWon, monthResult } from "@/lib/calc";
import { floorPlan84 as plan, household as h } from "@/mock";

// ④ 정원 카드: 공유용 9:16. 카드 안에 동·호수, 날짜·시간대, 단지 이름을 넣지 않는다(FR-B6)
export default function GardenCardPage() {
  const m = h.pastMonths.filter((p) => monthResult(p).achieved).at(-1)!;
  const r = monthResult(m);
  const pines = formatPines(r.pines);

  return (
    <>
      <main className="flex flex-col gap-3 px-gutter pt-2 pb-4">
        <header className="relative flex h-11 items-center justify-center">
          <Link href="/garden" aria-label="뒤로 가기" className="absolute left-0 -ml-2 p-2">
            <BackIcon className="size-6" />
          </Link>
          <h1 className="text-[17px] font-semibold">정원 카드</h1>
        </header>

        {/* 토글(CSS :checked)을 켜면 카드 안에 아낀 금액이 나타난다 */}
        <div className="group flex flex-col items-center gap-3">
          <article
            aria-label={`${m.month}월 정원 카드`}
            className="flex aspect-[9/16] w-[330px] flex-col overflow-hidden rounded-[28px] bg-linear-to-b from-[#fbf8f1] to-[#e9f1d9] px-6 pt-6 pb-5 shadow-card"
          >
            <p className="text-sm font-bold text-garden">정원</p>
            <h2 className="mt-1 text-[26px] leading-tight font-bold tracking-tight">{m.month}월의 정원</h2>

            <div className="relative -mx-4 my-2 flex-1">
              <Miniature
                plan={plan}
                stage="tree"
                plantScale={3}
                label="우리 집 미니어처, 발코니에 다 자란 나무"
                className="absolute inset-0 size-full"
              />
            </div>

            <p className="text-[22px] font-bold tabular-nums">
              목표 {formatPercent(m.goalRate, 0)} → <span className="text-garden">{formatPercent(r.rate)}</span> 달성
            </p>
            <p className="mt-1.5 text-[15px] font-semibold">우리 단지 숲에 소나무 {pines}그루를 보탰어요</p>
            <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">
              약 {formatKwh(r.savedKwh)} = {PINE_AGE_YEARS}년생 소나무 {pines}그루가 1년 동안 흡수하는 양
            </p>
            <p className="mt-2 hidden text-[13px] font-semibold group-has-checked:block">
              아낀 전기요금 약 {formatWon(r.savedWon)}
            </p>
            <p className="mt-3 text-[13px] font-semibold text-garden">#정원 #에너지갓생</p>
          </article>

          <label className="flex w-[330px] items-center justify-between py-1 text-sm font-medium">
            아낀 금액도 보여 주기
            <input type="checkbox" role="switch" className="peer sr-only" />
            <span
              aria-hidden
              className="relative h-6 w-10 rounded-full bg-ink/15 transition-colors peer-checked:bg-garden after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-garden/40"
            />
          </label>
        </div>
      </main>

      <ActionBar>
        <button type="button" className="h-11 flex-1 rounded-2xl bg-card text-[15px] font-semibold shadow-card">
          이미지 저장
        </button>
        <button type="button" className="h-11 flex-1 rounded-2xl bg-garden text-[15px] font-semibold text-white">
          인스타그램 스토리
        </button>
      </ActionBar>
    </>
  );
}

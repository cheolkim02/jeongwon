import Link from "next/link";
import { CheckIcon, ChevronIcon } from "@/components/icons";
import { checkupCount } from "@/lib/calc";
import { floorPlan84 as plan, household as h } from "@/mock";

// 괜찮은 항목. shortcut: Phase 1은 문구만 둔다, Phase 2 탐지 결과(FR-A4 등)가 생기면 데이터로 바꾼다
const OK = [
  { title: "대기 전력", note: "비슷한 집들과 비슷해요" },
  { title: "난방", note: "작년 이맘때와 비슷해요" },
];

// ② 검진 목록
export default function CheckupPage() {
  const count = checkupCount(h);
  const room = plan.rooms.find((r) => r.id === h.leak.roomId)!;

  return (
    <main className="flex flex-col gap-5 px-gutter pt-2 pb-5">
      <header className="flex h-11 items-center">
        <h1 className="text-xl font-bold tracking-tight">우리 집 검진</h1>
      </header>

      {count > 0 && (
        <Link href="/checkup/leak" className="card block p-4 ring-1 ring-glow/40">
          <p className="text-xs font-semibold text-glow-ink">살펴볼 곳 {count}</p>
          <div className="mt-2.5 flex items-center gap-3">
            <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-glow/20">
              <span className="size-3 rounded-full bg-glow shadow-[0_0_10px_4px] shadow-glow/60" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{room.name}</p>
              <p className="text-sm text-ink-soft">새벽에도 물이 흘러요</p>
            </div>
            <ChevronIcon className="size-5 text-ink-soft" />
          </div>
        </Link>
      )}

      <ul className="card divide-y divide-ink/5 px-4">
        {OK.map((o) => (
          <li key={o.title} className="flex items-center gap-3 py-3.5">
            <CheckIcon className="size-7 shrink-0" />
            <p>
              <span className="font-semibold">{o.title}</span>
              <span className="text-ink-soft"> · {o.note}</span>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}

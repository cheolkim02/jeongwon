/** 정원 진행 바: 채움(지금 절약률)과 목표 위치 표시. 값은 0~1(calc의 barFill·barGoal) */
export default function GoalBar({ fill, goal, valueText }: { fill: number; goal: number; valueText: string }) {
  return (
    <div
      role="progressbar"
      aria-label="이번 달 정원"
      aria-valuenow={Math.round(fill * 100)}
      aria-valuetext={valueText}
      className="relative h-2 rounded-full bg-garden/10"
    >
      <div className="h-full rounded-full bg-linear-to-r from-leaf to-garden" style={{ width: `${fill * 100}%` }} />
      <span
        aria-hidden
        className="absolute -top-1 h-4 w-[3px] -translate-x-1/2 rounded-full bg-ink/70 ring-2 ring-card"
        style={{ left: `${goal * 100}%` }}
      />
    </div>
  );
}

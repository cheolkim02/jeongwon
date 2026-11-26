// 근거 그래프: 최근 며칠의 새벽 최소 유량 막대. 평소 수준은 점선, 높아진 날은 점검 빛 색.
interface Props {
  /** L/시간, 오래된 날부터 */
  values: number[];
  /** 막대 아래 날짜(일). 마지막은 '오늘' */
  days: number[];
  /** 이 순번부터 점검 빛 색 */
  highlightFrom: number;
  usual: number;
}

const W = 310;
const H = 70; // 막대 영역
const TOP = 18; // 강조 묶음 이름 자리
const GAP = 2;

export default function FlowBars({ values, days, highlightFrom, usual }: Props) {
  const max = Math.max(...values, usual);
  const bw = (W - GAP * (values.length - 1)) / values.length;
  const y = (v: number) => TOP + H - (v / max) * H;
  const x = (i: number) => i * (bw + GAP);
  const hiCenter = (x(highlightFrom) + x(values.length - 1) + bw) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${TOP + H + 18}`} className="w-full overflow-visible" role="img" aria-label="최근 새벽 최소 유량 막대 그래프">
      {values.map((v, i) => {
        const top = y(v);
        const r = Math.min(3, TOP + H - top); // 위끝만 둥글게, 바닥에 붙인다
        const [l, rt, b] = [x(i), x(i) + bw, TOP + H];
        return (
          <path
            key={i}
            d={`M${l},${b}V${top + r}Q${l},${top} ${l + r},${top}H${rt - r}Q${rt},${top} ${rt},${top + r}V${b}Z`}
            className={i >= highlightFrom ? "fill-glow" : "fill-water"}
          >
            <title>{`${days[i]}일 새벽 시간당 ${v}L`}</title>
          </path>
        );
      })}
      <line x1={0} x2={W} y1={TOP + H} y2={TOP + H} className="stroke-ink/15" />
      <line
        x1={0}
        x2={W}
        y1={y(usual)}
        y2={y(usual)}
        strokeDasharray="4 3"
        className="stroke-ink-soft"
        strokeWidth={1.2}
      />
      <text x={2} y={y(usual) - 5} className="fill-ink-soft text-[10px] font-medium">
        평소
      </text>
      <text x={hiCenter} y={TOP - 6} textAnchor="middle" className="fill-ink text-[10.5px] font-semibold">
        {`최근 ${values.length - highlightFrom}일`}
      </text>
      {days.map((d, i) => (
        <text
          key={i}
          x={x(i) + bw / 2}
          y={TOP + H + 13}
          textAnchor="middle"
          className={`text-[9.5px] tabular-nums ${i === days.length - 1 ? "fill-ink font-semibold" : "fill-ink-soft"}`}
        >
          {i === days.length - 1 ? "오늘" : d}
        </text>
      ))}
    </svg>
  );
}

// 단지 정원: 아이소메트릭 아파트 동 사이로 소나무 숲. 숲은 진행률만큼만 심는다(가운데부터 바깥으로).
import { boxFaces, depthSort, iso, points, shade, type Box, type Pt } from "@/lib/iso";

const GROUND = "#e2e7cc";
const PATH = "#efe9dc";
const BUILDING = "#f6f1e8";
const WINDOW = "#cdd8de";
const FLOOR_H = 1.4; // 그림에서 한 층 높이(m, 실제보다 낮게)

// 그림 배치(m): 단지 바닥, 동 4개, 숲 자리
const SITE = { x: 0, y: 0, w: 42, d: 32 };
const BUILDINGS: Box[] = [
  { x: 3, y: 2, z: 0, w: 13, d: 3.2, h: 14 },
  { x: 20, y: 1.5, z: 0, w: 13, d: 3.2, h: 15.4 },
  { x: 36, y: 6, z: 0, w: 3.2, d: 12, h: 12.6 },
  { x: 2.5, y: 10, z: 0, w: 3.2, d: 12, h: 12.6 },
];
const FOREST = { x: 9, y: 9, w: 24, d: 20 };
const SPACING = 1.7;

/** 숲 자리: 격자에 고정된 흔들림을 주고, 숲 가운데에서 가까운 순으로 */
function pineSlots() {
  const cx = FOREST.x + FOREST.w / 2;
  const cy = FOREST.y + FOREST.d / 2;
  const slots: { x: number; y: number }[] = [];
  for (let i = 0; i * SPACING < FOREST.w; i++)
    for (let j = 0; j * SPACING < FOREST.d; j++) {
      const k = i * 31 + j * 17; // 매번 같은 그림이 나오게 난수 대신 고정 흔들림
      slots.push({
        x: FOREST.x + i * SPACING + ((k * 7) % 10) / 14,
        y: FOREST.y + j * SPACING + ((k * 3) % 10) / 14,
      });
    }
  return slots.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));
}
const SLOTS = pineSlots();

const Face = ({ pts, fill }: { pts: Pt[]; fill: string }) => (
  <polygon points={points(pts)} fill={fill} stroke={fill} strokeWidth={0.6} strokeLinejoin="round" />
);

/** 동: 3톤 상자 + 층마다 창문 띠(왼쪽·오른쪽 면) */
function Building({ b }: { b: Box }) {
  const f = boxFaces(b);
  const [X, Y] = [b.x + b.w, b.y + b.d];
  const floors = Math.floor(b.h / FLOOR_H);
  const band = (z0: number, z1: number, side: "left" | "right"): Pt[] =>
    side === "left"
      ? [iso(b.x + 0.5, Y, z0), iso(X - 0.5, Y, z0), iso(X - 0.5, Y, z1), iso(b.x + 0.5, Y, z1)]
      : [iso(X, b.y + 0.5, z0), iso(X, Y - 0.5, z0), iso(X, Y - 0.5, z1), iso(X, b.y + 0.5, z1)];
  return (
    <g>
      <Face pts={f.left} fill={shade(BUILDING, 0.12)} />
      <Face pts={f.right} fill={shade(BUILDING, 0.24)} />
      <Face pts={f.top} fill={BUILDING} />
      {Array.from({ length: floors - 1 }, (_, k) => {
        const z = (k + 1) * FLOOR_H;
        return (
          <g key={k}>
            <Face pts={band(z - 0.75, z - 0.25, "left")} fill={shade(WINDOW, 0.12)} />
            <Face pts={band(z - 0.75, z - 0.25, "right")} fill={shade(WINDOW, 0.3)} />
          </g>
        );
      })}
    </g>
  );
}

/** 소나무: 원뿔을 왼쪽 밝게·오른쪽 어둡게 나눠 칠한다. (x, y)는 밑동, 높이 약 2.5m */
function Pine({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(3)`}>
      <path d="M-0.9 0h1.8v-3h-1.8z" fill="#9a6b45" />
      {[
        [-3, 9, 7],
        [-7.5, 7.5, 6.5],
        [-11.5, 5.8, 6],
      ].map(([base, half, tall]) => (
        <g key={base}>
          <path d={`M0 ${base - tall}L${-half} ${base}H0z`} fill="#5e9f4b" />
          <path d={`M0 ${base - tall}L${half} ${base}H0z`} className="fill-garden" />
        </g>
      ))}
    </g>
  );
}

export default function ComplexScene({ progress, className }: { progress: number; className?: string }) {
  const planted = SLOTS.slice(0, Math.round(progress * SLOTS.length));
  const slab: Box = { ...SITE, z: -1.2, h: 1.2 };
  // 나무는 아주 작은 상자로 보고 동과 함께 앞뒤를 정한다
  const items = depthSort<Box & { pine?: boolean }>([
    ...BUILDINGS,
    ...planted.map((p) => ({ x: p.x, y: p.y, z: 0, w: 0.3, d: 0.3, h: 2, pine: true })),
  ]);
  const all = [slab, ...BUILDINGS].flatMap((b) => Object.values(boxFaces(b)).flat());
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs) - 8, Math.max(...xs) + 8, Math.min(...ys) - 8, Math.max(...ys) + 12];
  const f = boxFaces(slab);
  const ring = { x: FOREST.x - 1.5, y: FOREST.y - 1.5, w: FOREST.w + 3, d: FOREST.d + 3 };

  return (
    <svg viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} className={className} role="img" aria-label="우리 단지 정원 그림">
      <defs>
        <filter id="complex-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <polygon
        points={points(f.left.concat(f.right).map(([x, y]) => [x, y + 10] as Pt))}
        className="fill-ink/10"
        filter="url(#complex-soft)"
      />
      <Face pts={f.left} fill={shade(GROUND, 0.18)} />
      <Face pts={f.right} fill={shade(GROUND, 0.3)} />
      <Face pts={f.top} fill={GROUND} />
      {/* 숲 둘레 산책길 */}
      <Face
        pts={[iso(ring.x, ring.y), iso(ring.x + ring.w, ring.y), iso(ring.x + ring.w, ring.y + ring.d), iso(ring.x, ring.y + ring.d)]}
        fill={PATH}
      />
      <Face
        pts={[
          iso(FOREST.x, FOREST.y),
          iso(FOREST.x + FOREST.w, FOREST.y),
          iso(FOREST.x + FOREST.w, FOREST.y + FOREST.d),
          iso(FOREST.x, FOREST.y + FOREST.d),
        ]}
        fill="#d5e0b3"
      />
      {items.map((it, i) => {
        if (!it.pine) return <Building key={i} b={it} />;
        const [px, py] = iso(it.x + 0.15, it.y + 0.15);
        return <Pine key={i} x={px} y={py} />;
      })}
    </svg>
  );
}

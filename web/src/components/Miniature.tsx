// 우리 집 미니어처: 평면 데이터를 아이소메트릭으로 투영해 그린다. 윤곽선 없이 면마다 3톤 음영.
import type { GardenStage } from "@/lib/calc";
import { PX_PER_M, boxFaces, depthSort, iso, points, shade, type Box, type Pt } from "@/lib/iso";
import type { FloorPlan, FurnitureKind, Room, RoomId, Wall } from "@/types";
import { PlantShape } from "./icons";

const WALL_H = 1; // 낮게 자른 벽(m)
const WALL_T = 0.14;
const SLAB = 0.35; // 바닥판 두께

// 바닥은 밝고 덜 진하게: 점검 빛(주황)이 묻히지 않게
const FLOOR: Record<Room["floor"], string> = { wood: "#f1e6d2", tile: "#e9e6df", stone: "#e4ded3" };
const GLOW_FLOOR = "#ffd27f";
const WALL = "#fbf7ef";
const SLAB_COLOR = "#e4dac8";
const FURNITURE: Record<FurnitureKind, string> = {
  sofa: "#a3bba6",
  bed: "#cdae89",
  bedding: "#ffffff",
  blanket: "#cfd8de",
  table: "#c79f76",
  counter: "#e9e1d2",
  fridge: "#f5f4f0",
  toilet: "#fbfbf9",
  sink: "#fbfbf9",
  tub: "#fbfbf9",
  cabinet: "#b9956f",
  rug: "#e4d0ab",
  pot: "#d3a27b",
};

type Item = Box & { color: string };

/** 벽 선분 → 상자. x 방향 벽이 모서리를 차지하고 y 방향 벽은 그만큼 줄여 겹치지 않게 한다 */
function wallBox({ x0, y0, x1, y1, h = WALL_H }: Wall): Item {
  const t = WALL_T / 2;
  return y0 === y1
    ? { x: Math.min(x0, x1) - t, y: y0 - t, z: 0, w: Math.abs(x1 - x0) + WALL_T, d: WALL_T, h, color: WALL }
    : { x: x0 - t, y: Math.min(y0, y1) + t, z: 0, w: WALL_T, d: Math.abs(y1 - y0) - WALL_T, h, color: WALL };
}

/** 방 사각형을 m만큼 넓힌다(빛이 벽 너머로 번지게) */
const grow = (r: Room, m: number) => ({ x: r.x - m, y: r.y - m, w: r.w + 2 * m, d: r.d + 2 * m });

const floorPts = (r: { x: number; y: number; w: number; d: number }, z = 0): Pt[] => [
  iso(r.x, r.y, z),
  iso(r.x + r.w, r.y, z),
  iso(r.x + r.w, r.y + r.d, z),
  iso(r.x, r.y + r.d, z),
];

// 같은 색 얇은 테두리는 윤곽선이 아니라 면 사이 틈을 메우는 용도
const Face = ({ pts, fill }: { pts: Pt[]; fill: string }) => (
  <polygon points={points(pts)} fill={fill} stroke={fill} strokeWidth={0.6} strokeLinejoin="round" />
);

function BoxShape({ item }: { item: Item }) {
  const f = boxFaces(item);
  return (
    <g>
      {item.h > 0 && <Face pts={f.left} fill={shade(item.color, 0.12)} />}
      {item.h > 0 && <Face pts={f.right} fill={shade(item.color, 0.24)} />}
      <Face pts={f.top} fill={item.color} />
    </g>
  );
}

// 묘목 주위 빛 입자: [dx, dy, r, 지연(s)]
const SPARKS = [
  [-15, -30, 1.7, 0],
  [14, -38, 1.4, 0.8],
  [-8, -50, 1.2, 1.6],
  [17, -20, 1.3, 2.2],
  [-19, -13, 1.1, 1.2],
];

interface Props {
  plan: FloorPlan;
  /** 발코니 화분의 정원 단계 */
  stage: GardenStage;
  /** 점검 빛을 켤 방 */
  glowRoom?: RoomId;
  bubble?: { text: string; href: string };
  /** 확대: 평면의 한 점(m)을 가운데 두고 폭 w·높이 h(m)만큼만 보여 준다. 남는 쪽은 잘라 낸다 */
  focus?: { x: number; y: number; z?: number; w: number; h: number };
  label?: string;
  className?: string;
}

export default function Miniature({ plan, stage, glowRoom, bubble, focus, label = "우리 집 미니어처", className }: Props) {
  const W = Math.max(...plan.rooms.map((r) => r.x + r.w));
  const D = Math.max(...plan.rooms.map((r) => r.y + r.d));
  const slab: Item = { x: -WALL_T / 2, y: -WALL_T / 2, z: -SLAB, w: W + WALL_T, d: D + WALL_T, h: SLAB, color: SLAB_COLOR };
  const items = depthSort<Item>([
    ...plan.walls.map(wallBox),
    ...plan.furniture.map((f) => ({ ...f, z: f.z ?? 0, color: FURNITURE[f.kind] })),
  ]);

  const glow = plan.rooms.find((r) => r.id === glowRoom);
  const pot = plan.furniture.find((f) => f.kind === "pot");
  const [px, py] = iso(plan.plant.x, plan.plant.y, pot ? (pot.z ?? 0) + pot.h : 0);
  const anchor = glow && iso(glow.x + glow.w / 2, glow.y + glow.d / 2, WALL_H + 0.3);

  // 보이는 모든 꼭짓점 + 말풍선으로 viewBox를 정한다
  const all = [slab, ...items].flatMap((b) => Object.values(boxFaces(b)).flat());
  const xs = all.map((p) => p[0]);
  const ys = [...all.map((p) => p[1]), ...(anchor ? [anchor[1] - 44] : []), py - 60];
  const [x0, x1] = [Math.min(...xs) - 6, Math.max(...xs) + 6];
  const [y0, y1] = [Math.min(...ys) - 6, Math.max(...ys) + 10];
  let viewBox = `${x0} ${y0} ${x1 - x0} ${y1 - y0}`;
  if (focus) {
    const [cx, cy] = iso(focus.x, focus.y, focus.z);
    const [w, h] = [focus.w * PX_PER_M, focus.h * PX_PER_M];
    viewBox = `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
  }

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={focus ? "xMidYMid slice" : undefined}
      className={className}
      role="group"
      aria-label={label}
    >
      <defs>
        <filter id="mini-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="mini-mote" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <filter id="mini-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
      </defs>

      {/* 바닥 그림자와 바닥판 */}
      <polygon
        points={points(floorPts(slab, -SLAB).map(([x, y]) => [x, y + 8] as Pt))}
        className="fill-ink/10"
        filter="url(#mini-soft)"
      />
      <BoxShape item={slab} />

      {plan.rooms.map((r) => (
        <Face key={r.id} pts={floorPts(r)} fill={r === glow ? GLOW_FLOOR : FLOOR[r.floor]} />
      ))}

      {glow && (
        <polygon
          points={points(floorPts(grow(glow, 0.5)))}
          className="animate-breathe fill-glow motion-reduce:animate-none"
          filter="url(#mini-glow)"
        />
      )}

      {items.map((it, i) => (
        <BoxShape key={i} item={it} />
      ))}

      {/* 벽 위로 번지는 빛 */}
      {glow && (
        <polygon
          points={points(floorPts(grow(glow, 0.3), WALL_H * 0.8))}
          className="animate-breathe fill-glow/60 motion-reduce:animate-none"
          filter="url(#mini-glow)"
        />
      )}

      {/* 발코니 화분의 식물(정원 단계)과 빛 입자 */}
      <g aria-hidden>
        <g transform={`translate(${px - 20 * 1.3} ${py - 31 * 1.3}) scale(1.3)`}>
          <PlantShape stage={stage} />
        </g>
        {SPARKS.map(([dx, dy, r, delay]) => (
          <circle
            key={`${dx},${dy}`}
            cx={px + dx}
            cy={py + dy}
            r={r}
            fill="#d6ee93"
            filter="url(#mini-mote)"
            className="animate-twinkle motion-reduce:animate-none"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </g>

      {glow && anchor && bubble && (
        <a href={bubble.href} aria-label={`${glow.name}: ${bubble.text}`}>
          <polygon points={points(floorPts(glow))} fill="transparent" />
          <polygon
            points={points([
              [anchor[0] - 6, anchor[1] - 12],
              [anchor[0] + 6, anchor[1] - 12],
              [anchor[0], anchor[1] - 3],
            ])}
            className="fill-card"
          />
          <foreignObject x={anchor[0] - 90} y={anchor[1] - 44} width={180} height={33}>
            <div className="flex h-full items-end justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap text-ink shadow-card ring-1 ring-glow/40">
                <span className="size-2 rounded-full bg-glow" />
                {bubble.text}
              </span>
            </div>
          </foreignObject>
        </a>
      )}
    </svg>
  );
}

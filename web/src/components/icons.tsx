// 직접 그린 SVG 아이콘(외부 이미지·아이콘 세트를 쓰지 않는다)
import type { SVGProps } from "react";
import type { GardenStage } from "@/lib/calc";

type P = SVGProps<SVGSVGElement>;

const Line = ({ children, ...p }: P) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...p}
  >
    {children}
  </svg>
);

export const HomeIcon = (p: P) => (
  <Line {...p}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
  </Line>
);

export const CheckupIcon = (p: P) => (
  <Line {...p}>
    <rect x="5" y="4.5" width="14" height="16" rx="2.5" />
    <path d="M9 4.5v-.7a.8.8 0 0 1 .8-.8h4.4a.8.8 0 0 1 .8.8v.7" />
    <path d="m8.8 12.8 2.2 2.2 4.2-4.4" />
  </Line>
);

export const GardenIcon = (p: P) => (
  <Line {...p}>
    <path d="M12 20v-8" />
    <path d="M12 13c0-3.6-2.5-6-6.5-6 0 3.8 2.6 6 6.5 6z" />
    <path d="M12 11c0-3.2 2.3-5.6 6.5-5.6 0 3.7-2.5 5.6-6.5 5.6z" />
    <path d="M7.5 20h9" />
  </Line>
);

export const ComplexIcon = (p: P) => (
  <Line {...p}>
    <path d="M3.5 20h17" />
    <rect x="5" y="9" width="6" height="11" rx="1" />
    <rect x="13" y="4" width="6" height="16" rx="1" />
    <path d="M7.5 12.5h1M7.5 15.5h1M15.5 7.5h1M15.5 10.5h1M15.5 13.5h1" />
  </Line>
);

/** 알림 종: 새 알림은 빨간 점 대신 점검 빛 색 점 */
export const BellIcon = (p: P) => (
  <Line {...p}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
    <circle cx="18" cy="5" r="3" className="fill-glow stroke-paper" strokeWidth={1.5} />
  </Line>
);

// 정원 단계별 식물(40×40 칸, 밑동이 (20, 31)). 아이콘·미니어처·정원 화면이 같이 쓴다
const SeedShape = () => (
  <>
    <path d="M11 31c2-3.4 5.3-4.9 9-4.9s7 1.5 9 4.9z" fill="#c9a079" />
    <ellipse cx="20" cy="25.6" rx="2.4" ry="3.2" fill="#8a6644" transform="rotate(-18 20 25.6)" />
  </>
);

const SproutShape = () => (
  <>
    <path d="M20 31v-7" className="stroke-garden" strokeWidth={2} strokeLinecap="round" />
    <path d="M20 25.5c-.6-3.1-2.9-5-6.4-5 .3 3.3 2.7 5.2 6.4 5z" className="fill-leaf" />
    <path d="M20 24.5c.7-3.3 3.1-5.2 6.6-5.2-.4 3.5-2.9 5.4-6.6 5.2z" className="fill-leaf" />
  </>
);

const SaplingShape = () => (
  <>
    <path d="M20 31V14" className="stroke-garden" strokeWidth={2} strokeLinecap="round" />
    <path d="M20 23c-.8-4.2-3.8-6.6-8.4-6.6.4 4.3 3.6 6.9 8.4 6.6z" className="fill-leaf" />
    <path d="M20 19.5c.9-4.4 4-6.9 8.6-6.9-.5 4.6-3.8 7.2-8.6 6.9z" className="fill-garden" />
    <path d="M20 15c-.7-2.8.3-5.4 2.9-7 1.1 2.7.1 5.4-2.9 7z" className="fill-leaf" />
  </>
);

// 나무: 잎을 3톤(왼쪽 위 밝게, 가운데, 오른쪽 아래 어둡게)으로
const TreeShape = () => (
  <>
    <path d="M20 31v-10" stroke="#9a6b45" strokeWidth={2.6} strokeLinecap="round" />
    <circle cx="20" cy="15.5" r="9" fill="#5e9f4b" />
    <circle cx="24.2" cy="18.8" r="5.6" className="fill-garden" />
    <circle cx="16.4" cy="12.6" r="5.4" className="fill-leaf" />
  </>
);

const PLANT = { seed: SeedShape, sprout: SproutShape, sapling: SaplingShape, tree: TreeShape };

export const PlantShape = ({ stage }: { stage: GardenStage }) => {
  const Shape = PLANT[stage];
  return <Shape />;
};

export const PlantIcon = ({ stage, ...p }: P & { stage: GardenStage }) => (
  <svg viewBox="0 0 40 40" aria-hidden {...p}>
    <PlantShape stage={stage} />
  </svg>
);

export const BackIcon = (p: P) => (
  <Line {...p}>
    <path d="m14.5 5-7 7 7 7" />
  </Line>
);

export const ChevronIcon = (p: P) => (
  <Line {...p}>
    <path d="m9.5 5 7 7-7 7" />
  </Line>
);

/** 괜찮은 항목의 초록 체크 */
export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <circle cx="12" cy="12" r="11" className="fill-garden/12" />
    <path d="m7.5 12.3 3 3 6-6.2" fill="none" className="stroke-garden" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 지금 단계 식물 배지(정원 한 줄 카드) */
export const PlantBadge = ({ stage, ...p }: P & { stage: GardenStage }) => (
  <svg viewBox="0 0 40 40" aria-hidden {...p}>
    <circle cx="20" cy="20" r="20" className="fill-leaf/15" />
    <PlantShape stage={stage} />
    <path d="M14 31h12" className="stroke-garden/50" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

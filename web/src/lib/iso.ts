// 아이소메트릭(30°) 투영과 상자 그리기 순서. 평면 좌표는 m(x 폭, y 깊이, z 높이), 화면 좌표는 px.
// 보는 사람은 x·y가 큰 쪽에 있다: 윗면, 왼쪽 면(+y 앞면), 오른쪽 면(+x 옆면)이 보인다.

export const PX_PER_M = 22;
const COS30 = Math.cos(Math.PI / 6);

export type Pt = [number, number];

export const iso = (x: number, y: number, z = 0): Pt => [
  (x - y) * COS30 * PX_PER_M,
  ((x + y) / 2 - z) * PX_PER_M,
];

export interface Box {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

/** 보이는 세 면의 꼭짓점 */
export function boxFaces({ x, y, z, w, d, h }: Box) {
  const [X, Y, Z] = [x + w, y + d, z + h];
  return {
    top: [iso(x, y, Z), iso(X, y, Z), iso(X, Y, Z), iso(x, Y, Z)],
    left: [iso(x, Y, z), iso(X, Y, z), iso(X, Y, Z), iso(x, Y, Z)],
    right: [iso(X, y, z), iso(X, Y, z), iso(X, Y, Z), iso(X, y, Z)],
  };
}

export const points = (pts: Pt[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** a가 b보다 뒤(먼저 그릴 것)인가. 서로 겹치지 않는 상자에서만 맞다 */
const behind = (a: Box, b: Box) => a.x + a.w <= b.x || a.y + a.d <= b.y || a.z + a.h <= b.z;

/**
 * 뒤에 있는 상자부터 그리는 순서. 긴 벽은 중심점 정렬로는 앞뒤가 틀리므로
 * '한쪽만 뒤'인 쌍을 간선으로 위상 정렬한다(양쪽 다 뒤면 화면에서 겹치지 않아 순서 무관).
 */
export function depthSort<T extends Box>(boxes: T[]): T[] {
  const n = boxes.length;
  const next: number[][] = boxes.map(() => []);
  const indeg = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (i !== j && behind(boxes[i], boxes[j]) && !behind(boxes[j], boxes[i])) {
        next[i].push(j);
        indeg[j]++;
      }
  const out: T[] = [];
  const done = new Array<boolean>(n).fill(false);
  while (out.length < n) {
    // 준비된 것 중 앞의 것부터. 순환이 생기면(겹친 상자) 남은 것 중 앞의 것을 그냥 낸다.
    let k = indeg.findIndex((v, i) => !done[i] && v === 0);
    if (k < 0) k = done.indexOf(false);
    done[k] = true;
    out.push(boxes[k]);
    for (const j of next[k]) indeg[j]--;
  }
  return out;
}

/** 면 음영: 어두운 갈색 쪽으로 t만큼 섞는다(윗면 0, 왼쪽 면 중간, 오른쪽 면 진하게) */
export function shade(hex: string, t: number) {
  const n = parseInt(hex.slice(1), 16);
  const to = [0x4a, 0x3f, 0x35];
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v, i) => Math.round(v + (to[i] - v) * t));
  return `rgb(${c.join(" ")})`;
}

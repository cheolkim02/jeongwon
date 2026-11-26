import { describe, expect, it } from "vitest";
import { depthSort, iso, shade, type Box } from "./iso";

const box = (x: number, y: number, w: number, d: number, h = 1, z = 0): Box => ({ x, y, z, w, d, h });

describe("아이소메트릭", () => {
  it("x는 오른쪽 아래, y는 왼쪽 아래, z는 위로 간다", () => {
    const [ox, oy] = iso(0, 0);
    const [xx, xy] = iso(1, 0);
    const [yx, yy] = iso(0, 1);
    const [, zy] = iso(0, 0, 1);
    expect([ox, oy]).toEqual([0, 0]);
    expect(xx).toBeGreaterThan(0);
    expect(xy).toBeGreaterThan(0);
    expect(yx).toBeLessThan(0);
    expect(yy).toBeCloseTo(xy, 6);
    expect(zy).toBeLessThan(0);
  });

  it("긴 벽 바로 앞의 작은 상자는 벽 다음에 그린다(중심점 정렬이 틀리는 경우)", () => {
    const wall = box(5.8, 3.33, 5.6, 0.14);
    const chair = box(6.0, 3.6, 0.5, 0.5, 0.4);
    expect(depthSort([chair, wall])).toEqual([wall, chair]);
  });

  it("뒤쪽 가구는 앞쪽 벽보다 먼저, 쌓은 상자는 아래부터", () => {
    const wall = box(0, 3.33, 11, 0.14);
    const toilet = box(6, 0.3, 0.4, 0.5, 0.4);
    const frame = box(9, 4.5, 2, 1.6, 0.3);
    const mattress = box(9, 4.5, 2, 1.6, 0.14, 0.3);
    expect(depthSort([mattress, wall, frame, toilet])).toEqual([toilet, wall, frame, mattress]);
  });

  it("음영은 진할수록 어두워진다", () => {
    expect(shade("#ffffff", 0)).toBe("rgb(255 255 255)");
    expect(shade("#ffffff", 1)).toBe("rgb(74 63 53)");
  });
});

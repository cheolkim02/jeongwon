// docs/SCREENS.md '예시 데이터' 표의 화면 표시값이 mock + calc에서 그대로 나오는지 확인한다.
import { describe, expect, it } from "vitest";
import { complex, household } from "../mock";
import {
  STAGE_LABEL,
  billForecast,
  checkupCount,
  complexProgress,
  electricityBillWon,
  electricitySaving,
  formatKwh,
  formatLiters,
  formatPercent,
  formatPines,
  formatWon,
  gardenProgress,
  leakCheck,
  monthResult,
  recentDays,
} from "./calc";

describe("SCREENS.md 예시 데이터", () => {
  it("이번 달 전기: 절약 11.1kWh, '4.1%'", () => {
    const e = electricitySaving(household);
    expect(e.savedKwh).toBeCloseTo(11.1, 6);
    expect(formatPercent(e.rate)).toBe("4.1%");
  });

  it("목표: 9.36kWh, '약 9kWh', '3%'", () => {
    const g = gardenProgress(household);
    expect(g.goalKwh).toBeCloseTo(9.36, 6);
    expect(formatKwh(g.goalKwh)).toBe("9kWh");
    expect(formatPercent(household.goalRate, 0)).toBe("3%");
  });

  it("정원 단계: '묘목', 이대로면 월말에 나무", () => {
    const g = gardenProgress(household);
    expect(STAGE_LABEL[g.stage]).toBe("묘목");
    expect(g.onTrack).toBe(true);
  });

  it("누수: '6일째', '약 8L', '약 1만 원', 새벽 3시", () => {
    const l = leakCheck(household);
    expect(l.detected).toBe(true);
    expect(l.days).toBe(6);
    expect(l.flowLph).toBeCloseTo(8.05, 6);
    expect(formatLiters(l.flowLph)).toBe("8L");
    expect(l.monthlyLossWon).toBeCloseTo(5.796 * 1700, 6);
    expect(formatWon(l.monthlyLossWon)).toBe("1만 원");
    expect(l.hour).toBe(3);
    expect(l.usualLph).toBeCloseTo(0.55, 6); // 그래프의 평소 수준(누수 전 8일 중앙값)
    expect(checkupCount(household)).toBe(1);
  });

  it("내가 키운 나무: 9월·10월 달성", () => {
    expect(household.pastMonths.filter((m) => monthResult(m).achieved).map((m) => m.month)).toEqual([9, 10]);
  });

  it("10월 카드: '5.3% 달성', '소나무 1그루'", () => {
    const m = monthResult(household.pastMonths.find((p) => p.month === 10)!);
    expect(m.savedKwh).toBeCloseTo(15.8, 6);
    expect(formatPercent(m.rate)).toBe("5.3%");
    expect(m.achieved).toBe(true);
    expect(formatPines(m.pines)).toBe("1");
    expect(formatKwh(m.savedKwh)).toBe("16kWh"); // "약 16kWh = 소나무 1그루"
    expect(formatWon(m.savedWon)).toBe("3천 원"); // 토글을 켜면 보이는 아낀 금액(2단계 214.6원 × 15.8kWh)
  });

  it("단지: '25%', '1,700그루', '420그루'", () => {
    expect(formatPercent(complexProgress(complex), 0)).toBe("25%");
    expect(formatPines(complex.goalPines)).toBe("1,700");
    expect(formatPines(complex.currentPines)).toBe("420");
  });

  it("11월 예상 요금: 월말 예상 사용량 × 단가", () => {
    const b = billForecast(household);
    const kwh = (259.3 * 30) / 26;
    expect(b.electricity).toBeCloseTo(200 * 120 + (kwh - 200) * 214.6, 6);
    expect(b.water).toBeCloseTo(((10.4 * 30) / 26) * 1700, 6);
    expect(b.heating).toBeCloseTo(((420 * 30) / 26) * 110, 6);
    expect(b.total).toBeCloseTo(b.electricity + b.water + b.heating, 6);
  });
});

describe("규칙", () => {
  it("누진 3구간", () => {
    expect(electricityBillWon(150)).toBeCloseTo(150 * 120, 6);
    expect(electricityBillWon(450)).toBeCloseTo(200 * 120 + 200 * 214.6 + 50 * 307.3, 6);
  });

  it("금액은 천 원 단위 반올림", () => {
    expect(formatWon(112_000)).toBe("11만 2천 원");
    expect(formatWon(4_600)).toBe("5천 원");
    expect(formatWon(1_204_000)).toBe("120만 4천 원");
    expect(formatWon(300)).toBe("0원");
  });

  it("소나무는 1그루 미만이면 소수 첫째 자리", () => {
    expect(formatPines(0.64)).toBe("0.6");
    expect(formatPines(1700)).toBe("1,700");
  });

  it("정원 단계 경계, 절약이 없어도 씨앗에서 멈춘다", () => {
    const at = (usedKwh: number) =>
      gardenProgress({ ...household, usageToDate: { ...household.usageToDate, electricityKwh: usedKwh } });
    // 기준선 26일분 270.4kWh, 목표 9.36kWh
    expect(at(270.4 - 9.36 * 0.29).stage).toBe("seed");
    expect(at(270.4 - 9.36 * 0.31).stage).toBe("sprout");
    expect(at(270.4 - 9.36 * 0.71).stage).toBe("sapling");
    expect(at(300).stage).toBe("seed");
    expect(at(300).barFill).toBe(0);
  });

  it("못 채운 달은 나무 목록에서 그냥 빠진다", () => {
    expect(monthResult({ year: 2026, month: 8, baselineKwh: 300, usedKwh: 297, goalRate: 0.03 }).achieved).toBe(false);
  });

  it("그래프 날짜: 기준일까지 14일, 달이 바뀌어도 맞다", () => {
    expect(recentDays(household.asOf, 14)).toEqual([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
    expect(recentDays({ year: 2026, month: 12, day: 2 }, 3)).toEqual([30, 1, 2]);
  });

  it("누수가 없으면 살펴볼 곳 0", () => {
    const quiet = { ...household, leak: { ...household.leak, nightMinFlowLph: [0.5, 0.4, 0.6] } };
    expect(leakCheck(quiet)).toMatchObject({ detected: false, days: 0, monthlyLossWon: 0 });
    expect(checkupCount(quiet)).toBe(0);
  });
});

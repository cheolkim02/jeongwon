// 화면 숫자를 만드는 계산 함수. 화면은 여기서 나온 값만 쓴다.
import * as C from "../config/constants";
import type { Complex, Household, PastMonth } from "../types";

export type GardenStage = "seed" | "sprout" | "sapling" | "tree";
export const STAGE_LABEL: Record<GardenStage, string> = {
  seed: "씨앗",
  sprout: "새싹",
  sapling: "묘목",
  tree: "나무",
};

const daysInMonth = ({ year, month }: Household["asOf"]) => new Date(year, month, 0).getDate();

function median(xs: number[]) {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** 이번 달 전기: 작년 같은 기간(기준선 × 지난 날 / 그달 날 수)보다 얼마나 덜 썼나 */
export function electricitySaving(h: Household) {
  const baselineToDate = (h.baselineKwh * h.asOf.day) / daysInMonth(h.asOf);
  const savedKwh = baselineToDate - h.usageToDate.electricityKwh;
  return { savedKwh, rate: savedKwh / baselineToDate };
}

/** 정원: 목표량, 단계, 월말에 나무가 될지, 진행 바 위치(0~1) */
export function gardenProgress(h: Household) {
  const { savedKwh, rate } = electricitySaving(h);
  const goalKwh = h.baselineKwh * h.goalRate;
  const ratio = savedKwh / goalKwh;
  // 나무는 월말 달성이 확정될 때만 되므로 이번 달은 묘목까지. 줄어드는 단계는 없다.
  const stage: GardenStage =
    ratio < C.GARDEN_STAGE_BELOW.seed ? "seed" : ratio < C.GARDEN_STAGE_BELOW.sprout ? "sprout" : "sapling";
  const bar = (r: number) => Math.min(Math.max(r / C.GARDEN_BAR_MAX_RATE, 0), 1);
  return { savedKwh, rate, goalKwh, stage, onTrack: rate >= h.goalRate, barFill: bar(rate), barGoal: bar(h.goalRate) };
}

/** 누수: 끝에서부터 임계치를 넘은 연속 일수, 그 기간 중앙값 유량, 그 전의 평소 수준, 이대로 한 달 흐를 때 손실액 */
export function leakCheck(h: Household) {
  const flows = h.leak.nightMinFlowLph;
  let days = 0;
  while (days < flows.length && flows[flows.length - 1 - days] > C.LEAK_THRESHOLD_LPH) days++;
  const flowLph = days ? median(flows.slice(-days)) : 0;
  const before = flows.slice(0, flows.length - days);
  const usualLph = before.length ? median(before) : 0;
  const monthlyM3 = (flowLph * 24 * daysInMonth(h.asOf)) / 1000;
  return {
    detected: days >= C.LEAK_MIN_DAYS,
    days,
    flowLph,
    usualLph,
    hour: h.leak.minFlowHour,
    monthlyLossWon: monthlyM3 * C.WATER_WON_PER_M3,
  };
}

/** 기준일까지 최근 n일의 날짜(일). 오래된 날부터 */
export const recentDays = ({ year, month, day }: Household["asOf"], n: number) =>
  Array.from({ length: n }, (_, i) => new Date(year, month - 1, day - (n - 1 - i)).getDate());

/** 미니어처에서 살펴볼 곳 개수 */
export const checkupCount = (h: Household) => [leakCheck(h).detected].filter(Boolean).length;

/** 주택용 누진 전력량요금(원) */
export function electricityBillWon(kwh: number) {
  let won = 0;
  let prev = 0;
  for (const t of C.ELECTRICITY_TIERS) {
    won += Math.max(0, Math.min(kwh, t.upToKwh) - prev) * t.wonPerKwh;
    prev = t.upToKwh;
  }
  return won;
}

/** 이번 달 예상 요금: 기준일까지 사용량을 그달 날 수로 늘려 요금으로 바꾼다 */
export function billForecast(h: Household) {
  const scale = daysInMonth(h.asOf) / h.asOf.day;
  const u = h.usageToDate;
  const electricity = electricityBillWon(u.electricityKwh * scale);
  const water = u.waterM3 * scale * C.WATER_WON_PER_M3;
  const heating = u.heatingMcal * scale * C.HEATING_WON_PER_MCAL;
  return { electricity, water, heating, total: electricity + water + heating };
}

/** 지난달 결과: 절약량, 절약률, 달성 여부, 소나무 환산, 아낀 전기요금(누진 반영) */
export function monthResult(m: PastMonth) {
  const savedKwh = m.baselineKwh - m.usedKwh;
  const rate = savedKwh / m.baselineKwh;
  return {
    savedKwh,
    rate,
    achieved: rate >= m.goalRate,
    pines: savedKwh / C.KWH_PER_PINE,
    savedWon: electricityBillWon(m.baselineKwh) - electricityBillWon(m.usedKwh),
  };
}

/** 단지 정원 진행률 */
export const complexProgress = (c: Complex) => c.currentPines / c.goalPines;

// ---- 표시 형식 ('약'은 문구 쪽에서 붙인다) ----

/** 천 원 단위 반올림: 9,853 → "1만 원", 112,000 → "11만 2천 원" */
export function formatWon(won: number) {
  const k = Math.round(won / 1000);
  const man = Math.floor(k / 10);
  const cheon = k % 10;
  const s = [man && `${man.toLocaleString("ko-KR")}만`, cheon && `${cheon}천`].filter(Boolean).join(" ");
  return s ? `${s} 원` : "0원";
}

/** 퍼센트, 기본 소수 첫째 자리: 0.04105 → "4.1%" */
export const formatPercent = (rate: number, digits = 1) => `${(rate * 100).toFixed(digits)}%`;

export const formatKwh = (kwh: number) => `${Math.round(kwh)}kWh`;
export const formatLiters = (l: number) => `${Math.round(l)}L`;

/** 소나무: 1그루 이상이면 정수, 미만이면 소수 첫째 자리. 반올림해 1.0이 되면(0.999) "1"로 쓴다 */
export function formatPines(n: number) {
  const r = Math.round(n * 10) / 10;
  return r >= 1 ? Math.round(n).toLocaleString("ko-KR") : r.toFixed(1);
}

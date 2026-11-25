// 예시 데이터(입력값만). 값은 docs/SCREENS.md '예시 데이터' 표를 따른다.
import type { Complex, Household } from "../types";

export const household: Household = {
  asOf: { year: 2026, month: 11, day: 26 },
  baselineKwh: 312,
  usageToDate: { electricityKwh: 259.3, waterM3: 10.4, heatingMcal: 420 },
  goalRate: 0.03,
  leak: {
    nightMinFlowLph: [0.6, 0.4, 0.8, 0.5, 0.7, 0.3, 0.6, 0.5, 7.8, 8.2, 8.1, 7.9, 8.0, 8.3],
    minFlowHour: 3,
  },
  pastMonths: [{ year: 2026, month: 10, baselineKwh: 300, usedKwh: 284.2, goalRate: 0.03 }],
};

export const complex: Complex = {
  households: 1024,
  participatingHouseholds: 640,
  goalPines: 1700,
  currentPines: 420,
  pinesThisWeek: 96,
};

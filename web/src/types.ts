// 화면이 읽는 데이터 형태. Phase 2 파이프라인 JSON도 이 형태를 따른다. 입력값만 담고, 화면 숫자는 lib/calc가 만든다.

/** 지난달 전기 사용 결과 */
export interface PastMonth {
  year: number;
  month: number;
  /** 작년 같은 달 전기 사용량(날씨 보정 후), kWh */
  baselineKwh: number;
  usedKwh: number;
  /** 그달의 절약 목표 */
  goalRate: number;
}

export interface Household {
  /** 기준일(화면의 '오늘') */
  asOf: { year: number; month: number; day: number };
  /** 작년 같은 달 전기 사용량(날씨 보정 후, 한 달 전체), kWh */
  baselineKwh: number;
  /** 이번 달 기준일까지 누적 사용량 */
  usageToDate: { electricityKwh: number; waterM3: number; heatingMcal: number };
  /** 이번 달 절약 목표(0.03 = 3%) */
  goalRate: number;
  leak: {
    /** 최근 14일 새벽 최소 유량, L/시간. 오래된 날부터 */
    nightMinFlowLph: number[];
    /** 최소 유량이 나온 시각(0~23시) */
    minFlowHour: number;
  };
  /** 지난달들, 오래된 달부터 */
  pastMonths: PastMonth[];
}

/** 단지 전체 합계(10세대 이상 집계만) */
export interface Complex {
  households: number;
  participatingHouseholds: number;
  /** 이번 겨울 목표 소나무 그루 수 */
  goalPines: number;
  currentPines: number;
  pinesThisWeek: number;
}

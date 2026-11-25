// 요금 단가·환산 계수·임계치. 값마다 출처 또는 TODO를 적는다.

// 전기 주택용 누진(2026, 기타계절) 전력량요금, 원/kWh. 출처: 한전 전기요금표.
// Phase 1은 전력량요금만 계산한다. TODO: 기본요금·기후환경요금·연료비조정요금·부가세·전력기금
export const ELECTRICITY_TIERS = [
  { upToKwh: 200, wonPerKwh: 120 },
  { upToKwh: 400, wonPerKwh: 214.6 },
  { upToKwh: Infinity, wonPerKwh: 307.3 }, // TODO: 3단계 임시값(2025 요금표), 공식 요금표 확인
];

// TODO: 임시값. 서울 상수도+하수도+물이용부담금 공식 요금표 확인
export const WATER_WON_PER_M3 = 1700;

// TODO: 임시값. 지역난방 주택용 사용요금 공식 요금표 확인(기본요금 제외)
export const HEATING_WON_PER_MCAL = 110;

// 30년생 소나무 1그루 연간 CO2 흡수량, kg. 출처: 국립산림과학원(2012)
export const PINE_CO2_KG_PER_YEAR = 6.6;
// 전력 배출계수, kgCO2/kWh. 출처: 2023년 국가 전력배출계수(2025.12 공표)
export const GRID_KG_CO2_PER_KWH = 0.4173;
// 약 15.82kWh당 소나무 1그루·1년
export const KWH_PER_PINE = PINE_CO2_KG_PER_YEAR / GRID_KG_CO2_PER_KWH;

// TODO: 임시값. 누수 의심 기준 — 새벽 최소 유량(L/시간)과 연속 일수
export const LEAK_THRESHOLD_LPH = 2;
export const LEAK_MIN_DAYS = 3;

// 정원 단계: 절약량 ÷ 목표량이 이 값 미만이면 그 단계. 나무는 월말 달성 확정 때만.
export const GARDEN_STAGE_BELOW = { seed: 0.3, sprout: 0.7 };

// 정원 진행 바의 끝 = 고를 수 있는 가장 높은 목표(5%)
export const GARDEN_BAR_MAX_RATE = 0.05;

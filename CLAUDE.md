# 정원 (Jeongwon) — 해커톤 프로토타입

새는 돈은 찾아 주고, 아낀 만큼은 정원으로 키워 주는 AI 에너지 비서.
SVC Seoul AI 해커톤(with 현대건설) 지정과제 3 출품용, 1인 개발. 참가신청 마감 2026-11-29.

## 지금 단계: Phase 1 화면 시안
- 기능 없이 "앱을 켰을 때 어떻게 보이는지"를 만든다. 결과물은 신청서에 붙일 스크린샷과 GitHub 레포.
- 기준 문서: docs/SCREENS.md(화면·문구·디자인·예시 데이터). 작업 순서: docs/PLAN.md — 한 세션에 슬라이스 하나.
- Phase 2(신청 후): 합성 데이터로 실제 계산을 붙인다. 요구사항은 docs/SPEC_P0.md. 지금은 만들지 않는다.

## 구조
- web/: Next.js(App Router) + TypeScript + Tailwind
  - web/src/types.ts: 화면이 읽는 데이터 형태. Phase 2 파이프라인 JSON도 이 형태를 따른다
  - web/src/mock/: 예시 데이터(입력값만). floorplan.ts는 84㎡ 평면(방·벽·가구, m 단위)
  - web/src/lib/calc.ts: 화면 숫자를 만드는 계산 함수. iso.ts는 아이소메트릭 투영·그리기 순서·음영
  - web/src/config/constants.ts: 요금 단가·환산 계수·임계치(출처 또는 TODO 주석)
  - web/src/app/globals.css: 디자인 토큰(`@theme`: bg-paper, text-ink, rounded-card, px-gutter, `card` 등)
  - web/src/components/: 공통 요소(하단 탭바 + '예시 데이터' 표기, 직접 그린 SVG 아이콘, 우리 집 미니어처)
- docs/screenshots/: `npm run shots` 결과(커밋한다)
- pipeline/: Phase 2에서 만든다(Python)

## 명령
- 설치: `cd web && npm install` (내 컴퓨터에서 처음 한 번 `npx playwright install chromium`)
- 개발 서버: `cd web && npm run dev` → http://localhost:3000
- 검증: `cd web && npm run lint && npm run test && npm run build`
- 스크린샷: `cd web && npm run shots` — 빌드 후 운영 서버로 찍는다. 아직 없는 화면(404)은 건너뛴다

## 절대 규칙
- IMPORTANT: 화면의 숫자는 mock 입력값을 calc 함수로 계산한 결과만 쓴다. 문구에 숫자를 손으로 적지 않는다. (Phase 2에서 LLM을 붙여도 LLM은 계산 결과를 설명만 하고 숫자를 만들지 않는다.)
- 모든 화면 맨 아래에 "예시 데이터"라고 표시한다.
- 순위·등수를 어디에도 표시하지 않는다. 정원은 내 목표로만 자라고, 시들거나 줄지 않는다.
- 점검 표시는 빨간 경고가 아니라 따뜻한 빛으로 한다. 사용자를 탓하는 말투를 쓰지 않는다.
- 세대 사용량을 가전별로 쪼개 추정해 보여주지 않는다. 미니어처 하이라이트는 '가장 의심되는 점검 위치'일 뿐이다.
- 다른 세대 숫자는 10세대 이상 집계로만 보여 준다. 공유 카드에 동·호수와 날짜·시간대 정보를 넣지 않는다.
- 힐스테이트·my HILLS 등 실제 브랜드의 로고·이미지를 쓰지 않는다. 연동은 버튼 문구로만 표현한다.
- 외부 이미지를 가져다 쓰지 않는다. 그림은 SVG로 직접 그린다. 글꼴은 Pretendard(OFL).

## 작업 방식
- 슬라이스마다: 계획 → 구현 → 검증 명령 통과 → `npm run shots` → 스크린샷을 직접 열어 SCREENS.md의 완료 기준과 대조하고 고친다 → 커밋.
- UI 문구는 SCREENS.md에 적힌 것을 쓰고, 없으면 같은 말투(해요체, 생활 표현)로 쓴다.

@AGENTS.md
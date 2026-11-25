# 세션 프롬프트

## 첫 세션(V0) — plan mode에서 붙여넣기

CLAUDE.md, docs/SCREENS.md, docs/PLAN.md를 읽어줘. 이번 세션은 PLAN.md의 V0만 한다. 기능 없이 화면 시안을 만드는 단계다.

1. web/에 Next.js(App Router, TypeScript, Tailwind) 골격을 만들고 Pretendard 글꼴을 넣어 줘. SCREENS.md '디자인 방향'의 색·모서리·여백을 디자인 토큰으로 정의해 줘.
2. 휴대폰 폭(390px) 공통 레이아웃: 하단 탭바 4개, 화면 맨 아래 '예시 데이터' 표기.
3. web/src/types.ts, web/src/mock/, web/src/config/constants.ts, web/src/lib/calc.ts를 만들고, SCREENS.md '예시 데이터' 표의 화면 표시값이 그대로 나오는지 vitest로 확인해 줘. 임시 단가에는 TODO 주석을 달아 줘.
4. ① 홈 화면 뼈대: 인사 문구, 미니어처 자리(빈 상자), 이번 달 카드, 정원 한 줄 카드. 미니어처 그림은 다음 슬라이스(V1)에서 한다.
5. Playwright로 `npm run shots` 스크립트: SCREENS.md '스크린샷 목록'의 경로를 390×844, 배율 3으로 찍어 docs/screenshots/에 저장. 아직 없는 화면은 건너뛴다.
6. CLAUDE.md의 '명령' 섹션을 실제로 동작하는 명령으로 갱신해 줘.

스택에 더 나은 대안이 있으면 이유와 함께 제안해 줘. 계획을 먼저 보여 주고, 내가 승인하면 진행해. 끝나면 lint·test·build 결과를 보여 주고, 01_home.png를 직접 열어 확인한 내용을 알려 준 뒤 커밋해 줘.

## 다음 세션부터(V1~V4) — /clear 후 plan mode에서

CLAUDE.md, docs/SCREENS.md, docs/PLAN.md를 읽고 PLAN.md의 V○만 해줘. 계획을 먼저 보여 주고, 내가 승인하면 진행해. 끝나면 검증 명령과 `npm run shots`를 돌리고, 해당 화면 스크린샷을 직접 열어 SCREENS.md 완료 기준과 대조해 고친 뒤, 결과 스크린샷을 보여 주고 커밋해 줘.

V1에는 이 문장을 덧붙인다: 미니어처는 그림 방향이 가장 중요하니, 먼저 방 배치와 그림체를 간단히 그려 스크린샷으로 보여 주고, 내가 확인한 뒤에 다듬어 줘.
(마음에 드는 아이소메트릭 방 그림이 있으면 프롬프트에 이미지로 함께 붙여 넣는다.)

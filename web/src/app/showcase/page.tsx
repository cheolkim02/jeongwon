import type { Metadata } from "next";

export const metadata: Metadata = { title: "정원 · 모아 보기" };

// 실제 화면을 iframe으로 띄워 줄인다: 개별 화면을 고치면 모아 보기도 그대로 따라간다
const SCREENS = [
  { label: "① 우리 집", src: "/", caption: "살펴볼 곳이 빛나는 우리 집" },
  { label: "② 검진 상세", src: "/checkup/leak", caption: "새는 곳과 새는 돈을 알려 줘요" },
  { label: "③ 정원", src: "/garden", caption: "내 목표로 자라는 정원" },
  { label: "④ 정원 카드", src: "/garden/card", caption: "자랑하고 싶은 정원 카드" },
];
const PHONE = { w: 390, h: 844 };
const SCALE = 0.82;

// 모아 보기(1920×1080): 화면을 모은 한 장
export default function ShowcasePage() {
  return (
    <main className="mx-auto flex h-[1080px] w-[1920px] flex-col px-24 pt-14 pb-7">
      <header>
        <p className="text-[60px] leading-none font-bold tracking-tight text-garden">정원</p>
        <p className="mt-4 text-[28px] font-semibold tracking-tight">
          새는 돈은 찾아 주고, 아낀 만큼은 정원으로 키워 주는 AI 에너지 비서
        </p>
      </header>

      <ul className="mt-auto flex justify-between">
        {SCREENS.map((s) => (
          <li key={s.src} className="flex flex-col items-center">
            {/* 휴대폰 틀: 실제 기종을 흉내 내지 않는 단순한 둥근 사각형 */}
            <div className="rounded-[46px] bg-ink p-2.5 shadow-[0_24px_60px_rgb(35_38_31/0.18)]">
              <div className="overflow-hidden rounded-[36px]" style={{ width: PHONE.w * SCALE, height: PHONE.h * SCALE }}>
                <iframe
                  src={s.src}
                  title={`${s.label} 화면`}
                  width={PHONE.w}
                  height={PHONE.h}
                  className="origin-top-left border-0"
                  style={{ transform: `scale(${SCALE})` }}
                />
              </div>
            </div>
            <p className="mt-5 text-lg font-semibold text-ink-soft">{s.label}</p>
            <p className="mt-0.5 text-[26px] font-bold tracking-tight">{s.caption}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-base text-ink-soft">예시 데이터 · 정원 프로토타입</p>
    </main>
  );
}

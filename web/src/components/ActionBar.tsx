/** 모든 화면 맨 아래의 '예시 데이터' 표기 */
export const Footnote = () => (
  <p className="pb-2.5 text-center text-[10px] text-ink-soft">예시 데이터 · 정원 프로토타입</p>
);

/** 상세 화면 하단: 탭바 자리에 버튼 줄 + '예시 데이터' */
export default function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 mx-auto flex h-tabbar max-w-phone flex-col justify-end gap-2 border-t border-ink/5 bg-paper px-gutter pt-2.5">
      <div className="flex gap-2">{children}</div>
      <Footnote />
    </div>
  );
}

import BottomBar from "@/components/BottomBar";

// 탭 화면: 휴대폰 폭 + 하단 탭바
export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-phone pb-tabbar">{children}</div>
      <BottomBar />
    </>
  );
}

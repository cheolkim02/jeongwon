// 상세 화면: 휴대폰 폭. 하단에는 탭바 대신 화면마다 ActionBar(버튼 + '예시 데이터')
export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-phone pb-tabbar">{children}</div>;
}

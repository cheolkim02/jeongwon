import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Pretendard(OFL), 라이선스는 ./fonts/Pretendard-LICENSE.txt
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  weight: "45 920",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "정원",
  description: "새는 돈은 찾아 주고, 아낀 만큼은 정원으로 키워 주는 AI 에너지 비서",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="bg-paper font-sans break-keep text-ink antialiased">{children}</body>
    </html>
  );
}

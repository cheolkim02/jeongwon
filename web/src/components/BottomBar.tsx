"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Footnote } from "./ActionBar";
import { CheckupIcon, ComplexIcon, GardenIcon, HomeIcon } from "./icons";

const TABS = [
  { href: "/", label: "우리 집", Icon: HomeIcon },
  { href: "/checkup", label: "검진", Icon: CheckupIcon },
  { href: "/garden", label: "정원", Icon: GardenIcon },
  { href: "/complex", label: "단지", Icon: ComplexIcon },
];

/** 하단 탭바 4개와 모든 화면 맨 아래의 '예시 데이터' 표기 */
export default function BottomBar() {
  const path = usePathname();
  return (
    <div className="fixed inset-x-0 bottom-0 mx-auto flex h-tabbar max-w-phone flex-col border-t border-ink/5 bg-paper">
      <nav aria-label="주요 화면" className="grid flex-1 grid-cols-4">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active ? "text-garden" : "text-ink-soft"}`}
            >
              <Icon className="size-6" />
              {label}
            </Link>
          );
        })}
      </nav>
      <Footnote />
    </div>
  );
}

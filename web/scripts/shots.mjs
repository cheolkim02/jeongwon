// docs/SCREENS.md '스크린샷 목록'을 찍어 docs/screenshots/에 저장한다. `npm run shots`가 빌드 후 실행한다.
// 운영 서버로 찍는 이유: 개발 서버는 구석에 개발 표시 배지가 찍힌다. 아직 없는 화면(404)은 건너뛴다.
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const PORT = 3123;
const BASE = `http://localhost:${PORT}`;
const OUT = fileURLToPath(new URL("../../docs/screenshots/", import.meta.url));
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 };
const SHOTS = [
  ["00_showcase", "/showcase", { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 }],
  ["01_home", "/", PHONE],
  ["02_checkup_leak", "/checkup/leak", PHONE],
  ["03_garden", "/garden", PHONE],
  ["04_card", "/garden/card", PHONE],
  ["05_complex", "/complex", PHONE],
  ["06_goal", "/garden/goal", PHONE],
];

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
  cwd: fileURLToPath(new URL("..", import.meta.url)),
  stdio: ["ignore", "ignore", "inherit"],
});

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error("next start가 종료됐어요. `npm run build`를 먼저 했는지 확인하세요.");
    try {
      await fetch(BASE);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error("서버가 30초 안에 뜨지 않았어요.");
}

let browser;
try {
  await waitForServer();
  await mkdir(OUT, { recursive: true });
  browser = await chromium.launch();
  for (const [name, path, opts] of SHOTS) {
    const page = await browser.newPage(opts);
    const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
    if (res?.status() === 404) {
      console.log(`건너뜀  ${name}  (${path} 아직 없음)`);
    } else {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${OUT}${name}.png` });
      console.log(`저장    ${name}.png  (${path})`);
    }
    await page.close();
  }
} finally {
  await browser?.close();
  server.kill();
}

import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import {
  CV,
  EDUCATION,
  EXPERIENCE,
  KEYWORDS,
  FEATURED,
  SKILLS,
  UI,
  type Lang,
} from "../src/content.ts";

const CHROME =
  process.env.CHROME ?? "/Applications/chrome.app/Contents/MacOS/Google Chrome";
const PUBLIC = `${import.meta.dir}/../public`;
const PHONE = "+82 10-8173-7778";
const EMAIL = "worknadir95@gmail.com";
const LINKS = ["glasscube.uz", "linkedin.com/in/nodirbek-bokiev", "github.com/nodiry"];

const month = (ym: string, lang: Lang) =>
  new Date(`${ym}-01T00:00`).toLocaleDateString(lang, { year: "numeric", month: "short" });
const dot = (ym: string) => ym.replace("-", ".");
const host = (url: string) => url.replace(/^https?:\/\//, "");
const stack = (items: string[]) => `<p class="stack">${items.join(" · ")}</p>`;

const page = (title: string, body: string) => `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Sans+KR:wght@400;600&family=IBM+Plex+Mono&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 11mm 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 9.4pt/1.45 "IBM Plex Sans", "IBM Plex Sans KR", sans-serif; color: #15171a; }
  h1 { font-size: 22pt; margin: 0; letter-spacing: -0.02em; }
  h2 { font: 600 8pt "IBM Plex Mono", monospace; letter-spacing: 0.12em; text-transform: uppercase; color: #c2410c; border-bottom: 1px solid #15171a; padding-bottom: 2pt; margin: 10pt 0 4pt; }
  h3 { font-size: 10pt; margin: 0; }
  p, ul { margin: 0; }
  ul { padding-left: 13pt; }
  li::marker { color: #c2410c; }
  a { color: inherit; text-decoration: none; }
  .accent { color: #c2410c; font-weight: 600; }
  .muted, .stack { color: #5b5f66; }
  .stack { font: 7.6pt "IBM Plex Mono", monospace; margin-top: 2pt; }
  .row { display: flex; justify-content: space-between; gap: 12pt; align-items: baseline; }
  .item { margin-top: 6pt; break-inside: avoid; }
  .skills { display: grid; grid-template-columns: 30mm 1fr; gap: 2pt 8pt; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #9aa1ab; padding: 4pt 6pt; vertical-align: middle; text-align: left; }
  th { background: #efede6; text-align: center; white-space: nowrap; }
  tr { break-inside: avoid; }
</style></head><body>${body}</body></html>`;

function english() {
  const lang: Lang = "en";
  return page(
    `${UI.name.en} CV`,
    `
    <h1>${UI.name.en}</h1>
    <p class="accent" style="font-size:11pt">${UI.title.en} | ${KEYWORDS.join(" · ")}</p>
    <p class="muted">Busan, South Korea | ${PHONE} | ${EMAIL}</p>
    <p class="muted">${LINKS.join(" | ")}</p>

    <h2>${UI.experience.en}</h2>
    ${EXPERIENCE.map(
      (job) => `<div class="item">
        <div class="row"><h3>${job.role.en} · ${job.company}</h3>
          <span class="muted">${month(job.start, lang)} – ${job.end ? month(job.end, lang) : UI.present.en}</span></div>
        <p class="muted">${job.type.en} · ${job.place.en}</p>
        <ul>${job.bullets.map((b) => `<li>${b.en}</li>`).join("")}</ul>
        ${stack(job.stack)}
      </div>`,
    ).join("")}

    <h2>${UI.work.en}</h2>
    ${FEATURED.map(
      (p) => `<div class="item">
        <div class="row"><h3>${p.name} <span class="accent" style="font-size:8.5pt">· ${p.tag.en}</span></h3>
          <span class="muted">${host(p.demo ?? p.github)}</span></div>
        <p>${p.description.en}</p>
        ${stack(p.stack)}
      </div>`,
    ).join("")}

    <h2>${UI.skills.en}</h2>
    <div class="skills">${SKILLS.map(
      (s) => `<b>${s.title.en}</b><span>${s.items.join(", ")}</span>`,
    ).join("")}</div>

    <h2>${UI.education.en} & Languages</h2>
    <div class="row"><h3>${EDUCATION.school.en} · ${EDUCATION.degree.en}</h3>
      <span class="muted">${EDUCATION.place.en} · ${EDUCATION.start} – ${EDUCATION.end}</span></div>
    <p>Korean: intermediate</p>`,
  );
}

async function korean() {
  const photo = Buffer.from(await Bun.file(`${import.meta.dir}/cv-photo.jpg`).arrayBuffer()).toString("base64");
  const info: [string, string][] = [
    ["성명", `${UI.name.ko} (${UI.name.en})`],
    ["지원분야", `${UI.title.ko} (결제 · Web3 · AI)`],
    ["연락처", PHONE],
    ["이메일", EMAIL],
    ["주소", "부산광역시 사상구"],
    ["포트폴리오", LINKS.join("<br>")],
  ];
  const head = (labels: string[]) => `<tr>${labels.map((l) => `<th>${l}</th>`).join("")}</tr>`;
  const section = (title: string, table: string) =>
    `<h3 style="margin:14pt 0 5pt;font-size:11pt">■ ${title}</h3><table>${table}</table>`;

  return page(
    `${UI.name.ko} 이력서`,
    `
    <h1 style="text-align:center;letter-spacing:0.5em;margin-bottom:12pt">이력서</h1>
    <table>
      ${info
        .map(
          ([label, value], i) => `<tr>
          ${i === 0 ? `<td rowspan="${info.length}" style="width:32mm;text-align:center"><img src="data:image/jpeg;base64,${photo}" style="width:28mm;height:37mm;object-fit:cover"></td>` : ""}
          <th style="width:26mm">${label}</th><td>${value}</td></tr>`,
        )
        .join("")}
    </table>

    ${section(
      "학력사항",
      `${head(["기간", "학교명", "전공", "소재지"])}
      <tr><td>${EDUCATION.start} ~ ${EDUCATION.end}</td><td>${EDUCATION.school.ko}</td><td>${EDUCATION.degree.ko}</td><td>${EDUCATION.place.ko}</td></tr>`,
    )}

    ${section(
      "경력사항",
      `${head(["근무기간", "회사명", "직무", "형태", "담당업무"])}
      ${EXPERIENCE.map(
        (job) => `<tr>
          <td style="white-space:nowrap">${dot(job.start)} ~ ${job.end ? dot(job.end) : UI.present.ko}</td>
          <td>${job.company}</td><td>${job.role.ko}</td><td style="white-space:nowrap">${job.type.ko}</td>
          <td><ul>${job.bullets.map((b) => `<li>${b.ko}</li>`).join("")}</ul>${stack(job.stack)}</td></tr>`,
      ).join("")}`,
    )}

    ${section(
      "주요 프로젝트",
      `${head(["프로젝트", "내용", "기술"])}
      ${FEATURED.map(
        (p) => `<tr>
          <td style="white-space:nowrap"><b>${p.name}</b><br><span class="accent" style="font-size:8pt">${p.tag.ko}</span></td>
          <td>${p.description.ko}<br><span class="muted" style="font-size:8pt">${host(p.demo ?? p.github)}</span></td>
          <td style="font-size:8pt">${p.stack.join(", ")}</td></tr>`,
      ).join("")}`,
    )}

    ${section(
      "보유 기술",
      SKILLS.map((s) => `<tr><th style="width:32mm">${s.title.ko}</th><td>${s.items.join(", ")}</td></tr>`).join(""),
    )}

    ${section("어학", `<tr><th style="width:32mm">한국어</th><td>중급</td></tr>`)}

    <p style="text-align:center;margin-top:22pt">위의 기재 사항은 사실과 다름없음을 확인합니다.</p>
    <p style="text-align:center;margin-top:8pt">${new Date().toLocaleDateString("ko", { year: "numeric", month: "long", day: "numeric" })}</p>
    <p style="text-align:right;margin-top:8pt">작성자: ${UI.name.ko} (인)</p>`,
  );
}

async function pdf(html: string, out: string) {
  const file = `${tmpdir()}/cv-${crypto.randomUUID()}.html`;
  await Bun.write(file, html);
  const proc = Bun.spawn([
    CHROME,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--virtual-time-budget=10000",
    `--print-to-pdf=${PUBLIC}${out}`,
    `file://${file}`,
  ], { stdout: "ignore", stderr: "ignore" });
  await proc.exited;
  console.log(`written ${out}`);
}

await mkdir(`${PUBLIC}/cv`, { recursive: true });
await pdf(english(), CV.en);
await pdf(await korean(), CV.ko);

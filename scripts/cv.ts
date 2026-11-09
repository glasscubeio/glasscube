import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  TableLayoutType,
  TabStopType,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import {
  EDUCATION,
  EXPERIENCE,
  KEYWORDS,
  PROJECTS,
  SKILLS,
  UI,
  type Lang,
} from "../src/content.ts";

const OUT = `${import.meta.dir}/../public/cv`;
const PHONE = "+82 10-8173-7778";
const EMAIL = "worknadir95@gmail.com";
const LINKS = ["glasscube.uz", "linkedin.com/in/nodirbek-bokiev", "github.com/nodiry"];
const ACCENT = "C2410C";
const MUTED = "5B5F66";
const A4 = { width: 11906, height: 16838 };
const MARGIN = 720;
const WIDTH = A4.width - MARGIN * 2;

const month = (ym: string, lang: Lang) =>
  new Date(`${ym}-01T00:00`).toLocaleDateString(lang === "ko" ? "ko" : "en", {
    year: "numeric",
    month: "short",
  });
const dot = (ym: string) => ym.replace("-", ".");
const host = (url: string) => url.replace(/^https?:\/\//, "");

let font = "Arial";
const run = (text: string, opts: Record<string, unknown> = {}) =>
  new TextRun({ text, font, ...opts });

const bullet = (text: string) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 30 },
    children: [run(text)],
  });

const heading = (text: string) =>
  new Paragraph({
    spacing: { before: 160, after: 60 },
    keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "15171A", space: 2 } },
    children: [run(text.toUpperCase(), { bold: true, size: 18, color: ACCENT, characterSpacing: 40 })],
  });

const rightTab = (left: TextRun[], right: string) =>
  new Paragraph({
    keepNext: true,
    spacing: { before: 120 },
    tabStops: [{ type: TabStopType.RIGHT, position: WIDTH }],
    children: [
      ...left,
      run(`\t${right}`, { color: MUTED }),
    ],
  });

const doc = (children: (Paragraph | Table)[]) =>
  new Document({
    styles: { default: { document: { run: { font, size: 19 } } } },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 300, hanging: 220 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { size: A4, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
        children,
      },
    ],
  });

function english() {
  const lang: Lang = "en";
  font = "Arial";
  return doc([
    new Paragraph({ children: [run(UI.name.en, { bold: true, size: 44 })] }),
    new Paragraph({
      spacing: { after: 40 },
      children: [run(`${UI.title.en}  |  ${KEYWORDS.join(" · ")}`, { size: 22, color: ACCENT, bold: true })],
    }),
    new Paragraph({
      children: [run(["Busan, South Korea", PHONE, EMAIL].join("  |  "), { color: MUTED, size: 18 })],
    }),
    new Paragraph({ children: [run(LINKS.join("  |  "), { color: MUTED, size: 18 })] }),

    heading(UI.experience.en),
    ...EXPERIENCE.flatMap((job) => [
      rightTab(
        [run(job.role.en, { bold: true }), run(`  ·  ${job.company}`, { bold: true })],
        `${month(job.start, lang)} – ${job.end ? month(job.end, lang) : UI.present.en}`,
      ),
      new Paragraph({
        keepNext: true,
        spacing: { after: 40 },
        children: [run(`${job.type.en} · ${job.place.en}`, { color: MUTED, size: 18 })],
      }),
      ...job.bullets.map((b) => bullet(b.en)),
      new Paragraph({ children: [run(job.stack.join(" · "), { color: MUTED, size: 17 })] }),
    ]),

    heading(UI.work.en),
    ...PROJECTS.flatMap((p) => [
      rightTab(
        [run(p.name, { bold: true }), run(`  ·  ${p.tag.en}`, { color: ACCENT, size: 18 })],
        host(p.demo),
      ),
      new Paragraph({ children: [run(p.description.en)] }),
      new Paragraph({ children: [run(p.stack.join(" · "), { color: MUTED, size: 17 })] }),
    ]),

    heading(UI.skills.en),
    ...SKILLS.map(
      (s) =>
        new Paragraph({
          spacing: { after: 30 },
          children: [run(`${s.title.en}: `, { bold: true }), run(s.items.join(", "))],
        }),
    ),

    heading(UI.education.en),
    rightTab(
      [run(`${EDUCATION.school.en}  ·  ${EDUCATION.degree.en}`, { bold: true })],
      `${EDUCATION.place.en} · ${EDUCATION.start} – ${EDUCATION.end}`,
    ),

    heading("Languages"),
    new Paragraph({ children: [run("Korean: intermediate")] }),
  ]);
}

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "9AA1AB" };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const cell = (
  content: string | Paragraph[],
  width: number,
  opts: { head?: boolean } = {},
) =>
  new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    shading: opts.head ? { type: ShadingType.CLEAR, fill: "EFEDE6", color: "auto" } : undefined,
    children:
      typeof content === "string"
        ? [
            new Paragraph({
              alignment: opts.head ? AlignmentType.CENTER : AlignmentType.LEFT,
              children: [run(content, { bold: opts.head })],
            }),
          ]
        : content,
  });

const table = (widths: number[], rows: TableRow[]) =>
  new Table({
    width: { size: WIDTH, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    rows,
  });

const headRow = (labels: string[], widths: number[]) =>
  new TableRow({ tableHeader: true, children: labels.map((l, i) => cell(l, widths[i], { head: true })) });

const koHeading = (text: string) =>
  new Paragraph({
    spacing: { before: 280, after: 100 },
    keepNext: true,
    children: [run(`■ ${text}`, { bold: true, size: 24 })],
  });

async function korean() {
  const photo = await Bun.file(`${import.meta.dir}/cv-photo.jpg`).arrayBuffer();
  const photoW = 1900;
  const labelW = 1400;
  const info: [string, string][] = [
    ["성명", `${UI.name.ko} (${UI.name.en})`],
    ["지원분야", `${UI.title.ko} (결제 · Web3)`],
    ["연락처", PHONE],
    ["이메일", EMAIL],
    ["주소", "부산광역시 사상구"],
    ...LINKS.map((l, i): [string, string] => [i === 0 ? "포트폴리오" : "", l]),
  ];

  const expW = [1500, 1500, 1500, 1100, WIDTH - 5600];
  const projW = [1800, WIDTH - 1800 - 2600, 2600];
  const skillW = [2200, WIDTH - 2200];
  const eduW = [2000, 2600, 2400, WIDTH - 7000];

  font = "Malgun Gothic";
  return doc([
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [run("이 력 서", { bold: true, size: 40, characterSpacing: 200 })],
    }),
    table([photoW, WIDTH - photoW], [
      new TableRow({
        children: [
          cell(
            [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    type: "jpg",
                    data: photo,
                    transformation: { width: 105, height: 140 },
                  }),
                ],
              }),
            ],
            photoW,
          ),
          cell(
            info.map(
              ([label, value]) =>
                new Paragraph({
                  spacing: { after: 60 },
                  tabStops: [{ type: TabStopType.LEFT, position: labelW }],
                  children: [run(label, { bold: true }), run(`\t${value}`)],
                }),
            ),
            WIDTH - photoW,
          ),
        ],
      }),
    ]),

    koHeading("학력사항"),
    table(eduW, [
      headRow(["기간", "학교명", "전공", "소재지"], eduW),
      new TableRow({
        children: [
          cell(`${EDUCATION.start} ~ ${EDUCATION.end}`, eduW[0]),
          cell(EDUCATION.school.ko, eduW[1]),
          cell(EDUCATION.degree.ko, eduW[2]),
          cell(EDUCATION.place.ko, eduW[3]),
        ],
      }),
    ]),

    koHeading("경력사항"),
    table(expW, [
      headRow(["근무기간", "회사명", "직무", "형태", "담당업무"], expW),
      ...EXPERIENCE.map(
        (job) =>
          new TableRow({
            children: [
              cell(`${dot(job.start)} ~ ${job.end ? dot(job.end) : UI.present.ko}`, expW[0]),
              cell(job.company, expW[1]),
              cell(job.role.ko, expW[2]),
              cell(job.type.ko, expW[3]),
              cell(
                [
                  ...job.bullets.map((b) => bullet(b.ko)),
                  new Paragraph({ children: [run(job.stack.join(" · "), { color: MUTED, size: 17 })] }),
                ],
                expW[4],
              ),
            ],
          }),
      ),
    ]),

    koHeading("주요 프로젝트"),
    table(projW, [
      headRow(["프로젝트", "내용", "기술"], projW),
      ...PROJECTS.map(
        (p) =>
          new TableRow({
            children: [
              cell(
                [
                  new Paragraph({ children: [run(p.name, { bold: true })] }),
                  new Paragraph({ children: [run(p.tag.ko, { color: ACCENT, size: 17 })] }),
                ],
                projW[0],
              ),
              cell(
                [
                  new Paragraph({ children: [run(p.description.ko)] }),
                  new Paragraph({ children: [run(host(p.demo), { color: MUTED, size: 17 })] }),
                ],
                projW[1],
              ),
              cell(
                [new Paragraph({ children: [run(p.stack.join(", "), { size: 17 })] })],
                projW[2],
              ),
            ],
          }),
      ),
    ]),

    koHeading("보유 기술"),
    table(
      skillW,
      SKILLS.map(
        (s) =>
          new TableRow({
            children: [cell(s.title.ko, skillW[0], { head: true }), cell(s.items.join(", "), skillW[1])],
          }),
      ),
    ),

    koHeading("어학"),
    table(skillW, [
      new TableRow({ children: [cell("한국어", skillW[0], { head: true }), cell("중급", skillW[1])] }),
    ]),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 480 },
      children: [run("위의 기재 사항은 사실과 다름없음을 확인합니다.")],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
      children: [run(new Date().toLocaleDateString("ko", { year: "numeric", month: "long", day: "numeric" }))],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 200 },
      children: [run(`작성자: ${UI.name.ko}  (인)`)],
    }),
  ]);
}

await Bun.write(`${OUT}/Nodirbek_Bokiev_CV.docx`, await Packer.toBuffer(english()));
await Bun.write(`${OUT}/Nodirbek_Bokiev_Iryeokseo.docx`, await Packer.toBuffer(await korean()));
console.log("written");

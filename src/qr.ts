import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { canvasTexture, hologram, link, rounded, stream, text, type Keep, type Plating, type Shade } from "@/hologram";

const PRIMARY = "#7f62f4";
const ICE = "#d9d3ff";
const GRADIENT = [new THREE.Color("#818cf8"), new THREE.Color("#c084fc")];
const INK = new THREE.Color("#0b1020");
const SURFACE = "rgba(10, 8, 28, 0.9)";
const PLATE: Plating = [PRIMARY, SURFACE];
const CYCLE = 16;
const CONTENT = "https://qr.glasscube.uz";
// qrcode@1.5.4 QRCode.create(CONTENT, { errorCorrectionLevel: "H" }), one base-36 row per entry
const MATRIX = "8u3kan 4iitkx 6gz0pp 6gkwv1 6hf4nx 4ibpkx 8tz2pr 13o5c 7qtzp 5za6gm 8kzp4o w23co nd1aa 3ial3t 4u5j1c 7cv7rx 2zjynh 6j3mgh 6q9hj5 5yrmcb 6mp3i4 16u58 8tnk9c 4j7bx7 6gn3zl 6glhcy 6grqpq 4ipiot 8tn1g4";
const SIZE = 29;
const MODULE = 4;
const BOARD = { y: 150, margin: 2 };
const LOGO = 3;
const TYPE = { start: 0.2, perChar: 0.09 };
const DEBOUNCE = 0.75;
const SEND = { duration: 0.6 };
const RISE = { finder: 0.4, sweep: 1.4 };
const STYLES = ["Square", "Rounded", "Dots", "Classy"];
const STYLE = { start: 5.6, every: 1 };
const GRADIENT_AT = 9.6;
const LOGO_AT = 11.2;
const EXPORT_AT = 12.4;
const INPUT = new THREE.Vector3(-165, 205, 0);
const CHIPS = { x: 168, y: 235, spacing: 24 };

const { clamp, smoothstep } = THREE.MathUtils;
const half = (SIZE - 1) / 2;
const typed = TYPE.start + CONTENT.length * TYPE.perChar;
const requested = typed + DEBOUNCE;
const built = requested + SEND.duration;
const finder = (r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= SIZE - 7) || (r >= SIZE - 7 && c < 7);
const SWITCHES = [
  { at: -Infinity, style: 0 },
  ...STYLES.slice(1).map((_, i) => ({ at: STYLE.start + (i + 1) * STYLE.every, style: i + 1 })),
  { at: EXPORT_AT, style: 0 },
];
const covered = (r: number, c: number) => Math.abs(r - half) <= LOGO && Math.abs(c - half) <= LOGO;

const cells = MATRIX.split(" ").flatMap((row, r) =>
  [...parseInt(row, 36).toString(2).padStart(SIZE, "0")].flatMap((bit, c) =>
    bit === "1"
      ? [{
          r,
          c,
          position: new THREE.Vector3((c - half) * MODULE, BOARD.y + (half - r) * MODULE, 0),
          delay: finder(r, c) ? 0 : RISE.finder + ((r + c) / (2 * SIZE - 2)) * RISE.sweep,
          hidden: covered(r, c),
        }]
      : [],
  ),
);

function paintLogo(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 40);
  ctx.fill();
  const c = width / 2;
  const s = width * 0.28;
  const top = [c, c - s];
  const left = [c - s * 0.87, c - s / 2];
  const right = [c + s * 0.87, c - s / 2];
  const middle = [c, c];
  const bottom = [c, c + s];
  const lowLeft = [c - s * 0.87, c + s / 2];
  const lowRight = [c + s * 0.87, c + s / 2];
  ctx.strokeStyle = PRIMARY;
  ctx.lineWidth = 12;
  ctx.lineJoin = "round";
  for (const path of [[top, right, middle, left, top], [left, lowLeft, bottom, lowRight, right], [middle, bottom]]) {
    ctx.beginPath();
    path.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  }
}

export function buildQrHologram(shade: Shade, keep: Keep) {
  const kit = hologram(keep, shade, new THREE.Color(PRIMARY), new THREE.Color(ICE));
  const { group, content, translucent, mesh, sparks, sign } = kit;

  const span = (SIZE + BOARD.margin * 2) * MODULE;
  const backing = translucent(0.12, new THREE.Color(PRIMARY));
  mesh(new THREE.ShapeGeometry(rounded(span, span, 8)), backing, content, 0, BOARD.y, -2.5);

  const shapes = [
    new THREE.BoxGeometry(MODULE, MODULE, 3),
    new RoundedBoxGeometry(MODULE * 0.85, MODULE * 0.85, 3, 2, 0.8),
    new THREE.SphereGeometry(MODULE * 0.42, 10, 8),
    new THREE.BoxGeometry(MODULE * 0.6, MODULE * 0.6, 3).rotateZ(Math.PI / 4),
  ].map((geometry) => {
    const modules = new THREE.InstancedMesh(keep(geometry), keep(new THREE.MeshBasicMaterial()), cells.length);
    modules.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    cells.forEach((_, i) => modules.setColorAt(i, INK));
    content.add(modules);
    return modules;
  });

  const logo = mesh(
    new THREE.PlaneGeometry((LOGO * 2 + 1) * MODULE - 2, (LOGO * 2 + 1) * MODULE - 2),
    keep(new THREE.MeshBasicMaterial({ map: canvasTexture(256, 256, paintLogo, keep), transparent: true, depthWrite: false })),
    content,
    0,
    BOARD.y,
    2.5,
  );

  const input = sign(760, 110, 84, PLATE);
  input.sprite.position.copy(INPUT);
  const ring = mesh(new THREE.RingGeometry(7, 9, 64), translucent(0.9, new THREE.Color(ICE)), content, INPUT.x - 24, INPUT.y - 22, 0);
  const debounce = text([{ text: "debounce 750 ms", font: '500 40px "IBM Plex Mono", monospace', color: ICE }], 440, 80, keep);
  debounce.scale.set(42, 7.6, 1);
  debounce.position.set(INPUT.x + 14, INPUT.y - 22, 0);
  content.add(debounce);
  const route = link(INPUT.clone().add(new THREE.Vector3(42, 0, 0)), new THREE.Vector3(-span / 2, BOARD.y + 30, 0), 30);
  const request = sparks(3, ICE);
  const post = sign(440, 80, 42);
  post.sprite.position.set(-100, BOARD.y + 85, 10);

  const chip = (label: string, i: number) => {
    const sprite = text([{ text: label, font: '600 44px "IBM Plex Sans", sans-serif', color: ICE }], 320, 100, keep, PLATE);
    sprite.scale.set(36, 11.25, 1);
    sprite.position.set(CHIPS.x, CHIPS.y - i * CHIPS.spacing, 0);
    content.add(sprite);
    return sprite.material as THREE.SpriteMaterial;
  };
  const chips = [...STYLES, "Gradient", "Logo · EC H"].map(chip);

  const exports = ["SVG", "PNG 3×"].map((label, i) => {
    const sprite = text([{ text: label, font: '600 52px "IBM Plex Mono", monospace', color: "#ffffff" }], 300, 110, keep, [GRADIENT[1].getStyle(), SURFACE]);
    sprite.scale.set(30, 11, 1);
    content.add(sprite);
    return { sprite, to: new THREE.Vector3(-150, 120 - i * 18, 10) };
  });
  const scan = sign(640, 90, 70);
  scan.sprite.position.set(0, BOARD.y + span / 2 + 10, 10);

  const caption = text([{ text: "QR Studio · styled QR codes from a hand-rolled SVG renderer, nothing stored", font: '500 46px "IBM Plex Sans", sans-serif', color: ICE }], 1700, 120, keep, PLATE);
  caption.scale.set(240, 16.9, 1);
  caption.position.set(0, 30, 50);
  content.add(caption);

  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const lifted = new THREE.Vector3();
  const tint = new THREE.Color();
  const origin = new THREE.Vector3(0, BOARD.y, 10);

  const update = (seconds: number) => {
    kit.tick(seconds);
    const cycle = seconds % CYCLE;
    const out = 1 - smoothstep(cycle, CYCLE - 0.6, CYCLE);
    const scanning = cycle >= EXPORT_AT;
    const chars = clamp(Math.floor((cycle - TYPE.start) / TYPE.perChar), 0, CONTENT.length);
    input.show(`${CONTENT.slice(0, chars)}${chars < CONTENT.length && Math.floor(seconds * 3) % 2 ? "|" : " "}`, ICE);
    ring.geometry.setDrawRange(0, Math.round(clamp((cycle - typed) / DEBOUNCE, 0, 1) * 64) * 6);
    stream(request, route, cycle - requested, SEND.duration, 0.15, cycle >= requested && cycle < built ? 9 : 0);
    post.show(cycle >= requested && cycle < built + 0.6 ? "POST /api/qr" : "", ICE);

    const step = SWITCHES.filter((w) => cycle >= w.at).length - 1;
    const angle = seconds * 0.8;
    const axis = new THREE.Vector2(Math.cos(angle), Math.sin(angle));
    const showLogo = cycle >= LOGO_AT;
    shapes.forEach((modules, s) => {
      const morph = smoothstep(cycle - SWITCHES[step].at, 0, 0.25);
      const weight = (s === SWITCHES[step].style ? morph : 0) + (step > 0 && s === SWITCHES[step - 1].style ? 1 - morph : 0);
      cells.forEach((cell, i) => {
        const rise = smoothstep(cycle - built, cell.delay, cell.delay + 0.35) * out;
        const size = weight * rise * (cell.hidden && showLogo ? 0 : 1);
        lifted.copy(cell.position).setZ((1 - rise) * 30);
        matrix.compose(lifted, quaternion, scale.setScalar(Math.max(size, 0.0001)));
        modules.setMatrixAt(i, matrix);
        if (scanning) tint.copy(INK);
        else if (cycle >= GRADIENT_AT) {
          const along = (axis.x * (cell.c - half) + axis.y * (half - cell.r)) / SIZE + 0.5;
          tint.lerpColors(GRADIENT[0], GRADIENT[1], clamp(along, 0, 1));
        } else tint.set(ICE);
        modules.setColorAt(i, tint);
      });
      modules.instanceMatrix.needsUpdate = true;
      modules.instanceColor!.needsUpdate = true;
    });

    backing.color.set(scanning ? "#ffffff" : PRIMARY);
    backing.opacity = (scanning ? 0.96 : 0.12) * Math.max(out, 0.2);
    logo.scale.setScalar(Math.max(smoothstep(cycle, LOGO_AT, LOGO_AT + 0.4) * out, 0.001));

    chips.forEach((material, i) => {
      const on = i < STYLES.length ? cycle >= STYLE.start && i === SWITCHES[step].style && !scanning : cycle >= (i === STYLES.length ? GRADIENT_AT : LOGO_AT);
      material.opacity = on ? 1 : 0.35;
    });
    exports.forEach(({ sprite, to }, i) => {
      const fly = smoothstep(cycle, EXPORT_AT + i * 0.3, EXPORT_AT + i * 0.3 + 0.8);
      sprite.position.lerpVectors(origin, to, fly);
      sprite.visible = cycle >= EXPORT_AT;
      (sprite.material as THREE.SpriteMaterial).opacity = out;
    });
    scan.show(scanning ? "scan me ↓" : "", PRIMARY);
  };

  return { group, update };
}

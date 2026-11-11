import * as THREE from "three";
import { canvasTexture, card, hologram, link, plate, stream, text, type Keep, type Node, type Plating, type Shade } from "@/hologram";

const BLUE = "#4f8ef7";
const PURPLE = "#7c6af5";
const VIOLET = "#a78bfa";
const GREEN = "#10d9a0";
const ORANGE = "#f7a14f";
const MUTED = "#8899bb";
const SURFACE = "rgba(8, 11, 20, 0.88)";
const PLATE: Plating = [BLUE, SURFACE];
const CYCLE = 16;
const ENGINE = new THREE.Vector3(0, 185, 0);
const CARD = { width: 84, height: 26, x: 170, z: -15, turn: 0.3, spacing: 35, px: 8 };
const INPUTS: Node[] = [
  { label: "Eye Tracking", sub: "gaze · blink · EAR", color: BLUE },
  { label: "Face Pose", sub: "yaw · pitch · roll", color: PURPLE },
  { label: "OCEAN Profile", sub: "32 personality types", color: VIOLET },
  { label: "Chronotype", sub: "sleep cycle analysis", color: GREEN },
  { label: "ASRS Attention", sub: "focus span scoring", color: ORANGE },
];
const OUTPUTS: Node[] = [
  { label: "Peak Study Hours", sub: "highest focus window", color: BLUE },
  { label: "Session Length", sub: "optimal before fatigue", color: PURPLE },
  { label: "Method Mix", sub: "learn → practice → review", color: GREEN },
  { label: "Break Rhythm", sub: "recovery timing", color: ORANGE },
];
const TYPES = { learning: BLUE, practice: GREEN, review: PURPLE, research: ORANGE };
const GRID = { width: 170, height: 66, y: 84, from: 12, to: 22, session: 1.5, px: 8, left: 120, top: 110, right: 30, bottom: 30 };
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WINDOWS = [14, 19];
const BLOCKS: { day: number; start: number; type: keyof typeof TYPES }[] = [
  { day: 0, start: 19, type: "learning" },
  { day: 0, start: 14, type: "practice" },
  { day: 1, start: 19, type: "learning" },
  { day: 1, start: 14, type: "practice" },
  { day: 2, start: 19, type: "review" },
  { day: 3, start: 19, type: "review" },
  { day: 3, start: 14, type: "research" },
];

const { clamp, smoothstep } = THREE.MathUtils;
const column = (count: number) => Array.from({ length: count }, (_, i) => ENGINE.y + ((count - 1) / 2 - i) * CARD.spacing);

export function buildSchedulerHologram(shade: Shade, keep: Keep) {
  const kit = hologram(keep, shade, new THREE.Color(BLUE), new THREE.Color(0xc9dcff));
  const { group, content, translucent, lines, mesh, outline, sparks } = kit;
  const cardGeometry = keep(new THREE.PlaneGeometry(CARD.width, CARD.height));

  const nodes = (list: typeof INPUTS, side: number) =>
    column(list.length).map((y, i) => {
      const node = list[i];
      const map = canvasTexture(CARD.width * CARD.px, CARD.height * CARD.px, (ctx) => card(ctx, node, SURFACE), keep);
      const material = keep(new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false }));
      const board = new THREE.Mesh(cardGeometry, material);
      board.position.set(side * CARD.x, y, CARD.z);
      board.rotation.y = -side * CARD.turn;
      board.updateMatrix();
      content.add(board);
      const edge = new THREE.Vector3((-side * CARD.width) / 2, 0, 0).applyMatrix4(board.matrix);
      const hub = ENGINE.clone().add(new THREE.Vector3(side * 40, 0, 0));
      const curve = side < 0 ? link(edge, hub, 12) : link(hub, edge, 12);
      const path = mesh(new THREE.TubeGeometry(curve, 48, 0.9, 6), translucent(0.55, new THREE.Color(node.color)), content);
      return { material, curve, path, sparks: sparks(side < 0 ? 3 : 2, node.color) };
    });
  const inputs = nodes(INPUTS, -1);
  const outputs = nodes(OUTPUTS, 1);

  const engine = new THREE.Group();
  engine.position.copy(ENGINE);
  content.add(engine);
  const core = mesh(new THREE.SphereGeometry(13, 32, 16), translucent(0.85, new THREE.Color(0xc9dcff)), engine);
  const shell = outline(new THREE.IcosahedronGeometry(22, 0), lines(0.7, new THREE.Color(BLUE)), engine);
  const rings = [BLUE, PURPLE].map((color, i) => {
    const ring = mesh(new THREE.TorusGeometry(30 + i * 8, 0.7, 6, 96), translucent(0.8, new THREE.Color(color)), engine);
    ring.rotation.set(Math.PI / 2 + (i ? 0.45 : -0.35), i ? 0.3 : -0.2, 0);
    return ring;
  });
  const dots = [BLUE, GREEN, ORANGE].map((color) => mesh(new THREE.SphereGeometry(2.6, 12, 8), translucent(1, new THREE.Color(color)), engine));
  const pulse = mesh(new THREE.RingGeometry(44, 45.5, 64), translucent(0), engine);
  const name = text([{ text: "ADAPTIVE ENGINE", font: '600 40px "IBM Plex Mono", monospace', color: "#8fb4ff" }], 640, 90, keep);
  name.scale.set(58, 8.2, 1);
  name.position.y = -50;
  engine.add(name);

  const w = GRID.width * GRID.px;
  const h = GRID.height * GRID.px;
  const columnWidth = (w - GRID.left - GRID.right) / DAYS.length;
  const hour = (h - GRID.top - GRID.bottom) / (GRID.to - GRID.from);
  const at = (hours: number) => GRID.top + (hours - GRID.from) * hour;
  const sheet = canvasTexture(w, h, (ctx) => {
    plate(ctx, w, h, PLATE);
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#dbe6ff";
    ctx.font = '600 40px "IBM Plex Sans", sans-serif';
    ctx.fillText("Weekly plan · Night Owl · C 70 → 90 min", 36, 52);
    ctx.textAlign = "center";
    ctx.fillStyle = MUTED;
    ctx.font = '500 30px "IBM Plex Mono", monospace';
    DAYS.forEach((day, i) => ctx.fillText(day, GRID.left + (i + 0.5) * columnWidth, GRID.top - 16));
    ctx.textAlign = "left";
    ctx.strokeStyle = "rgba(136, 153, 187, 0.35)";
    ctx.lineWidth = 2;
    for (const start of WINDOWS) {
      ctx.fillText(`${start}:00`, 24, at(start + GRID.session / 2));
      ctx.beginPath();
      ctx.moveTo(GRID.left, at(start));
      ctx.lineTo(w - GRID.right, at(start));
      ctx.stroke();
    }
  }, keep);
  const sheetMaterial = keep(new THREE.MeshBasicMaterial({ map: sheet, transparent: true, depthWrite: false }));
  mesh(new THREE.PlaneGeometry(GRID.width, GRID.height), sheetMaterial, content, 0, GRID.y, 0);
  const toWorld = (px: number, py: number) => [px / GRID.px - GRID.width / 2, GRID.y + GRID.height / 2 - py / GRID.px];
  const blocks = BLOCKS.map(({ day, start, type }) => {
    const width = (columnWidth - 16) / GRID.px;
    const height = (GRID.session * hour) / GRID.px;
    const [x, y] = toWorld(GRID.left + (day + 0.5) * columnWidth, at(start + GRID.session / 2));
    return mesh(new THREE.PlaneGeometry(width, height), translucent(0, new THREE.Color(TYPES[type])), content, x, y, 0.6);
  });

  const caption = text([{ text: "Webcam focus + 3 tests → a weekly study plan", font: '500 46px "IBM Plex Sans", sans-serif', color: "#dbe6ff" }], 1280, 120, keep, PLATE);
  caption.scale.set(190, 17.8, 1);
  caption.position.set(0, 34, 40);
  content.add(caption);

  let spin = 0;
  let last = 0;
  const update = (seconds: number) => {
    kit.tick(seconds);
    const dt = clamp(seconds - last, 0, 0.1);
    last = seconds;
    const cycle = seconds % CYCLE;
    const out = 1 - smoothstep(cycle, CYCLE - 1, CYCLE);
    const ramp = (from: number, length: number) => clamp((cycle - from) / length, 0, 1) * out;
    const flow = (list: typeof inputs, lit: number, draw: number, start: number, duration: number) =>
      list.forEach((n, i) => {
        n.material.opacity = 0.3 + 0.7 * ramp(lit + i * 0.15, 0.4);
        n.path.geometry.setDrawRange(0, Math.round(ramp(draw + i * 0.12, 0.7) * 48) * 36);
        stream(n.sparks, n.curve, cycle - start - i * 0.15, duration, 0.6, 9 * out);
      });
    flow(inputs, 0.2, 1, 2.2, 1.8);
    flow(outputs, 3.4, 3.2, 4, 1.4);

    const active = ramp(2.2, 0.5);
    spin += (0.4 + 2.2 * active) * dt;
    (core.material as THREE.MeshBasicMaterial).opacity = 0.45 + 0.45 * active * (0.8 + 0.2 * Math.sin(seconds * 6));
    shell.material.opacity = 0.3 + 0.6 * active;
    shell.rotation.set(spin * 0.6, spin, 0);
    rings.forEach((r, i) => (r.rotation.z = spin * (i ? -1.2 : 0.9)));
    dots.forEach((d, k) => {
      const angle = spin * 1.6 + (k * Math.PI * 2) / 3;
      d.position.set(Math.cos(angle) * 30, Math.sin(angle) * 12, Math.sin(angle) * 28);
    });
    const beat = ((cycle - 2.2) % 1.5) / 1.5;
    pulse.scale.setScalar(1 + beat * 0.8);
    (pulse.material as THREE.MeshBasicMaterial).opacity = cycle > 2.2 ? (1 - beat) * active * 0.8 : 0;

    sheetMaterial.opacity = 0.4 + 0.6 * ramp(4.4, 0.5);
    blocks.forEach((b, k) => {
      const a = ramp(5 + k * 0.45, 0.35);
      b.scale.set(1 + 0.15 * Math.sin(a * Math.PI), Math.max(a, 0.001), 1);
      (b.material as THREE.MeshBasicMaterial).opacity = 0.9 * a;
    });
  };

  return { group, update };
}

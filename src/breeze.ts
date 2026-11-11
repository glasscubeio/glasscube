import * as THREE from "three";
import { canvasTexture, card, hologram, rounded, stream, text, type Keep, type Node, type Plating, type Shade } from "@/hologram";

const TEAL = "#2fd3c6";
const ICE = "#c9fff8";
const RED = "#ff4d5e";
const AMBER = "#ffd04d";
const ORANGE = "#ff9a3d";
const VIOLET = "#8f8cff";
const SURFACE = "rgba(2, 18, 24, 0.9)";
const PLATE: Plating = [TEAL, SURFACE];
const ACT = 6;
const CYCLE = ACT * 3;
const WATCH = { x: 0, y: 170, z: 10, width: 90, height: 106, px: 5 };
const OCEAN = { width: 400, depth: 200, y: 40 };
const TAPS = [0.8, 1.1, 1.4];
const ALARM = 1.6;
const CALL = 2.6;
const SOS = new THREE.Vector3(-165, 205, 0);
const KM = 10;
const RINGS = [
  { km: 1000, wind: 15, title: "Typhoon watch", color: AMBER },
  { km: 600, wind: 20, title: "Typhoon advisory", color: ORANGE },
  { km: 400, wind: 25, title: "TYPHOON WARNING", color: RED },
];
const STORM = { from: new THREE.Vector3(220, OCEAN.y + 6, 60), to: new THREE.Vector3(30, OCEAN.y + 6, 10), start: 0.4, end: 4, wind: [14, 30] };
const CARDS: Node[] = [
  { label: "Tide", sub: "tide times · moon phase", color: TEAL },
  { label: "Weather", sub: "wind · waves · sea temp", color: "#4fb3ff" },
  { label: "Point", sub: "depth · bottom type", color: AMBER },
];
const GEMINI = new THREE.Vector3(160, 190, 0);
const SCORE = 8.2;
const CARD = { width: 84, height: 26, x: -165, spacing: 45, px: 8 };

const { clamp, lerp, smoothstep } = THREE.MathUtils;

type Face = { color: string; title: string; lines: string[]; gauge?: number };

function star(outer: number, inner: number) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 ? inner : outer;
    const a = (i * Math.PI) / 4 + Math.PI / 2;
    if (i) shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  return shape;
}

function paintFace(ctx: CanvasRenderingContext2D, face: Face) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(2, 18, 24, 0.92)";
  ctx.strokeStyle = face.color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(4, 4, width - 8, height - 8, 80);
  ctx.fill();
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = face.color;
  ctx.font = '600 50px "IBM Plex Sans", sans-serif';
  ctx.fillText(face.title, width / 2, face.gauge === undefined ? 170 : 100, width - 60);
  let y = 250;
  if (face.gauge !== undefined) {
    const from = Math.PI * 0.75;
    const sweep = Math.PI * 1.5;
    ctx.lineCap = "round";
    ctx.lineWidth = 18;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.arc(width / 2, 235, 90, from, from + sweep);
    ctx.stroke();
    ctx.strokeStyle = face.color;
    ctx.beginPath();
    ctx.arc(width / 2, 235, 90, from, from + (sweep * face.gauge) / 10);
    ctx.stroke();
    ctx.fillStyle = ICE;
    ctx.font = '600 64px "IBM Plex Mono", monospace';
    ctx.fillText(face.gauge.toFixed(1), width / 2, 235);
    y = 370;
  }
  ctx.fillStyle = ICE;
  ctx.font = '400 32px "IBM Plex Mono", monospace';
  face.lines.forEach((line, i) => ctx.fillText(line, width / 2, y + i * 46, width - 60));
}

function screen(act: number, a: number): Face {
  if (act === 0) {
    const taps = TAPS.filter((t) => a >= t).length;
    if (a >= CALL) return { color: RED, title: "EMERGENCY", lines: ["Calling 112…"] };
    if (a >= ALARM) return { color: RED, title: "EMERGENCY", lines: ["Call 112?"] };
    if (taps) return { color: TEAL, title: `TAP ${taps}/3`, lines: ["within 0.5 s"] };
    return { color: TEAL, title: "BREEZE", lines: ["triple-tap for SOS"] };
  }
  if (act === 1) {
    const { km, wind } = storm(a);
    const tier = RINGS.filter((r) => km <= r.km && wind >= r.wind).length - 1;
    const lines = [`${Math.round(km)} km`, `${Math.round(wind)} m/s`];
    return tier < 0 ? { color: TEAL, title: "KMA typhoon feed", lines } : { color: RINGS[tier].color, title: RINGS[tier].title, lines };
  }
  const gauge = Math.round(SCORE * clamp((a - 3) / 1.2, 0, 1) * 10) / 10;
  if (a < 3) return { color: VIOLET, title: "Analyzing…", lines: ["Gemini 1.5 Flash"] };
  return { color: TEAL, title: "Fishing score", gauge, lines: a < 4.4 ? [] : ["Best: early morning", "Rockfish · Mackerel"] };
}

function storm(a: number) {
  const p = smoothstep(a, STORM.start, STORM.end);
  const position = STORM.from.clone().lerp(STORM.to, p);
  return { position, km: Math.hypot(position.x, position.z) * KM, wind: lerp(STORM.wind[0], STORM.wind[1], p) };
}

export function buildBreezeHologram(shade: Shade, keep: Keep) {
  const kit = hologram(keep, shade, new THREE.Color(TEAL), new THREE.Color(ICE));
  const { group, content, time, translucent, lines, mesh, outline, sparks } = kit;
  const color = (hex: string) => new THREE.Color(hex);

  const ocean = mesh(
    new THREE.PlaneGeometry(OCEAN.width, OCEAN.depth, 50, 25).rotateX(-Math.PI / 2),
    keep(new THREE.ShaderMaterial({
      uniforms: { time, color: { value: color(TEAL) } },
      vertexShader: `uniform float time;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  p.y += sin(p.x * 0.045 + time * 1.4) * 3.0 + cos(p.z * 0.08 + time * 0.9) * 2.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`,
      fragmentShader: `uniform vec3 color;
varying vec2 vUv;
void main() {
  vec2 e = min(vUv, 1.0 - vUv);
  gl_FragColor = vec4(color, 0.35 * smoothstep(0.0, 0.2, min(e.x, e.y)));
}`,
      transparent: true,
      depthWrite: false,
      wireframe: true,
    })),
    content,
    0,
    OCEAN.y,
    0,
  );
  ocean.renderOrder = -1;

  const watch = new THREE.Group();
  watch.position.set(WATCH.x, WATCH.y, WATCH.z);
  content.add(watch);
  const body = () => new THREE.ExtrudeGeometry(rounded(WATCH.width, WATCH.height, 22), { depth: 14, bevelEnabled: false, curveSegments: 8 }).translate(0, 0, -7);
  mesh(body(), translucent(0.12), watch);
  outline(body(), lines(0.8), watch);
  for (const side of [-1, 1]) {
    const y = side * (WATCH.height / 2 + 22);
    mesh(new THREE.BoxGeometry(56, 44, 8), translucent(0.08), watch, 0, y, -2);
    outline(new THREE.BoxGeometry(56, 44, 8), lines(0.5), watch).position.set(0, y, -2);
  }
  mesh(new THREE.CylinderGeometry(6, 6, 10, 20), translucent(0.6), watch, WATCH.width / 2 + 4, 18, 0).rotation.z = Math.PI / 2;
  const faceCanvas = canvasTexture((WATCH.width - 10) * WATCH.px, (WATCH.height - 10) * WATCH.px, () => {}, keep);
  const faceContext = (faceCanvas.image as HTMLCanvasElement).getContext("2d")!;
  mesh(new THREE.PlaneGeometry(WATCH.width - 10, WATCH.height - 10), keep(new THREE.MeshBasicMaterial({ map: faceCanvas, transparent: true, depthWrite: false })), watch, 0, 0, 7.5);
  let shown = "";

  const acts = [0, 1, 2].map(() => {
    const act = new THREE.Group();
    content.add(act);
    return act;
  });
  const [sos, typhoon, fishing] = acts;

  const ripples = TAPS.map(() => mesh(new THREE.RingGeometry(6, 7.5, 48), translucent(0, color(ICE)), watch, 8, -12, 8));
  const badge = text([{ text: "SOS → 112", font: '600 64px "IBM Plex Mono", monospace', color: RED }], 640, 150, keep, [RED, SURFACE]);
  badge.scale.set(64, 15, 1);
  badge.position.copy(SOS);
  sos.add(badge);
  const call = new THREE.LineCurve3(new THREE.Vector3(-WATCH.width / 2, WATCH.y + 5, WATCH.z), SOS.clone().add(new THREE.Vector3(32, 0, 0)));
  const signal = sparks(3, RED);
  signal.forEach((s) => sos.add(s));

  const pin = new THREE.Group();
  pin.position.set(0, OCEAN.y, 0);
  typhoon.add(pin);
  mesh(new THREE.ConeGeometry(5, 14, 16), translucent(0.9, color(ICE)), pin, 0, 12, 0).rotation.x = Math.PI;
  const rings = RINGS.map((r) => {
    const radius = r.km / KM;
    const ring = mesh(new THREE.RingGeometry(radius - 0.8, radius + 0.8, 96), translucent(0.35, color(r.color)), pin, 0, 1, 0);
    ring.rotation.x = -Math.PI / 2;
    const label = text([{ text: `${r.km} km`, font: '500 44px "IBM Plex Mono", monospace', color: r.color }], 320, 90, keep);
    label.scale.set(28, 7.9, 1);
    label.position.set(-radius * 0.72, 8, radius * 0.72);
    pin.add(label);
    return ring;
  });
  const eye = new THREE.Group();
  typhoon.add(eye);
  const arms = Array.from({ length: 420 }, (_, i) => {
    const r = 4 + i * 0.075;
    const a = i * 0.32;
    return new THREE.Vector3(Math.cos(a) * r, Math.sin(i * 1.7) * 1.5, Math.sin(a) * r);
  });
  eye.add(new THREE.Points(keep(new THREE.BufferGeometry().setFromPoints(arms)), keep(new THREE.PointsMaterial({ color: ICE, size: 2.4, transparent: true, opacity: 0.85, depthWrite: false }))));
  mesh(new THREE.TorusGeometry(4, 0.8, 6, 32), translucent(0.9, color(ICE)), eye).rotation.x = Math.PI / 2;

  const cards = CARDS.map((node, i) => {
    const map = canvasTexture(CARD.width * CARD.px, CARD.height * CARD.px, (ctx) => card(ctx, node, SURFACE), keep);
    const board = new THREE.Mesh(keep(new THREE.PlaneGeometry(CARD.width, CARD.height)), keep(new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false })));
    board.position.set(CARD.x, GEMINI.y + (1 - i) * CARD.spacing, 0);
    fishing.add(board);
    const from = board.position.clone().add(new THREE.Vector3(CARD.width / 2, 0, 0));
    const curve = new THREE.CubicBezierCurve3(from, new THREE.Vector3(-60, from.y, -60), new THREE.Vector3(60, GEMINI.y, -60), GEMINI.clone().add(new THREE.Vector3(-26, 0, 0)));
    const flow = sparks(3, node.color);
    flow.forEach((s) => fishing.add(s));
    return { curve, flow };
  });
  const gemini = new THREE.Group();
  gemini.position.copy(GEMINI);
  fishing.add(gemini);
  mesh(new THREE.ShapeGeometry(star(24, 6)), translucent(0.35, color(VIOLET)), gemini);
  outline(new THREE.ShapeGeometry(star(24, 6)), lines(0.9, color(VIOLET)), gemini);
  const model = text([{ text: "Gemini 1.5 Flash", font: '500 40px "IBM Plex Mono", monospace', color: VIOLET }], 560, 90, keep);
  model.scale.set(50, 8, 1);
  model.position.y = -36;
  gemini.add(model);
  const answer = new THREE.LineCurve3(GEMINI.clone().add(new THREE.Vector3(-26, 0, 0)), new THREE.Vector3(WATCH.width / 2, WATCH.y + 10, WATCH.z));
  const reply = sparks(2, VIOLET);
  reply.forEach((s) => fishing.add(s));

  const caption = text([{ text: "Breeze · SOS, typhoon alerts and AI fishing on the wrist", font: '500 46px "IBM Plex Sans", sans-serif', color: ICE }], 1400, 120, keep, PLATE);
  caption.scale.set(208, 17.8, 1);
  caption.position.set(0, 22, 110);
  content.add(caption);

  const update = (seconds: number) => {
    kit.tick(seconds);
    const cycle = seconds % CYCLE;
    const act = Math.floor(cycle / ACT);
    const a = cycle - act * ACT;
    const presence = smoothstep(a, 0, 0.4) * (1 - smoothstep(a, ACT - 0.5, ACT));
    acts.forEach((g, k) => {
      g.visible = k === act;
      g.scale.setScalar(Math.max(presence, 0.001));
    });

    const face = screen(act, a);
    const key = JSON.stringify(face);
    if (key !== shown) {
      shown = key;
      paintFace(faceContext, face);
      faceCanvas.needsUpdate = true;
    }

    const alarm = act === 0 && a >= ALARM && a < ALARM + 0.6;
    watch.position.x = WATCH.x + (alarm ? Math.sin(seconds * 90) * 1.5 : 0);
    watch.rotation.y = Math.sin(seconds * 0.6) * 0.12;

    ripples.forEach((r, i) => {
      const age = act === 0 ? clamp((a - TAPS[i]) / 0.4, 0, 1) : 1;
      r.scale.setScalar(1 + age * 2);
      (r.material as THREE.MeshBasicMaterial).opacity = act === 0 && a >= TAPS[i] ? 1 - age : 0;
    });
    (badge.material as THREE.SpriteMaterial).opacity = a >= CALL + 0.6 ? 1 : 0.4;
    stream(signal, call, a - CALL, 0.8, 0.27, a >= CALL && a < ACT - 0.5 ? 10 : 0);

    if (act === 1) {
      const { position, km } = storm(a);
      eye.position.copy(position);
      eye.rotation.y = -seconds * 2.4;
      rings.forEach((ring, i) => ((ring.material as THREE.MeshBasicMaterial).opacity = km <= RINGS[i].km ? 0.9 : 0.3));
    }

    gemini.rotation.z = seconds * (a >= 1 && a < 3 ? 3 : 0.6);
    cards.forEach((c, i) => stream(c.flow, c.curve, a - 1 - i * 0.15, 1.2, 0.4, a >= 1 && a < 3 ? 8 : 0));
    stream(reply, answer, a - 2.8, 0.5, 0.25, a >= 2.8 && a < 4.4 ? 9 : 0);
  };

  return { group, update };
}

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PROJECTS, type Lang } from "@/content";

export type Rect = { x: [number, number]; z: [number, number] };

const CARPET = { z: -300, width: 300 };
const WALKWAY = 800;
const BOOTH = { width: 500, depth: 280, height: 460, gap: 40, space: 140 };
const PANEL = { width: 420, height: 260, y: 230, px: 4, tilt: THREE.MathUtils.degToRad(5) };
const POST = { height: 100, every: 320 };
const ROWS = Math.ceil(PROJECTS.length / 2);
const HALL_START = -500 - WALKWAY;
const HALL_END = HALL_START - ROWS * (BOOTH.width + BOOTH.space) + BOOTH.space;

function matcap(light: string, mid: string, dark: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(48, 40, 4, 64, 64, 64);
  gradient.addColorStop(0, light);
  gradient.addColorStop(0.5, mid);
  gradient.addColorStop(1, dark);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const placed = (geometry: THREE.BufferGeometry, x: number, y: number, z: number) =>
  geometry.clone().translate(x, y, z);

const host = (url: string) => url.replace(/^https?:\/\//, "");

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > width) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  return line ? [...lines, line] : lines;
}

function draw(ctx: CanvasRenderingContext2D, index: number, lang: Lang, image?: HTMLImageElement) {
  const p = PROJECTS[index];
  const { width, height } = ctx.canvas;
  const pad = 90;
  const column = image ? 820 : width - pad * 2;
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#ff7a3d";
  ctx.fillRect(0, 0, width, 12);
  ctx.textBaseline = "top";

  let y = pad;
  ctx.font = '500 34px "IBM Plex Mono", "IBM Plex Sans KR", monospace';
  ctx.fillText(`${String(index + 1).padStart(2, "0")}${p.tag ? `  ·  ${p.tag[lang]}` : ""}`, pad, y);
  y += 70;
  ctx.fillStyle = "#e8eaed";
  ctx.font = '600 104px "IBM Plex Sans", "IBM Plex Sans KR", sans-serif';
  ctx.fillText(p.name, pad, y, column);
  y += 150;
  ctx.fillStyle = "#c9ced6";
  ctx.font = '400 44px "IBM Plex Sans", "IBM Plex Sans KR", sans-serif';
  for (const line of wrap(ctx, p.description[lang], column)) {
    ctx.fillText(line, pad, y);
    y += 64;
  }
  ctx.font = '400 32px "IBM Plex Sans", "IBM Plex Sans KR", sans-serif';
  for (const fact of p.details?.facts ?? []) {
    y += 14;
    ctx.fillStyle = "#9aa1ab";
    ctx.fillText(`${fact.label[lang]}  ${fact.value[lang]}`, pad, y, column);
    y += 40;
  }
  ctx.fillStyle = "#9aa1ab";
  ctx.font = '400 32px "IBM Plex Mono", monospace';
  const bottom = height - pad;
  ctx.fillText(host(p.demo ?? p.github), pad, bottom - 36, column);
  const stack = wrap(ctx, p.stack.join("  ·  "), column);
  stack.forEach((line, i) => ctx.fillText(line, pad, bottom - 100 - (stack.length - 1 - i) * 46));

  if (!image) return;
  const box = { x: pad + column + 70, y: pad + 70, w: width - pad * 2 - column - 70, h: height - pad * 2 - 70 };
  const scale = Math.min(box.w / image.width, box.h / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h);
}

export function buildExhibition(scene: THREE.Scene, lang: Lang) {
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(item: T) => (disposables.push(item), item);
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(keep(geometry), material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  };
  const flat = (color: number) => keep(new THREE.MeshBasicMaterial({ color }));
  const shaded = (...stops: [string, string, string]) => {
    const texture = keep(matcap(...stops));
    return keep(new THREE.MeshMatcapMaterial({ matcap: texture }));
  };
  const plane = (length: number, depth: number, material: THREE.Material, x: number, y: number, z = CARPET.z) => {
    add(new THREE.PlaneGeometry(length, depth), material, x, y, z).rotation.x = -Math.PI / 2;
  };

  const hallLength = HALL_START - HALL_END;
  plane(WALKWAY + 40, CARPET.width, flat(0x8a8d91), -460 - (WALKWAY + 40) / 2, 0.6);
  plane(hallLength, CARPET.width, flat(0xb3121c), HALL_START - hallLength / 2, 0.8);

  const gold = shaded("#fff4c2", "#c9a24a", "#4a3610");
  const parts = [
    { geometry: new THREE.CylinderGeometry(3, 3, POST.height, 12), y: POST.height / 2 },
    { geometry: new THREE.SphereGeometry(6, 12, 8), y: POST.height + 4 },
    { geometry: new THREE.CylinderGeometry(14, 16, 4, 16), y: 2 },
  ];
  const posts = Math.floor(hallLength / POST.every) + 1;
  const ropes: THREE.BufferGeometry[] = [];
  const matrix = new THREE.Matrix4();
  for (const { geometry, y } of parts) {
    const mesh = new THREE.InstancedMesh(keep(geometry), gold, posts * 2);
    [-1, 1].forEach((side, s) => {
      const z = CARPET.z + side * (CARPET.width / 2 - 15);
      for (let i = 0; i < posts; i++) {
        const x = HALL_START - 20 - i * POST.every;
        mesh.setMatrixAt(s * posts + i, matrix.makeTranslation(x, y, z));
        if (y !== 2 || i === posts - 1) continue;
        const a = new THREE.Vector3(x, POST.height - 6, z);
        const b = new THREE.Vector3(x - POST.every, POST.height - 6, z);
        const sag = a.clone().lerp(b, 0.5).setY(POST.height - 60);
        ropes.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, sag, b), 20, 2.5, 6));
      }
    });
    scene.add(mesh);
  }
  add(mergeGeometries(ropes), shaded("#d23a46", "#8a0c16", "#3a0408"));
  ropes.forEach((rope) => rope.dispose());

  const back = new THREE.BoxGeometry(BOOTH.width, BOOTH.height, 8);
  const sideDepth = BOOTH.depth * 0.2;
  const wingGeometry = new THREE.BoxGeometry(8, BOOTH.height, sideDepth);
  const baseGeometry = new THREE.BoxGeometry(BOOTH.width, 8, BOOTH.depth);
  const floorDepth = BOOTH.gap + BOOTH.depth + 60;
  const floorGeometry = new THREE.PlaneGeometry(BOOTH.width, floorDepth).rotateX(-Math.PI / 2);
  const floors: THREE.BufferGeometry[] = [];
  const panelGeometry = keep(new THREE.PlaneGeometry(PANEL.width, PANEL.height));
  const walls: THREE.BufferGeometry[] = [];
  const bases: THREE.BufferGeometry[] = [];
  const panels = PROJECTS.map((p, i) => {
    const side = i % 2 ? -1 : 1;
    const x = HALL_START - (BOOTH.width + BOOTH.space) * Math.floor(i / 2) - BOOTH.width / 2;
    const near = CARPET.z + side * (CARPET.width / 2 + BOOTH.gap);
    const middle = near + (side * BOOTH.depth) / 2;
    const far = near + side * BOOTH.depth;
    const wing = far - (side * sideDepth) / 2;
    bases.push(placed(baseGeometry, x, 4, middle));
    floors.push(placed(floorGeometry, x, 0.3, CARPET.z + side * (CARPET.width / 2 + floorDepth / 2)));
    walls.push(
      placed(back, x, BOOTH.height / 2, far),
      placed(wingGeometry, x - BOOTH.width / 2, BOOTH.height / 2, wing),
      placed(wingGeometry, x + BOOTH.width / 2, BOOTH.height / 2, wing),
    );

    const canvas = document.createElement("canvas");
    canvas.width = PANEL.width * PANEL.px;
    canvas.height = PANEL.height * PANEL.px;
    const ctx = canvas.getContext("2d")!;
    const texture = keep(new THREE.CanvasTexture(canvas));
    texture.colorSpace = THREE.SRGBColorSpace;
    const panel = new THREE.Mesh(panelGeometry, keep(new THREE.MeshBasicMaterial({ map: texture })));
    panel.position.set(x, PANEL.y, far - side * 20);
    scene.add(panel);
    panel.rotation.set(-side * PANEL.tilt, side > 0 ? Math.PI : 0, 0);
    panel.userData.href = `/work/${p.slug}`;

    const booth = { ctx, texture, image: undefined as HTMLImageElement | undefined, panel };
    const src = p.details?.sections?.flatMap((s) => s.images ?? [])[0]?.src;
    if (src) {
      const image = new Image();
      image.onload = () => {
        booth.image = image;
        redraw(current);
      };
      image.src = src;
    }
    return booth;
  });

  const occluder = add(mergeGeometries(walls), shaded("#ffffff", "#ecebe7", "#b9b8b2"));
  add(mergeGeometries(bases), flat(0xf4f4f1));
  add(mergeGeometries(floors), flat(0xd9dbde));
  [...walls, ...bases, ...floors, back, wingGeometry, baseGeometry, floorGeometry].forEach((geometry) => geometry.dispose());

  let current = lang;
  const redraw = (next: Lang) => {
    current = next;
    panels.forEach((b, i) => {
      draw(b.ctx, i, next, b.image);
      b.texture.needsUpdate = true;
    });
  };
  redraw(lang);
  document.fonts.ready.then(() => redraw(current));

  const walkable: Rect = {
    x: [HALL_END + 40, -440],
    z: [CARPET.z - CARPET.width / 2 + 30, CARPET.z + CARPET.width / 2 - 30],
  };

  return {
    walkable,
    occluders: [occluder],
    panels: panels.map((b) => b.panel),
    redraw,
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}

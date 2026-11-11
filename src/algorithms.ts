import * as THREE from "three";
import { canvasTexture, hologram, plate, text, type Keep, type Plating, type Shade } from "@/hologram";

const ICE = "#dbeafe";
const ACCENT = "#fbbf24";
const SURFACE = "rgba(8, 12, 20, 0.92)";
const PLATE: Plating = ["#64748b", SURFACE];
const ACT = 7;
const RUN = { start: 0.6, end: 6 };
const STAGE = { x: -60, y: 140, tilt: 0.6 };
const CODE = { x: 150, y: 165, width: 150, height: 120, px: 6.6, line: 38 };
const BARS = { count: 14, width: 10, pitch: 13, base: 62, scale: 0.5 };
const SORT = { idle: "#64748b", sorted: "#34d399", swapping: "#f87171", comparing: "#fbbf24", pivot: "#fb923c" };
const SORT_LINES = { comparing: 5, swapping: 7, sorted: 10, done: 13, pivot: 3 };
const QUICK = [
  "function quickSort(arr: number[], lo = 0, hi = arr.length-1) {",
  "  if (lo >= hi) return;",
  "  let i = lo - 1;",
  "  const pivot = arr[hi];",
  "  for (let j = lo; j < hi; j++) {",
  "    if (arr[j] <= pivot) {",
  "      i++;",
  "      [arr[i], arr[j]] = [arr[j], arr[i]];",
  "    }",
  "  }",
  "  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];",
  "  const pi = i + 1;",
  "  quickSort(arr, lo, pi - 1);",
  "  quickSort(arr, pi + 1, hi);",
  "}",
];
const MAZE = [
  "............",
  ".#####.####.",
  ".....#....#.",
  "####.#.##.#.",
  "...#.#..#...",
  ".#.#.##.###.",
  ".#...#......",
  ".#####.####.",
  ".....#....#.",
  ".###.####.#.",
  "...#......#.",
  ".#.#.######.",
];
const GRID = { size: MAZE.length, tile: 12, pitch: 13, start: [11, 0], end: [0, 11] };
const PATH = { wall: "#4b5563", empty: "#1f2937", start: "#10b981", end: "#ef4444", found: "#fb923c", path: "#facc15", current: "#ffffff", frontier: "#fb923c", visited: "#0f766e" };
const ASTAR_LINES = { init: 1, dequeue: 5, checkGoal: 6, relax: 10 };
const ASTAR = [
  "function aStar(grid, start, end) {",
  "  const g = {}; g[key(start)] = 0;",
  "  const open = new MinPQ(); open.push(h(start), start);",
  "  const parent = {};",
  "  while (!open.isEmpty()) {",
  "    const curr = open.pop(); // f = g + h",
  "    if (equals(curr, end)) return buildPath(parent, end);",
  "    for (const next of neighbors(grid, curr)) {",
  "      const tg = g[key(curr)] + cost(curr, next);",
  "      if (tg < (g[key(next)] ?? Infinity)) {",
  "        g[key(next)] = tg;",
  "        parent[key(next)] = curr;",
  "        open.push(tg + h(next), next);",
  "      }",
  "    }",
  "  }",
  "  return null; // no path",
  "}",
];
const HEX = { radius: 5, size: 8, generations: 12, seed: 0.3, minimum: 10 };
const HEX_DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]];
const LIFE = { alive: "#22d3ee", dead: "#1e3a5f" };
const RULE = [
  "const live = HEX_DIRS.filter(([dq, dr]) =>",
  "  current.has(`${q + dq},${r + dr}`),",
  ").length;",
  "const isAlive = current.has(ck);",
  "if (isAlive ? live === 2 || live === 3 : live === 3) next.add(ck);",
];
const SCENES = [
  { title: "Quick Sort · comparing, swapping, pivot", code: QUICK },
  { title: "A* · Manhattan heuristic", code: ASTAR },
  { title: "Hex Life · birth 3, survive 2-3, 6 neighbors", code: RULE },
];

const { clamp } = THREE.MathUtils;

type SortFrame = { array: number[]; comparing: number[]; swapping: number[]; sorted: Set<number>; pivot: number | null; line: number };
type PathFrame = { visited: Set<number>; frontier: Set<number>; current: number | null; path: number[]; line: number };

function quickSortFrames(initial: number[]) {
  const frames: SortFrame[] = [];
  const a = [...initial];
  const sorted = new Set<number>();
  const snap = (type: keyof typeof SORT_LINES, comparing: number[] = [], swapping: number[] = [], pivot: number | null = null) =>
    frames.push({ array: [...a], comparing, swapping, sorted: new Set(sorted), pivot, line: SORT_LINES[type] });
  const partition = (low: number, high: number) => {
    snap("pivot", [], [], high);
    let i = low - 1;
    for (let j = low; j < high; j++) {
      snap("comparing", [j, high], [], high);
      if (a[j] <= a[high]) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          snap("swapping", [], [i, j], high);
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    sorted.add(i + 1);
    snap("sorted", [], [i + 1, high]);
    return i + 1;
  };
  const sort = (low: number, high: number) => {
    if (low >= high) {
      if (low === high) sorted.add(low);
      return;
    }
    const pi = partition(low, high);
    sort(low, pi - 1);
    sort(pi + 1, high);
  };
  sort(0, a.length - 1);
  snap("done");
  return frames;
}

function aStarFrames() {
  const { size, start, end } = GRID;
  const index = (r: number, c: number) => r * size + c;
  const goal = index(end[0], end[1]);
  const h = (i: number) => Math.abs(Math.floor(i / size) - end[0]) + Math.abs((i % size) - end[1]);
  const g = new Map<number, number>([[index(start[0], start[1]), 0]]);
  const parent = new Map<number, number>();
  const visited = new Set<number>();
  const open = [{ f: h(index(start[0], start[1])), i: index(start[0], start[1]) }];
  const frames: PathFrame[] = [];
  const snap = (current: number | null, line: number, path: number[] = []) =>
    frames.push({ visited: new Set(visited), frontier: new Set(open.map((o) => o.i)), current, path, line });
  snap(null, ASTAR_LINES.init);
  while (open.length) {
    open.sort((x, y) => x.f - y.f);
    const curr = open.shift()!.i;
    if (visited.has(curr)) continue;
    visited.add(curr);
    snap(curr, ASTAR_LINES.dequeue);
    if (curr === goal) {
      const path = [goal];
      while (parent.has(path[0])) path.unshift(parent.get(path[0])!);
      snap(curr, ASTAR_LINES.checkGoal, path);
      break;
    }
    const r = Math.floor(curr / size);
    const c = curr % size;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size || MAZE[nr][nc] === "#") continue;
      const next = index(nr, nc);
      if (visited.has(next)) continue;
      const tentative = g.get(curr)! + 1;
      if (tentative < (g.get(next) ?? Infinity)) {
        g.set(next, tentative);
        parent.set(next, curr);
        open.push({ f: tentative + h(next), i: next });
        snap(curr, ASTAR_LINES.relax);
      }
    }
  }
  return frames;
}

function hexCells(radius: number) {
  const cells: { q: number; r: number; key: string }[] = [];
  for (let q = -radius; q <= radius; q++)
    for (let r = -radius; r <= radius; r++)
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= radius) cells.push({ q, r, key: `${q},${r}` });
  return cells;
}

function lifeGenerations(cells: ReturnType<typeof hexCells>) {
  const step = (current: Set<string>) => {
    const next = new Set<string>();
    for (const { q, r, key } of cells) {
      const live = HEX_DIRS.filter(([dq, dr]) => current.has(`${q + dq},${r + dr}`)).length;
      if (current.has(key) ? live === 2 || live === 3 : live === 3) next.add(key);
    }
    return next;
  };
  let generations: Set<string>[] = [];
  for (let attempt = 0; attempt < 20; attempt++) {
    generations = [new Set(cells.filter(() => Math.random() < HEX.seed).map((c) => c.key))];
    while (generations.length <= HEX.generations) generations.push(step(generations[generations.length - 1]));
    if (generations[HEX.generations].size >= HEX.minimum) break;
  }
  return generations;
}

function paintCode(ctx: CanvasRenderingContext2D, lines: string[], active: number) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  plate(ctx, width, height, PLATE);
  ctx.textBaseline = "middle";
  ctx.font = '600 26px "IBM Plex Mono", monospace';
  ctx.fillStyle = "#3178c6";
  ctx.fillText("TypeScript", 36, 40);
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("· Rust · Java", 210, 40);
  ctx.font = '400 24px "IBM Plex Mono", monospace';
  lines.forEach((line, i) => {
    const y = 90 + i * CODE.line;
    if (i === active) {
      ctx.fillStyle = "rgba(251, 191, 36, 0.22)";
      ctx.fillRect(16, y - CODE.line / 2, width - 32, CODE.line);
    }
    ctx.fillStyle = "#64748b";
    ctx.fillText(String(i + 1).padStart(2, " "), 30, y);
    ctx.fillStyle = i === active ? ACCENT : ICE;
    ctx.fillText(line, 80, y, width - 110);
  });
}

export function buildAlgorithmHologram(shade: Shade, keep: Keep) {
  const kit = hologram(keep, shade, new THREE.Color("#60a5fa"), new THREE.Color(ICE));
  const { group, content, mesh, sign } = kit;
  const stage = kit.acts(SCENES.length, ACT);
  const [sorting, pathfinding, life] = stage.groups;
  const tint = new THREE.Color();
  const matrix = new THREE.Matrix4();
  const still = new THREE.Quaternion();
  const stretch = new THREE.Vector3();

  const values: number[] = [];
  while (values.length < BARS.count) {
    const v = Math.floor(Math.random() * 270) + 20;
    if (!values.includes(v)) values.push(v);
  }
  const sortFrames = quickSortFrames(values);
  const bars = values.map((v, i) => {
    const bar = mesh(new THREE.BoxGeometry(BARS.width, v * BARS.scale, BARS.width).translate(0, (v * BARS.scale) / 2, 0), keep(new THREE.MeshBasicMaterial({ color: SORT.idle, transparent: true, opacity: 0.9 })), sorting);
    bar.position.set(STAGE.x + (i - (BARS.count - 1) / 2) * BARS.pitch, BARS.base, 0);
    return { value: v, bar };
  });

  const board = new THREE.Group();
  board.position.set(STAGE.x, STAGE.y - 40, 0);
  board.rotation.x = STAGE.tilt;
  pathfinding.add(board);
  const cellAt = (r: number, c: number) => new THREE.Vector3((c - (GRID.size - 1) / 2) * GRID.pitch, 0, (r - (GRID.size - 1) / 2) * GRID.pitch);
  const tiles = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(GRID.tile, 3, GRID.tile)), keep(new THREE.MeshBasicMaterial()), GRID.size * GRID.size);
  MAZE.forEach((row, r) =>
    [...row].forEach((cell, c) => {
      const wall = cell === "#";
      matrix.compose(cellAt(r, c).setY(wall ? 7 : 0), still, stretch.set(1, wall ? 5.6 : 1, 1));
      tiles.setMatrixAt(r * GRID.size + c, matrix);
      tiles.setColorAt(r * GRID.size + c, tint.set(wall ? PATH.wall : PATH.empty));
    }),
  );
  board.add(tiles);
  const pathFrames = aStarFrames();

  const hexes = hexCells(HEX.radius);
  const generations = lifeGenerations(hexes);
  const hive = new THREE.Group();
  hive.position.set(STAGE.x, STAGE.y - 40, 0);
  hive.rotation.x = STAGE.tilt;
  life.add(hive);
  const prisms = new THREE.InstancedMesh(keep(new THREE.CylinderGeometry(HEX.size * 0.9, HEX.size * 0.9, 3, 6)), keep(new THREE.MeshBasicMaterial()), hexes.length);
  hive.add(prisms);
  const hexAt = ({ q, r }: { q: number; r: number }) => new THREE.Vector3(HEX.size * Math.sqrt(3) * (q + r / 2), 0, HEX.size * 1.5 * r);

  const title = sign(1300, 90, 150);
  title.sprite.position.set(STAGE.x, 262, 10);
  const codeMap = canvasTexture(CODE.width * CODE.px, CODE.height * CODE.px, () => {}, keep);
  const codeContext = (codeMap.image as HTMLCanvasElement).getContext("2d")!;
  const panel = mesh(new THREE.PlaneGeometry(CODE.width, CODE.height), keep(new THREE.MeshBasicMaterial({ map: codeMap, transparent: true, depthWrite: false })), content, CODE.x, CODE.y, 0);
  panel.rotation.y = -0.3;
  let shown = "";

  const caption = text([{ text: "Algorithm Visualizer · 19 algorithms, code synced in TypeScript, Rust and Java", font: '500 46px "IBM Plex Sans", sans-serif', color: ICE }], 1800, 120, keep, PLATE);
  caption.scale.set(250, 16.7, 1);
  caption.position.set(0, 30, 50);
  content.add(caption);

  let last = 0;
  const update = (seconds: number) => {
    kit.tick(seconds);
    const dt = clamp(seconds - last, 0, 0.1);
    last = seconds;
    const { act, at } = stage.show(seconds);
    const progress = clamp((at - RUN.start) / (RUN.end - RUN.start), 0, 1);
    let line = 0;

    if (act === 0) {
      const f = sortFrames[Math.min(Math.floor(progress * sortFrames.length), sortFrames.length - 1)];
      line = f.line;
      bars.forEach(({ value, bar }) => {
        const i = f.array.indexOf(value);
        const x = STAGE.x + (i - (BARS.count - 1) / 2) * BARS.pitch;
        bar.position.x += (x - bar.position.x) * Math.min(1, dt * 14);
        const state = f.sorted.has(i) ? SORT.sorted : f.swapping.includes(i) ? SORT.swapping : f.comparing.includes(i) ? SORT.comparing : f.pivot === i ? SORT.pivot : SORT.idle;
        (bar.material as THREE.MeshBasicMaterial).color.set(state);
      });
    }

    if (act === 1) {
      const f = pathFrames[Math.min(Math.floor(progress * pathFrames.length), pathFrames.length - 1)];
      line = f.line;
      const path = new Set(f.path);
      MAZE.forEach((row, r) =>
        [...row].forEach((cell, c) => {
          if (cell === "#") return;
          const i = r * GRID.size + c;
          const isStart = r === GRID.start[0] && c === GRID.start[1];
          const isEnd = r === GRID.end[0] && c === GRID.end[1];
          const color = isStart ? PATH.start : isEnd ? (path.size ? PATH.found : PATH.end) : path.has(i) ? PATH.path : f.current === i ? PATH.current : f.frontier.has(i) ? PATH.frontier : f.visited.has(i) ? PATH.visited : PATH.empty;
          tiles.setColorAt(i, tint.set(color));
          matrix.compose(cellAt(r, c).setY(path.has(i) ? 3 : 0), still, stretch.set(1, path.has(i) ? 2 : 1, 1));
          tiles.setMatrixAt(i, matrix);
        }),
      );
      tiles.instanceColor!.needsUpdate = true;
      tiles.instanceMatrix.needsUpdate = true;
    }

    if (act === 2) {
      const tickAt = progress * HEX.generations;
      const generation = generations[Math.floor(tickAt)];
      const fresh = tickAt % 1;
      line = fresh < 0.35 ? 0 : 4;
      hexes.forEach((cell, i) => {
        const alive = generation.has(cell.key);
        matrix.compose(hexAt(cell).setY(alive ? 6 : 0), still, stretch.set(1, alive ? 5 : 1, 1));
        prisms.setMatrixAt(i, matrix);
        prisms.setColorAt(i, tint.set(alive ? LIFE.alive : LIFE.dead));
      });
      prisms.instanceMatrix.needsUpdate = true;
      prisms.instanceColor!.needsUpdate = true;
    }

    title.show(SCENES[act].title, ICE);
    const key = `${act}:${line}`;
    if (key !== shown) {
      shown = key;
      paintCode(codeContext, SCENES[act].code, line);
      codeMap.needsUpdate = true;
    }
  };

  return { group, update };
}

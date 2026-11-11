import * as THREE from "three";
import { hologram, text, type Keep, type Plating, type Shade } from "@/hologram";

const BLUE = 0;
const RED = 1;
const TEAMS = ["#3B82F6", "#EF4444"];
const NEUTRAL = "#8B7D6B";
const EARTH = "#5A4E3C";
const STONE = "#c9c2b5";
const SKIN = "#f1c27d";
const STEEL = "#d4d8de";
const GOLD = "#facc15";
const PINE = "#2D5A1B";
const PALM = "#1A4D3A";
const GRAVE = "#8a8a8a";
const WOOD = "#7a5230";
const WHEAT = "#d9b44a";
const ICE = "#e0f2fe";
const PLATE: Plating = ["#3B82F6", "rgba(10, 14, 30, 0.9)"];
const CYCLE = 19;
const HOP = 0.35;
const FLIP = 0.35;
const SIZE = 15;
const RADIUS = 4;
const ISLAND = { y: 60, tilt: 0.25, sway: 0.12 };

type Key = string;
type Step = [depart: number, key: Key];

const UNITS: { rank: number; team: number; from: number; to: number; path: Step[] }[] = [
  { rank: 1, team: BLUE, from: 1, to: 3.25, path: [[1, "-1,0"], [1.6, "0,0"]] },
  { rank: 1, team: BLUE, from: 2.6, to: 3.25, path: [[2.6, "-1,0"], [2.9, "0,0"]] },
  { rank: 2, team: BLUE, from: 3.25, to: 8.65, path: [[3.25, "0,0"]] },
  { rank: 1, team: BLUE, from: 8, to: 8.65, path: [[8, "-1,0"], [8.3, "0,0"]] },
  { rank: 3, team: BLUE, from: 8.65, to: Infinity, path: [[8.65, "0,0"], [9.4, "1,0"], [14, "2,0"]] },
  { rank: 2, team: RED, from: -Infinity, to: 12, path: [[0, "1,1"], [5.2, "0,1"]] },
];
const CAPTURES: { t: number; key: Key; team: number }[] = [
  { t: 1.95, key: "0,0", team: BLUE },
  { t: 5.55, key: "0,1", team: RED },
  { t: 9.75, key: "1,0", team: BLUE },
  { t: 14.35, key: "2,0", team: BLUE },
];
const STRUCTURES: { type: "castle" | "tower" | "farm"; team: number; key: Key; from: number; to: number }[] = [
  { type: "castle", team: BLUE, key: "-2,0", from: -Infinity, to: Infinity },
  { type: "castle", team: RED, key: "2,0", from: -Infinity, to: 14.35 },
  { type: "tower", team: RED, key: "1,0", from: -Infinity, to: 9.75 },
  { type: "farm", team: BLUE, key: "-3,1", from: -Infinity, to: Infinity },
  { type: "farm", team: RED, key: "3,-1", from: -Infinity, to: Infinity },
  { type: "farm", team: RED, key: "3,0", from: 6.2, to: Infinity },
  { type: "castle", team: RED, key: "3,1", from: 15.2, to: Infinity },
];
const TERRAIN: { type: "pine" | "palm" | "grave"; key: Key; from: number; to: number }[] = [
  { type: "pine", key: "0,0", from: -Infinity, to: 1.95 },
  { type: "pine", key: "0,-1", from: -Infinity, to: Infinity },
  { type: "pine", key: "-1,2", from: -Infinity, to: Infinity },
  { type: "palm", key: "-2,4", from: -Infinity, to: Infinity },
  { type: "palm", key: "2,-4", from: -Infinity, to: Infinity },
  { type: "grave", key: "0,1", from: 12, to: 16.6 },
  { type: "pine", key: "0,1", from: 16.6, to: Infinity },
];
const POPUPS: { t: number; key: Key; label: string; color: string }[] = [
  { t: 1, key: "-1,0", label: "peasant −10", color: GOLD },
  { t: 1.95, key: "0,0", label: "tree cut +3", color: GOLD },
  { t: 2.6, key: "-1,0", label: "peasant −10", color: GOLD },
  { t: 3.25, key: "0,0", label: "merge 1 + 1 = 2", color: ICE },
  { t: 5.55, key: "0,1", label: "2 > 0", color: ICE },
  { t: 6.2, key: "3,0", label: "farm −12", color: GOLD },
  { t: 7.4, key: "-2,0", label: "income +14", color: GOLD },
  { t: 8, key: "-1,0", label: "peasant −10", color: GOLD },
  { t: 8.65, key: "0,0", label: "merge 2 + 1 = 3", color: ICE },
  { t: 9.75, key: "1,0", label: "knight 3 > tower 2", color: ICE },
  { t: 11.6, key: "2,0", label: "income −5", color: "#fca5a5" },
  { t: 12, key: "0,1", label: "unit starved", color: "#fca5a5" },
  { t: 14.35, key: "2,0", label: "3 > capital 1", color: ICE },
  { t: 15.2, key: "3,1", label: "new capital", color: ICE },
  { t: 16.6, key: "0,1", label: "grave → pine", color: "#86efac" },
];
const BANNERS: { t: number; label: string; team: number }[] = [
  { t: 0, label: "Turn 1 · Blue", team: BLUE },
  { t: 4.6, label: "Turn 1 · Red", team: RED },
  { t: 7.2, label: "Turn 2 · Blue", team: BLUE },
  { t: 11.4, label: "Turn 2 · Red", team: RED },
  { t: 13.4, label: "Turn 3 · Blue", team: BLUE },
  { t: 16.2, label: "Turn 3 · Red", team: RED },
];
const KEEP = new Set([...UNITS.flatMap((u) => u.path.map(([, k]) => k)), ...STRUCTURES.map((s) => s.key), ...TERRAIN.map((t) => t.key)]);

const { clamp, smoothstep } = THREE.MathUtils;
const key = (q: number, r: number) => `${q},${r}`;
const pop = (t: number, from: number, to: number) => smoothstep(t, from, from + 0.3) * (1 - smoothstep(t, to, to + 0.3));

function island() {
  const tiles: { q: number; r: number; key: Key; owner: number | null; height: number }[] = [];
  for (let q = -RADIUS; q <= RADIUS; q++)
    for (let r = -RADIUS; r <= RADIUS; r++) {
      const ring = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
      if (ring > RADIUS || (ring === RADIUS && (q * 5 + r * 3 + 64) % 3 === 0 && !KEEP.has(key(q, r)))) continue;
      const u = q + r / 2;
      tiles.push({ q, r, key: key(q, r), owner: u <= -1 ? BLUE : u >= 1 ? RED : null, height: 7 + ((q * 31 + r * 17 + 99) % 3) * 1.5 });
    }
  return tiles;
}

export function buildAntiyoyHologram(shade: Shade, keep: Keep) {
  const kit = hologram(keep, shade, new THREE.Color("#7dd3fc"), new THREE.Color(ICE));
  const { group, content, mesh, sign } = kit;
  const materials = new Map<string, THREE.MeshLambertMaterial>();
  const paint = (color: string) => {
    if (!materials.has(color)) materials.set(color, keep(new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.25, flatShading: true })));
    return materials.get(color)!;
  };
  const part = (geometry: THREE.BufferGeometry, color: string, parent: THREE.Object3D, x = 0, y = 0, z = 0) => mesh(geometry, paint(color), parent, x, y, z);

  const world = new THREE.Group();
  world.position.y = ISLAND.y;
  world.rotation.x = ISLAND.tilt;
  content.add(world);

  const sea = mesh(
    new THREE.CircleGeometry(150, 64).rotateX(-Math.PI / 2),
    keep(new THREE.ShaderMaterial({
      uniforms: { time: kit.time },
      vertexShader: `varying vec2 vPos;
void main() {
  vPos = position.xz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
      fragmentShader: `uniform float time;
varying vec2 vPos;
void main() {
  float d = length(vPos) / 150.0;
  float wave = 0.5 + 0.5 * sin(d * 40.0 - time * 1.6);
  float glint = smoothstep(0.85, 1.0, wave) * 0.35;
  vec3 deep = vec3(0.07, 0.2, 0.45);
  gl_FragColor = vec4(deep + glint, (0.55 + glint) * (1.0 - smoothstep(0.75, 1.0, d)));
}`,
      transparent: true,
      depthWrite: false,
    })),
    world,
  );
  sea.renderOrder = -1;

  const tiles = island();
  const positions = new Map<Key, THREE.Vector3>();
  const tops = new Map<Key, { material: THREE.MeshLambertMaterial; mesh: THREE.Mesh; base: number; owner: number | null }>();
  const side = paint(EARTH);
  for (const tile of tiles) {
    const x = SIZE * Math.sqrt(3) * (tile.q + tile.r / 2);
    const z = SIZE * 1.5 * tile.r;
    const material = keep(new THREE.MeshLambertMaterial({ color: tile.owner === null ? NEUTRAL : TEAMS[tile.owner], flatShading: true }));
    const hex = new THREE.Mesh(keep(new THREE.CylinderGeometry(SIZE * 0.95, SIZE * 0.99, tile.height, 6)), [side, material, side]);
    hex.position.set(x, tile.height / 2, z);
    world.add(hex);
    positions.set(tile.key, new THREE.Vector3(x, tile.height, z));
    tops.set(tile.key, { material, mesh: hex, base: tile.height / 2, owner: tile.owner });
  }
  const top = (k: Key) => positions.get(k)!.clone();

  const unitModel = (rank: number, team: number) => {
    const body = new THREE.Group();
    const color = TEAMS[team];
    part(new THREE.CylinderGeometry(2.6, 3.4, 7, 8), color, body, 0, 3.5, 0);
    part(new THREE.SphereGeometry(2.2, 10, 8), SKIN, body, 0, 8.8, 0);
    if (rank >= 2) {
      part(new THREE.CylinderGeometry(0.35, 0.35, 14, 6), WOOD, body, 3.6, 7, 0);
      part(new THREE.ConeGeometry(0.9, 2.6, 6), STEEL, body, 3.6, 15.2, 0);
    }
    if (rank >= 3) {
      part(new THREE.CylinderGeometry(2.4, 2.4, 1.6, 10), STEEL, body, 0, 10.4, 0);
      part(new THREE.CylinderGeometry(3, 3, 0.8, 12).rotateZ(Math.PI / 2), color, body, -3.4, 4.5, 0);
    }
    if (rank >= 4) {
      part(new THREE.TorusGeometry(2, 0.5, 6, 12).rotateX(Math.PI / 2), GOLD, body, 0, 11, 0);
      for (let i = 0; i < 5; i++) part(new THREE.ConeGeometry(0.5, 1.6, 4), GOLD, body, Math.cos((i / 5) * Math.PI * 2) * 2, 12, Math.sin((i / 5) * Math.PI * 2) * 2);
    }
    body.scale.setScalar(1 + (rank - 1) * 0.12);
    const unit = new THREE.Group();
    unit.add(body);
    world.add(unit);
    return { unit, body };
  };
  const units = UNITS.map((u) => ({ ...u, ...unitModel(u.rank, u.team) }));

  const flags: THREE.Mesh[] = [];
  const flag = (team: number, parent: THREE.Object3D, height: number) => {
    part(new THREE.CylinderGeometry(0.35, 0.35, 9, 6), WOOD, parent, 0, height + 4.5, 0);
    const cloth = part(new THREE.BoxGeometry(6, 3.8, 0.3).translate(3, 0, 0), TEAMS[team], parent, 0.3, height + 7, 0);
    flags.push(cloth);
  };
  const castle = (team: number) => {
    const g = new THREE.Group();
    part(new THREE.BoxGeometry(15, 6, 15), STONE, g, 0, 3, 0);
    part(new THREE.BoxGeometry(8, 13, 8), STONE, g, 0, 6.5, 0);
    for (const [x, z] of [[-6, -6], [6, -6], [-6, 6], [6, 6]]) {
      part(new THREE.CylinderGeometry(2.4, 2.6, 11, 8), STONE, g, x, 5.5, z);
      part(new THREE.ConeGeometry(3, 4.6, 8), TEAMS[team], g, x, 13.3, z);
    }
    flag(team, g, 13);
    return g;
  };
  const tower = (team: number) => {
    const g = new THREE.Group();
    part(new THREE.CylinderGeometry(4.2, 5.4, 16, 8), STONE, g, 0, 8, 0);
    for (let i = 0; i < 6; i++) part(new THREE.BoxGeometry(1.8, 2.2, 1.8), STONE, g, Math.cos((i / 6) * Math.PI * 2) * 4, 17, Math.sin((i / 6) * Math.PI * 2) * 4);
    flag(team, g, 16);
    return g;
  };
  const farm = () => {
    const g = new THREE.Group();
    for (let i = -2; i <= 2; i++) part(new THREE.BoxGeometry(14, 1.4, 1.8), WHEAT, g, 0, 0.7, i * 2.8);
    part(new THREE.BoxGeometry(5, 4, 5), WOOD, g, 4, 2, -4);
    part(new THREE.ConeGeometry(4.4, 3.4, 4).rotateY(Math.PI / 4), "#b45309", g, 4, 5.7, -4);
    return g;
  };
  const structures = STRUCTURES.map((s) => {
    const model = s.type === "castle" ? castle(s.team) : s.type === "tower" ? tower(s.team) : farm();
    model.position.copy(top(s.key));
    world.add(model);
    return { ...s, model };
  });

  const debris = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    const piece = part(new THREE.BoxGeometry(2.2, 2.2, 2.2), STONE, world);
    return { piece, velocity: new THREE.Vector3(Math.cos(angle) * 18, 26 + (i % 3) * 6, Math.sin(angle) * 18) };
  });
  const fallen = STRUCTURES.find((s) => s.type === "castle" && s.to !== Infinity)!;

  const nature = TERRAIN.map((t) => {
    const g = new THREE.Group();
    if (t.type === "pine") {
      part(new THREE.CylinderGeometry(0.9, 1.1, 4, 6), WOOD, g, 0, 2, 0);
      [0, 1, 2].forEach((i) => part(new THREE.ConeGeometry(6 - i * 1.5, 6, 7), PINE, g, 0, 6 + i * 3.6, 0));
    } else if (t.type === "palm") {
      part(new THREE.CylinderGeometry(0.7, 1.1, 14, 6).translate(0, 7, 0).rotateZ(0.2), WOOD, g);
      for (let i = 0; i < 5; i++) {
        const leaf = part(new THREE.BoxGeometry(8, 0.5, 2.4).translate(4, 0, 0), PALM, g, -2.6, 13.6, 0);
        leaf.rotation.set(0, (i / 5) * Math.PI * 2, -0.35);
      }
    } else {
      part(new THREE.BoxGeometry(5, 1.4, 6), "#4b5563", g, 0, 0.7, 0);
      part(new THREE.BoxGeometry(3.6, 6, 1.2), GRAVE, g, 0, 4, -1.6);
      part(new THREE.BoxGeometry(1, 3.4, 1.4), "#6b7280", g, 0, 5.4, -1.6);
    }
    g.position.copy(top(t.key));
    world.add(g);
    return { ...t, model: g };
  });

  const rings = [...CAPTURES.map((c) => ({ t: c.t, key: c.key, color: TEAMS[c.team] })), ...UNITS.filter((u) => u.rank > 1 && u.from > 0).map((u) => ({ t: u.from, key: u.path[0][1], color: GOLD }))].map((ring) => {
    const shape = mesh(new THREE.RingGeometry(SIZE * 0.55, SIZE * 0.7, 6).rotateX(-Math.PI / 2).rotateY(Math.PI / 6), kit.translucent(0, new THREE.Color(ring.color)), world);
    shape.position.copy(top(ring.key)).add(new THREE.Vector3(0, 0.6, 0));
    return { ...ring, shape };
  });

  const popups = POPUPS.map((p) => {
    const sprite = text([{ text: p.label, font: '600 46px "IBM Plex Sans", sans-serif', color: p.color }], 560, 100, keep);
    sprite.scale.set(42, 7.5, 1);
    world.add(sprite);
    return { ...p, sprite };
  });

  const banner = sign(900, 120, 96, PLATE);
  banner.sprite.position.set(0, 236, -20);

  const caption = text([{ text: "Antiyoy Web · browser port of yiotro's hex strategy, played by the real rules", font: '500 46px "IBM Plex Sans", sans-serif', color: ICE }], 1800, 120, keep, PLATE);
  caption.scale.set(250, 16.7, 1);
  caption.position.set(0, 30, 70);
  content.add(caption);

  const before = new THREE.Color();
  const after = new THREE.Color();
  const from = new THREE.Vector3();
  const to = new THREE.Vector3();
  const color = (team: number | null) => (team === null ? NEUTRAL : TEAMS[team]);
  const update = (seconds: number) => {
    kit.tick(seconds);
    const cycle = seconds % CYCLE;
    const presence = smoothstep(cycle, 0, 0.5) * (1 - smoothstep(cycle, CYCLE - 0.6, CYCLE));
    world.scale.setScalar(Math.max(presence, 0.001));
    world.rotation.y = Math.sin(seconds * 0.25) * ISLAND.sway;

    for (const [k, tile] of tops) {
      const change = CAPTURES.filter((c) => c.key === k && cycle >= c.t).pop();
      const previous = CAPTURES.filter((c) => c.key === k && change && c.t < change.t).pop()?.team ?? tile.owner;
      if (!change) {
        tile.material.color.set(color(tile.owner));
        tile.mesh.position.y = tile.base;
        continue;
      }
      const k01 = clamp((cycle - change.t) / FLIP, 0, 1);
      tile.material.color.copy(before.set(color(previous))).lerp(after.set(color(change.team)), k01);
      tile.mesh.position.y = tile.base + Math.sin(k01 * Math.PI) * 2.5;
    }

    for (const u of units) {
      const shown = pop(cycle, u.from, u.to);
      u.unit.visible = shown > 0.001;
      if (!u.unit.visible) continue;
      u.unit.position.copy(top(u.path[0][1]));
      let lift = 0;
      for (let i = 1; i < u.path.length; i++) {
        const [depart, k] = u.path[i];
        if (cycle < depart) break;
        const step = clamp((cycle - depart) / HOP, 0, 1);
        from.copy(u.unit.position);
        to.copy(top(k));
        u.unit.position.lerpVectors(from, to, step);
        lift = Math.sin(step * Math.PI) * 10;
      }
      const drop = u.rank === 1 && u.from > 0 ? (1 - smoothstep(cycle, u.from, u.from + 0.3)) * 16 : 0;
      u.unit.position.y += lift + drop + Math.abs(Math.sin(seconds * 3 + u.rank)) * 0.8;
      u.unit.scale.setScalar(Math.max(shown, 0.001));
      u.body.rotation.y = u.team === BLUE ? Math.PI / 2 : -Math.PI / 2;
    }

    for (const s of structures) {
      const rise = s.from === -Infinity ? 1 : smoothstep(cycle, s.from, s.from + 0.5);
      const crumble = s.to === Infinity ? 0 : smoothstep(cycle, s.to, s.to + 0.6);
      const shown = rise * (1 - crumble);
      s.model.visible = shown > 0.001;
      s.model.scale.set(1, Math.max(shown, 0.001), 1);
    }
    debris.forEach(({ piece, velocity }) => {
      const age = cycle - fallen.to;
      piece.visible = age >= 0 && age < 0.9;
      if (!piece.visible) return;
      piece.position.copy(top(fallen.key)).addScaledVector(velocity, age);
      piece.position.y += 8 - 45 * age * age;
      piece.rotation.set(age * 6, age * 4, 0);
    });
    flags.forEach((f, i) => (f.rotation.y = Math.sin(seconds * 4 + i) * 0.35));

    for (const n of nature) {
      const grown = pop(cycle, n.from, n.to);
      n.model.visible = grown > 0.001;
      n.model.scale.setScalar(Math.max(grown, 0.001));
    }

    for (const r of rings) {
      const age = (cycle - r.t) / 0.8;
      r.shape.scale.setScalar(1 + clamp(age, 0, 1) * 0.8);
      (r.shape.material as THREE.MeshBasicMaterial).opacity = age >= 0 && age < 1 ? 1 - age : 0;
    }

    for (const p of popups) {
      const age = cycle - p.t;
      const visible = age >= 0 && age < 1.4;
      p.sprite.visible = visible;
      if (!visible) continue;
      p.sprite.position.copy(top(p.key));
      p.sprite.position.y += 26 + age * 10;
      (p.sprite.material as THREE.SpriteMaterial).opacity = 1 - smoothstep(age, 1, 1.4);
    }

    const turn = BANNERS.filter((b) => cycle >= b.t).pop()!;
    banner.show(turn.label, turn.team === BLUE ? "#93c5fd" : "#fca5a5");
    (banner.sprite.material as THREE.SpriteMaterial).opacity = presence;
  };

  return { group, update };
}

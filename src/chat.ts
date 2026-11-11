import * as THREE from "three";
import { canvasTexture, hologram, link, rounded, text, type Keep, type Plating, type Shade } from "@/hologram";

const BLUE = "#3b82f6";
const ALICE = "#38bdf8";
const BOB = "#f472b6";
const GOLD = "#fbbf24";
const RED = "#ef4444";
const ICE = "#dbeafe";
const SURFACE = "rgba(6, 12, 24, 0.9)";
const PLATE: Plating = [BLUE, SURFACE];
const CYCLE = 16;
const SERVER = new THREE.Vector3(0, 150, -20);
const PEERS = [
  { name: "alice", color: ALICE, at: new THREE.Vector3(-165, 150, 0) },
  { name: "bob", color: BOB, at: new THREE.Vector3(165, 150, 0) },
];
const EXCHANGE = { start: 0.6, duration: 1.6, derive: 2.4 };
const MESSAGES = [
  { from: 0, text: "hi bob", start: 3.6 },
  { from: 1, text: "hey alice", start: 8.2 },
];
const STEPS = { appear: 0.4, scramble: 0.6, send: 1.2, store: 2.2, forward: 2.6, open: 3.6, gone: 4.6 };
const WIPE = 13;
const BUBBLE = { width: 70, height: 20, px: 8 };

const { clamp, smoothstep } = THREE.MathUtils;
const lift = (at: THREE.Vector3, y: number) => at.clone().add(new THREE.Vector3(0, y, 0));
const holder = (at: THREE.Vector3, slot: number) => lift(at, 48).add(new THREE.Vector3(slot * 14, 0, 0));
const hex = (bytes: number) => Array.from({ length: bytes }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join("");

function paintBubble(ctx: CanvasRenderingContext2D, plain: boolean, body: string, color: string) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = plain ? color : SURFACE;
  ctx.strokeStyle = plain ? "#ffffff" : GOLD;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(4, 4, width - 8, height - 8, 40);
  ctx.fill();
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = plain ? "#06101f" : GOLD;
  ctx.font = plain ? '600 64px "IBM Plex Sans", sans-serif' : '500 44px "IBM Plex Mono", monospace';
  ctx.fillText(body, width / 2, height / 2, width - 50);
}

export function buildChatHologram(shade: Shade, keep: Keep) {
  const kit = hologram(keep, shade, new THREE.Color(BLUE), new THREE.Color(ICE));
  const { group, content, translucent, lines, mesh, outline, sparks, sign } = kit;
  const color = (value: string) => new THREE.Color(value);

  const key = (tint: string) => {
    const glyph = new THREE.Group();
    const material = translucent(0.95, color(tint));
    mesh(new THREE.TorusGeometry(5, 1.4, 8, 24), material, glyph, -9, 0, 0);
    mesh(new THREE.BoxGeometry(14, 2.4, 2.4), material, glyph, 3, 0, 0);
    mesh(new THREE.BoxGeometry(2.4, 4, 2.4), material, glyph, 8, -3, 0);
    content.add(glyph);
    return glyph;
  };

  const peers = PEERS.map((peer, i) => {
    const device = new THREE.Group();
    device.position.copy(peer.at);
    device.rotation.y = i ? -0.3 : 0.3;
    content.add(device);
    const shell = () => new THREE.ExtrudeGeometry(rounded(44, 76, 10), { depth: 6, bevelEnabled: false, curveSegments: 6 }).translate(0, 0, -3);
    const fill = translucent(0.15, color(peer.color));
    mesh(shell(), fill, device);
    const edge = lines(0.9, color(peer.color));
    outline(shell(), edge, device);
    const dot = mesh(new THREE.SphereGeometry(3, 12, 8), translucent(1, color("#22c55e")), device, 14, 30, 4);
    const name = text([{ text: peer.name, font: '600 52px "IBM Plex Mono", monospace', color: peer.color }], 320, 90, keep);
    name.scale.set(30, 8.4, 1);
    name.position.set(peer.at.x, peer.at.y - 50, peer.at.z);
    content.add(name);
    const own = key(peer.color);
    const lock = new THREE.Group();
    lock.position.set(peer.at.x, peer.at.y + 62, peer.at.z);
    content.add(lock);
    const gold = translucent(0.95, color(GOLD));
    mesh(new THREE.BoxGeometry(16, 13, 5), gold, lock);
    mesh(new THREE.TorusGeometry(5, 1.3, 8, 24, Math.PI), gold, lock, 0, 6.5, 0);
    const cipher = text([{ text: "AES-GCM 256", font: '500 40px "IBM Plex Mono", monospace', color: GOLD }], 360, 80, keep);
    cipher.scale.set(34, 7.6, 1);
    cipher.position.y = -16;
    lock.add(cipher);
    return { ...peer, fill, edge, dot, own, lock };
  });

  const rack = new THREE.Group();
  rack.position.copy(SERVER);
  content.add(rack);
  const unit = lines(0.8, color(BLUE));
  for (const y of [-22, 0, 22]) {
    outline(new THREE.BoxGeometry(56, 18, 36), unit, rack).position.y = y;
    mesh(new THREE.BoxGeometry(56, 18, 36), translucent(0.08), rack, 0, y, 0);
  }
  const server = text([{ text: "Bun · Socket.io", font: '600 44px "IBM Plex Mono", monospace', color: ICE }], 480, 90, keep);
  server.scale.set(44, 8.3, 1);
  server.position.set(SERVER.x, SERVER.y + 44, SERVER.z);
  content.add(server);
  const slots = MESSAGES.map((_, i) => mesh(new THREE.BoxGeometry(14, 14, 14), translucent(0.1, color(BLUE)), content, SERVER.x + (i - 0.5) * 22, 80, SERVER.z + 10));
  const memory = text([{ text: "in-memory Map", font: '500 40px "IBM Plex Mono", monospace', color: "#93c5fd" }], 400, 80, keep);
  memory.scale.set(38, 7.6, 1);
  memory.position.set(SERVER.x, 62, SERVER.z + 10);
  content.add(memory);
  const status = sign(900, 90, 96);
  status.sprite.position.set(SERVER.x, SERVER.y + 60, SERVER.z);

  const routes = [
    new THREE.CatmullRomCurve3([lift(PEERS[0].at, 40), lift(SERVER, 70), holder(PEERS[1].at, 1)]),
    new THREE.CatmullRomCurve3([lift(PEERS[1].at, -40), new THREE.Vector3(SERVER.x, 104, SERVER.z + 30), lift(PEERS[0].at, -40).add(new THREE.Vector3(30, 0, 0)), holder(PEERS[0].at, 1)]),
  ];
  const wires = routes.map((curve) => mesh(new THREE.TubeGeometry(curve, 96, 0.8, 6), translucent(0.25), content));
  const keys = PEERS.map((peer) => key(peer.color));
  const trails = PEERS.map((peer) => sparks(2, peer.color));

  const bubbles = MESSAGES.map((message) => {
    const sender = PEERS[message.from];
    const receiver = PEERS[1 - message.from];
    const map = canvasTexture(BUBBLE.width * BUBBLE.px, BUBBLE.height * BUBBLE.px, () => {}, keep);
    const ctx = (map.image as HTMLCanvasElement).getContext("2d")!;
    const bubble = mesh(new THREE.PlaneGeometry(BUBBLE.width, BUBBLE.height), keep(new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false })), content);
    const front = (at: THREE.Vector3) => at.clone().add(new THREE.Vector3(0, 0, 40));
    const up = link(front(sender.at), lift(SERVER, -30).add(new THREE.Vector3(0, 0, 40)), 30);
    const down = link(lift(SERVER, -30).add(new THREE.Vector3(0, 0, 40)), front(receiver.at), 30);
    return { ...message, sender, receiver, map, ctx, bubble, up, down, cipher: `${hex(4)}…${hex(4)}`, shown: "" };
  });

  const caption = text([{ text: "Secure Chat · end-to-end encrypted, the server only holds ciphertext", font: '500 46px "IBM Plex Sans", sans-serif', color: ICE }], 1600, 120, keep, PLATE);
  caption.scale.set(230, 17.3, 1);
  caption.position.set(0, 30, 50);
  content.add(caption);

  const update = (seconds: number) => {
    kit.tick(seconds);
    const cycle = seconds % CYCLE;
    const out = 1 - smoothstep(cycle, CYCLE - 0.6, CYCLE);
    const online = cycle < WIPE;

    const exchange = clamp((cycle - EXCHANGE.start) / EXCHANGE.duration, 0, 1);
    const derived = smoothstep(cycle, EXCHANGE.derive, EXCHANGE.derive + 0.5) * out;
    peers.forEach((peer, i) => {
      peer.fill.opacity = online ? 0.15 : 0.04;
      peer.edge.opacity = online ? 0.9 : 0.3;
      (peer.dot.material as THREE.MeshBasicMaterial).color.set(online ? "#22c55e" : RED);
      peer.own.position.copy(holder(peer.at, -1));
      peer.own.scale.setScalar(Math.max(1 - derived, 0.001) * out);
      peer.lock.scale.setScalar(Math.max(derived * (online ? 1 : 1 - smoothstep(cycle, WIPE, WIPE + 0.5)), 0.001));
      peer.lock.rotation.y = seconds * 0.8;
      const travelling = cycle >= EXCHANGE.start;
      routes[i].getPoint(exchange, keys[i].position);
      keys[i].visible = travelling;
      keys[i].scale.setScalar(Math.max(1 - derived, 0.001) * out);
      keys[i].rotation.y = seconds * 3;
      trails[i].forEach((s, k) => {
        routes[i].getPoint(clamp(exchange - (k + 1) * 0.06, 0, 1), s.position);
        s.visible = exchange > 0 && exchange < 1;
        s.scale.setScalar(8);
      });
      (wires[i].material as THREE.MeshBasicMaterial).opacity = exchange > 0 && exchange < 1 ? 0.7 : 0.2;
    });

    bubbles.forEach((b, i) => {
      const r = cycle - b.start;
      const live = r >= 0 && r < STEPS.gone;
      b.bubble.visible = live;
      const stored = r >= STEPS.store && online;
      const slot = slots[i].material as THREE.MeshBasicMaterial;
      slot.color.set(cycle >= WIPE && cycle < WIPE + 0.6 ? RED : b.sender.color);
      slot.opacity = cycle >= WIPE ? 0.9 * (1 - smoothstep(cycle, WIPE, WIPE + 0.8)) : stored ? 0.75 : 0.1;
      if (!live) return;
      const scrambling = r >= STEPS.scramble && r < STEPS.send;
      const unscrambling = r >= STEPS.open && r < STEPS.open + 0.5;
      const plain = r < STEPS.scramble || r >= STEPS.open + 0.5;
      const noise = scrambling || unscrambling;
      const tint = r >= STEPS.open ? b.receiver.color : b.sender.color;
      const state = `${plain}${tint}${noise ? Math.floor(seconds * 12) : ""}`;
      if (state !== b.shown) {
        b.shown = state;
        paintBubble(b.ctx, plain, noise ? `${hex(4)}…${hex(4)}` : plain ? b.text : b.cipher, tint);
        b.map.needsUpdate = true;
      }
      if (r < STEPS.send) b.up.getPoint(0, b.bubble.position);
      else if (r < STEPS.store) b.up.getPoint(smoothstep(r, STEPS.send, STEPS.store), b.bubble.position);
      else if (r < STEPS.forward) b.up.getPoint(1, b.bubble.position);
      else b.down.getPoint(smoothstep(r, STEPS.forward, STEPS.open), b.bubble.position);
      b.bubble.scale.setScalar(Math.max(smoothstep(r, 0, STEPS.appear) * (1 - smoothstep(r, STEPS.gone - 0.4, STEPS.gone)), 0.001));
    });

    const relaying = cycle >= MESSAGES[0].start && cycle < WIPE;
    if (cycle >= WIPE) status.show("both left → memory wiped", RED);
    else if (relaying) status.show("stores ciphertext only", GOLD);
    else if (cycle >= EXCHANGE.start) status.show("relays public keys (ECDH P-256)", ICE);
    else status.show("", ICE);
    (status.sprite.material as THREE.SpriteMaterial).opacity = out;
  };

  return { group, update };
}

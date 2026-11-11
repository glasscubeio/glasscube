import * as THREE from "three";
import { canvasTexture, hologram, link, plate, stream, text, type Keep, type Plating, type Shade } from "@/hologram";

const VIOLET = "#8b5cf6";
const LIGHT = "#a78bfa";
const AMBER = "#fbbf24";
const RED = "#f87171";
const ICE = "#e2e2f0";
const MUTED = "#9b9bb5";
const SURFACE = "rgba(8, 8, 15, 0.9)";
const PLATE: Plating = [VIOLET, SURFACE];
const CYCLE = 16;
const HOP = 0.5;
const SERVER = new THREE.Vector3(0, 222, 0);
const QUEUE = { y: 195, slots: 3, size: 10, gap: 14 };
const BEAM_Y = 135;
const FRAME = { width: 80, height: 60, px: 7, turn: 0.3 };
const LIVE = 6.5;
const NEXT = 12.5;
const LEFT = 13;
const PEERS = [
  { nick: "neo", color: VIOLET, x: -160, named: 0.3, searching: 0.8 },
  { nick: "mina", color: AMBER, x: 160, named: 1.8, searching: 2.2 },
];
const QUEUED = { from: PEERS[0].searching + HOP, to: PEERS[1].searching + HOP };
const HOPS: { at: number; from: number; to: number; name: string }[] = [
  { at: 0.8, from: 0, to: -1, name: "find_match → waitingQueue" },
  { at: 2.2, from: 1, to: -1, name: "find_match" },
  { at: 2.7, from: -1, to: 0, name: "matched · shouldInitiate: true" },
  { at: 2.7, from: -1, to: 1, name: "matched · shouldInitiate: true" },
  { at: 3.4, from: 0, to: -1, name: "webrtc_offer (SDP)" },
  { at: 3.9, from: -1, to: 1, name: "webrtc_offer (SDP)" },
  { at: 4.5, from: 1, to: -1, name: "webrtc_answer (SDP)" },
  { at: 5, from: -1, to: 0, name: "webrtc_answer (SDP)" },
  { at: 5.6, from: 0, to: -1, name: "ice_candidate" },
  { at: 5.6, from: 1, to: -1, name: "ice_candidate" },
  { at: 6.1, from: -1, to: 1, name: "ice_candidate" },
  { at: 6.1, from: -1, to: 0, name: "ice_candidate" },
  { at: NEXT, from: 0, to: -1, name: "next" },
  { at: LEFT - HOP, from: -1, to: 1, name: "partner_left" },
];

const { smoothstep } = THREE.MathUtils;

function screen(peer: number, cycle: number) {
  const { named, searching } = PEERS[peer];
  if (cycle < named) return "pick a nickname";
  if (cycle < searching) return "ready";
  if (cycle < QUEUED.to) return "searching…";
  if (cycle < LIVE) return "connecting…";
  if (peer === 0 && cycle >= NEXT) return "next →";
  if (peer === 1 && cycle >= LEFT) return "partner left";
  return "LIVE";
}

function paintFrame(ctx: CanvasRenderingContext2D, nick: string, state: string, color: string) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  plate(ctx, width, height, [color, SURFACE]);
  ctx.textBaseline = "middle";
  ctx.font = '600 36px "IBM Plex Mono", monospace';
  ctx.fillStyle = color;
  ctx.fillText(nick, 34, 48);
  const live = state === "LIVE";
  if (live) {
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(width - 120, 48, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("LIVE", width - 100, 48);
    return;
  }
  ctx.textAlign = "center";
  ctx.fillStyle = MUTED;
  ctx.font = '500 34px "IBM Plex Mono", monospace';
  ctx.fillText(state, width / 2, 110);
  ctx.textAlign = "left";
}

export function buildStrangerHologram(shade: Shade, keep: Keep) {
  const kit = hologram(keep, shade, new THREE.Color(VIOLET), new THREE.Color(ICE));
  const { group, content, translucent, lines, mesh, outline, sparks, sign } = kit;
  const color = (value: string) => new THREE.Color(value);

  const peers = PEERS.map((peer, i) => {
    const side = i ? 1 : -1;
    const frame = new THREE.Group();
    frame.position.set(peer.x, 160, 0);
    frame.rotation.y = -side * FRAME.turn;
    content.add(frame);
    const map = canvasTexture(FRAME.width * FRAME.px, FRAME.height * FRAME.px, () => {}, keep);
    const ctx = (map.image as HTMLCanvasElement).getContext("2d")!;
    mesh(new THREE.PlaneGeometry(FRAME.width, FRAME.height), keep(new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false })), frame);
    const avatar = new THREE.Group();
    frame.add(avatar);
    const skin = translucent(0.55, color(peer.color));
    mesh(new THREE.SphereGeometry(9, 24, 16), skin, avatar, 0, 2, 6);
    mesh(new THREE.CylinderGeometry(10, 18, 14, 24, 1, true), skin, avatar, 0, -16, 6);
    return { ...peer, map, ctx, avatar, skin, shown: "" };
  });

  const unit = lines(0.8, color(LIGHT));
  outline(new THREE.BoxGeometry(40, 26, 26), unit, content).position.copy(SERVER);
  mesh(new THREE.BoxGeometry(40, 26, 26), translucent(0.08), content, SERVER.x, SERVER.y, SERVER.z);
  const name = text(
    [
      { text: "Socket.IO signaling", font: '600 44px "IBM Plex Sans", sans-serif', color: ICE },
      { text: "Bun · in-memory Map", font: '400 28px "IBM Plex Mono", monospace', color: LIGHT },
    ],
    640,
    150,
    keep,
  );
  name.scale.set(80, 18.75, 1);
  name.position.set(SERVER.x, SERVER.y + 32, 0);
  content.add(name);
  const slots = Array.from({ length: QUEUE.slots }, (_, i) =>
    mesh(new THREE.BoxGeometry(QUEUE.size, QUEUE.size, QUEUE.size), translucent(0.1, color(LIGHT)), content, (i - (QUEUE.slots - 1) / 2) * QUEUE.gap, QUEUE.y, 0),
  );
  const queue = text([{ text: "waitingQueue", font: '500 36px "IBM Plex Mono", monospace', color: MUTED }], 400, 70, keep);
  queue.scale.set(38, 6.65, 1);
  queue.position.set(0, QUEUE.y - 13, 0);
  content.add(queue);

  const port = (peer: number) => new THREE.Vector3(PEERS[peer].x + (peer ? -1 : 1) * (FRAME.width / 2 - 4), 186, 0);
  const hub = (peer: number) => SERVER.clone().add(new THREE.Vector3(peer ? 21 : -21, 0, 0));
  const signals = HOPS.map((hop) => {
    const peer = hop.from < 0 ? hop.to : hop.from;
    const curve = hop.from < 0 ? link(hub(peer), port(peer), 16) : link(port(peer), hub(peer), 16);
    return { ...hop, curve, sprites: sparks(2, AMBER) };
  });
  const wires = [0, 1].map((peer) => mesh(new THREE.TubeGeometry(link(port(peer), hub(peer), 16), 32, 0.6, 6), translucent(0.2, color(AMBER)), content));

  const ends = [0, 1].map((peer) => new THREE.Vector3(PEERS[peer].x + (peer ? -1 : 1) * (FRAME.width / 2 - 4), BEAM_Y, 0));
  const beamCurve = link(ends[0], ends[1], 20);
  const backCurve = link(ends[1], ends[0], 20);
  const beam = mesh(new THREE.TubeGeometry(beamCurve, 64, 1.6, 8), translucent(0, color(LIGHT)), content);
  const video = [sparks(5, VIOLET), sparks(5, AMBER)];
  const status = sign(1200, 90, 130);
  status.sprite.position.set(0, 108, 20);

  const caption = text([{ text: "Hello Stranger · matched over Socket.IO, video goes peer-to-peer over WebRTC", font: '500 46px "IBM Plex Sans", sans-serif', color: ICE }], 1800, 120, keep, PLATE);
  caption.scale.set(250, 16.7, 1);
  caption.position.set(0, 30, 50);
  content.add(caption);

  const update = (seconds: number) => {
    kit.tick(seconds);
    const cycle = seconds % CYCLE;
    const out = 1 - smoothstep(cycle, CYCLE - 0.6, CYCLE);
    const live = cycle >= LIVE && cycle < NEXT;

    peers.forEach((peer, i) => {
      const state = screen(i, cycle);
      if (state !== peer.shown) {
        peer.shown = state;
        paintFrame(peer.ctx, cycle >= peer.named ? peer.nick : "", state, peer.color);
        peer.map.needsUpdate = true;
      }
      const present = cycle >= peer.named && !(i === 1 ? cycle >= LEFT : cycle >= LEFT + HOP);
      peer.avatar.scale.setScalar(Math.max((present ? 1 : 0) * out, 0.001));
      peer.avatar.position.y = live ? Math.sin(seconds * 2.4 + i) * 1.5 : 0;
      peer.avatar.rotation.y = live ? Math.sin(seconds * 1.3 + i * 2) * 0.25 : 0;
    });

    let latest = "";
    signals.forEach((s) => {
      const age = cycle - s.at;
      const moving = age >= 0 && age < HOP;
      stream(s.sprites, s.curve, age, HOP, 0.12, moving ? 8 : 0);
      if (age >= 0) latest = s.name;
    });
    wires.forEach((w) => ((w.material as THREE.MeshBasicMaterial).opacity = live ? 0.06 : 0.2));
    slots.forEach((slot, i) => ((slot.material as THREE.MeshBasicMaterial).opacity = i === 0 && cycle >= QUEUED.from && cycle < QUEUED.to ? 0.85 : 0.1));

    (beam.material as THREE.MeshBasicMaterial).opacity = live ? 0.35 + 0.15 * Math.sin(seconds * 6) : 0;
    stream(video[0], beamCurve, cycle - LIVE, 0.9, 0.18, live ? 7 : 0);
    stream(video[1], backCurve, cycle - LIVE - 0.09, 0.9, 0.18, live ? 7 : 0);

    if (cycle >= LEFT) status.show("disconnect → nickname freed", RED);
    else if (live) status.show("direct peer-to-peer video · no server relay", LIGHT);
    else status.show(latest, AMBER);
    (status.sprite.material as THREE.SpriteMaterial).opacity = out;
  };

  return { group, update };
}

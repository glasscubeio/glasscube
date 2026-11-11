import * as THREE from "three";
import { canvasTexture, glow, hologram, plate, text, vertex, type Keep, type Plating, type Shade } from "@/hologram";

const CYAN = new THREE.Color(0x19c3f2);
const ICE = new THREE.Color(0xbff3ff);
const PLATE: Plating = ["rgba(95, 212, 245, 0.95)", "rgba(5, 28, 46, 0.86)"];
const CYCLE = 14;
const MOVE = { start: 1, every: 2.4, duration: 1.4 };
const STEPS = [
  { title: "Tap Send", detail: "POST /api/wallet/send" },
  { title: "Email code", detail: "6 digits, bound to this transfer" },
  { title: "CDP signs", detail: "EIP-3009 · no gas, no ETH" },
  { title: "Operator pays gas", detail: "transferWithAuthorization" },
  { title: "Base Sepolia", detail: "USDC contract settles" },
  { title: "Recipient", detail: "full amount, nothing skimmed" },
];
const LAST = STEPS.length - 1;
const RING = { x: 195, y: 90, center: 150, from: 215, to: -35 };
const STATIONS = STEPS.map((_, i) => {
  const angle = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(RING.from, RING.to, i / LAST));
  return new THREE.Vector3(Math.cos(angle) * RING.x, RING.center + Math.sin(angle) * RING.y, -20 - Math.sin(angle) * 25);
});

const arrival = (k: number) => (k === 0 ? 0.4 : MOVE.start + (k - 1) * MOVE.every + MOVE.duration);

function progress(time: number) {
  for (let s = 0; s < LAST; s++) {
    const start = MOVE.start + s * MOVE.every;
    if (time < start) return s;
    if (time < start + MOVE.duration) return s + THREE.MathUtils.smoothstep(time, start, start + MOVE.duration);
  }
  return LAST;
}

export function buildWalletHologram(screenshot: string, shade: Shade, keep: Keep) {
  const kit = hologram(keep, shade, CYAN, ICE);
  const { group, content, time, translucent, lines, mesh, outline } = kit;

  const coin = new THREE.Group();
  coin.position.set(0, RING.center, 30);
  content.add(coin);
  const face = canvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = "#06263a";
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#7fe6ff";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(128, 128, 104, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#bff3ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '600 120px "IBM Plex Sans", sans-serif';
    ctx.fillText("$", 128, 116);
    ctx.font = '600 34px "IBM Plex Mono", monospace';
    ctx.fillText("USDC", 128, 196);
  }, keep);
  const faceMaterial = keep(new THREE.MeshBasicMaterial({ map: face, transparent: true, opacity: 0.92, depthWrite: false }));
  const coinBody = mesh(new THREE.CylinderGeometry(30, 30, 5, 64), [translucent(0.85), faceMaterial, faceMaterial], coin);
  coinBody.rotation.x = Math.PI / 2;
  const orbits = [0, 1].map((i) => {
    const ring = mesh(new THREE.TorusGeometry(42 + i * 8, 0.8, 6, 96), translucent(0.8), coin);
    ring.rotation.set(Math.PI / 2 + (i ? 0.5 : -0.4), i ? 0.3 : -0.2, 0);
    return ring;
  });

  const curve = new THREE.CatmullRomCurve3(STATIONS, false, "centripetal");
  const trail = keep(new THREE.ShaderMaterial({
    uniforms: { time, progress: { value: 0 }, color: { value: CYAN } },
    vertexShader: vertex,
    fragmentShader: `uniform float time;
uniform float progress;
uniform vec3 color;
varying vec2 vUv;
void main() {
  float dash = step(0.45, fract(vUv.x * 60.0 - time * 1.2));
  float lit = step(vUv.x, progress);
  gl_FragColor = vec4(mix(color, vec3(0.75, 0.97, 1.0), lit * 0.6), mix(0.22, 0.95, lit) * (0.45 + 0.55 * dash));
}`,
    transparent: true,
    depthWrite: false,
  }));
  mesh(new THREE.TubeGeometry(curve, 240, 1.7, 8), trail, content);
  const tToU = (t: number) => {
    let low = 0;
    let high = 1;
    for (let i = 0; i < 18; i++) {
      const middle = (low + high) / 2;
      if (curve.getUtoTmapping(middle, 0) < t) low = middle;
      else high = middle;
    }
    return low;
  };

  const token = new THREE.Group();
  content.add(token);
  mesh(new THREE.CylinderGeometry(6, 6, 1.6, 32), translucent(1, ICE), token).rotation.x = Math.PI / 2;
  const tokenGlow = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: glow(keep, "rgba(220, 250, 255, 1)", "rgba(60, 200, 245, 0.6)", "rgba(15, 182, 232, 0)"), transparent: true, depthWrite: false })));
  tokenGlow.scale.setScalar(34);
  token.add(tokenGlow);

  const plateMap = canvasTexture(400, 280, (ctx) => plate(ctx, 400, 280, PLATE), keep);
  const plateGeometry = keep(new THREE.PlaneGeometry(100, 70));
  const stations = STEPS.map((step, i) => {
    const station = new THREE.Group();
    station.position.copy(STATIONS[i]);
    content.add(station);
    const backing = keep(new THREE.MeshBasicMaterial({ map: plateMap, transparent: true, depthWrite: false }));
    const board = new THREE.Mesh(plateGeometry, backing);
    board.position.set(0, 4, -3);
    station.add(board);
    const stroke = lines(0.4);
    const fill = translucent(0.08);
    const label = text(
      [
        { text: `0${i + 1} · ${step.title}`, font: '600 44px "IBM Plex Sans", sans-serif', color: "#bff3ff" },
        { text: step.detail, font: '400 28px "IBM Plex Mono", monospace', color: "#5fd4f5" },
      ],
      640,
      150,
      keep,
    );
    label.scale.set(88, 20.6, 1);
    label.position.y = 26;
    station.add(label);
    const pulse = mesh(new THREE.RingGeometry(15, 16.6, 64), translucent(0), station);
    return { station, stroke, fill, label, pulse, backing };
  });

  const [send, email, sign, gas, chain, receive] = stations;
  const shot = keep(new THREE.TextureLoader().load(screenshot));
  shot.colorSpace = THREE.SRGBColorSpace;
  const card = mesh(
    new THREE.PlaneGeometry(64, 40),
    keep(new THREE.ShaderMaterial({
      uniforms: { time, glow: { value: 0 }, map: { value: shot } },
      vertexShader: vertex,
      fragmentShader: `uniform sampler2D map;
uniform float time;
uniform float glow;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(map, vUv).rgb;
  vec3 tint = vec3(0.35, 0.85, 1.0);
  float scan = 0.82 + 0.18 * sin(vUv.y * 260.0 - time * 6.0);
  float band = 0.85 + 0.15 * smoothstep(0.0, 0.1, abs(fract(vUv.y * 0.5 - time * 0.12) - 0.5));
  vec2 e = min(vUv, 1.0 - vUv);
  float edge = 1.0 - smoothstep(0.0, 0.025, min(e.x, e.y));
  vec3 col = mix(c, c * tint + tint * 0.15, 0.45) * scan * band;
  col = mix(col, vec3(0.6, 0.95, 1.0), edge);
  float flicker = 0.94 + 0.06 * sin(time * 41.0) * sin(time * 17.0);
  gl_FragColor = vec4(col * flicker * (0.65 + 0.35 * glow), 0.92);
}`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })),
    send.station,
    0,
    6,
  );
  card.rotation.x = -0.12;

  outline(new THREE.BoxGeometry(36, 24, 2), email.stroke, email.station);
  mesh(new THREE.PlaneGeometry(36, 24), email.fill, email.station);
  const flap = new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-18, 12, 1.2), new THREE.Vector3(0, -1, 1.2), new THREE.Vector3(18, 12, 1.2)])), email.stroke);
  email.station.add(flap);
  const code = text([{ text: "4 8 2 9 1 7", font: '600 64px "IBM Plex Mono", monospace', color: "#bff3ff" }], 512, 110, keep);
  code.scale.set(44, 9.5, 1);
  code.position.set(0, -20, 4);
  email.station.add(code);

  const key = outline(new THREE.OctahedronGeometry(12, 0), sign.stroke, sign.station);
  mesh(new THREE.OctahedronGeometry(12, 0), sign.fill, key);
  const scribble = Array.from({ length: 80 }, (_, i) => {
    const t = i / 79;
    return new THREE.Vector3(-22 + 44 * t, -20 + Math.sin(t * 15) * 4 * (1 - t * 0.5) + Math.sin(t * 40) * 1.2, 3);
  });
  const signature = new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints(scribble)), lines(1));
  sign.station.add(signature);

  outline(new THREE.BoxGeometry(18, 22, 12), gas.stroke, gas.station).position.y = -10;
  mesh(new THREE.BoxGeometry(18, 22, 12), gas.fill, gas.station, 0, -10, 0);
  const flame = new THREE.Group();
  flame.position.y = 2;
  gas.station.add(flame);
  mesh(new THREE.ConeGeometry(7, 20, 24), translucent(0.55), flame, 0, 10, 0);
  mesh(new THREE.ConeGeometry(3.5, 12, 16), translucent(0.9, ICE), flame, 0, 6, 0);

  const blocks = [0, 1, 2, 3].map((k) => {
    const block = new THREE.Group();
    block.position.x = -27 + k * 18;
    chain.station.add(block);
    outline(new THREE.BoxGeometry(12, 12, 12), chain.stroke, block);
    mesh(new THREE.BoxGeometry(12, 12, 12), chain.fill, block);
    return block;
  });
  outline(new THREE.BoxGeometry(54, 0.1, 0.1), chain.stroke, chain.station);

  outline(new THREE.BoxGeometry(38, 24, 3), receive.stroke, receive.station);
  mesh(new THREE.PlaneGeometry(38, 24), receive.fill, receive.station);
  const amount = text([{ text: "+2.00 USDC", font: '600 64px "IBM Plex Mono", monospace', color: "#bff3ff" }], 512, 110, keep);
  amount.scale.set(40, 8.6, 1);
  amount.position.z = 3;
  receive.station.add(amount);
  const burst = mesh(new THREE.RingGeometry(20, 22, 64), translucent(0), receive.station);

  const caption = text([{ text: "Gasless USDC on Base · the user never pays gas", font: '500 46px "IBM Plex Sans", sans-serif', color: "#bff3ff" }], 1280, 120, keep, PLATE);
  caption.scale.set(190, 17.8, 1);
  caption.position.set(0, 68, 45);
  content.add(caption);

  const update = (seconds: number) => {
    kit.tick(seconds);
    const cycle = seconds % CYCLE;
    const p = progress(cycle);
    const t = p / LAST;
    curve.getPoint(t, token.position);
    trail.uniforms.progress.value = tToU(t);
    token.rotation.y = seconds * 4;
    const fade = THREE.MathUtils.smoothstep(cycle, 0, 0.4) * (1 - THREE.MathUtils.smoothstep(cycle, CYCLE - 0.6, CYCLE));
    token.scale.setScalar(Math.max(fade, 0.001));

    stations.forEach((s, i) => {
      const age = cycle - arrival(i);
      const lit = age >= 0 ? 1 : 0;
      s.stroke.opacity = 0.35 + 0.65 * lit;
      s.fill.opacity = 0.05 + 0.15 * lit;
      s.backing.opacity = 0.55 + 0.45 * lit;
      (s.label.material as THREE.SpriteMaterial).opacity = 0.45 + 0.55 * lit;
      const ring = THREE.MathUtils.clamp(age, 0, 1);
      s.pulse.scale.setScalar(1 + ring * 2.2);
      (s.pulse.material as THREE.MeshBasicMaterial).opacity = age >= 0 && age < 1 ? 1 - ring : 0;
    });
    const age = (k: number) => cycle - arrival(k);
    (card.material as THREE.ShaderMaterial).uniforms.glow.value = age(0) >= 0 ? 1 : 0;
    (code.material as THREE.SpriteMaterial).opacity = THREE.MathUtils.clamp(age(1) * 2, 0, 1) * (0.85 + 0.15 * Math.sin(seconds * 30));
    key.rotation.y = seconds * (age(2) >= 0 ? 2.4 : 0.6);
    signature.geometry.setDrawRange(0, Math.floor(THREE.MathUtils.clamp(age(2) / 1.2, 0, 1) * scribble.length));
    const burn = age(3) >= 0 ? 1 : 0.3;
    flame.scale.set(burn, burn * (0.85 + 0.25 * Math.sin(seconds * 23) * Math.sin(seconds * 7)), burn);
    blocks[3].scale.setScalar(Math.max(THREE.MathUtils.clamp(age(4) * 3, 0, 1), 0.001));
    blocks.forEach((b, k) => (b.rotation.y = seconds * 0.6 + k * 0.4));
    (amount.material as THREE.SpriteMaterial).opacity = THREE.MathUtils.clamp(age(5) * 2, 0, 1);
    const b = THREE.MathUtils.clamp(age(5) / 1.4, 0, 1);
    burst.scale.setScalar(1 + b * 3);
    (burst.material as THREE.MeshBasicMaterial).opacity = age(5) >= 0 ? 1 - b : 0;

    coin.rotation.y = seconds * (age(5) >= 0 && age(5) < 1.4 ? 6 : 1.2);
    orbits.forEach((o, i) => (o.rotation.z = seconds * (i ? -0.8 : 0.6)));
  };

  return { group, update };
}

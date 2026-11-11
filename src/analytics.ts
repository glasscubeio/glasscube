import * as THREE from "three";
import { canvasTexture, hologram, link, plate, stream, text, type Keep, type Plating, type Shade } from "@/hologram";

const VIOLET = "#7c3aed";
const LIGHT = "#c4b5fd";
const ICE = "#ede9fe";
const GREEN = "#10b981";
const AMBER = "#fbbf24";
const MUTED = "#a1a1aa";
const SURFACE = "rgba(12, 8, 24, 0.9)";
const PLATE: Plating = [VIOLET, SURFACE];
const CYCLE = 16;
const DEVICES = ["desktop", "mobile", "tablet"] as const;
const VISITS = [
  { device: 0, country: "KR", session: 1, load: 420 },
  { device: 1, country: "UZ", session: 2, load: 610 },
  { device: 0, country: "KR", session: 1, load: 380 },
  { device: 2, country: "US", session: 3, load: 520 },
  { device: 1, country: "KR", session: 4, load: 700 },
  { device: 0, country: "DE", session: 5, load: 450 },
  { device: 1, country: "UZ", session: 2, load: 590 },
  { device: 0, country: "KR", session: 6, load: 400 },
];
const HISTORY = [5, 9, 6, 12, 8, 4, 7];
const BEACON = { start: 0.4, every: 0.9, hop: 0.45 };
const CRON = 8.6;
const AGGREGATE = 0.9;
const SITE = new THREE.Vector3(-172, 205, 0);
const TRAFFIC = new THREE.Vector3(-70, 205, 0);
const MONGO = new THREE.Vector3(30, 170, 0);
const CLOCK = new THREE.Vector3(30, 112, 0);
const DASH = { x: 155, y: 160, width: 112, height: 88, px: 8 };
const DISC = { radius: 18, height: 2.4, gap: 3.2 };

const { clamp, smoothstep } = THREE.MathUtils;

function summarize() {
  const sessions = new Map<number, { count: number; device: number }>();
  for (const v of VISITS) sessions.set(v.session, { count: (sessions.get(v.session)?.count ?? 0) + 1, device: sessions.get(v.session)?.device ?? v.device });
  const devices = DEVICES.map((_, d) => [...sessions.values()].filter((s) => s.device === d).length);
  const countries = [...new Set(VISITS.map((v) => v.country))]
    .map((country) => ({ country, visits: VISITS.filter((v) => v.country === country).length }))
    .sort((a, b) => b.visits - a.visits);
  return {
    visits: VISITS.length,
    visitors: sessions.size,
    bounce: Math.round(([...sessions.values()].filter((s) => s.count === 1).length / sessions.size) * 100),
    load: Math.round(VISITS.reduce((sum, v) => sum + v.load, 0) / VISITS.length),
    devices,
    countries,
  };
}

function paintDashboard(ctx: CanvasRenderingContext2D, metric: ReturnType<typeof summarize> | undefined) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  plate(ctx, width, height, PLATE);
  ctx.textBaseline = "middle";
  ctx.fillStyle = ICE;
  ctx.font = '600 36px "IBM Plex Sans", sans-serif';
  ctx.fillText("glasscube.uz · 24h", 40, 52);
  const tiles = [
    { label: "Visits", value: metric ? String(metric.visits) : "—" },
    { label: "Visitors", value: metric ? String(metric.visitors) : "—" },
    { label: "Bounce", value: metric ? `${metric.bounce}%` : "—" },
    { label: "Avg load", value: metric ? `${metric.load} ms` : "—" },
  ];
  const tile = (width - 80 - 3 * 16) / 4;
  tiles.forEach((t, i) => {
    const x = 40 + i * (tile + 16);
    ctx.fillStyle = "rgba(124, 58, 237, 0.16)";
    ctx.beginPath();
    ctx.roundRect(x, 90, tile, 110, 14);
    ctx.fill();
    ctx.fillStyle = MUTED;
    ctx.font = '400 24px "IBM Plex Mono", monospace';
    ctx.fillText(t.label, x + 16, 120);
    ctx.fillStyle = ICE;
    ctx.font = '600 40px "IBM Plex Sans", sans-serif';
    ctx.fillText(t.value, x + 16, 168, tile - 24);
  });

  const bars = metric ? [...HISTORY, metric.visits] : HISTORY;
  const chart = { x: 40, y: 240, width: 520, height: 300 };
  const peak = Math.max(...HISTORY, VISITS.length);
  const slot = chart.width / (HISTORY.length + 1);
  ctx.fillStyle = MUTED;
  ctx.font = '400 22px "IBM Plex Mono", monospace';
  ctx.fillText("visits per 15 min", chart.x, chart.y);
  bars.forEach((v, i) => {
    const h = (v / peak) * (chart.height - 50);
    ctx.fillStyle = metric && i === bars.length - 1 ? LIGHT : "rgba(196, 181, 253, 0.45)";
    ctx.fillRect(chart.x + i * slot + 6, chart.y + chart.height - h, slot - 12, h);
  });

  const side = { x: 600, y: 240 };
  ctx.fillStyle = MUTED;
  ctx.fillText("devices", side.x, side.y);
  DEVICES.forEach((d, i) => {
    const y = side.y + 44 + i * 40;
    const share = metric ? metric.devices[i] / metric.visitors : 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(side.x + 110, y - 10, 200, 20);
    ctx.fillStyle = [VIOLET, GREEN, AMBER][i];
    ctx.fillRect(side.x + 110, y - 10, 200 * share, 20);
    ctx.fillStyle = ICE;
    ctx.fillText(d, side.x, y);
  });
  ctx.fillStyle = MUTED;
  ctx.fillText("countries", side.x, side.y + 190);
  (metric?.countries ?? []).slice(0, 3).forEach((c, i) => {
    ctx.fillStyle = ICE;
    ctx.fillText(`${c.country}  ${c.visits}`, side.x, side.y + 232 + i * 36);
  });
}

export function buildAnalyticsHologram(shade: Shade, keep: Keep) {
  const kit = hologram(keep, shade, new THREE.Color(VIOLET), new THREE.Color(ICE));
  const { group, content, translucent, lines, mesh, outline, sparks, sign } = kit;
  const color = (value: string) => new THREE.Color(value);
  const metric = summarize();

  const label = (title: string, detail: string, at: THREE.Vector3) => {
    const sprite = text(
      [
        { text: title, font: '600 44px "IBM Plex Sans", sans-serif', color: ICE },
        { text: detail, font: '400 28px "IBM Plex Mono", monospace', color: LIGHT },
      ],
      640,
      150,
      keep,
    );
    sprite.scale.set(80, 18.75, 1);
    sprite.position.copy(at);
    content.add(sprite);
  };

  const site = canvasTexture(560, 368, (ctx) => {
    plate(ctx, 560, 368, PLATE);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(10, 10, 540, 56);
    ["#f87171", AMBER, GREEN].forEach((dot, i) => {
      ctx.fillStyle = dot;
      ctx.beginPath();
      ctx.arc(44 + i * 34, 38, 10, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = '500 34px "IBM Plex Mono", monospace';
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e06c75";
    ctx.fillText("<script>", 40, 140);
    ctx.fillStyle = LIGHT;
    ctx.fillText("  sendBeacon(…)", 40, 200);
    ctx.fillStyle = "#e06c75";
    ctx.fillText("</script>", 40, 260);
  }, keep);
  mesh(new THREE.PlaneGeometry(70, 46), keep(new THREE.MeshBasicMaterial({ map: site, transparent: true, depthWrite: false })), content, SITE.x, SITE.y, 0);
  label("Your Website", "one <script> tag", new THREE.Vector3(SITE.x, SITE.y + 36, 0));

  const glyphs = [
    { size: [24, 16], x: -26 },
    { size: [9, 16], x: 0 },
    { size: [14, 18], x: 22 },
  ].map(({ size: [w, h], x }) => {
    const fill = translucent(0.08);
    mesh(new THREE.BoxGeometry(w, h, 2), fill, content, SITE.x + x, SITE.y - 52, 0);
    outline(new THREE.BoxGeometry(w, h, 2), lines(0.8, color(LIGHT)), content).position.set(SITE.x + x, SITE.y - 52, 0);
    return fill;
  });

  const unit = lines(0.8, color(LIGHT));
  outline(new THREE.BoxGeometry(40, 30, 30), unit, content).position.copy(TRAFFIC);
  mesh(new THREE.BoxGeometry(40, 30, 30), translucent(0.08), content, TRAFFIC.x, TRAFFIC.y, TRAFFIC.z);
  label("Traffic Server", "Bun · GeoLite2", new THREE.Vector3(TRAFFIC.x, TRAFFIC.y + 34, 0));
  const geo = sign(320, 90, 26, [AMBER, SURFACE]);
  geo.sprite.position.set(TRAFFIC.x, TRAFFIC.y - 30, 10);

  const discs = VISITS.map((_, i) => mesh(new THREE.CylinderGeometry(DISC.radius, DISC.radius, DISC.height, 32), translucent(0.55, color(GREEN)), content, MONGO.x, MONGO.y - 14 + i * DISC.gap, 0));
  outline(new THREE.CylinderGeometry(DISC.radius + 2, DISC.radius + 2, VISITS.length * DISC.gap + 8, 32, 1, true), lines(0.35, color(GREEN)), content).position.set(MONGO.x, MONGO.y - 14 + (VISITS.length * DISC.gap) / 2 - 2, 0);
  label("MongoDB", "Track collection", new THREE.Vector3(MONGO.x, MONGO.y + 38, 0));

  const dial = new THREE.Group();
  dial.position.copy(CLOCK);
  content.add(dial);
  mesh(new THREE.TorusGeometry(16, 1, 8, 64), translucent(0.8, color(LIGHT)), dial);
  const sweep = mesh(new THREE.RingGeometry(0, 15, 64, 1, Math.PI / 2), translucent(0.25, color(VIOLET)), dial);
  sweep.rotation.y = Math.PI;
  const hand = new THREE.Group();
  dial.add(hand);
  mesh(new THREE.BoxGeometry(1.6, 13, 1.6).translate(0, 6.5, 0), translucent(1, color(ICE)), hand);
  const cron = text([{ text: "cron */15 * * * *", font: '500 40px "IBM Plex Mono", monospace', color: LIGHT }], 480, 80, keep);
  cron.scale.set(46, 7.7, 1);
  cron.position.set(CLOCK.x, CLOCK.y - 26, 0);
  content.add(cron);

  const board = canvasTexture(DASH.width * DASH.px, DASH.height * DASH.px, () => {}, keep);
  const boardContext = (board.image as HTMLCanvasElement).getContext("2d")!;
  const dashboard = mesh(new THREE.PlaneGeometry(DASH.width, DASH.height), keep(new THREE.MeshBasicMaterial({ map: board, transparent: true, depthWrite: false })), content, DASH.x, DASH.y, 0);
  dashboard.rotation.y = -0.3;
  label("Your Dashboard", "Metric · 15-min snapshot", new THREE.Vector3(DASH.x, DASH.y + DASH.height / 2 + 14, 0));
  let painted: boolean | undefined;

  const hop = (from: THREE.Vector3, to: THREE.Vector3) => link(from, to, 18);
  const routes = [
    hop(SITE.clone().add(new THREE.Vector3(36, 0, 0)), TRAFFIC.clone().add(new THREE.Vector3(-21, 0, 0))),
    hop(TRAFFIC.clone().add(new THREE.Vector3(21, 0, 0)), MONGO.clone().add(new THREE.Vector3(-20, 10, 0))),
  ];
  routes.forEach((curve) => mesh(new THREE.TubeGeometry(curve, 32, 0.6, 6), translucent(0.25), content));
  const beacons = routes.map(() => sparks(1, LIGHT));
  const pipe = hop(MONGO.clone().add(new THREE.Vector3(20, 0, 0)), new THREE.Vector3(DASH.x - DASH.width / 2, DASH.y, 0));
  const flow = sparks(5, VIOLET);
  const beaconSign = text([{ text: "navigator.sendBeacon", font: '500 36px "IBM Plex Mono", monospace', color: LIGHT }], 480, 70, keep);
  beaconSign.scale.set(44, 6.4, 1);
  beaconSign.position.set((SITE.x + TRAFFIC.x) / 2, SITE.y + 20, 10);
  content.add(beaconSign);

  const caption = text([{ text: "Analytics · one script tag in, a full dashboard out", font: '500 46px "IBM Plex Sans", sans-serif', color: ICE }], 1300, 120, keep, PLATE);
  caption.scale.set(180, 16.6, 1);
  caption.position.set(0, 30, 50);
  content.add(caption);

  const update = (seconds: number) => {
    kit.tick(seconds);
    const cycle = seconds % CYCLE;
    const out = 1 - smoothstep(cycle, CYCLE - 0.6, CYCLE);

    let country = "";
    VISITS.forEach((v, i) => {
      const age = cycle - BEACON.start - i * BEACON.every;
      if (age >= 0 && age < BEACON.every) {
        glyphs.forEach((g, d) => (g.opacity = d === v.device ? 0.7 : 0.08));
        if (age >= BEACON.hop) country = `${v.country} · ${DEVICES[v.device]}`;
      }
      const stored = age >= BEACON.hop * 2 ? out : 0;
      discs[i].scale.set(1, Math.max(stored, 0.001), 1);
    });
    if (cycle > BEACON.start + VISITS.length * BEACON.every) glyphs.forEach((g) => (g.opacity = 0.08));
    const latest = Math.floor((cycle - BEACON.start) / BEACON.every);
    const age = cycle - BEACON.start - latest * BEACON.every;
    const live = latest >= 0 && latest < VISITS.length;
    stream(beacons[0], routes[0], age, BEACON.hop, 0, live && age < BEACON.hop ? 9 : 0);
    stream(beacons[1], routes[1], age - BEACON.hop, BEACON.hop, 0, live && age >= BEACON.hop && age < BEACON.hop * 2 ? 9 : 0);
    geo.show(country, AMBER);

    const turn = clamp(cycle / CRON, 0, 1);
    hand.rotation.z = -turn * Math.PI * 2;
    sweep.geometry.setDrawRange(0, Math.round(turn * 64) * 6);
    (sweep.material as THREE.MeshBasicMaterial).opacity = cycle >= CRON && cycle < CRON + AGGREGATE ? 0.7 : 0.25;
    stream(flow, pipe, cycle - CRON, AGGREGATE / 2, 0.1, cycle >= CRON && cycle < CRON + AGGREGATE ? 8 : 0);

    const aggregated = cycle >= CRON + AGGREGATE / 2 && out > 0.5;
    if (aggregated !== painted) {
      painted = aggregated;
      paintDashboard(boardContext, aggregated ? metric : undefined);
      board.needsUpdate = true;
    }
  };

  return { group, update };
}

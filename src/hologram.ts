import * as THREE from "three";

export type Keep = <T extends { dispose(): void }>(item: T) => T;
export type Shade = (...stops: [string, string, string]) => THREE.Material;
export type Line = { text: string; font: string; color: string };
export type Node = { label: string; sub: string; color: string };

export const vertex = `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export function canvasTexture(width: number, height: number, paint: (ctx: CanvasRenderingContext2D) => void, keep: Keep) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  paint(canvas.getContext("2d")!);
  const texture = keep(new THREE.CanvasTexture(canvas));
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export type Plating = [stroke: string, fill: string];

export function plate(ctx: CanvasRenderingContext2D, width: number, height: number, [stroke, fill]: Plating) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(4, 4, width - 8, height - 8, 22);
  ctx.fill();
  ctx.stroke();
}

export function rounded(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

export function card(ctx: CanvasRenderingContext2D, node: Node, surface: string) {
  const { width, height } = ctx.canvas;
  plate(ctx, width, height, [node.color, surface]);
  ctx.fillStyle = node.color;
  ctx.beginPath();
  ctx.arc(52, height / 2, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = '600 56px "IBM Plex Sans", sans-serif';
  ctx.fillText(node.label, 90, height * 0.36, width - 120);
  ctx.fillStyle = node.color;
  ctx.font = '400 38px "IBM Plex Mono", monospace';
  ctx.fillText(node.sub, 90, height * 0.7, width - 120);
}

export function link(from: THREE.Vector3, to: THREE.Vector3, bulge: number) {
  const middle = (from.x + to.x) / 2;
  return new THREE.CubicBezierCurve3(
    from,
    new THREE.Vector3(middle, from.y, from.z + bulge),
    new THREE.Vector3(middle, to.y, to.z + bulge),
    to,
  );
}

function lettering(ctx: CanvasRenderingContext2D, lines: Line[], width: number, height: number) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  lines.forEach((line, i) => {
    const y = (height / (lines.length + 1)) * (i + 1);
    ctx.font = line.font;
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(3, 16, 28, 0.9)";
    ctx.strokeText(line.text, width / 2, y);
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, width / 2, y);
  });
}

export function text(lines: Line[], width: number, height: number, keep: Keep, plating?: Plating) {
  const map = canvasTexture(width, height, (ctx) => {
    if (plating) plate(ctx, width, height, plating);
    lettering(ctx, lines, width, height);
  }, keep);
  return new THREE.Sprite(keep(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false })));
}

export function glow(keep: Keep, ...stops: [string, string, string]) {
  return canvasTexture(128, 128, (ctx) => {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    [0, 0.3, 1].forEach((at, i) => gradient.addColorStop(at, stops[i]));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }, keep);
}

export function stream(sprites: THREE.Sprite[], curve: THREE.Curve<THREE.Vector3>, age: number, duration: number, gap: number, size: number) {
  sprites.forEach((sprite, k) => {
    const t = age - k * gap;
    sprite.visible = t >= 0 && size > 0;
    curve.getPoint((Math.max(t, 0) / duration) % 1, sprite.position);
    sprite.scale.setScalar(size);
  });
}

export function hologram(keep: Keep, shade: Shade, color: THREE.Color, ice: THREE.Color) {
  const group = new THREE.Group();
  const content = new THREE.Group();
  group.add(content);
  const time = { value: 0 };
  const translucent = (opacity: number, tint = color) =>
    keep(new THREE.MeshBasicMaterial({ color: tint, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }));
  const lines = (opacity: number, tint = ice) => keep(new THREE.LineBasicMaterial({ color: tint, transparent: true, opacity, depthWrite: false }));
  const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[], parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
    const object = new THREE.Mesh(keep(geometry), material);
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  };
  const outline = (geometry: THREE.BufferGeometry, material: THREE.LineBasicMaterial, parent: THREE.Object3D) => {
    const object = new THREE.LineSegments(keep(new THREE.EdgesGeometry(geometry)), material);
    geometry.dispose();
    parent.add(object);
    return object;
  };
  mesh(new THREE.CylinderGeometry(42, 48, 8, 48), shade("#9fb0c4", "#2f3a48", "#07090c"), group, 0, 4, 0);
  const core = mesh(new THREE.CircleGeometry(34, 48), translucent(0.9, ice), group, 0, 8.2, 0);
  core.rotation.x = -Math.PI / 2;
  mesh(new THREE.TorusGeometry(39, 1.4, 8, 64), translucent(1), group, 0, 8.5, 0).rotation.x = Math.PI / 2;
  const cone = mesh(
    new THREE.CylinderGeometry(200, 36, 230, 64, 1, true),
    keep(new THREE.ShaderMaterial({
      uniforms: { time, color: { value: color } },
      vertexShader: vertex,
      fragmentShader: `uniform float time;
uniform vec3 color;
varying vec2 vUv;
void main() {
  float fade = pow(1.0 - vUv.y, 1.8);
  float streak = 0.55 + 0.45 * sin(vUv.x * 75.0 + time * 1.7);
  float scan = 0.8 + 0.2 * sin(vUv.y * 90.0 - time * 5.0);
  gl_FragColor = vec4(color, fade * streak * scan * 0.26);
}`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })),
    group,
    0,
    123,
    0,
  );
  cone.renderOrder = -1;

  const sparkMap = glow(keep, "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0)");
  const sparks = (count: number, color: string) =>
    Array.from({ length: count }, () => {
      const sprite = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: sparkMap, color, transparent: true, depthWrite: false })));
      content.add(sprite);
      return sprite;
    });

  const sign = (width: number, height: number, scale: number, plating?: Plating) => {
    const map = canvasTexture(width, height, () => {}, keep);
    const ctx = (map.image as HTMLCanvasElement).getContext("2d")!;
    const sprite = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false })));
    sprite.scale.set(scale, (scale * height) / width, 1);
    content.add(sprite);
    let shown = "";
    const show = (body: string, tint: string) => {
      if (body + tint === shown) return;
      shown = body + tint;
      ctx.clearRect(0, 0, width, height);
      map.needsUpdate = true;
      if (!body) return;
      if (plating) plate(ctx, width, height, plating);
      lettering(ctx, [{ text: body, font: '500 44px "IBM Plex Mono", monospace', color: tint }], width, height);
    };
    return { sprite, show };
  };

  const acts = (count: number, length: number) => {
    const groups = Array.from({ length: count }, () => {
      const act = new THREE.Group();
      content.add(act);
      return act;
    });
    const show = (seconds: number) => {
      const cycle = seconds % (count * length);
      const act = Math.floor(cycle / length);
      const at = cycle - act * length;
      const presence = THREE.MathUtils.smoothstep(at, 0, 0.4) * (1 - THREE.MathUtils.smoothstep(at, length - 0.5, length));
      groups.forEach((g, k) => {
        g.visible = k === act;
        g.scale.setScalar(Math.max(presence, 0.001));
      });
      return { act, at };
    };
    return { groups, show };
  };

  const tick = (seconds: number) => {
    time.value = seconds;
    content.position.y = Math.sin(seconds * 0.8) * 2.5;
    (core.material as THREE.MeshBasicMaterial).opacity = 0.75 + 0.2 * Math.sin(seconds * 3);
  };

  return { group, content, time, translucent, lines, mesh, outline, sparks, sign, acts, tick };
}

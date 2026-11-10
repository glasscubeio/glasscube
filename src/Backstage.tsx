import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/addons/renderers/CSS3DRenderer.js";
import type { Lang } from "@/content";
import { buildExhibition, type Rect } from "@/exhibition";

const FOV = 50;
const EYE = 165;
const FACE = { width: 1100, lift: 300, z: 1100 };
const PAGE = { width: FACE.width, y: 530, z: 800 };
const TILT = THREE.MathUtils.degToRad(10);
const END = new THREE.Vector3(0, EYE, -400);
const STUDIO = { width: 1000, front: 60, curveAt: -700, radius: 220, height: 650 };
const FLOOR: Rect = {
  x: [-STUDIO.width / 2 + 40, STUDIO.width / 2 - 40],
  z: [STUDIO.curveAt + 20, STUDIO.front - 20],
};
const INTRO_MS = 2800;
const SPEED = 300;
const KEYS: Record<string, [number, number]> = {
  KeyW: [1, 0],
  ArrowUp: [1, 0],
  KeyS: [-1, 0],
  ArrowDown: [-1, 0],
  KeyA: [0, -1],
  ArrowLeft: [0, -1],
  KeyD: [0, 1],
  ArrowRight: [0, 1],
};

const { clamp, lerp, smoothstep } = THREE.MathUtils;
const phase = (t: number, from: number, to: number) => smoothstep(t, from, to);
const inside = ({ x, z }: Rect, px: number, pz: number) => px >= x[0] && px <= x[1] && pz >= z[0] && pz <= z[1];

function cyclorama({ width, front, curveAt, radius, height }: typeof STUDIO) {
  const profile: [number, number][] = [[front, 0]];
  for (let i = 0; i <= 32; i++) {
    const a = (i / 32) * (Math.PI / 2);
    profile.push([curveAt - Math.sin(a) * radius, radius - Math.cos(a) * radius]);
  }
  profile.push([curveAt - radius, height]);
  const positions = profile.flatMap(([z, y]) => [-width / 2, y, z, width / 2, y, z]);
  const index = profile.slice(1).flatMap((_, i) => {
    const a = i * 2;
    return [a, a + 2, a + 1, a + 1, a + 2, a + 3];
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

function averageColor(video: HTMLVideoElement, ctx: CanvasRenderingContext2D) {
  ctx.drawImage(video, 0, 0, 8, 8);
  const data = ctx.getImageData(0, 0, 8, 8).data;
  const sum = [0, 0, 0];
  for (let i = 0; i < data.length; i += 4) for (let c = 0; c < 3; c++) sum[c] += data[i + c];
  return sum.map((v) => v / 64 / 255) as [number, number, number];
}

export default function Backstage({
  children,
  scrollY,
  lang,
  labels,
  onExit,
  onOpen,
}: {
  children: ReactNode;
  scrollY: number;
  lang: Lang;
  labels: { exit: string; walk: string; noCamera: string };
  onExit: (scrollTop: number) => void;
  onOpen: (href: string) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [page] = useState(() => {
    const el = document.createElement("div");
    el.dataset.stage = "";
    Object.assign(el.style, {
      width: `${innerWidth}px`,
      height: `${innerHeight}px`,
      overflow: "auto",
      scrollbarWidth: "none",
      background:
        "linear-gradient(115deg, rgb(255 255 255 / 0.16), rgb(255 255 255 / 0.03) 35%, rgb(255 255 255 / 0) 60%, rgb(255 255 255 / 0.08)), rgb(190 215 255 / 0.05)",
      outline: "2px solid rgb(225 238 255 / 0.45)",
      boxShadow: "inset 0 0 0 6px rgb(255 255 255 / 0.04), inset 0 0 80px rgb(200 225 255 / 0.12), 0 0 160px rgb(150 195 255 / 0.2)",
    });
    return el;
  });
  const [cameraBlocked, setCameraBlocked] = useState(false);
  const exit = useRef(() => onExit(page.scrollTop));
  exit.current = () => onExit(page.scrollTop);
  const open = useRef(onOpen);
  open.current = onOpen;
  const initialLang = useRef(lang);
  const redraw = useRef<(lang: Lang) => void>(undefined);

  useEffect(() => {
    redraw.current?.(lang);
  }, [lang]);

  useEffect(() => {
    page.scrollTop = scrollY;
  }, [page, scrollY]);

  useEffect(() => {
    const root = stage.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 1, 12000);
    camera.rotation.order = "YXZ";

    const gl = new THREE.WebGLRenderer({ antialias: true });
    gl.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const css = new CSS3DRenderer();
    css.domElement.style.overflow = "clip";
    for (const el of [gl.domElement, css.domElement]) {
      el.style.position = "absolute";
      el.style.inset = "0";
      root.appendChild(el);
    }

    RectAreaLightUniformsLib.init();
    scene.background = new THREE.Color(0x000000);
    const wall = new THREE.MeshStandardMaterial({ color: 0xe6e6e3, roughness: 0.55, side: THREE.DoubleSide });
    scene.add(new THREE.Mesh(cyclorama(STUDIO), wall));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.06));
    const exhibition = buildExhibition(scene, initialLang.current);
    redraw.current = exhibition.redraw;
    const areas = [FLOOR, exhibition.walkable];
    const walkable = (x: number, z: number) => areas.some((area) => inside(area, x, z));

    const scale = PAGE.width / innerWidth;
    const pageObject = new CSS3DObject(page);
    pageObject.scale.setScalar(scale);
    pageObject.position.set(0, PAGE.y, PAGE.z);
    pageObject.rotation.x = -TILT;
    const normal = new THREE.Vector3(0, Math.sin(TILT), Math.cos(TILT));
    scene.add(pageObject);
    const glow = new THREE.RectAreaLight(0xcfe0ff, 4, PAGE.width, innerHeight * scale);
    glow.position.copy(pageObject.position);
    glow.rotation.x = -TILT;
    scene.add(glow);

    const video = document.createElement("video");
    video.muted = video.autoplay = video.playsInline = true;
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    const faceMaterial = new THREE.MeshBasicMaterial({ color: 0x15171a });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), faceMaterial);
    face.rotation.set(-TILT, Math.PI, 0);
    const fit = (aspect: number) => {
      face.scale.set(FACE.width, FACE.width / aspect, 1);
      face.position.set(0, FACE.lift + FACE.width / aspect / 2, FACE.z);
      faceLight.height = FACE.width / aspect;
      faceLight.position.copy(face.position);
    };
    const faceLight = new THREE.RectAreaLight(0xffffff, 0, FACE.width, FACE.width);
    faceLight.rotation.x = -TILT;
    fit(16 / 9);
    scene.add(face, faceLight);
    const sample = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
    video.onloadedmetadata = () => {
      fit(video.videoWidth / video.videoHeight);
      faceMaterial.color.set(0xffffff);
      faceMaterial.map = videoTexture;
      faceMaterial.needsUpdate = true;
      faceLight.intensity = 3;
    };

    let stream: MediaStream | undefined;
    let disposed = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" } })
      .then((s) => {
        if (disposed) return s.getTracks().forEach((track) => track.stop());
        stream = s;
        video.srcObject = s;
        video.play();
      })
      .catch(() => setCameraBlocked(true));
    if (!navigator.mediaDevices) setCameraBlocked(true);

    const start = (innerHeight * scale) / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const view = { yaw: 0, pitch: -TILT };
    const from = pageObject.position.clone().addScaledVector(normal, start);
    const through = pageObject.position.clone().addScaledVector(normal, -140);
    camera.position.copy(from);
    const begin = performance.now();
    let last = begin;
    let walking = false;
    let frame = 0;
    let shown = true;

    const held = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") return exit.current();
      if (!(e.code in KEYS)) return;
      e.preventDefault();
      held.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => held.delete(e.code);

    let drag: { x: number; y: number; moved: boolean } | undefined;
    const onPointerDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, moved: false };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag || !walking) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      drag = { x: e.clientX, y: e.clientY, moved: true };
      view.yaw -= dx * 0.003;
      view.pitch = clamp(view.pitch - dy * 0.003, -1.2, 1.2);
    };
    const onPointerUp = () => {
      if (drag?.moved) addEventListener("click", (e) => e.stopPropagation(), { capture: true, once: true });
      drag = undefined;
    };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!walking || page.contains(target) || target.closest("button")) return;
      pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const href = raycaster.intersectObjects([...exhibition.panels, ...exhibition.occluders])[0]?.object.userData.href;
      if (href) open.current(href);
    };
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(innerWidth, innerHeight);
      css.setSize(innerWidth, innerHeight);
    };
    onResize();
    addEventListener("keydown", onKeyDown);
    addEventListener("keyup", onKeyUp);
    root.parentElement!.addEventListener("pointerdown", onPointerDown);
    root.parentElement!.addEventListener("click", onClick);
    addEventListener("pointermove", onPointerMove);
    addEventListener("pointerup", onPointerUp);
    addEventListener("resize", onResize);

    const forward = new THREE.Vector3();
    const toObject = new THREE.Vector3();
    const ray = new THREE.Vector3();
    gl.setAnimationLoop((now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!walking) {
        const t = clamp((now - begin) / INTRO_MS, 0, 1);
        const dive = phase(t, 0, 0.55);
        const turn = phase(t, 0.35, 1);
        camera.position.lerpVectors(from, through, dive).lerp(END, turn);
        view.yaw = lerp(0, Math.PI, turn);
        view.pitch = lerp(-TILT, 0.33, turn);
        walking = t === 1;
      } else {
        let ahead = 0;
        let side = 0;
        for (const code of held) {
          ahead += KEYS[code][0];
          side += KEYS[code][1];
        }
        const step = SPEED * dt * (held.size ? 1 : 0);
        const sin = Math.sin(view.yaw);
        const cos = Math.cos(view.yaw);
        const { x, z } = camera.position;
        const nx = x + (-sin * ahead + cos * side) * step;
        const nz = z + (-cos * ahead - sin * side) * step;
        if (walkable(nx, nz)) camera.position.set(nx, EYE, nz);
        else if (walkable(nx, z)) camera.position.x = nx;
        else if (walkable(x, nz)) camera.position.z = nz;
      }
      exhibition.update(now / 1000, dt);
      if (faceLight.intensity && frame++ % 15 === 0) faceLight.color.setRGB(...averageColor(video, sample), THREE.SRGBColorSpace);
      camera.rotation.set(view.pitch, view.yaw, 0);
      camera.getWorldDirection(forward);
      toObject.subVectors(pageObject.position, camera.position);
      const distance = toObject.length();
      raycaster.set(camera.position, ray.copy(toObject).divideScalar(distance));
      const blocked = camera.position.x < FLOOR.x[0] && (raycaster.intersectObjects(exhibition.occluders)[0]?.distance ?? Infinity) < distance;
      const visible = toObject.dot(forward) > 20 && !blocked;
      const opacity = String(clamp((Math.abs(toObject.dot(normal)) - 20) / 100, 0, 1));
      if (visible !== shown) {
        shown = visible;
        page.style.visibility = visible ? "visible" : "hidden";
      }
      if (opacity !== page.style.opacity) page.style.opacity = opacity;
      gl.render(scene, camera);
      if (visible) css.render(scene, camera);
    });

    return () => {
      disposed = true;
      stream?.getTracks().forEach((track) => track.stop());
      gl.setAnimationLoop(null);
      removeEventListener("keydown", onKeyDown);
      removeEventListener("keyup", onKeyUp);
      root.parentElement!.removeEventListener("pointerdown", onPointerDown);
      root.parentElement!.removeEventListener("click", onClick);
      removeEventListener("pointermove", onPointerMove);
      removeEventListener("pointerup", onPointerUp);
      removeEventListener("resize", onResize);
      scene.remove(pageObject);
      for (const mesh of scene.children) if (mesh instanceof THREE.Mesh) mesh.geometry.dispose();
      for (const disposable of [wall, faceMaterial, videoTexture, gl, exhibition]) disposable.dispose();
      root.replaceChildren();
    };
  }, [page]);

  return (
    <div data-void className="fixed inset-0 touch-none overflow-hidden">
      <div ref={stage} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 font-mono text-xs text-muted">
        <span className="bg-black/60 px-2 py-1">{cameraBlocked ? labels.noCamera : labels.walk}</span>
        <button
          onClick={() => exit.current()}
          className="pointer-events-auto border border-ink bg-black/60 px-3 py-2 text-ink hover:border-accent hover:bg-accent hover:text-bg"
        >
          {labels.exit}
        </button>
      </div>
      {createPortal(children, page)}
    </div>
  );
}

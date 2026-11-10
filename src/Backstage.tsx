import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/addons/renderers/CSS3DRenderer.js";

const FOV = 50;
const EYE = 165;
const FACE = { width: 1100, lift: 300, z: 1100 };
const PAGE = { width: FACE.width, y: 530, z: 500 };
const TILT = THREE.MathUtils.degToRad(10);
const END = new THREE.Vector3(0, EYE, -400);
const STUDIO = { width: 1000, front: 60, curveAt: -700, radius: 220, height: 650 };
const BOUNDS = { x: STUDIO.width / 2 - 40, zMin: STUDIO.curveAt + 20, zMax: STUDIO.front - 20 };
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
  labels,
  onExit,
}: {
  children: ReactNode;
  scrollY: number;
  labels: { exit: string; walk: string; noCamera: string };
  onExit: (scrollTop: number) => void;
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
      backdropFilter: "blur(2px) saturate(140%) brightness(1.15)",
      outline: "2px solid rgb(225 238 255 / 0.45)",
      boxShadow: "inset 0 0 0 6px rgb(255 255 255 / 0.04), inset 0 0 80px rgb(200 225 255 / 0.12), 0 0 160px rgb(150 195 255 / 0.2)",
    });
    return el;
  });
  const [cameraBlocked, setCameraBlocked] = useState(false);
  const exit = useRef(() => onExit(page.scrollTop));
  exit.current = () => onExit(page.scrollTop);

  useEffect(() => {
    page.scrollTop = scrollY;
  }, [page, scrollY]);

  useEffect(() => {
    const root = stage.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 1, 12000);
    camera.rotation.order = "YXZ";

    const gl = new THREE.WebGLRenderer({ antialias: true });
    gl.setPixelRatio(Math.min(devicePixelRatio, 2));
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
    addEventListener("pointermove", onPointerMove);
    addEventListener("pointerup", onPointerUp);
    addEventListener("resize", onResize);

    const forward = new THREE.Vector3();
    const toObject = new THREE.Vector3();
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
        camera.position.x = clamp(camera.position.x + (-sin * ahead + cos * side) * step, -BOUNDS.x, BOUNDS.x);
        camera.position.z = clamp(camera.position.z + (-cos * ahead - sin * side) * step, BOUNDS.zMin, BOUNDS.zMax);
      }
      if (faceLight.intensity && frame++ % 6 === 0) faceLight.color.setRGB(...averageColor(video, sample), THREE.SRGBColorSpace);
      camera.rotation.set(view.pitch, view.yaw, 0);
      camera.getWorldDirection(forward);
      toObject.subVectors(pageObject.position, camera.position);
      const depth = toObject.dot(forward);
      page.style.visibility = depth > 20 ? "visible" : "hidden";
      page.style.opacity = String(clamp((Math.abs(toObject.dot(normal)) - 20) / 100, 0, 1));
      gl.render(scene, camera);
      css.render(scene, camera);
    });

    return () => {
      disposed = true;
      stream?.getTracks().forEach((track) => track.stop());
      gl.setAnimationLoop(null);
      removeEventListener("keydown", onKeyDown);
      removeEventListener("keyup", onKeyUp);
      root.parentElement!.removeEventListener("pointerdown", onPointerDown);
      removeEventListener("pointermove", onPointerMove);
      removeEventListener("pointerup", onPointerUp);
      removeEventListener("resize", onResize);
      scene.remove(pageObject);
      for (const mesh of scene.children) if (mesh instanceof THREE.Mesh) mesh.geometry.dispose();
      for (const disposable of [wall, faceMaterial, videoTexture, gl]) disposable.dispose();
      root.replaceChildren();
    };
  }, [page]);

  return (
    <div data-void className="fixed inset-0 touch-none overflow-hidden">
      <div ref={stage} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 font-mono text-xs text-muted">
        <span>{cameraBlocked ? labels.noCamera : labels.walk}</span>
        <button
          onClick={() => exit.current()}
          className="pointer-events-auto border border-ink px-3 py-2 text-ink hover:border-accent hover:bg-accent hover:text-bg"
        >
          {labels.exit}
        </button>
      </div>
      {createPortal(children, page)}
    </div>
  );
}

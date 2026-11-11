import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/addons/renderers/CSS3DRenderer.js";
import { UI, type Lang } from "@/content";
import { buildExhibition, type Rect } from "@/exhibition";

const FOV = 50;
const EYE = 165;
const PAGE = { width: 1100, lift: 10, z: 0 };
const END = { position: new THREE.Vector3(300, EYE, -500), yaw: 1.98, pitch: 0.05 };
const STUDIO = { width: 1000, front: 60, curveAt: -700, radius: 220, height: 650 };
const FLOOR: Rect = {
  x: [-STUDIO.width / 2 + 40, STUDIO.width / 2 - 40],
  z: [STUDIO.curveAt + 20, PAGE.z - 40],
};
const INTRO_MS = 2800;
const SPEED = 300;
const LOOK = 0.0022;
const ESC_GRACE_MS = 300;
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
  return geometry;
}

export default function Backstage({
  children,
  scrollY,
  lang,
  onExit,
  onOpen,
}: {
  children: ReactNode;
  scrollY: number;
  lang: Lang;
  onExit: (scrollTop: number) => void;
  onOpen: (href: string) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [aimed, setAimed] = useState(false);
  const [page] = useState(() => {
    const el = document.createElement("div");
    el.dataset.stage = "";
    Object.assign(el.style, {
      width: `${innerWidth}px`,
      height: `${innerHeight}px`,
      overflow: "hidden",
      background:
        "linear-gradient(115deg, rgb(255 255 255 / 0.16), rgb(255 255 255 / 0.03) 35%, rgb(255 255 255 / 0) 60%, rgb(255 255 255 / 0.08)), rgb(190 215 255 / 0.05)",
      outline: "2px solid rgb(225 238 255 / 0.45)",
      boxShadow: "inset 0 0 0 6px rgb(255 255 255 / 0.04), inset 0 0 80px rgb(200 225 255 / 0.12), 0 0 160px rgb(150 195 255 / 0.2)",
    });
    return el;
  });
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
    const frame = root.parentElement!;
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

    scene.background = new THREE.Color(0x000000);
    const wall = new THREE.MeshBasicMaterial({ color: 0xf6f5f1, side: THREE.DoubleSide });
    scene.add(new THREE.Mesh(cyclorama(STUDIO), wall));
    const exhibition = buildExhibition(scene, initialLang.current);
    redraw.current = exhibition.redraw;
    const areas = [FLOOR, exhibition.walkable];
    const walkable = (x: number, z: number) => areas.some((area) => inside(area, x, z));

    const scale = PAGE.width / innerWidth;
    const height = innerHeight * scale;
    const pageObject = new CSS3DObject(page);
    pageObject.scale.setScalar(scale);
    pageObject.position.set(0, height / 2 + PAGE.lift, PAGE.z);
    const normal = new THREE.Vector3(0, 0, 1);
    scene.add(pageObject);

    const start = height / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const view = { yaw: 0, pitch: 0 };
    const from = pageObject.position.clone().addScaledVector(normal, start);
    const through = pageObject.position.clone().addScaledVector(normal, -140);
    camera.position.copy(from);
    const begin = performance.now();
    let last = begin;
    let walking = false;
    let shown = true;
    let target: (() => void) | undefined;
    let unlockedAt = -Infinity;

    const isLocked = () => document.pointerLockElement === frame;
    const lock = () => Promise.resolve(frame.requestPointerLock()).catch(() => {});
    const onLockChange = () => {
      if (!isLocked()) unlockedAt = performance.now();
      setLocked(isLocked());
    };
    const held = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        if (!isLocked() && performance.now() - unlockedAt > ESC_GRACE_MS) exit.current();
        return;
      }
      if (!(e.code in KEYS)) return;
      e.preventDefault();
      held.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => held.delete(e.code);
    const onMouseMove = (e: MouseEvent) => {
      if (!walking || !isLocked()) return;
      view.yaw -= e.movementX * LOOK;
      view.pitch = clamp(view.pitch - e.movementY * LOOK, -1.2, 1.2);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as Element).closest("button")) return;
      if (isLocked()) target?.();
      else lock();
    };
    const onClickCapture = (e: MouseEvent) => {
      if (!e.isTrusted || !page.contains(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const center = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const aim = (): (() => void) | undefined => {
      const hit = shown ? document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest<HTMLElement>("a, button") : null;
      if (hit && page.contains(hit)) return () => hit.click();
      raycaster.setFromCamera(center, camera);
      const href: string | undefined = raycaster.intersectObjects([...exhibition.targets, ...exhibition.occluders])[0]?.object.userData.href;
      if (!href) return undefined;
      return href.startsWith("http") ? () => window.open(href, "_blank", "noopener") : () => open.current(href);
    };
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(innerWidth, innerHeight);
      css.setSize(innerWidth, innerHeight);
    };
    onResize();
    lock();
    document.addEventListener("pointerlockchange", onLockChange);
    addEventListener("keydown", onKeyDown);
    addEventListener("keyup", onKeyUp);
    addEventListener("mousemove", onMouseMove);
    frame.addEventListener("pointerdown", onPointerDown);
    frame.addEventListener("click", onClickCapture, { capture: true });
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
        camera.position.lerpVectors(from, through, dive).lerp(END.position, turn);
        view.yaw = lerp(0, END.yaw, turn);
        view.pitch = lerp(0, END.pitch, turn);
        walking = t === 1;
        if (walking) setReady(true);
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
      exhibition.update(now / 1000, camera.position);
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
      const next = walking && isLocked() ? aim() : undefined;
      if (!next !== !target) setAimed(!!next);
      target = next;
    });

    return () => {
      gl.setAnimationLoop(null);
      if (isLocked()) document.exitPointerLock();
      document.removeEventListener("pointerlockchange", onLockChange);
      removeEventListener("keydown", onKeyDown);
      removeEventListener("keyup", onKeyUp);
      removeEventListener("mousemove", onMouseMove);
      frame.removeEventListener("pointerdown", onPointerDown);
      frame.removeEventListener("click", onClickCapture, { capture: true });
      removeEventListener("resize", onResize);
      scene.remove(pageObject);
      for (const mesh of scene.children) if (mesh instanceof THREE.Mesh) mesh.geometry.dispose();
      for (const disposable of [wall, gl, exhibition]) disposable.dispose();
      root.replaceChildren();
    };
  }, [page]);

  return (
    <div data-void className="fixed inset-0 touch-none select-none overflow-hidden">
      <div ref={stage} className="absolute inset-0" />
      {ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-xs">
          {locked ? (
            <>
              <span className={`size-2 rounded-full border border-black/60 ${aimed ? "bg-accent" : "bg-ink"}`} />
              {aimed && <span className="absolute top-1/2 mt-4 bg-black/60 px-2 py-1 text-ink">{UI.open[lang]}</span>}
            </>
          ) : (
            <span className="bg-black/60 px-3 py-2 text-ink">{UI.resume[lang]}</span>
          )}
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 font-mono text-xs text-muted">
        <span className="bg-black/60 px-2 py-1">{UI.walk[lang]}</span>
        <button
          onClick={() => exit.current()}
          className="pointer-events-auto border border-ink bg-black/60 px-3 py-2 text-ink hover:border-accent hover:bg-accent hover:text-bg"
        >
          {UI.exit[lang]}
        </button>
      </div>
      {createPortal(children, page)}
    </div>
  );
}

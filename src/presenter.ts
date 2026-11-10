import * as THREE from "three";

type Stops = [string, string, string];
type Shade = (...stops: Stops) => THREE.Material;

const PACE = { range: 110, period: 16, stride: 32 };
const BLINK = { every: 4.3, length: 0.16 };

export function buildPresenter(shade: Shade, keep: <T extends { dispose(): void }>(item: T) => T) {
  const suit = shade("#6f7f9e", "#1c2433", "#05070b");
  const lapel = shade("#56637d", "#121821", "#030406");
  const shirt = shade("#ffffff", "#e9ecf0", "#9aa1ab");
  const tie = shade("#ff6b6b", "#b3121c", "#3a0408");
  const shoe = shade("#9aa1ab", "#15171a", "#000000");
  const metal = shade("#f5f9ff", "#7f95b0", "#18202b");
  const dark = shade("#9fb0c4", "#2f3a48", "#07090c");
  const brass = shade("#fff4c2", "#c9a24a", "#4a3610");
  const glow = (color: number) => keep(new THREE.MeshBasicMaterial({ color }));

  const part = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D) => {
    const mesh = new THREE.Mesh(keep(geometry), material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  const joint = (x: number, y: number, z: number, parent: THREE.Object3D) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    parent.add(group);
    return group;
  };

  const root = new THREE.Group();
  const body = joint(0, 95, 0, root);
  const torso = part(new THREE.CapsuleGeometry(17, 30, 6, 20), suit, 0, 30, 0, body);
  torso.scale.set(1.15, 1, 0.62);
  part(new THREE.BoxGeometry(11, 22, 2), shirt, 0, 46, 10, body);
  part(new THREE.BoxGeometry(3.6, 19, 1), tie, 0, 43, 11.2, body);
  part(new THREE.BoxGeometry(5, 4, 1.4), tie, 0, 54, 11.4, body);
  for (const side of [-1, 1]) {
    part(new THREE.BoxGeometry(5, 20, 1.2), lapel, side * 5.2, 45, 10.9, body).rotation.z = side * 0.32;
    part(new THREE.BoxGeometry(5, 3, 1), shirt, side * 3.4, 57, 9.4, body).rotation.z = -side * 0.5;
  }
  part(new THREE.BoxGeometry(4.5, 2.6, 0.8), shirt, -10, 47, 10.8, body).rotation.z = 0.15;
  for (const y of [31, 24]) part(new THREE.SphereGeometry(1.1, 10, 8), brass, 0, y, 10.8, body);

  part(new THREE.CylinderGeometry(4, 4, 12, 14), dark, 0, 61, 0, body);
  for (const [i, y] of [57.5, 61, 64.5].entries()) part(new THREE.CylinderGeometry(5.4, 5.4, 2.2, 18), i % 2 ? brass : metal, 0, y, 0, body);

  const head = joint(0, 66, 0, body);
  head.scale.setScalar(1.35);
  const shell = part(new THREE.CapsuleGeometry(11, 6, 8, 24), metal, 0, 14, 0, head);
  shell.scale.set(1, 1, 0.95);
  part(new THREE.TorusGeometry(11.1, 0.55, 6, 36), brass, 0, 11, 0, head).rotation.x = Math.PI / 2;
  part(new THREE.BoxGeometry(10, 4.6, 2), dark, 0, 7, 9.8, head);
  for (const y of [6.2, 7.8]) part(new THREE.BoxGeometry(9, 0.6, 2.3), brass, 0, y, 9.9, head);
  for (const side of [-1, 1]) {
    part(new THREE.CylinderGeometry(3.6, 3.6, 3, 18), brass, side * 11.2, 15, 0, head).rotation.z = Math.PI / 2;
    part(new THREE.SphereGeometry(1.6, 10, 8), dark, side * 12.9, 15, 0, head);
    part(new THREE.BoxGeometry(7, 1.4, 2), dark, side * 5.2, 24, 9.2, head).rotation.z = -side * 0.15;
    for (const a of [0.55, 1.05]) part(new THREE.SphereGeometry(0.8, 8, 6), brass, side * Math.sin(a) * 11.2, 11, Math.cos(a) * 10.6, head);
  }
  const eyes = [-1, 1].map((side) => {
    const eye = joint(side * 5.2, 17, 8, head);
    part(new THREE.CylinderGeometry(5.6, 5.6, 4, 24), dark, 0, 0, 0, eye).rotation.x = Math.PI / 2;
    part(new THREE.SphereGeometry(4.8, 20, 16), shirt, 0, 0, 1.8, eye);
    part(new THREE.CircleGeometry(2.4, 24), glow(0x5fdcff), 0, 0, 6.65, eye);
    part(new THREE.CircleGeometry(1.1, 16), glow(0x05070b), 0, 0, 6.7, eye);
    return eye;
  });
  const antenna = joint(0, 28, 0, head);
  part(new THREE.CylinderGeometry(0.7, 0.9, 9, 8), dark, 0, 4.5, 0, antenna);
  const tip = part(new THREE.SphereGeometry(2.2, 14, 10), glow(0xff7a3d), 0, 10, 0, antenna);

  const limb = (side: number, upper: number, lower: number, radius: number, y: number, x: number) => {
    const top = joint(side * x, y, 0, body);
    part(new THREE.CapsuleGeometry(radius, upper, 4, 12), suit, 0, -upper / 2, 0, top);
    const middle = joint(0, -upper, 0, top);
    part(new THREE.CapsuleGeometry(radius * 0.9, lower, 4, 12), suit, 0, -lower / 2, 0, middle);
    return { top, middle, end: -lower - radius };
  };
  const legs = [-1, 1].map((side) => {
    const leg = limb(side, 44, 44, 7, 0, 9.5);
    part(new THREE.BoxGeometry(11, 7, 27), shoe, 0, leg.end + 3.5, 6, leg.middle);
    return leg;
  });
  const arms = [-1, 1].map((side) => {
    const arm = limb(side, 30, 27, 5.2, 52, 21);
    part(new THREE.CylinderGeometry(4.6, 4.6, 2.4, 14), brass, 0, arm.end + 4, 0, arm.middle);
    const hand = joint(0, arm.end + 2, 0, arm.middle);
    part(new THREE.BoxGeometry(7, 8, 3.6), metal, 0, -3, 0, hand);
    const fingers = joint(0, -7, 0, hand);
    for (const x of [-2.3, 0, 2.3]) part(new THREE.CapsuleGeometry(1.2, 4.5, 3, 8), metal, x, -3, 0, fingers);
    part(new THREE.CapsuleGeometry(1.2, 3.5, 3, 8), metal, -side * 4.2, -2.5, 1.2, hand).rotation.z = side * 0.6;
    return { ...arm, fingers };
  });

  const blob = part(
    new THREE.CircleGeometry(32, 24),
    keep(new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false })),
    0,
    0.5,
    0,
    root,
  );
  blob.rotation.x = -Math.PI / 2;

  let yaw = Math.PI;
  const origin = new THREE.Vector3();

  const update = (seconds: number, dt: number) => {
    const w = (Math.PI * 2) / PACE.period;
    const offset = Math.sin(seconds * w) * PACE.range;
    const velocity = Math.cos(seconds * w);
    const speed = Math.min(1, Math.abs(velocity) * 1.6);
    const present = 1 - speed;
    root.position.x = origin.x + offset;

    const target = speed > 0.35 ? (velocity > 0 ? Math.PI / 2 : Math.PI * 1.5) : Math.PI;
    yaw += (target - yaw) * Math.min(1, dt * 4);
    root.rotation.y = yaw;

    const step = (offset / PACE.stride) * Math.PI;
    const swing = Math.sin(step) * 0.55 * speed;
    legs.forEach((leg, i) => {
      leg.top.rotation.x = i ? swing : -swing;
      leg.middle.rotation.x = Math.max(0, -Math.sin(step + (i ? 0 : Math.PI))) * 0.8 * speed;
    });
    body.position.y = 95 + Math.abs(Math.cos(step)) * 2 * speed;

    const wave = Math.sin(seconds * 1.4);
    arms.forEach((arm, i) => {
      const side = i ? 1 : -1;
      const lead = i === (wave > 0 ? 1 : 0) ? present : present * 0.25;
      arm.top.rotation.x = (i ? -swing : swing) * 0.8 - lead * 1.1;
      arm.top.rotation.z = side * (0.08 + lead * 0.55);
      arm.middle.rotation.x = -0.25 - lead * 0.6;
      arm.fingers.rotation.x = 0.9 - lead * 0.8;
    });

    head.rotation.y = present * Math.sin(seconds * 0.6) * 0.5;
    head.rotation.x = -0.05 + Math.sin(seconds * 2.1) * 0.03 * present;
    head.rotation.z = present * Math.sin(seconds * 0.9) * 0.12;
    const blink = seconds % BLINK.every;
    const lid = blink < BLINK.length ? 1 - Math.sin((blink / BLINK.length) * Math.PI) * 0.9 : 1;
    for (const eye of eyes) eye.scale.y = lid;
    antenna.rotation.z = Math.sin(seconds * 7) * 0.18 * speed + Math.sin(seconds * 1.3) * 0.05;
    antenna.rotation.x = Math.cos(seconds * 5) * 0.08 * speed;
    tip.scale.setScalar(1 + Math.sin(seconds * 4) * 0.12);
    torso.scale.y = 1 + Math.sin(seconds * 2) * 0.01;
  };

  return {
    root,
    update,
    place: (x: number, y: number, z: number) => {
      root.position.set(x, y, z);
      origin.set(x, y, z);
    },
  };
}

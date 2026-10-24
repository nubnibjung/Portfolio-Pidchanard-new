import * as THREE from 'three';
import { readStageProgress, scrollState } from './scrollState.js';

// Ashima Arts 3D simplex noise (MIT).
const NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  vec3 ns = 0.142857142857 * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uPixelRatio;
uniform float uSize;
uniform float uHyper;
uniform vec3 uMouse;

attribute vec3 aRing;
attribute vec3 aWave;
attribute vec3 aHelix;
attribute vec3 aCube;
attribute vec3 aGalaxy;
attribute vec3 aSaturn;
attribute float aSeed;

varying vec3 vColor;
varying float vAlpha;

${NOISE}

// Each particle starts its morph slightly later than its neighbours, so shapes dissolve in a ripple.
float morph(float p, float index, float seed) {
  return smoothstep(0.0, 1.0, clamp((p - index) * 1.4 - seed * 0.4, 0.0, 1.0));
}

void main() {
  vec3 pos = position;
  pos = mix(pos, aRing, morph(uProgress, 0.0, aSeed));
  pos = mix(pos, aWave, morph(uProgress, 1.0, aSeed));
  pos = mix(pos, aHelix, morph(uProgress, 2.0, aSeed));
  pos = mix(pos, aCube, morph(uProgress, 3.0, aSeed));
  pos = mix(pos, aGalaxy, morph(uProgress, 4.0, aSeed));
  pos = mix(pos, aSaturn, morph(uProgress, 5.0, aSeed));

  float waveWeight = morph(uProgress, 1.0, 0.0) * (1.0 - morph(uProgress, 2.0, 0.0));
  pos.y += waveWeight * (sin(pos.x * 0.8 + uTime) * 0.32 + cos(pos.z * 1.2 + uTime * 0.7) * 0.22);

  // Galaxy arms and Saturn's rings both swirl around the vertical axis.
  float galaxyWeight = morph(uProgress, 4.0, 0.0);
  float swirl = galaxyWeight * uTime * 0.07 * (1.0 + 1.4 / (length(pos.xz) + 0.5));
  pos.xz = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl)) * pos.xz;

  float n = snoise(pos * 0.5 + vec3(0.0, uTime * 0.1, 0.0));
  pos += normalize(pos + 0.0001) * n * (0.14 + uHyper * 0.9);

  vec4 world = modelMatrix * vec4(pos, 1.0);

  vec2 away = world.xy - uMouse.xy;
  float push = smoothstep(1.5, 0.0, length(away));
  world.xy += normalize(away + 0.0001) * push * 0.6;
  world.z += push * 0.5;

  vec4 view = viewMatrix * world;
  gl_Position = projectionMatrix * view;
  gl_PointSize = uSize * (0.35 + aSeed * 0.9) * (1.0 + push * 1.3 + uHyper * 0.8) * uPixelRatio / -view.z;

  vec3 violet = vec3(0.52, 0.45, 1.0);
  vec3 lilac = vec3(0.86, 0.83, 1.0);
  vec3 teal = vec3(0.34, 0.81, 0.70);
  float t = n * 0.5 + 0.5;
  vec3 color = mix(violet, lilac, smoothstep(0.4, 0.95, t));
  color = mix(color, teal, smoothstep(0.72, 1.0, aSeed) * 0.75);
  vec3 rainbow = 0.5 + 0.5 * cos(uTime * 3.0 + aSeed * 6.28 + vec3(0.0, 2.0, 4.0));
  vColor = mix(color, rainbow, uHyper) + push * 0.5;
  vAlpha = 0.5 + 0.5 * t;
}
`;

const FRAGMENT = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float glow = pow(smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5)), 1.6);
  if (glow < 0.01) discard;
  gl_FragColor = vec4(vColor, glow * vAlpha * uOpacity * 0.75);
}
`;

// Where the cloud sits for each stage, so it frames the content instead of hiding behind it.
const STAGE_POSES = [
  { x: 2.4, y: 0, tilt: 0, scale: 1, opacity: 1 },
  { x: -2.7, y: 0, tilt: 0.35, scale: 0.9, opacity: 0.7 },
  { x: 0, y: -2.3, tilt: 0.3, scale: 1.1, opacity: 0.5 },
  { x: -2.2, y: 0, tilt: 0.2, scale: 0.85, opacity: 0.45 },
  { x: 2.4, y: 0, tilt: 0.5, scale: 1.0, opacity: 0.55 },
  { x: 1.2, y: -0.3, tilt: 1.05, scale: 1.25, opacity: 0.7 },
  { x: 2.2, y: 0.2, tilt: 0.45, scale: 1.05, opacity: 0.85 },
];

function poseAt(progress, key) {
  const index = Math.min(Math.floor(progress), STAGE_POSES.length - 1);
  const next = Math.min(index + 1, STAGE_POSES.length - 1);
  const t = progress - index;
  const eased = t * t * (3 - 2 * t);
  return STAGE_POSES[index][key] + (STAGE_POSES[next][key] - STAGE_POSES[index][key]) * eased;
}

function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function buildShapes(count) {
  const sphere = new Float32Array(count * 3);
  const ring = new Float32Array(count * 3);
  const wave = new Float32Array(count * 3);
  const helix = new Float32Array(count * 3);
  const cube = new Float32Array(count * 3);
  const galaxy = new Float32Array(count * 3);
  const saturn = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const columns = Math.ceil(Math.sqrt(count * 1.8));
  const rows = Math.ceil(count / columns);

  for (let i = 0; i < count; i += 1) {
    const k = i * 3;
    seed[i] = Math.random();

    // Fibonacci sphere.
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const radius = 2.1 * (0.93 + Math.random() * 0.12);
    sphere[k] = Math.cos(golden * i) * r * radius;
    sphere[k + 1] = y * radius;
    sphere[k + 2] = Math.sin(golden * i) * r * radius;

    // Torus knot (3,2) with a fuzzy tube.
    const u = (i / count) * Math.PI * 2;
    const knotR = 1.35 + 0.55 * Math.cos(3 * u);
    const tube = 0.3 * Math.sqrt(Math.random());
    const spin = Math.random() * Math.PI * 2;
    ring[k] = knotR * Math.cos(2 * u) + Math.cos(spin) * tube;
    ring[k + 1] = knotR * Math.sin(2 * u) + Math.sin(spin) * tube;
    ring[k + 2] = 0.55 * Math.sin(3 * u) + Math.cos(spin + 1.3) * tube;

    // Flat grid that the shader rolls into an ocean.
    wave[k] = ((i % columns) / columns - 0.5) * 11;
    wave[k + 1] = -1.1;
    wave[k + 2] = (Math.floor(i / columns) / rows - 0.5) * 6;

    // Double helix with rungs.
    const strand = i % 3;
    const along = (i / count) * 2 - 1;
    if (strand < 2) {
      const angle = along * Math.PI * 5 + strand * Math.PI;
      helix[k] = along * 6.5 + (Math.random() - 0.5) * 0.08;
      helix[k + 1] = Math.cos(angle) * 1.05 + (Math.random() - 0.5) * 0.12;
      helix[k + 2] = Math.sin(angle) * 1.05 + (Math.random() - 0.5) * 0.12;
    } else {
      const rung = Math.round(along * 40) / 40;
      const angle = rung * Math.PI * 5;
      const span = Math.random() * 2 - 1;
      helix[k] = rung * 6.5;
      helix[k + 1] = Math.cos(angle) * 1.05 * span;
      helix[k + 2] = Math.sin(angle) * 1.05 * span;
    }

    // Three-armed spiral galaxy.
    const dist = 4.2 * Math.pow(Math.random(), 1.6) + 0.05;
    const arm = ((i % 3) / 3) * Math.PI * 2 + dist * 1.25;
    const scatter = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45 * dist;
    galaxy[k] = Math.cos(arm) * dist + scatter;
    galaxy[k + 1] = (Math.random() - 0.5) * 0.25 * (4.5 - dist) * 0.25;
    galaxy[k + 2] = Math.sin(arm) * dist + scatter * 0.6;

    // Two nested wireframe cubes: particles sit on the 12 edges, the inner cube is turned 45deg.
    const inner = i % 4 === 0;
    const half = inner ? 0.95 : 1.75;
    const edge = Math.floor(Math.random() * 12);
    const alongEdge = (Math.random() * 2 - 1) * half;
    const c1 = (edge & 1 ? 1 : -1) * half;
    const c2 = (edge & 2 ? 1 : -1) * half;
    let cx = c1;
    let cy = c2;
    let cz = alongEdge;
    if (edge < 4) [cx, cy, cz] = [alongEdge, c1, c2];
    else if (edge < 8) [cx, cy, cz] = [c1, alongEdge, c2];
    if (inner) [cx, cz] = [(cx - cz) * Math.SQRT1_2, (cx + cz) * Math.SQRT1_2];
    cube[k] = cx + (Math.random() - 0.5) * 0.05;
    cube[k + 1] = cy + (Math.random() - 0.5) * 0.05;
    cube[k + 2] = cz + (Math.random() - 0.5) * 0.05;

    // Saturn: a planet (a third of the particles) wrapped in a flat, banded ring.
    if (i % 3 === 0) {
      const py = Math.random() * 2 - 1;
      const pr = Math.sqrt(1 - py * py);
      const pa = Math.random() * Math.PI * 2;
      saturn[k] = Math.cos(pa) * pr * 1.05;
      saturn[k + 1] = py * 1.05;
      saturn[k + 2] = Math.sin(pa) * pr * 1.05;
    } else {
      const band = Math.random() < 0.7 ? 1.6 + Math.random() * 0.75 : 2.55 + Math.random() * 0.45;
      const ra = Math.random() * Math.PI * 2;
      saturn[k] = Math.cos(ra) * band;
      saturn[k + 1] = (Math.random() - 0.5) * 0.05;
      saturn[k + 2] = Math.sin(ra) * band;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(sphere, 3));
  geometry.setAttribute('aRing', new THREE.BufferAttribute(ring, 3));
  geometry.setAttribute('aWave', new THREE.BufferAttribute(wave, 3));
  geometry.setAttribute('aHelix', new THREE.BufferAttribute(helix, 3));
  geometry.setAttribute('aCube', new THREE.BufferAttribute(cube, 3));
  geometry.setAttribute('aGalaxy', new THREE.BufferAttribute(galaxy, 3));
  geometry.setAttribute('aSaturn', new THREE.BufferAttribute(saturn, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
  return geometry;
}

export function createParticleScene(container) {
  const mobile = window.matchMedia('(max-width: 768px)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = mobile ? 9000 : 22000;

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.setClearColor('#07070a');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 7;

  const geometry = buildShapes(count);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSize: { value: mobile ? 22 : 26 },
      uOpacity: { value: 1 },
      uHyper: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
    },
  });

  const group = new THREE.Group();
  group.add(new THREE.Points(geometry, material));
  scene.add(group);

  const viewport = { width: 1, height: 1 };
  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    viewport.height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    viewport.width = viewport.height * camera.aspect;
  };
  resize();
  window.addEventListener('resize', resize);

  const pointer = { x: 0, y: 0, active: false };
  const onPointerMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    pointer.active = true;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const mouse = new THREE.Vector3(99, 99, 0);
  const target = new THREE.Vector3();
  let progress = readStageProgress();
  let frame = 0;
  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    scrollState.progress = readStageProgress();
    progress = damp(progress, scrollState.progress, 3.2, dt);

    const u = material.uniforms;
    const hyperOn = now < scrollState.hyperUntil ? 1 : 0;
    u.uHyper.value = damp(u.uHyper.value, hyperOn, 2, dt);
    if (!reduceMotion) u.uTime.value += dt * (1 + 2.5 * u.uHyper.value);
    u.uProgress.value = progress;
    u.uOpacity.value = poseAt(progress, 'opacity');

    if (pointer.active) {
      target.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0);
      mouse.lerp(target, 1 - Math.exp(-8 * dt));
      u.uMouse.value.copy(mouse);
    }

    // Phones: smaller overall, and the hero sphere a bit smaller still so it fits above the text.
    const scale = poseAt(progress, 'scale') * (mobile ? 0.72 - 0.14 * Math.max(0, 1 - progress) : 1);
    group.position.x = damp(group.position.x, mobile ? 0 : poseAt(progress, 'x'), 4, dt);
    // On phones the hero text sits at the bottom, so lift the first shape into the top half.
    const mobileLift = mobile ? 1.55 * Math.max(0, 1 - progress) : 0;
    group.position.y = damp(group.position.y, poseAt(progress, 'y') + mobileLift, 4, dt);
    group.scale.setScalar(damp(group.scale.x, scale, 4, dt));
    group.rotation.x = damp(group.rotation.x, poseAt(progress, 'tilt') + pointer.y * 0.15, 3, dt);
    group.rotation.z = damp(group.rotation.z, -pointer.x * 0.1, 3, dt);
    if (!reduceMotion) group.rotation.y += dt * (0.06 + 0.8 * u.uHyper.value);

    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

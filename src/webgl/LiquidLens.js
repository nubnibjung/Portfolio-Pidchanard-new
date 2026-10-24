import * as THREE from 'three';

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uTex;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;
uniform vec2 uPlane;
uniform vec2 uImage;
varying vec2 vUv;

// object-fit: cover, anchored slightly below centre (matches the <img> fallback's object-position).
vec2 coverUv(vec2 uv) {
  float planeRatio = uPlane.x / uPlane.y;
  float imageRatio = uImage.x / uImage.y;
  vec2 scale = planeRatio > imageRatio
    ? vec2(1.0, imageRatio / planeRatio)
    : vec2(planeRatio / imageRatio, 1.0);
  vec2 offset = vec2((1.0 - scale.x) * 0.5, (1.0 - scale.y) * 0.4);
  return uv * scale + offset;
}

void main() {
  vec2 aspect = vec2(uPlane.x / uPlane.y, 1.0);
  vec2 toMouse = (vUv - uMouse) * aspect;
  float dist = length(toMouse);
  float lens = smoothstep(0.32, 0.0, dist) * uHover;

  vec2 uv = vUv;
  uv -= (vUv - uMouse) * lens * 0.35;
  uv += normalize(toMouse + 0.0001) / aspect * sin(dist * 38.0 - uTime * 3.0) * 0.006 * lens;

  vec2 shift = (vUv - uMouse) * lens * 0.04;
  vec2 base = coverUv(uv);
  float r = texture2D(uTex, coverUv(uv + shift)).r;
  float g = texture2D(uTex, base).g;
  float b = texture2D(uTex, coverUv(uv - shift)).b;
  vec3 color = vec3(r, g, b);

  // Muted at rest, full colour under the lens.
  float grey = dot(color, vec3(0.299, 0.587, 0.114));
  float colorAmount = mix(0.35, 1.0, max(uHover * 0.6, smoothstep(0.45, 0.0, dist) * uHover));
  color = mix(vec3(grey), color, colorAmount);
  color += lens * 0.06;

  gl_FragColor = vec4(color, 1.0);
}
`;

export function createLiquidLens(container, imageUrl, onReady) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const uniforms = {
    uTex: { value: null },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uTime: { value: 0 },
    uPlane: { value: new THREE.Vector2(1, 1) },
    uImage: { value: new THREE.Vector2(1, 1) },
  };
  const material = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms });
  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));

  let disposed = false;
  let texture = null;
  new THREE.TextureLoader().load(imageUrl, (loaded) => {
    if (disposed) {
      loaded.dispose();
      return;
    }
    texture = loaded;
    texture.minFilter = THREE.LinearFilter;
    uniforms.uTex.value = texture;
    uniforms.uImage.value.set(texture.image.width, texture.image.height);
    onReady?.();
  });

  const resize = () => {
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight, false);
    uniforms.uPlane.value.set(clientWidth, clientHeight);
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const targetMouse = new THREE.Vector2(0.5, 0.5);
  let hoverTarget = 0;
  const onMove = (event) => {
    const rect = container.getBoundingClientRect();
    targetMouse.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height);
    hoverTarget = 1;
  };
  const onLeave = () => { hoverTarget = 0; };
  container.addEventListener('pointermove', onMove);
  container.addEventListener('pointerleave', onLeave);

  let inView = true;
  const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
  io.observe(container);

  let frame = 0;
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (inView && texture) {
      uniforms.uTime.value += dt;
      uniforms.uMouse.value.lerp(targetMouse, 1 - Math.exp(-10 * dt));
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * (1 - Math.exp(-5 * dt));
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    io.disconnect();
    container.removeEventListener('pointermove', onMove);
    container.removeEventListener('pointerleave', onLeave);
    texture?.dispose();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

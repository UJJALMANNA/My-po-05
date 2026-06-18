// ============================================================
// 3D SCENE — a slow-orbiting particle lattice behind the hero
// signal-flow diagram, suggesting a control-system phase space.
// Built with Three.js (loaded via import map in index.html).
// Respects prefers-reduced-motion and fails silently if WebGL
// is unavailable, so the page never breaks without it.
// ============================================================

import * as THREE from 'three';

const canvas = document.getElementById('heroCanvas');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  initScene(canvas);
}

function initScene(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    console.warn('WebGL unavailable, skipping 3D scene.', e);
    return;
  }

  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight || w;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Particle lattice: points arranged on a torus-knot-ish path
  // suggesting a phase-space trajectory of a control system.
  const PARTICLE_COUNT = 420;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const radiusOuter = 3.4;
  const radiusInner = 1.1;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = (i / PARTICLE_COUNT) * Math.PI * 2 * 3; // 3 loops
    const r = radiusOuter + radiusInner * Math.cos(t * 1.5);
    const x = r * Math.cos(t);
    const y = r * Math.sin(t) * 0.6;
    const z = radiusInner * Math.sin(t * 1.5) * 1.4;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x6C5CE7,
    size: 0.055,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    vertexColors: true
  });

  // give particles a gradient of colors across the trajectory
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const colorA = new THREE.Color(0x6C5CE7); // indigo
  const colorB = new THREE.Color(0xA35CE7); // violet
  const colorC = new THREE.Color(0xF368B0); // pink
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = i / PARTICLE_COUNT;
    const c = t < 0.5
      ? colorA.clone().lerp(colorB, t * 2)
      : colorB.clone().lerp(colorC, (t - 0.5) * 2);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // a faint warm accent ring for the GATE "feedback loop" motif
  const ringGeo = new THREE.TorusGeometry(2.2, 0.01, 8, 128);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xFF9F5A, transparent: true, opacity: 0.4 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.4;
  scene.add(ring);

  let frame = 0;
  let visible = true;

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(container);

  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    frame += 1;
    points.rotation.y = frame * 0.0022;
    points.rotation.x = Math.sin(frame * 0.0009) * 0.25;
    ring.rotation.z = frame * 0.0015;
    renderer.render(scene, camera);
  }
  animate();
}

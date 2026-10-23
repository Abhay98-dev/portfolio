import * as THREE from 'three';

/**
 * High-fidelity procedural texture generator for ABHAYVERSE starship cockpit.
 * Completely local, zero network dependencies, runs offline, ultra-crisp resolution.
 */

const textureCache: Record<string, THREE.CanvasTexture> = {};

/**
 * 2048x1024 Procedural Deep Space Panorama Texture
 */
export function getProceduralSpacePanoramaTexture(): THREE.CanvasTexture {
  if (textureCache['space_panorama']) return textureCache['space_panorama'];

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep space base gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  bgGrad.addColorStop(0, '#010309');
  bgGrad.addColorStop(0.5, '#030816');
  bgGrad.addColorStop(1, '#010207');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Volumetric Cosmic Nebulae Clouds (Multiple soft layered radial bursts)
  const nebulae = [
    { x: 750, y: 380, r: 600, col: 'rgba(0, 150, 255, 0.12)' },
    { x: 850, y: 420, r: 400, col: 'rgba(0, 242, 254, 0.10)' },
    { x: 1400, y: 550, r: 700, col: 'rgba(120, 40, 200, 0.11)' },
    { x: 1300, y: 480, r: 450, col: 'rgba(80, 20, 160, 0.14)' },
    { x: 300, y: 700, r: 500, col: 'rgba(14, 116, 144, 0.10)' },
    { x: 1750, y: 250, r: 450, col: 'rgba(56, 189, 248, 0.08)' },
  ];

  nebulae.forEach(n => {
    const grad = ctx.createRadialGradient(n.x, n.y, 20, n.x, n.y, n.r);
    grad.addColorStop(0, n.col);
    grad.addColorStop(0.5, n.col.replace(/[\d\.]+\)$/, '0.04)'));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Pinprick Stars with Gaussian glow
  // Seeded-like random generation for consistent distribution
  let seed = 42;
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // 3000 background stars
  for (let i = 0; i < 3000; i++) {
    const x = pseudoRandom() * 2048;
    const y = pseudoRandom() * 1024;
    const brightness = pseudoRandom();
    const radius = pseudoRandom() * 1.2 + 0.3;

    ctx.fillStyle = brightness > 0.85
      ? '#ffffff'
      : brightness > 0.6
      ? '#bae6fd'
      : brightness > 0.35
      ? '#7dd3fc'
      : '#c4b5fd';

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Occasional bright star with 4-point diffraction spike
    if (brightness > 0.985) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x + 8, y);
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x, y + 8);
      ctx.stroke();

      // Soft halo
      const halo = ctx.createRadialGradient(x, y, 1, x, y, 9);
      halo.addColorStop(0, 'rgba(0, 242, 254, 0.6)');
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['space_panorama'] = texture;
  return texture;
}

/**
 * Cockpit Metallic Floor Plate Texture
 */
export function getFloorPanelTexture(): THREE.CanvasTexture {
  if (textureCache['floor']) return textureCache['floor'];

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark titanium base
  ctx.fillStyle = '#202c40';
  ctx.fillRect(0, 0, 1024, 1024);

  // Large floor panel grid (4x4 tiles)
  const tileSize = 256;
  for (let x = 0; x < 1024; x += tileSize) {
    for (let y = 0; y < 1024; y += tileSize) {
      // Tile background with subtle metallic bevel
      const grad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
      grad.addColorStop(0, '#34445d');
      grad.addColorStop(0.3, '#2a3a52');
      grad.addColorStop(0.8, '#223149');
      grad.addColorStop(1, '#1b273a');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 3, y + 3, tileSize - 6, tileSize - 6);

      // Inner tile bevel border
      ctx.strokeStyle = '#2b3d63';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 8, y + 8, tileSize - 16, tileSize - 16);

      // Corner mechanical bolt fasteners
      ctx.fillStyle = '#475e8a';
      const corners = [
        [x + 16, y + 16],
        [x + tileSize - 16, y + 16],
        [x + 16, y + tileSize - 16],
        [x + tileSize - 16, y + tileSize - 16]
      ];
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0a101d';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Subtle non-slip crosshatch grip texture in center
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      for (let px = x + 36; px < x + tileSize - 36; px += 20) {
        ctx.beginPath();
        ctx.moveTo(px, y + 36);
        ctx.lineTo(px + 12, y + tileSize - 36);
        ctx.stroke();
      }
    }
  }

  // Deep expansion seams
  ctx.strokeStyle = '#111b2a';
  ctx.lineWidth = 6;
  for (let x = 0; x <= 1024; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache['floor'] = texture;
  return texture;
}

/**
 * Cockpit Wall Panel Texture with Mechanical Ventilation & Bevels
 */
export function getWallPanelTexture(): THREE.CanvasTexture {
  if (textureCache['wall']) return textureCache['wall'];

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base dark gunmetal
  ctx.fillStyle = '#1a2639';
  ctx.fillRect(0, 0, 1024, 1024);

  // Vertical structural ribbed plates (4 vertical columns)
  const colWidth = 256;
  for (let x = 0; x < 1024; x += colWidth) {
    const grad = ctx.createLinearGradient(x, 0, x + colWidth, 0);
    grad.addColorStop(0, '#25354b');
    grad.addColorStop(0.15, '#3a4c67');
    grad.addColorStop(0.85, '#2c3d55');
    grad.addColorStop(1, '#202e43');
    ctx.fillStyle = grad;
    ctx.fillRect(x + 4, 0, colWidth - 8, 1024);

    // Beveled panels in column
    for (let y = 64; y < 1024; y += 220) {
      ctx.fillStyle = '#30425b';
      ctx.fillRect(x + 20, y, colWidth - 40, 180);

      ctx.strokeStyle = '#384d75';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 20, y, colWidth - 40, 180);

      // Louver / ventilation slits with subtle cyan backlight
      for (let sy = y + 24; sy < y + 150; sy += 18) {
        ctx.fillStyle = '#142137';
        ctx.fillRect(x + 36, sy, colWidth - 72, 8);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.15)';
        ctx.fillRect(x + 36, sy + 6, colWidth - 72, 2);
      }
    }

    // Heavy vertical bolt lines
    ctx.fillStyle = '#526b99';
    for (let by = 24; by < 1024; by += 64) {
      ctx.beginPath();
      ctx.arc(x + 12, by, 3.5, 0, Math.PI * 2);
      ctx.arc(x + colWidth - 12, by, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1.5);
  textureCache['wall'] = texture;
  return texture;
}

/**
 * Cockpit Mechanical Ceiling Texture
 */
export function getCeilingPanelTexture(): THREE.CanvasTexture {
  if (textureCache['ceiling']) return textureCache['ceiling'];

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark matte steel
  ctx.fillStyle = '#17243a';
  ctx.fillRect(0, 0, 1024, 1024);

  // Cross-hatched ceiling plates
  const size = 256;
  for (let x = 0; x < 1024; x += size) {
    for (let y = 0; y < 1024; y += size) {
      ctx.fillStyle = '#283951';
      ctx.fillRect(x + 6, y + 6, size - 12, size - 12);

      // Inner recess
      ctx.fillStyle = '#1b2a40';
      ctx.fillRect(x + 24, y + 24, size - 48, size - 48);

      // Ventilation grille in center
      ctx.strokeStyle = '#354964';
      ctx.lineWidth = 2;
      for (let gy = y + 36; gy < y + size - 36; gy += 12) {
        ctx.beginPath();
        ctx.moveTo(x + 36, gy);
        ctx.lineTo(x + size - 36, gy);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache['ceiling'] = texture;
  return texture;
}

/**
 * Authentic Cockpit Console Screen Textures
 */
export type CockpitScreenType = 
  | 'primary_flight_display'
  | 'orbital_trajectory'
  | 'shields_and_hull'
  | 'nav_starmap'
  | 'radar'
  | 'code';

export function getConsoleScreenTexture(type: CockpitScreenType): THREE.CanvasTexture {
  const key = `cockpit_screen_${type}`;
  if (textureCache[key]) return textureCache[key];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark glass background with cyan tint
  ctx.fillStyle = '#020713';
  ctx.fillRect(0, 0, 512, 256);

  // Fine coordinate grid
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y < 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Header HUD bar
  ctx.fillStyle = 'rgba(0, 242, 254, 0.18)';
  ctx.fillRect(0, 0, 512, 26);
  ctx.fillStyle = '#00f2fe';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(`AV-01 // COCKPIT HELM // ${type.toUpperCase()}`, 12, 17);
  ctx.fillStyle = '#34d399';
  ctx.fillText('SYS: STABLE', 410, 17);

  if (type === 'primary_flight_display') {
    // Artificial Horizon / Attitude Director Indicator
    const cx = 256;
    const cy = 135;

    // Pitch ladder
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2;
    for (let p = -40; p <= 40; p += 20) {
      if (p === 0) continue;
      ctx.beginPath();
      ctx.moveTo(cx - 35, cy + p);
      ctx.lineTo(cx + 35, cy + p);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px monospace';
      ctx.fillText(`${Math.abs(p / 2)}°`, cx + 42, cy + p + 3);
    }

    // Horizon line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy);
    ctx.lineTo(cx - 20, cy);
    ctx.moveTo(cx + 20, cy);
    ctx.lineTo(cx + 80, cy);
    ctx.stroke();

    // Flight director reticle
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 8, cy - 8, 16, 16);

    // Speed tape on left
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(20, 36, 50, 200);
    ctx.strokeStyle = '#00f2fe';
    ctx.strokeRect(20, 36, 50, 200);
    ctx.fillStyle = '#00f2fe';
    ctx.font = '10px monospace';
    ctx.fillText('SPEED', 26, 52);
    ctx.fillText('0.42c', 26, 135);

    // Altitude / Distance tape on right
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(442, 36, 50, 200);
    ctx.strokeStyle = '#00f2fe';
    ctx.strokeRect(442, 36, 50, 200);
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('DIST', 448, 52);
    ctx.fillText('14.2 AU', 448, 135);
  } else if (type === 'orbital_trajectory') {
    // Elliptical orbit map
    const cx = 220;
    const cy = 140;

    // Target planet
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Orbit ellipse
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 140, 75, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();

    // Ship position on orbit
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx + 100, cy - 35, 5, 0, Math.PI * 2);
    ctx.fill();

    // Telemetry notes
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('PERIAPSIS: 420 KM', 340, 60);
    ctx.fillText('APOAPSIS: 42,000 KM', 340, 80);
    ctx.fillText('PERIOD: 18h 24m', 340, 100);
    ctx.fillText('INCLINATION: 14.8°', 340, 120);
    ctx.fillText('DELTA-V: 1,480 M/S', 340, 140);
    ctx.fillText('TRAJECTORY: HYPERBOLIC', 340, 160);
    ctx.fillStyle = '#34d399';
    ctx.fillText('VECTOR: INTERCEPT [LOCKED]', 340, 195);
  } else if (type === 'shields_and_hull') {
    // Top-down starship silhouette wireframe
    const cx = 160;
    const cy = 140;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 65);
    ctx.lineTo(cx + 35, cy + 20);
    ctx.lineTo(cx + 55, cy + 45);
    ctx.lineTo(cx + 15, cy + 50);
    ctx.lineTo(cx, cy + 35);
    ctx.lineTo(cx - 15, cy + 50);
    ctx.lineTo(cx - 55, cy + 45);
    ctx.lineTo(cx - 35, cy + 20);
    ctx.closePath();
    ctx.stroke();

    // Hexagonal deflector shield perimeter
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy - 5, 75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Hull status readout
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText('DEFLECTOR SHIELDS: 100%', 280, 70);
    ctx.fillStyle = '#00f2fe';
    ctx.fillRect(280, 80, 180, 8);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('HULL INTEGRITY: 99.4%', 280, 115);
    ctx.fillStyle = '#34d399';
    ctx.fillRect(280, 125, 180, 8);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('WARP CONTAINMENT: NOMINAL', 280, 160);
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(280, 170, 180, 8);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('THERMAL SINK: 42°C [STABLE]', 280, 205);
  } else if (type === 'nav_starmap') {
    // Sector map
    const cx = 256;
    const cy = 135;

    // Sector circles
    [40, 80, 120].forEach(r => {
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Star points
    const stars = [
      [cx - 40, cy - 30, 'SOL-01'],
      [cx + 60, cy - 50, 'ALPHA-CEN'],
      [cx - 70, cy + 40, 'VEGA-9'],
      [cx + 80, cy + 60, 'SIRIUS-B'],
      [cx + 10, cy + 20, 'AV-01 [HERE]']
    ];
    stars.forEach(([sx, sy, label]) => {
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(sx as number, sy as number, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e0f2fe';
      ctx.font = '9px monospace';
      ctx.fillText(label as string, (sx as number) + 6, (sy as number) + 3);
    });

    // Course line
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + 10, cy + 20);
    ctx.lineTo(cx + 80, cy + 60);
    ctx.stroke();
  } else if (type === 'radar') {
    // Concentric radar sweep
    const cx = 150;
    const cy = 145;
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1.5;
    [30, 60, 90].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(cx - 95, cy);
    ctx.lineTo(cx + 95, cy);
    ctx.moveTo(cx, cy - 95);
    ctx.lineTo(cx, cy + 95);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx + 38, cy - 42, 4, 0, Math.PI * 2);
    ctx.arc(cx - 50, cy + 28, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('RADAR BEACON: HYDROGEN LINE', 270, 65);
    ctx.fillText('BEARING: 042° RELATIVE', 270, 90);
    ctx.fillText('SCAN FREQ: 1420.405 MHz', 270, 115);
    ctx.fillText('CONTACT: EXOPLANET ORBIT', 270, 140);
    ctx.fillStyle = '#34d399';
    ctx.fillText('TARGET LOCK: POSITIVE', 270, 175);
  } else {
    // Code stream
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    const lines = [
      'const helm = new CockpitFlightDirector({ sync: true });',
      'await helm.alignAttitudeVector({ pitch: 0, yaw: 0 });',
      'import { NodeCluster, RedisCache } from "abhayverse/sys";',
      'const apiGateway = express.createRouter({ rateLimit: true });',
      'apiGateway.intercept("/telemetry", (req, res) => {',
      '  return res.json({ status: "STABLE", latency: "0.2ms" });',
      '});',
      '// ALL SUBSYSTEMS NOMINAL // BUFFER SYNCHRONIZED',
      'DEBUG: Cache hit ratio: 99.4% [UPSTASH_REDIS_ACTIVE]'
    ];
    lines.forEach((line, idx) => {
      ctx.fillText(line, 16, 52 + idx * 21);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache[key] = texture;
  return texture;
}

export function getAsteroidTexture(): THREE.CanvasTexture {
  if (textureCache['asteroid']) return textureCache['asteroid'];

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2d3748';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 12 + 2;
    const grad = ctx.createRadialGradient(x, y, 1, x, y, r);
    grad.addColorStop(0, '#1a202c');
    grad.addColorStop(0.7, '#2d3748');
    grad.addColorStop(1, '#4a5568');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache['asteroid'] = texture;
  return texture;
}

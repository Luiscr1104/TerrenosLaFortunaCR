import { useEffect, useRef } from "react";
import * as THREE from "three";

export function WildlifeCinema() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId;
    let frame = 0;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x040c06, 1);

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040c06, 0.012);

    const camera = new THREE.PerspectiveCamera(62, W / H, 0.1, 300);
    camera.position.set(0, 3, 22);
    camera.lookAt(0, 6, 0);

    // ── Stars ─────────────────────────────────────────────────
    const starCount = 1800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 260;
      starPos[i * 3 + 1] = Math.random() * 80 + 8;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 25;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.18,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── Volcano ───────────────────────────────────────────────
    const volcanoGroup = new THREE.Group();
    volcanoGroup.position.set(0, -14, -60);

    const coneGeo = new THREE.ConeGeometry(22, 34, 7);
    const coneMat = new THREE.MeshPhongMaterial({
      color: 0x111308,
      shininess: 0,
      flatShading: true,
    });
    volcanoGroup.add(new THREE.Mesh(coneGeo, coneMat));

    // Secondary smaller cone (shape layering)
    const cone2Geo = new THREE.ConeGeometry(14, 20, 7);
    const cone2Mat = new THREE.MeshPhongMaterial({
      color: 0x0d110a,
      shininess: 0,
      flatShading: true,
    });
    const cone2 = new THREE.Mesh(cone2Geo, cone2Mat);
    cone2.position.y = 4;
    volcanoGroup.add(cone2);

    scene.add(volcanoGroup);

    // Lava glow particles at summit
    const lavaCount = 240;
    const lavaPos = new Float32Array(lavaCount * 3);
    for (let i = 0; i < lavaCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 2.5;
      lavaPos[i * 3]     = Math.cos(angle) * r;
      lavaPos[i * 3 + 1] = 17 + Math.random() * 5;
      lavaPos[i * 3 + 2] = Math.sin(angle) * r;
    }
    const lavaGeo = new THREE.BufferGeometry();
    lavaGeo.setAttribute("position", new THREE.BufferAttribute(lavaPos, 3));
    const lavaMat = new THREE.PointsMaterial({
      color: 0xff4800,
      size: 0.55,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const lavaParticles = new THREE.Points(lavaGeo, lavaMat);
    volcanoGroup.add(lavaParticles);

    // Lava glow light
    const lavaLight = new THREE.PointLight(0xff3200, 4, 90);
    lavaLight.position.set(0, 3, -40);
    scene.add(lavaLight);

    // Ambient fill
    scene.add(new THREE.AmbientLight(0x091208, 3));

    // Soft moon light from above-left
    const moonLight = new THREE.DirectionalLight(0x2a4a6a, 0.6);
    moonLight.position.set(-20, 30, 10);
    scene.add(moonLight);

    // ── Fireflies ─────────────────────────────────────────────
    const ffCount = 400;
    const ffPos = new Float32Array(ffCount * 3);
    const ffBase = new Float32Array(ffCount * 3);
    const ffSpeed = new Float32Array(ffCount);
    const ffPhase = new Float32Array(ffCount);

    for (let i = 0; i < ffCount; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = Math.random() * 14 - 1;
      const z = (Math.random() - 0.5) * 25 + 6;
      ffPos[i * 3] = ffBase[i * 3] = x;
      ffPos[i * 3 + 1] = ffBase[i * 3 + 1] = y;
      ffPos[i * 3 + 2] = ffBase[i * 3 + 2] = z;
      ffSpeed[i] = Math.random() * 0.6 + 0.25;
      ffPhase[i] = Math.random() * Math.PI * 2;
    }

    const ffGeo = new THREE.BufferGeometry();
    const ffPosAttr = new THREE.BufferAttribute(ffPos, 3);
    ffGeo.setAttribute("position", ffPosAttr);
    const ffMat = new THREE.PointsMaterial({
      color: 0x90ff44,
      size: 0.28,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const fireflies = new THREE.Points(ffGeo, ffMat);
    scene.add(fireflies);

    // ── Birds ─────────────────────────────────────────────────
    function makeBirdShape() {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(-0.8, 0.5, -2.2, 0.3, -2.8, -0.3);
      shape.bezierCurveTo(-1.8, 0.15, -0.9, 0.25, 0, 0);
      shape.bezierCurveTo(0.9, 0.25, 1.8, 0.15, 2.8, -0.3);
      shape.bezierCurveTo(2.2, 0.3, 0.8, 0.5, 0, 0);
      return shape;
    }

    const birdColors = [0xcc2200, 0xdd3300, 0xaa1a00, 0xc02800, 0xd42b00];
    const birds = [];
    const birdMeta = [];

    for (let i = 0; i < 6; i++) {
      const geo = new THREE.ShapeGeometry(makeBirdShape());
      const mat = new THREE.MeshBasicMaterial({
        color: birdColors[i % birdColors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const sc = 0.45 + Math.random() * 0.35;
      mesh.scale.setScalar(sc);
      const startX = -38 - Math.random() * 18;
      const y = Math.random() * 9 + 3;
      const z = Math.random() * 9 + 5;
      mesh.position.set(startX, y, z);
      scene.add(mesh);
      birds.push(mesh);
      birdMeta.push({
        x: startX, y, z,
        speed: 0.04 + Math.random() * 0.025,
        wingPhase: Math.random() * Math.PI * 2,
        delayFrames: Math.floor(Math.random() * 180),
        sc,
      });
    }

    // ── Jungle silhouette (foreground) ────────────────────────
    function makeTree(cx, height, spread) {
      const shape = new THREE.Shape();
      shape.moveTo(cx - spread * 0.15, -12);
      shape.lineTo(cx - spread * 0.12, 0);
      // rough canopy
      const steps = 10;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = cx - spread / 2 + spread * t;
        const maxH = height * (Math.sin(t * Math.PI) * 0.7 + 0.3);
        const py = maxH * (0.75 + Math.random() * 0.35);
        shape.lineTo(px, py);
      }
      shape.lineTo(cx + spread * 0.12, 0);
      shape.lineTo(cx + spread * 0.15, -12);
      shape.closePath();
      return shape;
    }

    const treePositions = [
      [-24, 7, 4.8], [-18, 5.5, 5], [-12, 8, 5.5], [-6, 6, 4.5],
      [0, 6.5, 4.8], [6, 7, 5], [12, 5, 4.5], [18, 7.5, 5.5], [24, 6, 4.8],
    ];

    treePositions.forEach(([cx, h, spread]) => {
      const shape = makeTree(0, h, spread);
      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x010603,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cx, -3.5, 10);
      scene.add(mesh);
    });

    // A solid black bar at the very bottom to seal the ground
    const groundGeo = new THREE.PlaneGeometry(120, 14);
    const groundMat = new THREE.MeshBasicMaterial({ color: 0x010603, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -9.5, 5);
    scene.add(ground);

    // ── Resize handler ────────────────────────────────────────
    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────
    function animate() {
      animId = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.012;

      // Firefly drift
      for (let i = 0; i < ffCount; i++) {
        const sp = ffSpeed[i];
        const ph = ffPhase[i];
        ffPosAttr.array[i * 3]     = ffBase[i * 3]     + Math.sin(t * sp + ph) * 2.2;
        ffPosAttr.array[i * 3 + 1] = ffBase[i * 3 + 1] + Math.cos(t * sp * 0.65 + ph) * 1.6;
        ffPosAttr.array[i * 3 + 2] = ffBase[i * 3 + 2] + Math.sin(t * sp * 0.45 + ph + 1) * 1.2;
      }
      ffPosAttr.needsUpdate = true;
      ffMat.opacity = 0.55 + Math.sin(t * 1.8) * 0.3;

      // Lava flicker
      lavaLight.intensity = 3.5 + Math.sin(t * 2.8) * 1.5;
      lavaMat.opacity = 0.65 + Math.sin(t * 2.1) * 0.25;

      // Lava particle drift upward
      const lavaArr = lavaGeo.getAttribute("position");
      for (let i = 0; i < lavaCount; i++) {
        lavaArr.array[i * 3 + 1] += 0.015 + Math.random() * 0.01;
        if (lavaArr.array[i * 3 + 1] > 24) {
          lavaArr.array[i * 3 + 1] = 17;
        }
      }
      lavaArr.needsUpdate = true;

      // Bird flight
      birds.forEach((bird, i) => {
        const m = birdMeta[i];
        if (frame < m.delayFrames) return;
        m.x += m.speed;
        if (m.x > 42) {
          m.x = -42 - Math.random() * 12;
          m.y = Math.random() * 9 + 3;
          m.z = Math.random() * 9 + 5;
          m.speed = 0.04 + Math.random() * 0.025;
        }
        bird.position.x = m.x;
        bird.position.y = m.y + Math.sin(frame * 0.06 + i * 1.3) * 0.28;
        bird.rotation.z = Math.sin(frame * 0.18 + m.wingPhase) * 0.22;
      });

      // Gentle camera breathe
      camera.position.x = Math.sin(t * 0.04) * 0.6;
      camera.position.y = 3 + Math.cos(t * 0.028) * 0.35;
      camera.lookAt(0, 7, -20);

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      starGeo.dispose(); starMat.dispose();
      coneGeo.dispose(); coneMat.dispose();
      lavaGeo.dispose(); lavaMat.dispose();
      ffGeo.dispose(); ffMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "88vh", minHeight: "520px", background: "#040c06" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        {/* Gold eyebrow */}
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <div className="h-px w-10 bg-[#C9A24E]/50" />
          <span
            className="text-[#C9A24E] text-[10px] sm:text-xs font-medium tracking-[0.38em] uppercase"
            style={{ fontFamily: "var(--font-sans, Inter, system-ui)" }}
          >
            La Fortuna · Arenal · Costa Rica
          </span>
          <div className="h-px w-10 bg-[#C9A24E]/50" />
        </div>

        {/* Hero quote */}
        <h2
          className="max-w-5xl mx-auto text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold italic text-white leading-[1.08] tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            textShadow: "0 2px 40px rgba(0,0,0,0.85)",
          }}
        >
          550 species call this home.
          <span
            className="block mt-2"
            style={{ color: "#C9A24E", textShadow: "0 2px 40px rgba(0,0,0,0.85), 0 0 60px rgba(201,162,78,0.2)" }}
          >
            Soon, you will too.
          </span>
        </h2>

        {/* Divider */}
        <div className="h-px w-16 bg-[#C9A24E]/60 mb-8" />

        {/* Wildlife chips */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {[
            "🐒 Howler Monkeys",
            "🦜 Scarlet Macaws",
            "🦅 Toucans",
            "🦋 Blue Morpho",
            "🌋 Arenal Volcano",
          ].map((item) => (
            <span
              key={item}
              className="bg-black/45 backdrop-blur-sm border border-white/15 text-white/80 px-4 py-2 rounded-full text-xs sm:text-sm font-medium"
              style={{ fontFamily: "var(--font-sans, Inter, system-ui)" }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Sub-copy */}
        <p
          className="mt-8 max-w-xl text-white/50 text-sm sm:text-base leading-relaxed"
          style={{ fontFamily: "var(--font-sans, Inter, system-ui)" }}
        >
          Wake up to a volcano that breathes. Fall asleep to the howl of the jungle.
          <br className="hidden sm:block" />
          Own a piece of the most biodiverse land on Earth.
        </p>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #040c06)" }}
      />
    </div>
  );
}

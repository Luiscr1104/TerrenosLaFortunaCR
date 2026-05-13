"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Iridescent vertex shader — passes world-space normal for Fresnel
const VERT = `
  varying vec2  vUv;
  varying vec3  vWorldNormal;
  varying vec3  vWorldPos;

  void main() {
    vUv          = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 wPos    = modelMatrix * vec4(position, 1.0);
    vWorldPos    = wPos.xyz;
    gl_Position  = projectionMatrix * viewMatrix * wPos;
  }
`;

// Fragment: luminance-based alpha cut + Fresnel iridescence (deep blue → electric cyan)
const FRAG = `
  uniform sampler2D uTex;
  uniform vec3      uCam;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec4 tex = texture2D(uTex, vUv);

    // Cut out white background using luminance threshold
    float lum   = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    float alpha = smoothstep(0.90, 0.60, lum);
    if (alpha < 0.04) discard;

    // Fresnel — angle between wing normal and view direction
    vec3  viewDir = normalize(uCam - vWorldPos);
    float cosA    = abs(dot(normalize(vWorldNormal), viewDir));
    float fresnel = pow(1.0 - cosA, 2.2);

    // Colour palette: near-normal → deep royal blue; grazing → electric cyan
    vec3 deepBlue = vec3(0.03, 0.20, 0.62);
    vec3 midBlue  = vec3(0.06, 0.38, 0.82);
    vec3 cyan     = vec3(0.22, 0.70, 0.96);
    vec3 irid     = mix(deepBlue, mix(midBlue, cyan, fresnel), fresnel);

    // Preserve dark veins & margins from photo (dark pixels stay dark)
    float dark    = smoothstep(0.35, 0.08, lum);
    vec3  final   = mix(irid, irid * 0.25, dark);

    // Add subtle warm shimmer highlight at grazing angles
    final += cyan * fresnel * fresnel * 0.35;

    gl_FragColor  = vec4(final, alpha * 0.94);
  }
`;

function buildWing(
  wW: number,
  wH: number,
  uStart: number,
  uEnd: number,
  pivotRight: boolean, // true = right-edge pivot (left wing), false = left-edge pivot (right wing)
  tex: THREE.Texture
) {
  const geo = new THREE.PlaneGeometry(wW, wH, 6, 8);

  // Move pivot: left wing → shift geometry left so right edge = 0
  //             right wing → shift geometry right so left edge = 0
  geo.translate(pivotRight ? -wW / 2 : wW / 2, 0, 0);

  // Remap UVs to the butterfly's left or right half
  const uvs = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uvs.count; i++) {
    const u = uvs.getX(i);
    uvs.setX(i, uStart + u * (uEnd - uStart));
  }
  uvs.needsUpdate = true;

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTex: { value: tex },
      uCam: { value: new THREE.Vector3(0, 0, 5) },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  return new THREE.Mesh(geo, mat);
}

function createButterfly(scale: number, tex: THREE.Texture) {
  const group = new THREE.Group();
  const wW = 0.88 * scale;
  const wH = 1.08 * scale;

  // Left wing group — pivot at x=0 (body centre), wing extends -x
  const leftPivot = new THREE.Group();
  leftPivot.add(buildWing(wW, wH, 0, 0.5, true, tex));
  group.add(leftPivot);

  // Right wing group — pivot at x=0, wing extends +x
  const rightPivot = new THREE.Group();
  rightPivot.add(buildWing(wW, wH, 0.5, 1.0, false, tex));
  group.add(rightPivot);

  return { group, leftPivot, rightPivot };
}

export function MorphoThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const setSize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    setSize();
    mount.appendChild(renderer.domElement);

    // Orthographic camera — frustum in world units
    const FRUSTUM = 3;
    const aspect = () => mount.clientWidth / mount.clientHeight;
    const camera = new THREE.OrthographicCamera(
      -FRUSTUM * aspect(), FRUSTUM * aspect(),
      FRUSTUM, -FRUSTUM,
      0.1, 20
    );
    camera.position.z = 5;

    const scene = new THREE.Scene();

    // Soft directional light adds a subtle highlight
    const dir = new THREE.DirectionalLight(0x90caf9, 0.8);
    dir.position.set(1, 2, 4);
    scene.add(dir);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Load the morpho texture
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/724a0f5a-9b72-4577-a987-94c49e0f0c86.jpg");
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;

    // Two butterflies — small and subtle
    const b1 = createButterfly(0.52, tex);
    b1.group.position.set(-1.6, 0.8, 0);
    scene.add(b1.group);

    const b2 = createButterfly(0.34, tex);
    b2.group.position.set(1.8, -0.6, -0.3);
    scene.add(b2.group);

    // Animation loop
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Wing flap: absolute-sine drives smooth open→close cycle
      // rotation.y = 0 → wings flat/open; ~1.35 rad (~77°) → nearly closed
      const flap1 = Math.abs(Math.sin(t * 0.75 * Math.PI)) * 1.2;
      b1.leftPivot.rotation.y  =  flap1;
      b1.rightPivot.rotation.y = -flap1;

      const flap2 = Math.abs(Math.sin((t + 0.6) * 0.65 * Math.PI)) * 1.2;
      b2.leftPivot.rotation.y  =  flap2;
      b2.rightPivot.rotation.y = -flap2;

      // Very slow, passive drift
      b1.group.position.x = -1.6 + Math.sin(t * 0.08) * 0.4 + Math.sin(t * 0.05) * 0.15;
      b1.group.position.y =  0.8 + Math.cos(t * 0.07) * 0.3 + Math.sin(t * 0.04) * 0.12;
      b1.group.rotation.z = Math.sin(t * 0.08) * 0.04;

      b2.group.position.x =  1.8 + Math.sin(t * 0.06 + 2.1) * 0.35;
      b2.group.position.y = -0.6 + Math.cos(t * 0.07 + 0.9) * 0.28;
      b2.group.rotation.z = Math.sin(t * 0.06) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      setSize();
      const a = aspect();
      camera.left   = -FRUSTUM * a;
      camera.right  =  FRUSTUM * a;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
      }}
    />
  );
}

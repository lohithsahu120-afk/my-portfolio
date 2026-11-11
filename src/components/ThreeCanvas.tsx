import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Rotate3D, Layers, ZoomIn, ZoomOut, Maximize2, Sparkles, RefreshCcw, Eye, Sun, ChevronUp, ChevronDown } from 'lucide-react';

interface ThreeCanvasProps {
  className?: string;
  onExplodedChange?: (value: number) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explodedVal, setExplodedVal] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<'isometric' | 'front' | 'top' | 'close'>('isometric');
  const [lightMode, setLightMode] = useState<'studio' | 'neon' | 'warm'>('studio');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [activePartName, setActivePartName] = useState<string>('Neural Tensor Core');

  // Mutable refs for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const explodedRef = useRef<number>(0);
  const explodedTargetRef = useRef<number>(0);
  const autoRotateRef = useRef<boolean>(true);

  // Group parts for exploded animation
  const topHeatsinkRef = useRef<THREE.Group | null>(null);
  const bottomHeatsinkRef = useRef<THREE.Group | null>(null);
  const leftGimbalRef = useRef<THREE.Group | null>(null);
  const rightGimbalRef = useRef<THREE.Group | null>(null);
  const outerRingRef = useRef<THREE.Mesh | null>(null);
  const innerRingRef = useRef<THREE.Mesh | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const latticeGroupRef = useRef<THREE.Group | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);

  explodedTargetRef.current = explodedVal;
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js directives
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(5.5, 4.0, 6.0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // slightly below horizon
    controlsRef.current = controls;

    // Environment map using RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(6, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.HemisphereLight(0x60a5fa, 0x0f172a, 1.8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Contact Shadow Grounding Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0,0,0,0.65)');
      gradient.addColorStop(0.5, 'rgba(0,0,0,0.25)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(canvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.8;
    scene.add(shadowPlane);

    // -------------------------------------------------------------
    // Procedural 3D Composite Model: The "NeuroCore-3D" Architecture
    // -------------------------------------------------------------
    const mainRig = new THREE.Group();
    scene.add(mainRig);

    // 1. Central Luminous Quantum Tensor Core
    const coreGeo = new THREE.OctahedronGeometry(0.85, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      emissive: 0x2563eb,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.35,
      transparent: true,
      opacity: 0.95,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = !isSoftwareGl;
    mainRig.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 2. High-precision Wireframe Crystalline Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.95,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    mainRig.add(cageMesh);

    // 3. Inner Synaptic Waveguide Lattice (Glowing interconnects)
    const latticeGroup = new THREE.Group();
    for (let i = 0; i < 18; i++) {
      const tubeGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.8, 8);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x60a5fa,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      const angle = (i / 18) * Math.PI * 2;
      tube.position.set(Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9);
      tube.rotation.z = (Math.PI / 6) * Math.sin(angle);
      tube.rotation.x = (Math.PI / 6) * Math.cos(angle);
      latticeGroup.add(tube);
    }
    mainRig.add(latticeGroup);
    latticeGroupRef.current = latticeGroup;

    // 4. Top Exploded Heatsink Plate (Brushed Titanium Fin Array)
    const topHeatsink = new THREE.Group();
    const plateGeo = new THREE.BoxGeometry(1.6, 0.12, 1.6);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.92,
      roughness: 0.18,
    });
    const topPlate = new THREE.Mesh(plateGeo, plateMat);
    topPlate.position.y = 1.0;
    topPlate.castShadow = !isSoftwareGl;
    topHeatsink.add(topPlate);

    // Cooling micro-fins
    for (let f = -0.65; f <= 0.65; f += 0.18) {
      const finGeo = new THREE.BoxGeometry(1.5, 0.25, 0.04);
      const finMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.95,
        roughness: 0.22,
      });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(0, 1.18, f);
      fin.castShadow = !isSoftwareGl;
      topHeatsink.add(fin);
    }
    mainRig.add(topHeatsink);
    topHeatsinkRef.current = topHeatsink;

    // 5. Bottom Heatsink & Substrate Carrier Plate
    const bottomHeatsink = new THREE.Group();
    const bottomPlate = new THREE.Mesh(plateGeo, plateMat);
    bottomPlate.position.y = -1.0;
    bottomPlate.receiveShadow = !isSoftwareGl;
    bottomHeatsink.add(bottomPlate);

    for (let f = -0.65; f <= 0.65; f += 0.18) {
      const finGeo = new THREE.BoxGeometry(1.5, 0.25, 0.04);
      const finMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.95,
        roughness: 0.22,
      });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(0, -1.18, f);
      bottomHeatsink.add(fin);
    }
    mainRig.add(bottomHeatsink);
    bottomHeatsinkRef.current = bottomHeatsink;

    // 6. Gimbal Gyroscope Rings (Left / Right & Concentric)
    const ringGeo = new THREE.TorusGeometry(1.7, 0.045, 16, 100);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });
    const innerRing = new THREE.Mesh(ringGeo, goldMat);
    mainRig.add(innerRing);
    innerRingRef.current = innerRing;

    const ringGeoOuter = new THREE.TorusGeometry(2.1, 0.05, 16, 120);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.98,
      roughness: 0.12,
    });
    const outerRing = new THREE.Mesh(ringGeoOuter, outerRingMat);
    mainRig.add(outerRing);
    outerRingRef.current = outerRing;

    // 7. Orbiting Neural Token Particles (Floating Swarm)
    const particleCount = 60;
    const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
    });
    const particleGroup = new THREE.Group();
    const particleSpeeds: number[] = [];
    const particleRadii: number[] = [];
    const particleHeights: number[] = [];

    for (let p = 0; p < particleCount; p++) {
      const pMesh = new THREE.Mesh(particleGeo, particleMat);
      const radius = 2.2 + Math.random() * 0.8;
      const speed = 0.4 + Math.random() * 0.6;
      const height = (Math.random() - 0.5) * 1.5;
      particleRadii.push(radius);
      particleSpeeds.push(speed);
      particleHeights.push(height);
      particleGroup.add(pMesh);
    }
    mainRig.add(particleGroup);

    // 8. Ground Circular Stator Pedestal
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.25, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.7;
    baseMesh.receiveShadow = !isSoftwareGl;
    scene.add(baseMesh);

    // Concentric base laser dial ring
    const dialRingGeo = new THREE.RingGeometry(2.0, 2.3, 48);
    const dialRingMat = new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const dialRing = new THREE.Mesh(dialRingGeo, dialRingMat);
    dialRing.rotation.x = -Math.PI / 2;
    dialRing.position.y = -1.56;
    scene.add(dialRing);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth exponential damping for exploded view
      const targetExp = explodedTargetRef.current;
      explodedRef.current = THREE.MathUtils.damp(explodedRef.current, targetExp, 6.0, delta);
      const exp = explodedRef.current;

      // Apply exploded displacements
      if (topHeatsinkRef.current) {
        topHeatsinkRef.current.position.y = 0.0 + exp * 1.4;
      }
      if (bottomHeatsinkRef.current) {
        bottomHeatsinkRef.current.position.y = 0.0 - exp * 1.4;
      }
      if (innerRingRef.current) {
        innerRingRef.current.scale.setScalar(1.0 + exp * 0.4);
        innerRingRef.current.rotation.x = elapsed * 0.4;
        innerRingRef.current.rotation.y = elapsed * 0.6;
      }
      if (outerRingRef.current) {
        outerRingRef.current.scale.setScalar(1.0 + exp * 0.6);
        outerRingRef.current.rotation.y = -elapsed * 0.35;
        outerRingRef.current.rotation.z = elapsed * 0.25;
      }
      if (coreMeshRef.current) {
        coreMeshRef.current.rotation.y = elapsed * 0.5;
        coreMeshRef.current.rotation.x = Math.sin(elapsed * 0.4) * 0.2;
        // Subtle breathing scale
        const s = 1.0 + Math.sin(elapsed * 2.0) * 0.03;
        coreMeshRef.current.scale.set(s, s, s);
      }
      if (latticeGroupRef.current) {
        latticeGroupRef.current.rotation.y = -elapsed * 0.25;
      }

      // Update orbiting particles
      for (let p = 0; p < particleCount; p++) {
        const pMesh = particleGroup.children[p];
        if (pMesh) {
          const angle = elapsed * particleSpeeds[p] + (p * Math.PI * 2) / particleCount;
          const r = particleRadii[p] * (1.0 + exp * 0.5);
          pMesh.position.set(
            Math.cos(angle) * r,
            particleHeights[p] + Math.sin(elapsed + p) * 0.15,
            Math.sin(angle) * r
          );
        }
      }

      // Auto-rotation when not interacting
      if (autoRotateRef.current) {
        mainRig.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Preset Camera Transitions with Smooth Damping
  const setCameraPreset = (preset: 'isometric' | 'front' | 'top' | 'close') => {
    setActivePreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (preset === 'isometric') {
      camera.position.set(5.5, 4.0, 6.0);
      controls.target.set(0, 0, 0);
      setActivePartName('Full Neural Architecture');
    } else if (preset === 'front') {
      camera.position.set(0, 0.5, 7.5);
      controls.target.set(0, 0, 0);
      setActivePartName('Frontal Heatsink & Tensor Array');
    } else if (preset === 'top') {
      camera.position.set(0, 8.5, 0.2);
      controls.target.set(0, 0, 0);
      setActivePartName('Concentric Gyroscope & Waveguide Topology');
    } else if (preset === 'close') {
      camera.position.set(2.2, 1.2, 2.5);
      controls.target.set(0, 0, 0);
      setActivePartName('Quantum Tensor Nucleus (Close-Up)');
    }
  };

  const handleLightPreset = (mode: 'studio' | 'neon' | 'warm') => {
    setLightMode(mode);
    if (!keyLightRef.current) return;
    if (mode === 'studio') {
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 3.2;
    } else if (mode === 'neon') {
      keyLightRef.current.color.setHex(0x38bdf8);
      keyLightRef.current.intensity = 4.0;
    } else if (mode === 'warm') {
      keyLightRef.current.color.setHex(0xfbbf24);
      keyLightRef.current.intensity = 3.0;
    }
  };

  return (
    <div className={`relative w-full h-[520px] sm:h-[600px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: 3D HUD Badge (Minimal Title / Spec) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs">
          <Rotate3D className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-white">NeuroCore-3D</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span className="text-slate-300 font-mono text-[11px]">{activePartName}</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1 pl-1 font-mono">
          Interactive: Drag to Rotate · Scroll to Zoom · Right Click to Pan
        </div>
      </div>

      {/* Top Right: Auto-Rotate & Reset Buttons */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
            autoRotate
              ? 'bg-blue-600/90 text-white border-blue-500'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Toggle 360 Auto-Rotation"
        >
          <Rotate3D className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{autoRotate ? 'Rotating' : 'Rotate Paused'}</span>
        </button>

        <button
          onClick={() => setCameraPreset('isometric')}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Reset Camera View"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Unified Bottom Control Dock (Strictly pinned bottom-center, zero viewport occlusion) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-2xl transition-all duration-300 ${
          isDockCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Collapse / Expand Toggle Button */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="px-3 py-1 text-[11px] font-medium bg-slate-900/90 text-slate-300 hover:text-white border-t border-x border-slate-700/80 rounded-t-lg transition-colors flex items-center gap-1.5"
          >
            {isDockCollapsed ? <ChevronUp className="w-3 h-3 text-blue-400" /> : <ChevronDown className="w-3 h-3 text-blue-400" />}
            <span>{isDockCollapsed ? 'Show 3D Controls' : 'Hide Controls (Zen Mode)'}</span>
          </button>
        </div>

        {/* Dock Controls Container */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl flex flex-col gap-3">
          {/* Row 1: Exploded View Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 whitespace-nowrap flex items-center gap-1.5 shrink-0">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Exploded View:</span>
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodedVal}
              onChange={(e) => setExplodedVal(parseFloat(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-blue-400 w-10 text-right shrink-0 tabular-nums">
              {Math.round(explodedVal * 100)}%
            </span>
          </div>

          {/* Row 2: Camera View Presets & Lighting Themes */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
            {/* View Presets */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Camera:</span>
              {[
                { id: 'isometric', label: 'Isometric' },
                { id: 'front', label: 'Front' },
                { id: 'top', label: 'Top' },
                { id: 'close', label: 'Core Macro' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCameraPreset(p.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                    activePreset === p.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Lighting Modes */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Lighting:</span>
              {[
                { id: 'studio', label: 'Studio' },
                { id: 'neon', label: 'Neon' },
                { id: 'warm', label: 'Warm' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleLightPreset(l.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                    lightMode === l.id
                      ? 'bg-slate-700 text-blue-400 border border-blue-500/50'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, EyeOff, Layers, Sparkles } from 'lucide-react';

type BackgroundMode = 'terrain' | 'constellation' | 'fluid';

export const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<BackgroundMode>('terrain');
  const [isInteractive, setIsInteractive] = useState(true);

  // Keep ref of mutable settings so animation loop doesn't restart
  const modeRef = useRef<BackgroundMode>(mode);
  const isInteractiveRef = useRef<boolean>(isInteractive);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    isInteractiveRef.current = isInteractive;
  }, [isInteractive]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js skill
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.022);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 18, 38);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x030712, 1);
    container.appendChild(renderer.domElement);

    // 2. Procedural Topographic Terrain Grid (Spline / Three.js 3D Wireframe & Surface)
    const gridSegments = isSoftwareGl ? 50 : 85;
    const terrainGeo = new THREE.PlaneGeometry(90, 80, gridSegments, gridSegments);
    terrainGeo.rotateX(-Math.PI / 2);

    // Cache original vertex positions for fluid wave synthesis
    const posAttr = terrainGeo.attributes.position;
    const originalPositions = new Float32Array(posAttr.array);

    // Dynamic vertex colors based on height (Emerald to Cyan to Deep Slate)
    const count = posAttr.count;
    const colors = new Float32Array(count * 3);
    const colorLow = new THREE.Color(0x064e3b);   // Deep Emerald
    const colorMid = new THREE.Color(0x10b981);   // Luminous Emerald
    const colorHigh = new THREE.Color(0x06b6d4);  // Cyan
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      colors[i * 3] = colorMid.r;
      colors[i * 3 + 1] = colorMid.g;
      colors[i * 3 + 2] = colorMid.b;
    }
    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom wireframe/line material with glow & depth
    const terrainMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.y = -6;
    scene.add(terrainMesh);

    // 3. Floating Earth Observation Satellites / Constellation Nodes
    const particleCount = isSoftwareGl ? 60 : 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 80;
      particlePositions[i * 3 + 1] = Math.random() * 25 - 4;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.02,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Canvas texture for soft glowing circular particle sprites
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pCtx = particleCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(52, 211, 153, 1)');
      grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.7)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);
    particleTexture.colorSpace = THREE.SRGBColorSpace;

    const particleMat = new THREE.PointsMaterial({
      size: 1.6,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Input & Pointer Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 5. Responsive Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 6. Animation Render Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse damping
      mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 3.5, delta);
      mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 3.5, delta);

      // Camera subtle perspective tilt on mouse move
      if (isInteractiveRef.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, mouse.x * 6, 2.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 18 + mouse.y * 3.5, 2.5, delta);
        camera.lookAt(0, -2, 0);
      }

      const curMode = modeRef.current;

      // Update Topographic Terrain Heights
      if (curMode === 'terrain' || curMode === 'fluid') {
        terrainMesh.visible = true;
        const currentPos = terrainGeo.attributes.position;
        const colorAttr = terrainGeo.attributes.color;
        const currentArray = currentPos.array as Float32Array;
        const colorArray = colorAttr.array as Float32Array;

        const waveSpeed = curMode === 'fluid' ? 1.4 : 0.7;
        const waveScale = curMode === 'fluid' ? 3.8 : 2.5;

        for (let i = 0; i < count; i++) {
          const ox = originalPositions[i * 3];
          const oz = originalPositions[i * 3 + 2];

          // Harmonic multi-frequency procedural waves simulating digital elevation contour lines
          const elevation1 = Math.sin(ox * 0.12 + time * waveSpeed) * Math.cos(oz * 0.14 + time * waveSpeed * 0.8);
          const elevation2 = Math.sin(ox * 0.24 - oz * 0.18 + time * 0.4) * 0.6;
          const elevation3 = Math.cos(Math.sqrt(ox * ox + oz * oz) * 0.15 - time * 0.6) * 0.8;

          // Mouse interactive ripple field
          let mouseDist = 0;
          if (isInteractiveRef.current) {
            const mWorldX = mouse.x * 25;
            const mWorldZ = -mouse.y * 20;
            const dx = ox - mWorldX;
            const dz = oz - mWorldZ;
            const dist = Math.sqrt(dx * dx + dz * dz);
            mouseDist = Math.max(0, 1 - dist / 18) * 4.0;
          }

          const h = (elevation1 + elevation2 + elevation3) * waveScale + mouseDist;
          currentArray[i * 3 + 1] = h;

          // Color gradient mapping: Emerald lowlands to Cyan peaks
          const normH = Math.min(1, Math.max(0, (h + 3) / 9));
          if (normH < 0.5) {
            tempColor.lerpColors(colorLow, colorMid, normH * 2);
          } else {
            tempColor.lerpColors(colorMid, colorHigh, (normH - 0.5) * 2);
          }

          colorArray[i * 3] = tempColor.r;
          colorArray[i * 3 + 1] = tempColor.g;
          colorArray[i * 3 + 2] = tempColor.b;
        }

        currentPos.needsUpdate = true;
        colorAttr.needsUpdate = true;
      } else {
        terrainMesh.visible = false;
      }

      // Update Constellation Satellite Nodes
      if (curMode === 'constellation' || curMode === 'terrain') {
        particles.visible = true;
        const pPos = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pPos[i * 3] += particleVelocities[i].x;
          pPos[i * 3 + 1] += particleVelocities[i].y;
          pPos[i * 3 + 2] += particleVelocities[i].z;

          // Wrap around space boundaries
          if (pPos[i * 3] > 40) pPos[i * 3] = -40;
          if (pPos[i * 3] < -40) pPos[i * 3] = 40;
          if (pPos[i * 3 + 1] > 22) pPos[i * 3 + 1] = -4;
          if (pPos[i * 3 + 1] < -4) pPos[i * 3 + 1] = 22;
          if (pPos[i * 3 + 2] > 30) pPos[i * 3 + 2] = -30;
          if (pPos[i * 3 + 2] < -30) pPos[i * 3 + 2] = 30;
        }
        particleGeo.attributes.position.needsUpdate = true;
      } else {
        particles.visible = false;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      terrainGeo.dispose();
      terrainMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* Three.js Canvas Container pinned behind content */}
      <div
        ref={mountRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, #06152b 0%, #030712 70%, #020408 100%)',
        }}
      />

      {/* Atmospheric vignette & radial mask for perfect readability */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top,_transparent_30%,_rgba(3,7,18,0.78)_90%)]" />

      {/* Subtle Spline-style 3D Mode Controller Dock (Pinned Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800/90 text-xs shadow-2xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode('terrain')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              mode === 'terrain'
                ? 'bg-emerald-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Interactive 3D Topographic Elevation Grid"
          >
            Lidar Mesh
          </button>
          <button
            onClick={() => setMode('constellation')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              mode === 'constellation'
                ? 'bg-cyan-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="3D Satellite Earth Observation Constellation"
          >
            Sat Swarm
          </button>
          <button
            onClick={() => setMode('fluid')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              mode === 'fluid'
                ? 'bg-emerald-300 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Fluid Harmonic Terrain Waves"
          >
            Fluid Waves
          </button>
        </div>

        <span className="w-px h-3.5 bg-slate-800 mx-0.5" />

        {/* Interactive toggle */}
        <button
          onClick={() => setIsInteractive(!isInteractive)}
          className={`p-1.5 rounded-full transition-colors ${
            isInteractive
              ? 'text-emerald-400 hover:text-emerald-300'
              : 'text-slate-500 hover:text-slate-400'
          }`}
          title={isInteractive ? 'Cursor interaction: Active' : 'Cursor interaction: Off'}
          aria-label="Toggle 3D interactive cursor response"
        >
          {isInteractive ? <Sparkles className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>
    </>
  );
};

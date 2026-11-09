import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { RotateCcw, Play, Pause, ZoomIn, ZoomOut, Box, RefreshCw, AlertCircle, Compass } from 'lucide-react';

interface Vehicle3DCanvasProps {
  modelUrl: string;
  textureBasePath?: string;
  vehicleName: string;
  fallbackImage: string;
}

export const Vehicle3DCanvas: React.FC<Vehicle3DCanvasProps> = ({
  modelUrl,
  textureBasePath = '',
  vehicleName,
  fallbackImage,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [currentDeg, setCurrentDeg] = useState(0);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setLoading(true);
    setProgress(0);
    setLoadError(null);
    materialsRef.current = [];

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b); // obsidian dark

    // 2. Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5.5, 2.2, 5.5);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // don't go below floor
    controls.minDistance = 2.0;
    controls.maxDistance = 15.0;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 1.8;
    controls.target.set(0, 0.8, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting Rig
    // Ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    // Key Light (warm white directional)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Fill Light (cool sky tone)
    const fillLight = new THREE.DirectionalLight(0xccddff, 1.2);
    fillLight.position.set(-6, 8, -6);
    scene.add(fillLight);

    // Rim Light (automotive red glow accent from rear)
    const rimLight = new THREE.DirectionalLight(0xef4444, 1.5);
    rimLight.position.set(0, 3, -10);
    scene.add(rimLight);

    // Headlight highlight (crisp front white)
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(0, 2, 8);
    scene.add(frontLight);

    // 6. Showroom Floor & Shadow Plane
    const gridHelper = new THREE.GridHelper(20, 20, 0xdc2626, 0x27272a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Shadow receiver disc
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.001;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 7. Load 3D Model with FBXLoader
    const manager = new THREE.LoadingManager();
    manager.addHandler(/\.dds$/i, new DDSLoader());

    const loader = new FBXLoader(manager);
    if (textureBasePath) {
      loader.setResourcePath(textureBasePath);
    }

    loader.load(
      modelUrl,
      (fbx) => {
        modelRef.current = fbx;

        // Auto-compute bounding box to center and scale perfectly
        const box = new THREE.Box3().setFromObject(fbx);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Normalize car scale so length is ~4.6 units
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 4.6;
        const scale = maxDim > 0 ? targetSize / maxDim : 1;
        fbx.scale.set(scale, scale, scale);

        // Recompute centered box after scaling
        const scaledBox = new THREE.Box3().setFromObject(fbx);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);

        // Position model so wheels rest on y = 0
        fbx.position.x = -scaledCenter.x;
        fbx.position.y = -scaledBox.min.y;
        fbx.position.z = -scaledCenter.z;

        // Enable shadows and collect materials
        fbx.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                materialsRef.current.push(...mesh.material);
              } else {
                materialsRef.current.push(mesh.material);
              }
            }
          }
        });

        scene.add(fbx);
        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setProgress(Math.round((xhr.loaded / xhr.total) * 100));
        } else {
          // Progress simulation for non-content-length headers
          setProgress((prev) => Math.min(prev + 5, 95));
        }
      },
      (error) => {
        console.error('FBX Load Error:', error);
        setLoadError('3D model visualization is loading with high-res studio frames.');
        setLoading(false);
      }
    );

    // 8. Animation & Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      // Track angle around Y for compass
      const camPos = camera.position;
      const angle = Math.atan2(camPos.x, camPos.z);
      const deg = Math.round(((angle * 180) / Math.PI + 360) % 360);
      setCurrentDeg(deg);

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      materialsRef.current.forEach((m) => m.dispose());
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, textureBasePath]);

  // Toggle Auto Rotate
  const toggleAutoRotate = () => {
    setIsAutoRotating((prev) => {
      const next = !prev;
      if (controlsRef.current) {
        controlsRef.current.autoRotate = next;
      }
      return next;
    });
  };

  // Toggle Wireframe
  const toggleWireframe = () => {
    setIsWireframe((prev) => {
      const next = !prev;
      materialsRef.current.forEach((mat: any) => {
        if (mat) mat.wireframe = next;
      });
      return next;
    });
  };

  // Reset Camera View
  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(5.5, 2.2, 5.5);
      controlsRef.current.target.set(0, 0.8, 0);
      controlsRef.current.update();
    }
  };

  const zoomIn = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.multiplyScalar(0.85);
      controlsRef.current.update();
    }
  };

  const zoomOut = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.multiplyScalar(1.15);
      controlsRef.current.update();
    }
  };

  const getCompassLabel = (deg: number) => {
    if (deg >= 340 || deg <= 20) return 'Front Profile (0°)';
    if (deg >= 70 && deg <= 110) return 'Right Side (90°)';
    if (deg >= 160 && deg <= 200) return 'Rear View (180°)';
    if (deg >= 250 && deg <= 290) return 'Left Side (270°)';
    return `${deg}° Studio View`;
  };

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] flex flex-col items-center justify-center bg-black rounded-2xl overflow-hidden select-none border border-zinc-800">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md text-white p-6">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/50 flex items-center justify-center mb-4 text-red-500 animate-pulse">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
          <h4 className="font-display font-black text-lg tracking-tight text-white mb-1">
            Loading 3D Studio: {vehicleName}
          </h4>
          <p className="text-xs text-zinc-400 max-w-xs text-center mb-4">
            Loading high-fidelity mesh and studio textures...
          </p>
          <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <div
              className="h-full bg-red-600 transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(progress, 15)}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-zinc-400 mt-2">{progress > 0 ? `${progress}%` : 'Buffering...'}</span>
        </div>
      )}

      {/* Fallback Message if model couldn't load */}
      {loadError && (
        <div className="absolute bottom-16 left-4 right-4 z-20 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>Interactive 360° Studio Active. Drag horizontally to inspect vehicle angles.</span>
          </div>
        </div>
      )}

      {/* Top Floating Badges */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="bg-black/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-zinc-700 flex items-center gap-1.5 shadow-lg">
          <RotateCcw className="w-3.5 h-3.5 text-red-500" />
          <span>Click & Drag to Rotate 3D Model</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="bg-black/80 text-red-500 text-xs font-black px-3.5 py-1.5 rounded-full backdrop-blur-md border border-red-600/40 flex items-center gap-1.5 shadow-lg">
          <Compass className="w-3.5 h-3.5" />
          <span>{getCompassLabel(currentDeg)}</span>
        </div>
      </div>

      {/* Bottom Floating 3D Studio Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-2 p-2 rounded-2xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 shadow-2xl">
        <div className="flex items-center gap-2">
          {/* Auto Rotate Toggle */}
          <button
            onClick={toggleAutoRotate}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isAutoRotating
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAutoRotating ? 'Pause Turntable' : 'Auto Rotate'}</span>
          </button>

          {/* Wireframe toggle */}
          <button
            onClick={toggleWireframe}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isWireframe
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Wireframe</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetCamera}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-all"
            title="Reset Perspective"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={zoomIn}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={zoomOut}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

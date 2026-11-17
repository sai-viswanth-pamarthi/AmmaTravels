import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Fuel,
  Settings,
  Users,
  Briefcase,
  Gauge,
  PhoneCall,
  Sparkles,
  Sun,
  Moon,
  Eye,
  Info
} from 'lucide-react';
import { Vehicle } from '@/types';
import { getVehicleWhatsAppUrl } from '@/lib/whatsapp';
import { Vehicle3DCanvas } from './Vehicle3DCanvas';

interface Vehicle360ViewerProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onSelectInterest: (vehicle: Vehicle) => void;
}

export const Vehicle360Viewer: React.FC<Vehicle360ViewerProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSelectInterest,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState<'360' | 'gallery' | 'specs'>('360');
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startFrameRef = useRef(0);

  const [studioLighting, setStudioLighting] = useState<'day' | 'night' | 'sunset'>('day');
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);

  const totalFrames = 36; // 36 frames = 10 degrees per frame

  // Derive high-res quadrant perspective images for this vehicle
  const angleImages = useMemo(() => {
    const list = [vehicle.primaryImage, ...(vehicle.gallery || [])].filter(Boolean);
    return {
      front: list[0] || vehicle.primaryImage,
      right: list[1] || list[0] || vehicle.primaryImage,
      rear: list[2] || list[1] || list[0] || vehicle.primaryImage,
      left: list[3] || list[1] || list[0] || vehicle.primaryImage,
    };
  }, [vehicle]);

  const currentPerspective = useMemo(() => {
    const deg = (currentFrame * 10) % 360;
    if (deg >= 315 || deg < 45) {
      return { img: angleImages.front, label: 'Front Profile (0°)', quadrant: 'front' };
    } else if (deg >= 45 && deg < 135) {
      return { img: angleImages.right, label: 'Right Side Profile (90°)', quadrant: 'right' };
    } else if (deg >= 135 && deg < 225) {
      return { img: angleImages.rear, label: 'Rear Tail View (180°)', quadrant: 'rear' };
    } else {
      return { img: angleImages.left, label: 'Left Side Profile (270°)', quadrant: 'left' };
    }
  }, [currentFrame, angleImages]);

  const hotspots = useMemo(() => [
    {
      id: 'powertrain',
      title: 'Powertrain & Specs',
      desc: `${vehicle.specs.powerBhp || `${vehicle.specs.engineCc || 1500} cc`} • ${vehicle.transmission} • ${vehicle.fuel}`,
      x: '28%',
      y: '52%',
    },
    {
      id: 'cabin',
      title: 'Comfort & Seating',
      desc: `${vehicle.seats} Ergo Seats • Dual Zone Climate Control & Infotainment`,
      x: '52%',
      y: '42%',
    },
    {
      id: 'boot',
      title: 'Luggage Storage',
      desc: `${vehicle.specs.bootSpaceLiters ? `${vehicle.specs.bootSpaceLiters} L Boot Capacity` : 'Spacious Trunk Room'}`,
      x: '76%',
      y: '50%',
    },
  ], [vehicle]);

  // Auto-rotate effect with dynamic speed
  useEffect(() => {
    if (!isOpen || !isAutoRotating || activeTab !== '360') return;
    const intervalTime = Math.max(50, Math.round(120 / rotationSpeed));
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isOpen, isAutoRotating, activeTab, rotationSpeed]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIsAutoRotating(false);
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      } else if (e.key === 'ArrowLeft') {
        setIsAutoRotating(false);
        setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Pointer / Drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startFrameRef.current = currentFrame;
    setIsAutoRotating(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    // Every 12px of movement shifts one frame
    const frameOffset = Math.floor(deltaX / 12);
    const newFrame = (startFrameRef.current - frameOffset) % totalFrames;
    setCurrentFrame(newFrame >= 0 ? newFrame : newFrame + totalFrames);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Current angle in degrees (0 to 350)
  const currentDegrees = currentFrame * 10;

  // Angle compass label
  const getAngleLabel = (deg: number) => {
    if (deg >= 340 || deg <= 20) return 'Front Profile (0°)';
    if (deg >= 70 && deg <= 110) return 'Right Side (90°)';
    if (deg >= 160 && deg <= 200) return 'Rear View (180°)';
    if (deg >= 250 && deg <= 290) return 'Left Side (270°)';
    return `${deg}° Angle`;
  };

  const whatsappUrl = getVehicleWhatsAppUrl(vehicle.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#FAF6EC] dark:bg-slate-900 rounded-3xl border border-[#E8DFCF] dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92dvh]">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E8DFCF] dark:border-slate-800 bg-[#FFFDF7] dark:bg-slate-950 gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  {vehicle.type.toUpperCase()} • {vehicle.subType}
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {vehicle.name}{' '}
                <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">
                  ({vehicle.year})
                </span>
              </h2>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            {/* Tab switchers visible on all screens */}
            <div className="flex overflow-x-auto no-scrollbar bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('360')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap text-center ${
                  activeTab === '360'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                360° Studio
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap text-center ${
                  activeTab === 'gallery'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Photos ({vehicle.gallery.length})
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap text-center ${
                  activeTab === 'specs'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Specs
              </button>
            </div>

            <button
              onClick={onClose}
              className="hidden sm:flex p-2.5 min-w-[44px] min-h-[44px] items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Visualizer Area (8 cols on lg) */}
          <div className={`lg:col-span-8 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 select-none transition-colors duration-300 ${
            studioLighting === 'night'
              ? 'bg-gradient-to-b from-slate-950 via-[#060a14] to-slate-950 text-white'
              : studioLighting === 'sunset'
              ? 'bg-gradient-to-b from-amber-950/30 via-slate-950 to-slate-900 text-white'
              : 'bg-gradient-to-b from-slate-100/80 via-white to-slate-50 dark:from-slate-950 dark:to-slate-900'
          }`}>
            {activeTab === '360' && (
              <div className="relative flex-1 flex flex-col items-center justify-between min-h-[360px] sm:min-h-[440px]">
                {/* 360° Interactive Canvas Box */}
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className="relative w-full max-w-2xl h-72 sm:h-96 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl group"
                >
                  {/* Studio Spotlight Dynamic Beam */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay transition-all duration-100"
                    style={{
                      background: `linear-gradient(${currentDegrees + 45}deg, transparent 15%, rgba(255,255,255,0.4) 50%, transparent 85%)`,
                    }}
                  />

                  {/* 3D Turntable Base Platform */}
                  <div className="absolute bottom-6 sm:bottom-8 w-[380px] sm:w-[480px] h-24 pointer-events-none flex items-center justify-center">
                    <div
                      className="w-full h-full rounded-[100%] border-2 border-blue-500/50 dark:border-blue-400/60 shadow-[0_0_35px_rgba(59,130,246,0.25)] transition-transform duration-75 relative flex items-center justify-center"
                      style={{
                        transform: `rotateX(72deg) rotateZ(${currentDegrees}deg)`,
                      }}
                    >
                      <div className="w-[88%] h-[88%] rounded-[100%] border border-dashed border-blue-400/40" />
                      <span className="absolute top-1 text-[9px] font-mono text-blue-500 dark:text-blue-400 font-extrabold uppercase">
                        ▲ FRONT 0°
                      </span>
                      <span className="absolute right-2 text-[9px] font-mono text-blue-500 dark:text-blue-400 font-extrabold uppercase">
                        90° RIGHT
                      </span>
                      <span className="absolute bottom-1 text-[9px] font-mono text-blue-500 dark:text-blue-400 font-extrabold uppercase">
                        180° REAR
                      </span>
                      <span className="absolute left-2 text-[9px] font-mono text-blue-500 dark:text-blue-400 font-extrabold uppercase">
                        270° LEFT
                      </span>
                    </div>
                  </div>

                  {/* Procedural / Multi-Angle 360 Vehicle Projection */}
                  <div
                    className="relative w-full h-full flex items-center justify-center transition-transform duration-100 z-10"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${
                        Math.sin((currentDegrees * Math.PI) / 180) * 1.8
                      }deg)`,
                    }}
                  >
                    <img
                      key={currentPerspective.quadrant}
                      src={currentPerspective.img}
                      alt={`${vehicle.name} view at ${currentDegrees}°`}
                      className="max-h-[82%] max-w-[92%] object-contain filter pointer-events-none transition-all duration-200 animate-in fade-in"
                      style={{
                        filter: `drop-shadow(0 25px 30px rgba(0, 0, 0, 0.45)) brightness(${
                          studioLighting === 'night'
                            ? 0.88 + Math.cos((currentDegrees * Math.PI) / 180) * 0.15
                            : studioLighting === 'sunset'
                            ? 1.05 + Math.cos((currentDegrees * Math.PI) / 180) * 0.1
                            : 0.95 + Math.cos((currentDegrees * Math.PI) / 180) * 0.12
                        }) contrast(1.05)`,
                      }}
                    />

                    {/* Interactive Hotspots Overlays */}
                    {showHotspots && hotspots.map((spot) => (
                      <div
                        key={spot.id}
                        className="absolute z-20"
                        style={{ left: spot.x, top: spot.y }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                          }}
                          className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/50 hover:scale-125 transition-transform animate-pulse"
                          title={spot.title}
                        >
                          <span className="text-[10px] font-black">+</span>
                        </button>

                        {/* Hotspot Popover Detail */}
                        {activeHotspot === spot.id && (
                          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-48 p-2.5 rounded-xl bg-slate-900/95 text-white border border-blue-500/40 shadow-xl backdrop-blur-md animate-in fade-in">
                            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">{spot.title}</p>
                            <p className="text-[10px] text-slate-200 mt-0.5 leading-snug">{spot.desc}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Top Left: Drag to rotate hint & Hotspots toggle */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <div className="bg-slate-950/80 text-white text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-sm">
                      <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                      <span>Drag to rotate 360°</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowHotspots(!showHotspots)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border transition-all ${
                        showHotspots
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-slate-950/80 text-slate-300 border-white/10 hover:text-white'
                      }`}
                    >
                      Hotspots {showHotspots ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Top Right: Live Angle Compass Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-slate-950/80 text-blue-400 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-blue-500/40 flex items-center gap-1.5 shadow-md">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{currentPerspective.label}</span>
                  </div>
                </div>

                {/* 360 Studio Bottom Toolbar */}
                <div className="w-full max-w-2xl mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Auto-rotate toggle & Speed */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      className={`px-3 py-1.5 font-semibold rounded-xl border flex items-center gap-1.5 transition-all active:scale-95 ${
                        isAutoRotating
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-[#FFFDF7] dark:bg-slate-800 text-stone-700 dark:text-slate-200 border-[#E8DFCF] dark:border-slate-700 hover:bg-[#F3EBD8]'
                      }`}
                    >
                      {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isAutoRotating ? 'Pause' : 'Rotate'}</span>
                    </button>

                    {/* Speed Selector */}
                    {isAutoRotating && (
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
                        {[0.5, 1, 2].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => setRotationSpeed(spd)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                              rotationSpeed === spd
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Angle scrubber slider */}
                  <div className="flex-1 min-w-[160px] max-w-[220px] flex items-center gap-2">
                    <span className="text-[10px] font-mono text-stone-500 dark:text-slate-400">0°</span>
                    <input
                      type="range"
                      min={0}
                      max={totalFrames - 1}
                      value={currentFrame}
                      onChange={(e) => {
                        setIsAutoRotating(false);
                        setCurrentFrame(Number(e.target.value));
                      }}
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-stone-200 dark:bg-slate-700 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Rotate angle slider"
                    />
                    <span className="text-[10px] font-mono text-stone-500 dark:text-slate-400">360°</span>
                  </div>

                  {/* Studio Lighting Mood Switcher */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setStudioLighting('day')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                        studioLighting === 'day'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                      title="Daylight Studio"
                    >
                      <Sun className="w-3 h-3" />
                      <span className="hidden sm:inline">Day</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioLighting('night')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                        studioLighting === 'night'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                      title="Neon Night Mood"
                    >
                      <Moon className="w-3 h-3" />
                      <span className="hidden sm:inline">Night</span>
                    </button>
                  </div>

                  {/* Zoom controls */}
                  <div className="flex items-center gap-1 bg-[#FFFDF7] dark:bg-slate-800 border border-[#E8DFCF] dark:border-slate-700 rounded-xl p-0.5">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.8, Number((z - 0.2).toFixed(1))))}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-500"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold px-1 text-slate-700 dark:text-slate-200">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(2.0, Number((z + 0.2).toFixed(1))))}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-500"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery View Tab */}
            {activeTab === 'gallery' && (
              <div className="flex-1 flex flex-col items-center justify-between gap-4">
                <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img
                    src={vehicle.gallery[selectedGalleryIdx] || vehicle.primaryImage}
                    alt={`${vehicle.name} photo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Thumbnails */}
                <div className="flex items-center gap-3 overflow-x-auto w-full pb-2">
                  {vehicle.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGalleryIdx(idx)}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedGalleryIdx === idx
                          ? 'border-blue-500 shadow-md shadow-blue-500/20 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specs View Tab */}
            {activeTab === 'specs' && (
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 p-2">
                <div className="p-3 bg-[#FFFDF7] dark:bg-slate-800/80 rounded-xl border border-[#E8DFCF] dark:border-slate-700">
                  <p className="text-xs text-stone-500 dark:text-slate-400">Transmission</p>
                  <p className="text-sm font-bold text-stone-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-blue-500" />
                    {vehicle.transmission}
                  </p>
                </div>
                <div className="p-3 bg-[#FFFDF7] dark:bg-slate-800/80 rounded-xl border border-[#E8DFCF] dark:border-slate-700">
                  <p className="text-xs text-stone-500 dark:text-slate-400">Fuel Type</p>
                  <p className="text-sm font-bold text-stone-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-blue-500" />
                    {vehicle.fuel}
                  </p>
                </div>
                <div className="p-3 bg-[#FFFDF7] dark:bg-slate-800/80 rounded-xl border border-[#E8DFCF] dark:border-slate-700">
                  <p className="text-xs text-stone-500 dark:text-slate-400">Seating Capacity</p>
                  <p className="text-sm font-bold text-stone-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-500" />
                    {vehicle.seats} Seats
                  </p>
                </div>
                {vehicle.specs.engineCc && (
                  <div className="p-3 bg-[#FFFDF7] dark:bg-slate-800/80 rounded-xl border border-[#E8DFCF] dark:border-slate-700">
                    <p className="text-xs text-stone-500 dark:text-slate-400">Engine Displacement</p>
                    <p className="text-sm font-bold text-stone-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-blue-500" />
                      {vehicle.specs.engineCc} cc
                    </p>
                  </div>
                )}
                {vehicle.specs.mileageKmpl && (
                  <div className="p-3 bg-[#FFFDF7] dark:bg-slate-800/80 rounded-xl border border-[#E8DFCF] dark:border-slate-700">
                    <p className="text-xs text-stone-500 dark:text-slate-400">Fuel Economy</p>
                    <p className="text-sm font-bold text-stone-900 dark:text-slate-100 mt-1">
                      {vehicle.specs.mileageKmpl} km/l
                    </p>
                  </div>
                )}
                {vehicle.specs.bootSpaceLiters && (
                  <div className="p-3 bg-[#FFFDF7] dark:bg-slate-800/80 rounded-xl border border-[#E8DFCF] dark:border-slate-700">
                    <p className="text-xs text-stone-500 dark:text-slate-400">Luggage Boot</p>
                    <p className="text-sm font-bold text-stone-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      {vehicle.specs.bootSpaceLiters} Liters
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pricing, Inclusions, & Direct Booking CTA (4 cols on lg) */}
          <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-[#FFFDF7] dark:bg-slate-950">
            <div>
              {/* Price Callout */}
              <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-950/30 border border-blue-500/30 dark:border-blue-600/40">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  Transparent Tariff
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                    ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">/ 24 hrs</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between border-t border-blue-500/20 dark:border-blue-900/40 pt-2">
                  <span>Weekly Rate: ₹{vehicle.pricePerWeek?.toLocaleString('en-IN') || (vehicle.pricePerDay * 6).toLocaleString('en-IN')}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Save ~15%</span>
                </div>
              </div>

              {/* Rental Conditions & Limits */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Security Deposit (Refundable)</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    ₹{vehicle.deposit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Daily Free Run Limit</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{vehicle.kmLimit} km / day</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Excess KM Rate</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">₹{vehicle.excessKmRate} / km</span>
                </div>
              </div>

              {/* Included Perks Checklist */}
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Included With Every Booking
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                  {vehicle.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Valid RC, Comprehensive Insurance & PUC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Interested & WhatsApp */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <button
                onClick={() => {
                  onClose();
                  onSelectInterest(vehicle);
                }}
                disabled={vehicle.status === 'Maintenance'}
                className="btn-interactive w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>I'm Interested</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Chat Directly on WhatsApp</span>
              </a>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                Hub pickup in Kakinada • Doorstep delivery available upon request
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

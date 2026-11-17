import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles
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

  const totalFrames = 36; // 36 frames = 10 degrees per frame

  // Auto-rotate effect
  useEffect(() => {
    if (!isOpen || !isAutoRotating || activeTab !== '360') return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 120);
    return () => clearInterval(interval);
  }, [isOpen, isAutoRotating, activeTab]);

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
          <div className="lg:col-span-8 p-6 flex flex-col justify-between bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 select-none">
            {activeTab === '360' && (
              vehicle.model3dUrl ? (
                <div className="relative flex-1 w-full min-h-[380px] sm:min-h-[440px] flex flex-col rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <Vehicle3DCanvas
                    modelUrl={vehicle.model3dUrl}
                    textureBasePath={vehicle.textureBasePath}
                    vehicleName={vehicle.name}
                    fallbackImage={vehicle.primaryImage}
                  />
                </div>
              ) : (
                <div className="relative flex-1 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[420px]">
                  {/* 360° Interactive Canvas Box */}
                  <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    className="relative w-full max-w-xl h-64 sm:h-80 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl group"
                  >
                    {/* Procedural / Photographic 360 vehicle projection */}
                    <div
                      className="relative w-full h-full flex items-center justify-center transition-transform duration-75"
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${
                          // Subtle 3D tilt perspective simulation
                          Math.sin((currentDegrees * Math.PI) / 180) * 2
                        }deg)`,
                      }}
                    >
                      <img
                        src={vehicle.primaryImage}
                        alt={`${vehicle.name} view at ${currentDegrees}°`}
                        className="w-full h-full object-contain filter drop-shadow-2xl pointer-events-none transition-all duration-100"
                        style={{
                          // Hue and lighting shift simulating 360 light rotation
                          filter: `drop-shadow(0 20px 25px rgba(0, 0, 0, 0.25)) brightness(${
                            0.92 + Math.cos((currentDegrees * Math.PI) / 180) * 0.12
                          })`,
                        }}
                      />
                    </div>

                    {/* Drag to rotate hint pill */}
                    <div className="absolute top-4 left-4 bg-slate-950/80 text-white text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1.5 opacity-90 pointer-events-none">
                      <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                      <span>Drag horizontally to rotate 360°</span>
                    </div>

                    {/* Angle Compass Badge */}
                    <div className="absolute top-4 right-4 bg-slate-950/80 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-blue-500/30 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>{getAngleLabel(currentDegrees)}</span>
                    </div>
                  </div>

                  {/* 360 Studio Bottom Toolbar */}
                  <div className="w-full max-w-xl mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    {/* Auto-rotate toggle */}
                    <button
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        isAutoRotating
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-[#FFFDF7] dark:bg-slate-800 text-stone-700 dark:text-slate-200 border-[#E8DFCF] dark:border-slate-700 hover:bg-[#F3EBD8]'
                      }`}
                    >
                      {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isAutoRotating ? 'Pause Spin' : 'Auto Rotate'}</span>
                    </button>

                    {/* Angle scrubber slider */}
                    <div className="flex-1 max-w-[200px] flex items-center gap-2">
                      <span className="text-[10px] text-stone-500 dark:text-slate-400">0°</span>
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
                      <span className="text-[10px] text-stone-500 dark:text-slate-400">360°</span>
                    </div>

                    {/* Zoom controls */}
                    <div className="flex items-center gap-1 bg-[#FFFDF7] dark:bg-slate-800 border border-[#E8DFCF] dark:border-slate-700 rounded-lg p-0.5">
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-500 focus-visible:outline-none focus-visible:text-blue-500"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-bold px-1 text-slate-700 dark:text-slate-200">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <button
                        onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-500 focus-visible:outline-none focus-visible:text-blue-500"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
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

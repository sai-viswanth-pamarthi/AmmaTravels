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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-warm-50 dark:bg-charcoal-900 rounded-3xl border border-warm-200 dark:border-charcoal-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                {vehicle.type.toUpperCase()} • {vehicle.subType}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  vehicle.status === 'Available'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : vehicle.status === 'Booked'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {vehicle.status}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-charcoal-900 dark:text-warm-50 mt-1">
              {vehicle.name}{' '}
              <span className="text-sm font-normal text-charcoal-500 dark:text-warm-300">
                ({vehicle.year})
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="hidden sm:flex bg-warm-100 dark:bg-charcoal-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('360')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === '360'
                    ? 'bg-white dark:bg-charcoal-900 text-teal-950 dark:text-saffron-400 shadow-sm'
                    : 'text-charcoal-600 dark:text-warm-300 hover:text-charcoal-900'
                }`}
              >
                360° Studio
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-white dark:bg-charcoal-900 text-teal-950 dark:text-saffron-400 shadow-sm'
                    : 'text-charcoal-600 dark:text-warm-300 hover:text-charcoal-900'
                }`}
              >
                Photo Gallery ({vehicle.gallery.length})
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'specs'
                    ? 'bg-white dark:bg-charcoal-900 text-teal-950 dark:text-saffron-400 shadow-sm'
                    : 'text-charcoal-600 dark:text-warm-300 hover:text-charcoal-900'
                }`}
              >
                Technical Specs
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-warm-100 rounded-full hover:bg-warm-100 dark:hover:bg-charcoal-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Visualizer Area (8 cols on lg) */}
          <div className="lg:col-span-8 p-6 flex flex-col justify-between bg-gradient-to-b from-warm-100/70 to-warm-50 dark:from-charcoal-950 dark:to-charcoal-900 border-b lg:border-b-0 lg:border-r border-warm-200 dark:border-charcoal-800 select-none">
            {activeTab === '360' && (
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
                  <div className="absolute top-4 left-4 bg-charcoal-950/70 text-warm-100 text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1.5 opacity-90 pointer-events-none">
                    <RotateCcw className="w-3.5 h-3.5 text-saffron-400" />
                    <span>Drag horizontally to rotate 360°</span>
                  </div>

                  {/* Angle Compass Badge */}
                  <div className="absolute top-4 right-4 bg-charcoal-950/70 text-saffron-400 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-saffron-500/30 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{getAngleLabel(currentDegrees)}</span>
                  </div>
                </div>

                {/* 360 Studio Bottom Toolbar */}
                <div className="w-full max-w-xl mt-4 pt-3 border-t border-warm-200 dark:border-charcoal-800 flex items-center justify-between gap-3">
                  {/* Auto-rotate toggle */}
                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors ${
                      isAutoRotating
                        ? 'bg-teal-900 text-saffron-400 border-teal-700'
                        : 'bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-warm-200 border-warm-300 dark:border-charcoal-700'
                    }`}
                  >
                    {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAutoRotating ? 'Pause Spin' : 'Auto Rotate'}</span>
                  </button>

                  {/* Angle scrubber slider */}
                  <div className="flex-1 max-w-[200px] flex items-center gap-2">
                    <span className="text-[10px] text-charcoal-500 dark:text-warm-400">0°</span>
                    <input
                      type="range"
                      min={0}
                      max={totalFrames - 1}
                      value={currentFrame}
                      onChange={(e) => {
                        setIsAutoRotating(false);
                        setCurrentFrame(Number(e.target.value));
                      }}
                      className="w-full accent-saffron-500 cursor-pointer h-1.5 bg-warm-300 dark:bg-charcoal-700 rounded-lg"
                      aria-label="Rotate angle slider"
                    />
                    <span className="text-[10px] text-charcoal-500 dark:text-warm-400">360°</span>
                  </div>

                  {/* Zoom controls */}
                  <div className="flex items-center gap-1 bg-white dark:bg-charcoal-800 border border-warm-300 dark:border-charcoal-700 rounded-lg p-0.5">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                      className="p-1.5 text-charcoal-600 dark:text-warm-300 hover:text-charcoal-900"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold px-1 text-charcoal-700 dark:text-warm-200">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
                      className="p-1.5 text-charcoal-600 dark:text-warm-300 hover:text-charcoal-900"
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
                <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-charcoal-950 flex items-center justify-center">
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
                          ? 'border-saffron-500 shadow-md scale-105'
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
                <div className="p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-warm-200 dark:border-charcoal-700">
                  <p className="text-xs text-charcoal-500 dark:text-warm-400">Transmission</p>
                  <p className="text-sm font-bold text-charcoal-900 dark:text-warm-100 mt-1 flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-saffron-500" />
                    {vehicle.transmission}
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-warm-200 dark:border-charcoal-700">
                  <p className="text-xs text-charcoal-500 dark:text-warm-400">Fuel Type</p>
                  <p className="text-sm font-bold text-charcoal-900 dark:text-warm-100 mt-1 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-saffron-500" />
                    {vehicle.fuel}
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-warm-200 dark:border-charcoal-700">
                  <p className="text-xs text-charcoal-500 dark:text-warm-400">Seating Capacity</p>
                  <p className="text-sm font-bold text-charcoal-900 dark:text-warm-100 mt-1 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-saffron-500" />
                    {vehicle.seats} Seats
                  </p>
                </div>
                {vehicle.specs.engineCc && (
                  <div className="p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-warm-200 dark:border-charcoal-700">
                    <p className="text-xs text-charcoal-500 dark:text-warm-400">Engine Displacement</p>
                    <p className="text-sm font-bold text-charcoal-900 dark:text-warm-100 mt-1 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-saffron-500" />
                      {vehicle.specs.engineCc} cc
                    </p>
                  </div>
                )}
                {vehicle.specs.mileageKmpl && (
                  <div className="p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-warm-200 dark:border-charcoal-700">
                    <p className="text-xs text-charcoal-500 dark:text-warm-400">Fuel Economy</p>
                    <p className="text-sm font-bold text-charcoal-900 dark:text-warm-100 mt-1">
                      {vehicle.specs.mileageKmpl} km/l
                    </p>
                  </div>
                )}
                {vehicle.specs.bootSpaceLiters && (
                  <div className="p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-warm-200 dark:border-charcoal-700">
                    <p className="text-xs text-charcoal-500 dark:text-warm-400">Luggage Boot</p>
                    <p className="text-sm font-bold text-charcoal-900 dark:text-warm-100 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-saffron-500" />
                      {vehicle.specs.bootSpaceLiters} Liters
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pricing, Inclusions, & Direct Booking CTA (4 cols on lg) */}
          <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-white dark:bg-charcoal-950">
            <div>
              {/* Price Callout */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <span className="text-xs text-teal-700 dark:text-teal-300 font-semibold uppercase tracking-wider">
                  Transparent Tariff
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-teal-950 dark:text-warm-50 font-display">
                    ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-charcoal-600 dark:text-warm-300 font-medium">/ 24 hrs</span>
                </div>
                <div className="mt-2 text-xs text-charcoal-600 dark:text-warm-300 flex items-center justify-between border-t border-teal-200/60 dark:border-teal-800/60 pt-2">
                  <span>Weekly Rate: ₹{vehicle.pricePerWeek?.toLocaleString('en-IN') || (vehicle.pricePerDay * 6).toLocaleString('en-IN')}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Save ~15%</span>
                </div>
              </div>

              {/* Rental Conditions & Limits */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs py-1 border-b border-warm-200 dark:border-charcoal-800">
                  <span className="text-charcoal-600 dark:text-warm-400">Security Deposit (Refundable)</span>
                  <span className="font-bold text-charcoal-900 dark:text-warm-100">
                    ₹{vehicle.deposit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-warm-200 dark:border-charcoal-800">
                  <span className="text-charcoal-600 dark:text-warm-400">Daily Free Run Limit</span>
                  <span className="font-bold text-charcoal-900 dark:text-warm-100">{vehicle.kmLimit} km / day</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-warm-200 dark:border-charcoal-800">
                  <span className="text-charcoal-600 dark:text-warm-400">Excess KM Rate</span>
                  <span className="font-bold text-charcoal-900 dark:text-warm-100">₹{vehicle.excessKmRate} / km</span>
                </div>
              </div>

              {/* Included Perks Checklist */}
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal-500 dark:text-warm-400 mb-2">
                  Included With Every Booking
                </p>
                <div className="space-y-1.5 text-xs text-charcoal-700 dark:text-warm-200">
                  {vehicle.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                    <span>Valid RC, Comprehensive Insurance & PUC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Interested & WhatsApp */}
            <div className="mt-6 pt-4 border-t border-warm-200 dark:border-charcoal-800 space-y-2.5">
              <button
                onClick={() => {
                  onClose();
                  onSelectInterest(vehicle);
                }}
                disabled={vehicle.status === 'Maintenance'}
                className="w-full py-3 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-teal-950 font-bold text-sm tracking-wide shadow-lg shadow-saffron-500/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>I'm Interested — Book Vehicle</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Chat Directly on WhatsApp</span>
              </a>

              <p className="text-[11px] text-center text-charcoal-500 dark:text-warm-400">
                Hub pickup in Kakinada • Doorstep delivery available upon request
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

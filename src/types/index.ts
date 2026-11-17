export type VehicleType = 'car' | 'bike';
export type VehicleStatus = 'Available' | 'Booked' | 'Maintenance';
export type InterestType = 'vehicle' | 'event';
export type LeadStage =
  | 'New'
  | 'Contacted'
  | 'Visit/Meeting Scheduled'
  | 'Documents Verified'
  | 'Confirmed'
  | 'Completed'
  | 'Rejected';

export type UserRole = 'admin' | 'staff' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  token?: string;
}

export interface VehicleColorVariant {
  name: string;
  hex: string;
  image?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  subType: string; // Scooter, Cruiser, Roadster, Sports, Hatchback, Sedan, SUV, 7-Seater MPV
  brand: string;
  model: string;
  year: number;
  transmission: 'Manual' | 'Automatic';
  fuel: 'Petrol' | 'Diesel' | 'Electric';
  seats: number;
  pricePerDay: number; // in INR
  pricePerWeek: number; // in INR
  deposit: number; // in INR
  kmLimit: number; // km/day
  excessKmRate: number; // INR/km
  status: VehicleStatus;
  specs: {
    engineCc?: number;
    mileageKmpl?: number;
    powerBhp?: string;
    bootSpaceLiters?: number;
    topSpeedKmph?: number;
  };
  features: string[];
  colors?: Array<VehicleColorVariant | string>;
  primaryImage: string;
  gallery: string[];
  has360View?: boolean;
  frames360?: string[]; // 24-36 frame URLs or generated procedural angles
  model3dUrl?: string; // 3D model asset path
  model3dType?: 'fbx' | 'gltf' | 'glb';
  textureBasePath?: string;
  isFeatured?: boolean;
}

export interface EventPackage {
  id: string;
  title: string;
  slug: string;
  eventType: 'Wedding' | 'Birthday' | 'Corporate' | 'TourGroup';
  tagline: string;
  description: string;
  priceRange: string; // e.g. "₹50,000 - ₹2,50,000"
  guestCapacity: string; // e.g. "50 - 500 Guests"
  includedServices: string[];
  gallery: string[];
  highlights: string[];
  isFeatured: boolean;
}

export interface InterestSubmission {
  id: string;
  refId: string; // AT-V-1001 or AT-E-2001
  type: InterestType;
  vehicleId?: string;
  vehicleName?: string;
  selectedColor?: string;
  packageId?: string;
  packageName?: string;
  
  // Customer Details
  name: string;
  phone: string;
  email: string;
  
  // Vehicle Booking specifics
  pickupDate?: string;
  returnDate?: string;
  pickupLocation?: string;
  idProofUrl?: string;
  
  // Event Booking specifics
  eventType?: string;
  eventDate?: string;
  guestCount?: number;
  budgetRange?: string;
  cityVenue?: string;
  
  message?: string;
  
  // CRM Lead Pipeline
  status: 'Submitted' | 'Contacted' | 'Confirmed' | 'Completed' | 'Cancelled';
  progressStage: LeadStage;
  internalNotes?: string;
  followUpDate?: string;
  assignedTo?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  interestId: string;
  adminName: string;
  action: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  bookedVehicles: number;
  maintenanceVehicles: number;
  newEnquiriesToday: number;
  confirmedBookings: number;
  eventEnquiries: number;
  estimatedRevenue: number;
  enquiriesOverTime: { date: string; count: number }[];
  mostRequestedVehicles: { name: string; count: number }[];
}

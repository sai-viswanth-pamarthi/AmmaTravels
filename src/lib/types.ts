export type VehicleCategory = 'car' | 'bike';

export type BookingStatus =
  | 'pending'
  | 'under_review'
  | 'awaiting_payment'
  | 'confirmed'
  | 'ready_for_pickup'
  | 'active'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type DocumentType = 'driving_license' | 'aadhaar_card' | 'passport' | 'other';
export type DocumentStatus = 'pending' | 'verified' | 'correction_required' | 'rejected';
export type FuelPolicy = 'customer_fills' | 'full_to_full' | 'same_to_same';
export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  brand: string;
  category: VehicleCategory;
  subCategory: string; // e.g. Scooter, Cruiser, Hatchback, SUV, 7-Seater
  registrationNumber?: string;
  year: number;
  transmission: 'Manual' | 'Automatic';
  fuelType: 'Petrol' | 'Diesel' | 'Electric';
  seatingCapacity: number;
  engineCc?: number;
  mileageKmpl?: number;
  primaryImageUrl: string;
  galleryImages?: string[];
  description: string;
  dailyRate: number; // in INR (₹)
  hourlyRate: number; // in INR (₹)
  depositAmount: number; // in INR (₹)
  kmLimitPerDay: number;
  excessKmRate: number; // per km in INR (₹)
  fuelPolicy: FuelPolicy;
  minAge: number;
  features: string[];
  isPublished: boolean;
  isAvailable: boolean;
  displayOrder: number;
}

export interface MaintenanceBlock {
  id: string;
  vehicleId: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  reason: string;
  createdAt?: string;
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. AT-2026-1001
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: VehicleCategory;
  vehicleImageUrl: string;
  pickupTime: string; // ISO string
  returnTime: string; // ISO string
  pickupLocation: string;
  returnLocation: string;
  status: BookingStatus;
  
  // Snapshots
  baseRateSnapshot: number;
  hourlyRateSnapshot: number;
  depositSnapshot: number;
  kmLimitSnapshot: number;
  excessKmRateSnapshot: number;
  fuelPolicySnapshot: FuelPolicy;
  
  // Billing Breakdown
  rentalCharge: number;
  addonsCharge: number;
  depositCharge: number;
  totalAmount: number;
  currency: string; // 'INR'
  
  // Add-ons & details
  helmetCount: number;
  damageProtection: boolean;
  customerNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  
  // Inspection readings
  odometerStart?: number;
  odometerEnd?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface BookingStatusHistory {
  id: string;
  bookingId: string;
  fromStatus: BookingStatus | null;
  toStatus: BookingStatus;
  changedBy: string;
  notes?: string;
  createdAt: string;
}

export interface CustomerDocument {
  id: string;
  userId: string;
  documentType: DocumentType;
  fileName: string;
  storagePath: string;
  fileSizeBytes: number;
  mimeType: string;
  status: DocumentStatus;
  correctionNotes?: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  filePreviewUrl?: string;
}

export interface RentalPolicy {
  id: string;
  title: string;
  category: string;
  description: string;
  displayOrder: number;
}

export interface PriceCalculation {
  totalHours: number;
  rentalDays: number;
  rentalHoursRemainder: number;
  baseRentalCharge: number;
  helmetCharge: number;
  protectionCharge: number;
  addonsTotal: number;
  refundableDeposit: number;
  totalPayable: number;
  kmAllowed: number;
  excessKmRate: number;
  currency: string;
  formattedDuration: string;
}

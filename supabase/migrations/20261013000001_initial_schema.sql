-- ====================================================================
-- AMMA TRAVELS: DATABASE SCHEMA MIGRATION
-- Production-grade schema with strict RLS, constraints & audit logging
-- Location: Kakinada, Andhra Pradesh, India
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS & DOMAINS
DO $$ BEGIN
  CREATE TYPE vehicle_category AS ENUM ('car', 'bike');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'pending',
    'under_review',
    'awaiting_payment',
    'confirmed',
    'ready_for_pickup',
    'active',
    'completed',
    'rejected',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE document_type AS ENUM (
    'driving_license',
    'aadhaar_card',
    'passport',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE document_status AS ENUM (
    'pending',
    'verified',
    'correction_required',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE fuel_policy AS ENUM (
    'customer_fills',
    'full_to_full',
    'same_to_same'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. SEQUENCES
CREATE SEQUENCE IF NOT EXISTS booking_ref_seq START WITH 1001;

-- 3. PROFILES TABLE (Supabase Auth link)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  brand TEXT NOT NULL,
  category vehicle_category NOT NULL,
  sub_category TEXT NOT NULL, -- e.g. 'Scooter', 'Cruiser', 'Hatchback', 'SUV'
  registration_number TEXT,
  year INTEGER NOT NULL CHECK (year >= 2015),
  transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Automatic')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric')),
  seating_capacity INTEGER NOT NULL CHECK (seating_capacity >= 1),
  engine_cc INTEGER,
  mileage_kmpl NUMERIC(5,2),
  primary_image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  daily_rate NUMERIC(10,2) NOT NULL CHECK (daily_rate > 0),
  hourly_rate NUMERIC(10,2) NOT NULL CHECK (hourly_rate > 0),
  deposit_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
  km_limit_per_day INTEGER NOT NULL DEFAULT 150 CHECK (km_limit_per_day >= 0),
  excess_km_rate NUMERIC(10,2) NOT NULL DEFAULT 5.00 CHECK (excess_km_rate >= 0),
  fuel_policy fuel_policy NOT NULL DEFAULT 'customer_fills',
  min_age INTEGER NOT NULL DEFAULT 20 CHECK (min_age >= 18),
  features TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. VEHICLE IMAGES
CREATE TABLE IF NOT EXISTS public.vehicle_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRICING RULES (Peak / Weekend / Duration modifiers)
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  min_hours INTEGER DEFAULT 4,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. MAINTENANCE BLOCKS
CREATE TABLE IF NOT EXISTS public.maintenance_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_maintenance_window CHECK (end_time > start_time)
);

-- 8. RENTAL POLICIES
CREATE TABLE IF NOT EXISTS public.rental_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g. 'eligibility', 'cancellation', 'fuel', 'damage'
  description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- 9. BOOKINGS TABLE (With strict pricing snapshotting and INR currency)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
  pickup_time TIMESTAMPTZ NOT NULL,
  return_time TIMESTAMPTZ NOT NULL,
  pickup_location TEXT NOT NULL DEFAULT 'Kakinada Hub (Main Road)',
  return_location TEXT NOT NULL DEFAULT 'Kakinada Hub (Main Road)',
  status booking_status NOT NULL DEFAULT 'pending',
  
  -- Price & Policy Snapshots (prevents retroactive alteration)
  base_rate_snapshot NUMERIC(10,2) NOT NULL,
  hourly_rate_snapshot NUMERIC(10,2) NOT NULL,
  deposit_snapshot NUMERIC(10,2) NOT NULL,
  km_limit_snapshot INTEGER NOT NULL,
  excess_km_rate_snapshot NUMERIC(10,2) NOT NULL,
  fuel_policy_snapshot TEXT NOT NULL,
  
  -- Itemized Billing
  rental_charge NUMERIC(10,2) NOT NULL CHECK (rental_charge >= 0),
  addons_charge NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (addons_charge >= 0),
  deposit_charge NUMERIC(10,2) NOT NULL CHECK (deposit_charge >= 0),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  
  -- Booking specifics
  helmet_count INTEGER NOT NULL DEFAULT 1,
  damage_protection BOOLEAN NOT NULL DEFAULT false,
  customer_notes TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  
  -- Inspection readings
  odometer_start INTEGER,
  odometer_end INTEGER,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_booking_window CHECK (return_time > pickup_time)
);

-- 10. BOOKING STATUS AUDIT HISTORY
CREATE TABLE IF NOT EXISTS public.booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. CUSTOMER DOCUMENTS (Private storage integration)
CREATE TABLE IF NOT EXISTS public.customer_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  status document_status NOT NULL DEFAULT 'pending',
  correction_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. DOCUMENT REVIEW HISTORY
CREATE TABLE IF NOT EXISTS public.document_review_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.customer_documents(id) ON DELETE CASCADE,
  status document_status NOT NULL,
  notes TEXT,
  reviewer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. INDEXES FOR HIGH-PERFORMANCE SEARCH & DATE RANGE QUERIES
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON public.vehicles(category, is_published, is_available);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_dates ON public.bookings(vehicle_id, pickup_time, return_time) WHERE status NOT IN ('rejected', 'cancelled');
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle ON public.maintenance_blocks(vehicle_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.customer_documents(user_id, status);

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_review_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins have full profile access" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Vehicles Policies
CREATE POLICY "Public can view published vehicles" ON public.vehicles
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage vehicles" ON public.vehicles
  FOR ALL USING (public.is_admin());

-- Vehicle Images Policies
CREATE POLICY "Public can view vehicle images" ON public.vehicle_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage vehicle images" ON public.vehicle_images
  FOR ALL USING (public.is_admin());

-- Bookings Policies
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can request cancellation for pending bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status IN ('cancelled', 'pending'));

CREATE POLICY "Admins have full booking management" ON public.bookings
  FOR ALL USING (public.is_admin());

-- Customer Documents Policies (CRITICAL: private document security)
CREATE POLICY "Users can view own documents" ON public.customer_documents
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can upload own documents" ON public.customer_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update document verification status" ON public.customer_documents
  FOR ALL USING (public.is_admin());

-- Notifications Policies
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

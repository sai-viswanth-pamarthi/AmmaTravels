-- ====================================================================
-- AMMATRAVELS DATABASE SCHEMA (PostgreSQL / Supabase)
-- Offerings: (1) Car & Bike Rentals, (2) Event Management Packages
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
  CREATE TYPE vehicle_type AS ENUM ('car', 'bike');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_status AS ENUM ('Available', 'Booked', 'Maintenance');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE interest_type AS ENUM ('vehicle', 'event');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE lead_stage AS ENUM (
    'New',
    'Contacted',
    'Visit/Meeting Scheduled',
    'Documents Verified',
    'Confirmed',
    'Completed',
    'Rejected'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'staff', 'user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(25),
  password_hash VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  type vehicle_type NOT NULL, -- car or bike
  sub_type VARCHAR(100) NOT NULL, -- Scooter, Cruiser, Sports, Hatchback, SUV, MPV
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  transmission VARCHAR(50) NOT NULL, -- Manual, Automatic
  fuel VARCHAR(50) NOT NULL, -- Petrol, Diesel, Electric
  seats INTEGER NOT NULL DEFAULT 2,
  price_per_day NUMERIC(10,2) NOT NULL,
  price_per_week NUMERIC(10,2) NOT NULL,
  deposit NUMERIC(10,2) NOT NULL DEFAULT 1000.00,
  km_limit INTEGER NOT NULL DEFAULT 150,
  excess_km_rate NUMERIC(6,2) NOT NULL DEFAULT 5.00,
  status vehicle_status DEFAULT 'Available',
  specs JSONB DEFAULT '{}'::jsonb, -- engine_cc, mileage, boot_space, etc.
  features TEXT[] DEFAULT '{}',
  primary_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  has_360_view BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VEHICLE MEDIA (360-degree frame sequences and photos)
CREATE TABLE IF NOT EXISTS vehicle_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  media_type VARCHAR(50) NOT NULL, -- 'photo', '360_frame', '3d_model'
  url TEXT NOT NULL,
  frame_index INTEGER, -- 1 to 36 for 360 viewer sequence
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EVENT MANAGEMENT PACKAGES
CREATE TABLE IF NOT EXISTS event_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL, -- 'Wedding', 'Birthday', 'Corporate', 'TourGroup'
  tagline TEXT,
  description TEXT NOT NULL,
  price_range VARCHAR(100) NOT NULL, -- e.g. "₹50,000 - ₹2,50,000"
  guest_capacity VARCHAR(100), -- e.g. "50 - 500 Guests"
  included_services TEXT[] DEFAULT '{}',
  gallery TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INTEREST SUBMISSIONS & LEADS (CRM PIPELINE)
CREATE TABLE IF NOT EXISTS interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_id VARCHAR(50) UNIQUE NOT NULL, -- AT-V-1001 or AT-E-2001
  type interest_type NOT NULL, -- vehicle or event
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  package_id UUID REFERENCES event_packages(id) ON DELETE SET NULL,
  
  -- Customer Contact Details
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- Vehicle-specific fields
  pickup_date DATE,
  return_date DATE,
  pickup_location VARCHAR(200),
  id_proof_url TEXT,
  
  -- Event-specific fields
  event_type VARCHAR(100),
  event_date DATE,
  guest_count INTEGER,
  budget_range VARCHAR(100),
  city_venue VARCHAR(200),
  
  message TEXT,
  
  -- CRM Lead Status & Pipeline Stages
  status VARCHAR(50) DEFAULT 'Submitted',
  progress_stage lead_stage DEFAULT 'New',
  internal_notes TEXT,
  follow_up_date DATE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ACTIVITY LOG (CRM Audit Trail)
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  admin_name VARCHAR(150) NOT NULL,
  action VARCHAR(100) NOT NULL, -- 'Stage Changed', 'Note Added', 'Follow-up Set', 'Call Logged'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type, status, is_featured);
CREATE INDEX IF NOT EXISTS idx_interests_ref ON interests(ref_id, phone);
CREATE INDEX IF NOT EXISTS idx_interests_stage ON interests(progress_stage, type);
CREATE INDEX IF NOT EXISTS idx_activity_interest ON activity_log(interest_id, created_at);

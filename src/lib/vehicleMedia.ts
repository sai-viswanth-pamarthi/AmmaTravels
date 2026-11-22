import { Vehicle } from '@/types';

export interface VehicleColorVariant {
  name: string;
  hex: string;
  image: string;
}

export interface VehicleViewImage {
  label: string;
  url: string;
}

export interface VehicleModelMedia {
  modelKeyword: string;
  primaryImage: string;
  colors: VehicleColorVariant[];
  views: VehicleViewImage[];
}

export const VEHICLE_MEDIA_CATALOG: VehicleModelMedia[] = [
  // 1. Maruti Suzuki Swift Dzire (Checked before swift)
  {
    modelKeyword: 'dzire',
    primaryImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Splendid Silver',
        hex: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Arctic White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Front Elegant Chrome Stance', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Side Aerodynamic Profile', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Spacious Rear Passenger Cabin', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Deep 382L Luggage Trunk', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 2. Maruti Suzuki Swift
  {
    modelKeyword: 'swift',
    primaryImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Sizzling Red',
        hex: '#DC2626',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Luster Blue',
        hex: '#1D4ED8',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Pearl Arctic White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Front 3/4 Dynamic Angle', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Side Profile Aerodynamics', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Driver Cockpit & Touchscreen', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Precision Alloy Wheels', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 3. Tata Altroz
  {
    modelKeyword: 'altroz',
    primaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Cosmo Dark Black',
        hex: '#0B0F19',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Signature Dark Edition Front', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: '90-Degree Wide Doors Open', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Harman 8-Speaker Cockpit', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 4. Tata Punch
  {
    modelKeyword: 'punch',
    primaryImage: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Atomic Orange',
        hex: '#EA580C',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Daytona Grey',
        hex: '#4B5563',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Calypso Gold',
        hex: '#CA8A04',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'High Stance Front Grille', url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80' },
      { label: '187mm High Clearance Side Profile', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Adventure Cockpit & Digital Cluster', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 5. Tata Tiago
  {
    modelKeyword: 'tiago',
    primaryImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Flame Red',
        hex: '#DC2626',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Compact City Front Fascia', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Automatic AMT Console & Dashboard', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 6. Tata Nexon
  {
    modelKeyword: 'nexon',
    primaryImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Fearless Gold',
        hex: '#D97706',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Bi-LED Light Bar Front Stance', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80' },
      { label: '208mm Ground Clearance Profile', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Digital Touchscreen Cockpit', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 7. Hyundai i20
  {
    modelKeyword: 'i20',
    primaryImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Fiery Red',
        hex: '#DC2626',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Polar White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Parametric Jewel Grille Front', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Sleek Euro Stance Profile', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Bose Audio & Digital Cabin', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 8. Hyundai Verna
  {
    modelKeyword: 'verna',
    primaryImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Abyss Black',
        hex: '#0B0F19',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Futuristic Horizon LED Front', url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Fastback Coupe Sedan Profile', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Ventilated Seats & Dual Screens', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 9. Thar Roxx (5-Door) - (Checked before standard thar)
  {
    modelKeyword: 'roxx',
    primaryImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Tango Red',
        hex: '#B91C1C',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Stealth Black',
        hex: '#09090B',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: '5-Door Roxx Dominant Grille', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Long Wheelbase 5-Door Stance', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Panoramic Skyroof & Ivory Leather Cabin', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 10. Mahindra Thar 4x4
  {
    modelKeyword: 'thar',
    primaryImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Deep Forest Green',
        hex: '#14532D',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Iconic 7-Slot Front Grille', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Rugged Hard-Top Profile', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Mechanical 4x4 Transfer Lever', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 11. Mahindra XUV 7XO
  {
    modelKeyword: '7xo',
    primaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Napoli Black',
        hex: '#0F172A',
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Executive Flagship LED Front Stance', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Commanding 7-Seater Luxury Profile', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Triple Screen High-Tech Cockpit', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 12. Mahindra XEV 9e (Electric)
  {
    modelKeyword: 'xev',
    primaryImage: 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Everest White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Aerodynamic Electric Coupe Front', url: 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Sloping Coupe Roofline Profile', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Triple 12.3-inch Panoramic Display', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 13. Mahindra Scorpio-N
  {
    modelKeyword: 'scorpio',
    primaryImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Everest White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Commanding Big Daddy Front Chrome Grille', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80' },
      { label: 'High Seating 7-Passenger Stance', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
      { label: '4XPLOR Terrain Modes & Leather Console', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 14. Maruti Suzuki Ertiga
  {
    modelKeyword: 'ertiga',
    primaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Pearl Arctic White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Family 7-Seater Front Chrome', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Extended Family Cabin Profile', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Folding 3-Row Flexible Seating', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 15. Toyota Innova Crysta
  {
    modelKeyword: 'innova',
    primaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Super White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Silver Metallic',
        hex: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Executive Chrome Front Grille', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Long Wheelbase Luxury Profile', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Captain Chairs Luxury Middle Row', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // --- TWO WHEELERS (9 MODELS AS REQUESTED) ---
  {
    modelKeyword: 'activa',
    primaryImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { name: 'Pearl Precious White', hex: '#F8FAFC', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Matte Axis Grey', hex: '#4B5563', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Decent Blue Metallic', hex: '#1D4ED8', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Rebel Red Metallic', hex: '#DC2626', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Pearl Siren Blue', hex: '#0284C7', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Midnight Black', hex: '#0F172A', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
    ],
    views: [
      { label: 'Full Scooter Profile', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Digital Speedometer & Controls', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    modelKeyword: 'fascino',
    primaryImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { name: 'Vivid Red', hex: '#DC2626', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Metallic Black', hex: '#0F172A', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
    ],
    views: [
      { label: 'European Retro Scooter Fascia', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Deep Underseat 21L Storage', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    modelKeyword: 'pulsar',
    primaryImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { name: 'Solar Red', hex: '#DC2626', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Neon Black', hex: '#0F172A', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
    views: [
      { label: 'Sporty Wolf-Eyed Headlamp Profile', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Twin Strip LED Tail Stance', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    modelKeyword: 'bullet',
    primaryImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { name: 'Military Black', hex: '#0F172A', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Military Red', hex: '#DC2626', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Standard Black', hex: '#18181B', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Standard Maroon', hex: '#7F1D1D', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Black Gold', hex: '#CA8A04', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
    ],
    views: [
      { label: 'Handcrafted Heritage Pinstripe Tank', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Iconic Chrome Exhaust & Engine Stance', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    modelKeyword: 'gt 650',
    primaryImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { name: 'Rocker Red', hex: '#DC2626', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
    views: [
      { label: 'Cafe Racer Twin Cylinder Profile', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Clip-On Handlebars & Fuel Tank', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    modelKeyword: 'duke',
    primaryImage: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { name: 'Electronic Orange', hex: '#EA580C', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80' },
    ],
    views: [
      { label: 'Aggressive Predator Streetfighter Stance', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80' },
      { label: 'WP APEX Inverted Front Forks & Trellis', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    modelKeyword: 'r15',
    primaryImage: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { name: 'Metallic Red', hex: '#DC2626', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80' },
    ],
    views: [
      { label: 'Aerodynamic Full Racing Fairing', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Track-Ready Cockpit & Clip-On Bars', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    modelKeyword: 'hunter',
    primaryImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { name: 'Factory Black', hex: '#0F172A', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Rebel Yellow', hex: '#EAB308', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
    ],
    views: [
      { label: 'Agile Urban Roadster Stance', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { label: '17-inch Alloy Wheel & Upswept Exhaust', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    modelKeyword: 'vespa',
    primaryImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { name: 'Tuscan Yellow', hex: '#EAB308', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Monte Carlo Blue', hex: '#1D4ED8', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Azzurro Provenza', hex: '#38BDF8', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Pearl White', hex: '#F8FAFC', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Matt Black', hex: '#0F172A', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { name: 'Passion Red', hex: '#DC2626', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
    ],
    views: [
      { label: 'Italian Monocoque Steel Stance', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Full LED Round Headlamp & Saddle', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
];

/**
 * Finds the rich model media entry for a given vehicle, matching by name or model keywords.
 */
export function findVehicleModelMedia(vehicle: Vehicle): VehicleModelMedia | null {
  const query = `${vehicle.name} ${vehicle.model} ${vehicle.brand} ${vehicle.subType || ''}`.toLowerCase();
  for (const entry of VEHICLE_MEDIA_CATALOG) {
    if (query.includes(entry.modelKeyword)) {
      return entry;
    }
  }
  return null;
}

/**
 * Resolves the primary vehicle image (online model specific).
 * Prioritizes vehicle.primaryImage if specified, otherwise uses matching model media.
 */
export function resolvePrimaryVehicleImage(vehicle: Vehicle): string {
  if (vehicle.primaryImage) return vehicle.primaryImage;
  const match = findVehicleModelMedia(vehicle);
  if (match) return match.primaryImage;
  return vehicle.primaryImage || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80';
}

/**
 * Resolves all color variants for a vehicle, with specific photos for each color.
 * Prioritizes colors defined on the vehicle instance.
 */
export function resolveVehicleColorVariants(vehicle: Vehicle): VehicleColorVariant[] {
  // 1. If vehicle has its own explicit colors defined, ALWAYS prioritize them
  if (vehicle.colors && vehicle.colors.length > 0) {
    const match = findVehicleModelMedia(vehicle);
    return vehicle.colors.map((c) => {
      if (typeof c === 'object' && c !== null && 'name' in c && 'hex' in c) {
        return {
          name: c.name,
          hex: c.hex,
          image: (c as any).image || vehicle.primaryImage,
        };
      }
      const colorName = String(c);
      const lower = colorName.toLowerCase();
      const foundInMedia = match?.colors?.find(
        (mc) => mc.name.toLowerCase().includes(lower) || lower.includes(mc.name.toLowerCase())
      );
      if (foundInMedia) {
        return foundInMedia;
      }
      let hex = '#4B5563';
      if (lower.includes('white')) hex = '#F8FAFC';
      else if (lower.includes('red') || lower.includes('crimson') || lower.includes('tango')) hex = '#DC2626';
      else if (lower.includes('black') || lower.includes('dark') || lower.includes('stealth')) hex = '#0B0F19';
      else if (lower.includes('blue')) hex = '#1D4ED8';
      else if (lower.includes('silver')) hex = '#CBD5E1';
      else if (lower.includes('green') || lower.includes('forest')) hex = '#14532D';
      else if (lower.includes('gold') || lower.includes('yellow')) hex = '#D97706';
      else if (lower.includes('orange')) hex = '#EA580C';
      else if (lower.includes('grey') || lower.includes('gray')) hex = '#6B7280';
      return {
        name: colorName,
        hex,
        image: vehicle.primaryImage,
      };
    });
  }

  // 2. Fallback to model media catalog
  const match = findVehicleModelMedia(vehicle);
  if (match && match.colors && match.colors.length > 0) {
    return match.colors;
  }

  // 3. Generic fallback
  return vehicle.type === 'bike'
    ? [
        { name: 'Stealth Black', hex: '#18181B', image: vehicle.primaryImage },
        { name: 'Fireball Red', hex: '#B91C1C', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
        { name: 'Pure White', hex: '#F8FAFC', image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80' },
      ]
    : [
        { name: 'Pearl Arctic White', hex: '#F8FAFC', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
        { name: 'Crimson Red', hex: '#DC2626', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
        { name: 'Midnight Black', hex: '#0F172A', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      ];
}

/**
 * Resolves the picture for the selected color variant of the vehicle.
 */
export function resolveVehicleImageForColor(vehicle: Vehicle, colorName: string): string {
  const colors = resolveVehicleColorVariants(vehicle);
  const found = colors.find((c) => c.name.toLowerCase() === colorName.toLowerCase());
  if (found && found.image) {
    return found.image;
  }

  // Check partial name match
  const partial = colors.find(
    (c) =>
      colorName.toLowerCase().includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(colorName.toLowerCase())
  );
  if (partial && partial.image) {
    return partial.image;
  }

  return resolvePrimaryVehicleImage(vehicle);
}

/**
 * Compiles a rich photo gallery for the vehicle consisting of:
 * 1. Different vehicle views (Front, Side, Rear, Cockpit, Engine)
 * 2. Photos of the vehicle in each color variant
 */
export function resolveCompleteVehicleGallery(vehicle: Vehicle): Array<{ label: string; url: string }> {
  const match = findVehicleModelMedia(vehicle);
  const result: Array<{ label: string; url: string }> = [];

  // Add primary view
  const primaryImg = resolvePrimaryVehicleImage(vehicle);
  result.push({ label: `${vehicle.name} — Main View`, url: primaryImg });

  // Add different model views
  if (match && match.views) {
    match.views.forEach((v) => {
      if (!result.some((r) => r.url === v.url)) {
        result.push(v);
      }
    });
  }

  // Add vehicle in different color variants
  const colors = resolveVehicleColorVariants(vehicle);
  colors.forEach((c) => {
    if (c.image && !result.some((r) => r.url === c.image)) {
      result.push({ label: `${vehicle.name} in ${c.name}`, url: c.image });
    }
  });

  // Include any extra database gallery photos if present
  if (vehicle.gallery && vehicle.gallery.length > 0) {
    vehicle.gallery.forEach((url, i) => {
      if (url && !result.some((r) => r.url === url)) {
        result.push({ label: `${vehicle.name} — Gallery ${i + 1}`, url });
      }
    });
  }

  return result;
}

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
  // 1. Maruti Suzuki Swift
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
        name: 'Pearl Arctic White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Luster Blue',
        hex: '#1D4ED8',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Magma Grey',
        hex: '#4B5563',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Splendid Silver',
        hex: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Midnight Black',
        hex: '#0F172A',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Front 3/4 Dynamic Angle', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Side Profile Aerodynamics', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Rear Angle & LED Tail', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Driver Cockpit & Touchscreen', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Alloy Wheels & Chassis', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 2. Toyota Fortuner 4x4
  {
    modelKeyword: 'fortuner',
    primaryImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Super White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Attitude Black',
        hex: '#09090B',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Avant-Garde Bronze',
        hex: '#78350F',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Silver Metallic',
        hex: '#94A3B8',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Phantom Brown',
        hex: '#451A03',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'High Clearance 4x4 Front', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Off-Road Trail Profile', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Rear Tailgate & Stance', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
      { label: '7-Seater Leather Cabin', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Dashboard & Terrain Controls', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 3. Toyota Innova Crysta
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
        name: 'Attitude Black',
        hex: '#0F172A',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Silver Metallic',
        hex: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Garnet Red',
        hex: '#991B1B',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Avant-Garde Bronze',
        hex: '#78350F',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Executive Chrome Front', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Long Wheelbase Side Profile', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Rear Angle & Tailgate', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Captain Chairs Luxury Middle Row', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Spacious Luggage Boot Space', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 4. Mahindra Thar 4x4
  {
    modelKeyword: 'thar',
    primaryImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Napoli Black',
        hex: '#09090B',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Red Rage',
        hex: '#DC2626',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Everest White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Aquamarine Blue',
        hex: '#0284C7',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Deep Grey',
        hex: '#4B5563',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Iconic 7-Slot Front Grille', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Rugged Hard-Top Profile', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Rear Mounted Spare Tyre', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Washable Adventure Interior', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Mechanical 4x4 Transfer Lever', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 5. Hyundai Creta
  {
    modelKeyword: 'creta',
    primaryImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Atlas White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Abyss Black',
        hex: '#0F172A',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Ranger Khaki',
        hex: '#4D533C',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Fiery Red',
        hex: '#DC2626',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Titan Grey',
        hex: '#4B5563',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Robust Emerald',
        hex: '#064E3B',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Parametric LED Front Face', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Compact Urban SUV Profile', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Horizon Connected Tail-lamps', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Panoramic Voice Sunroof Interior', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Dual Digital Display Cockpit', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 6. Mahindra XUV700
  {
    modelKeyword: 'xuv700',
    primaryImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Midnight Black',
        hex: '#09090B',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Everest White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Electric Blue',
        hex: '#1E40AF',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Red Rage',
        hex: '#DC2626',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Dazzling Silver',
        hex: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Twin-Peak Grille & C-LED Headlamps', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Flush Door Handles Side Profile', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Arrow-tip Rear LED Cluster', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Dual 10.25-inch Superscreen Cockpit', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Panoramic Skyroof Luxury Seating', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 7. BMW M3 Touring
  {
    modelKeyword: 'bmw',
    primaryImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Isle of Man Green',
        hex: '#0B5345',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Alpine White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Black Sapphire',
        hex: '#0F172A',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Toronto Red',
        hex: '#DC2626',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Portimao Blue',
        hex: '#1D4ED8',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Aggressive M Double-Kidney Front', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Sports Estate Wagon Stance', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Quad Exhaust Sports Diffuser', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80' },
      { label: 'M Carbon Bucket Seats & Wheel', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Forged M Alloy Brakes', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 8. Audi A6 C8 Limousine
  {
    modelKeyword: 'audi',
    primaryImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
    colors: [
      {
        name: 'Ibis White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Mythos Black',
        hex: '#0F172A',
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Navarra Blue',
        hex: '#1E3A8A',
        image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Daytona Grey',
        hex: '#4B5563',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Tango Red',
        hex: '#B91C1C',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    views: [
      { label: 'Singleframe Grille & HD Matrix LED', url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Executive Limousine Profile', url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Dynamic OLED Rear Tail-lamps', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Audi Virtual Cockpit Plus', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Bang & Olufsen 3D Sound Interior', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80' },
    ],
  },

  // 9. Honda Activa 6G
  {
    modelKeyword: 'activa',
    primaryImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    colors: [
      {
        name: 'Rebel Red Metallic',
        hex: '#B91C1C',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Pearl Precious White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Decent Blue Metallic',
        hex: '#1D4ED8',
        image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Matte Axis Grey',
        hex: '#4B5563',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Midnight Black',
        hex: '#18181B',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    views: [
      { label: 'Front Apron with Chrome Wings', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Step-Through City Commuter Stance', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Rear External Fuel Lid & Tail', url: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Spacious Underseat Helmet Storage', url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Easy Telescopic Front Suspension', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
  },

  // 10. Royal Enfield Classic 350
  {
    modelKeyword: 'classic',
    primaryImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
    colors: [
      {
        name: 'Stealth Black',
        hex: '#18181B',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Halcyon Green',
        hex: '#14532D',
        image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Redditch Red',
        hex: '#B91C1C',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Chrome Bronze',
        hex: '#78350F',
        image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Marsh Grey',
        hex: '#4B5563',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    views: [
      { label: 'Iconic Teardrop Tank & Headlamp', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Vintage Cruiser Side Profile', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Long Chrome Exhaust Thumper', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Retro Digilog Speedometer Cockpit', url: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sprung Touring Saddle Seat', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
    ],
  },

  // 11. Royal Enfield Himalayan 450
  {
    modelKeyword: 'himalayan',
    primaryImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    colors: [
      {
        name: 'Hanle Black',
        hex: '#18181B',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Kamet White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Slate Himalayan Salt',
        hex: '#9A3412',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Kaza Brown',
        hex: '#78350F',
        image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    views: [
      { label: 'Adventure Windscreen & High Stance', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Long Travel 21-inch Wheel Profile', url: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sherpa 450 Liquid-Cooled Engine', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Full Round TFT Google Maps Display', url: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Rear Pannier Rack & High Exhaust', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
  },

  // 12. Royal Enfield Hunter 350
  {
    modelKeyword: 'hunter',
    primaryImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
    colors: [
      {
        name: 'Dapper Ash',
        hex: '#71717A',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Rebel Blue',
        hex: '#2563EB',
        image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Rebel Red',
        hex: '#DC2626',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Dapper Grey',
        hex: '#3F3F46',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    views: [
      { label: 'Urban Roadster Front Stance', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Compact City Flick Profile', url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Short Throaty Exhaust Canister', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Tuck-and-Roll Single Piece Saddle', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Alloy Wheels & Tubeless Tyres', url: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80' },
    ],
  },

  // 13. Yamaha MT-15 V2
  {
    modelKeyword: 'mt-15',
    primaryImage: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
    colors: [
      {
        name: 'Cyan Storm',
        hex: '#06B6D4',
        image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Metallic Black',
        hex: '#18181B',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Racing Blue',
        hex: '#1D4ED8',
        image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Ice Fluo Vermillion',
        hex: '#EA580C',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    views: [
      { label: 'Predatory Twin LED Eyeline Front', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Hyper Naked Streetfighter Profile', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Golden Upside-Down Front Forks', url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Liquid Cooled VVA Engine & DeltaBox', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Negative LCD Bluetooth Instrument Cluster', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
  },

  // 14. Bajaj Pulsar NS200
  {
    modelKeyword: 'pulsar',
    primaryImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
    colors: [
      {
        name: 'Burnt Red',
        hex: '#B91C1C',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Pewter Grey',
        hex: '#4B5563',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Metallic Pearl White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Glossy Ebony Black',
        hex: '#18181B',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    views: [
      { label: 'Streetfighter Wolf-Eyed Visor Front', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Aggressive Perimeter Frame Stance', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Underbelly Silencer Exhaust', url: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Triple Spark 4-Valve Engine', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Split Seat & Sporty Clip-on Handlebars', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80' },
    ],
  },

  // 15. Ather 450X Gen 3
  {
    modelKeyword: 'ather',
    primaryImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
    colors: [
      {
        name: 'Cosmic Black',
        hex: '#18181B',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Lunar Grey',
        hex: '#4B5563',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Salt Green',
        hex: '#15803D',
        image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Space Grey White',
        hex: '#E2E8F0',
        image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    views: [
      { label: 'Futuristic Sharp LED Headlamp Apron', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Aero Aluminum Chassis Profile', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Interactive 7-inch Touchscreen Cockpit', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Belt-Drive Electric Motor & Monoshock', url: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Home Fast Charger & Boot Storage', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
    ],
  },

  // 16. Jawa 42 Bobber
  {
    modelKeyword: 'jawa',
    primaryImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    colors: [
      {
        name: 'Moonstone White',
        hex: '#F8FAFC',
        image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Mystic Copper',
        hex: '#9A3412',
        image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Jasper Red',
        hex: '#B91C1C',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      },
      {
        name: 'Black Shield',
        hex: '#18181B',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    views: [
      { label: 'Single-Seat Bobber Floating Saddle', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Low-Slung Custom Cruiser Stance', url: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Slash-Cut Twin Chrome Silencers', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Negative LCD Speedometer & Bar-End Mirrors', url: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Spoke Wheels & Wide Rear Tyre', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
];

/**
 * Finds the rich model media entry for a given vehicle, matching by name or model keywords.
 */
export function findVehicleModelMedia(vehicle: Vehicle): VehicleModelMedia | null {
  const query = `${vehicle.name} ${vehicle.model} ${vehicle.brand}`.toLowerCase();
  for (const entry of VEHICLE_MEDIA_CATALOG) {
    if (query.includes(entry.modelKeyword)) {
      return entry;
    }
  }
  return null;
}

/**
 * Resolves the primary vehicle image (online model specific).
 */
export function resolvePrimaryVehicleImage(vehicle: Vehicle): string {
  const match = findVehicleModelMedia(vehicle);
  if (match) return match.primaryImage;
  return vehicle.primaryImage;
}

/**
 * Resolves all color variants for a vehicle, with specific photos for each color.
 */
export function resolveVehicleColorVariants(vehicle: Vehicle): VehicleColorVariant[] {
  const match = findVehicleModelMedia(vehicle);
  if (match && match.colors && match.colors.length > 0) {
    return match.colors;
  }

  // Fallback if vehicle has custom colors in database
  if (vehicle.colors && vehicle.colors.length > 0) {
    return vehicle.colors.map((c) => {
      if (typeof c === 'string') {
        const lower = c.toLowerCase();
        let hex = '#4B5563';
        if (lower.includes('white')) hex = '#F8FAFC';
        else if (lower.includes('red') || lower.includes('crimson')) hex = '#DC2626';
        else if (lower.includes('black')) hex = '#0F172A';
        else if (lower.includes('blue')) hex = '#1D4ED8';
        else if (lower.includes('silver')) hex = '#CBD5E1';
        else if (lower.includes('green')) hex = '#15803D';
        else if (lower.includes('bronze')) hex = '#78350F';
        return { name: c, hex, image: vehicle.primaryImage };
      }
      return {
        name: c.name,
        hex: c.hex,
        image: vehicle.primaryImage,
      };
    });
  }

  // Generic fallback
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
  const partial = colors.find((c) =>
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

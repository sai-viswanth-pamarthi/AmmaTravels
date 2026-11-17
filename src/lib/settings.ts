import { useState, useEffect } from 'react';

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  secondaryEmail: string;
  primaryAddress: string;
  landmark: string;
  operatingHours: string;
  locations: string[];
}

export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'Amma Travels',
  tagline: 'Amma Enterprises · Self Drive Cars & Rental Bikes',
  phone: '+91 88857 57966',
  whatsapp: '918885757966',
  email: 'contact@ammatravelskkd.com',
  secondaryEmail: 'rentals@ammatravels.in',
  primaryAddress: 'Bhanugudi Junction, Kakinada, Andhra Pradesh 533003',
  landmark: 'Near Kakinada Town Railway Station & Main Road',
  operatingHours: '24/7 Operations & Roadside Assistance',
  locations: [
    'Kakinada Central Hub (Main Road)',
    'Bhanugudi Junction Hub',
    'Kakinada Town Railway Station',
    'Rajahmundry Airport (RJA) Express Point',
    'Doorstep Delivery (Kakinada City Limits)',
    'Uppada Beach Scenic Road Hub',
  ],
};

const STORAGE_KEY = 'at_business_settings_v2';
const EVENT_NAME = 'at_business_settings_updated';

export function getBusinessSettings(): BusinessSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      locations: Array.isArray(parsed.locations) && parsed.locations.length > 0
        ? parsed.locations
        : DEFAULT_SETTINGS.locations,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveBusinessSettings(updated: Partial<BusinessSettings>): BusinessSettings {
  const current = getBusinessSettings();
  const next: BusinessSettings = {
    ...current,
    ...updated,
    locations: updated.locations && updated.locations.length > 0 ? updated.locations : current.locations,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
    }
  } catch (err) {
    console.error('Failed to save business settings', err);
  }
  return next;
}

export function useBusinessSettings(): [BusinessSettings, (updated: Partial<BusinessSettings>) => void] {
  const [settings, setSettings] = useState<BusinessSettings>(() => getBusinessSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getBusinessSettings());
    };
    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const update = (updated: Partial<BusinessSettings>) => {
    const next = saveBusinessSettings(updated);
    setSettings(next);
  };

  return [settings, update];
}

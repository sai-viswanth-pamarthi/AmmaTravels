import { getBusinessSettings } from './settings';

export const DEFAULT_WHATSAPP_NUMBER =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_WHATSAPP_NUMBER) ||
  (() => {
    try {
      return getBusinessSettings().whatsapp.replace(/[^0-9]/g, '');
    } catch {
      return '918885757966';
    }
  })() ||
  '918885757966'; // Replace with your 10-12 digit country-coded number

export const BUSINESS_NAME = 'Amma Travels';

export function getWhatsAppUrl(text: string, phone: string = DEFAULT_WHATSAPP_NUMBER): string {
  const effectivePhone = phone || (() => {
    try {
      return getBusinessSettings().whatsapp.replace(/[^0-9]/g, '') || DEFAULT_WHATSAPP_NUMBER;
    } catch {
      return DEFAULT_WHATSAPP_NUMBER;
    }
  })();
  const cleanPhone = effectivePhone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function getGeneralSupportWhatsAppUrl(phone: string = DEFAULT_WHATSAPP_NUMBER): string {
  return getWhatsAppUrl(`Hello ${BUSINESS_NAME}, I would like to enquire about your rental and travel services.`, phone);
}

export function getVehicleEnquiryWhatsAppUrl(
  vehicleName: string,
  pickupDate?: string,
  returnDate?: string,
  phone: string = DEFAULT_WHATSAPP_NUMBER
): string {
  let msg = `Hello ${BUSINESS_NAME}, I am interested in renting the ${vehicleName} in Kakinada.`;
  if (pickupDate && returnDate) {
    msg += ` Rental dates: ${pickupDate} to ${returnDate}.`;
  }
  return getWhatsAppUrl(msg, phone);
}

export function getVehicleWhatsAppUrl(
  vehicleName: string,
  refId?: string,
  pickupDate?: string,
  returnDate?: string
): string {
  let msg = `Hello ${BUSINESS_NAME}, I am interested in renting the ${vehicleName} in Kakinada.`;
  if (refId) {
    msg += ` My enquiry reference ID is ${refId}.`;
  }
  if (pickupDate && returnDate) {
    msg += ` Rental dates: ${pickupDate} to ${returnDate}.`;
  }
  return getWhatsAppUrl(msg);
}

export function getEventWhatsAppUrl(packageName: string, refId?: string): string {
  let msg = `Hello ${BUSINESS_NAME}, I would like to enquire about your "${packageName}" package in Kakinada.`;
  if (refId) {
    msg += ` My enquiry reference ID is ${refId}.`;
  }
  return getWhatsAppUrl(msg);
}

export function getBookingSupportWhatsAppUrl(
  bookingRef: string,
  vehicleName?: string,
  phone: string = DEFAULT_WHATSAPP_NUMBER
): string {
  let msg = `Hello ${BUSINESS_NAME}, I need support regarding my booking ${bookingRef}`;
  if (vehicleName) {
    msg += ` for ${vehicleName}.`;
  }
  return getWhatsAppUrl(msg, phone);
}

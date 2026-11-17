import { getBusinessSettings } from './settings';

export function getEffectiveWhatsAppNumber(): string {
  try {
    return getBusinessSettings().whatsapp.replace(/[^0-9]/g, '');
  } catch {
    return '918885757966';
  }
}

export function getWhatsAppUrl(text: string, phone?: string): string {
  const targetPhone = (phone ? phone.replace(/[^0-9]/g, '') : getEffectiveWhatsAppNumber());
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

export function getGeneralSupportWhatsAppUrl(phone?: string): string {
  return getWhatsAppUrl('Hello Amma Travels, I would like to enquire about your services in Kakinada.', phone);
}

export function getVehicleEnquiryWhatsAppUrl(
  vehicleName: string,
  pickupDate?: string,
  returnDate?: string,
  phone?: string
): string {
  let msg = `Hello Amma Travels, I am interested in renting the ${vehicleName} in Kakinada.`;
  if (pickupDate && returnDate) {
    msg += ` Rental dates: ${pickupDate} to ${returnDate}.`;
  }
  return getWhatsAppUrl(msg, phone);
}

export function getBookingSupportWhatsAppUrl(
  bookingRef: string,
  vehicleName?: string,
  phone?: string
): string {
  let msg = `Hello Amma Travels, I need assistance regarding my enquiry reference ${bookingRef}`;
  if (vehicleName) {
    msg += ` for ${vehicleName}.`;
  }
  return getWhatsAppUrl(msg, phone);
}

export function getVehicleWhatsAppUrl(vehicleName: string, refId?: string): string {
  let msg = `Hello Amma Travels, I am interested in renting the ${vehicleName} in Kakinada.`;
  if (refId) {
    msg += ` My enquiry reference ID is ${refId}.`;
  }
  return getWhatsAppUrl(msg);
}

export function getEventWhatsAppUrl(packageName: string, refId?: string): string {
  let msg = `Hello Amma Travels, I would like to enquire about your "${packageName}" package in Kakinada.`;
  if (refId) {
    msg += ` My enquiry reference ID is ${refId}.`;
  }
  return getWhatsAppUrl(msg);
}

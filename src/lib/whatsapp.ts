export const DEFAULT_WHATSAPP_NUMBER = '918885757966';
export const BUSINESS_PHONE = DEFAULT_WHATSAPP_NUMBER;

export function getWhatsAppUrl(text: string, phone: string = DEFAULT_WHATSAPP_NUMBER): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function getGeneralSupportWhatsAppUrl(phone: string = DEFAULT_WHATSAPP_NUMBER): string {
  return getWhatsAppUrl('Hello Amma Travels, I would like to enquire about your services in Kakinada.', phone);
}

export function getVehicleEnquiryWhatsAppUrl(
  vehicleName: string,
  pickupDate?: string,
  returnDate?: string,
  phone: string = DEFAULT_WHATSAPP_NUMBER
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
  phone: string = DEFAULT_WHATSAPP_NUMBER
): string {
  let msg = `Hello Amma Travels, I need assistance regarding my booking ${bookingRef}`;
  if (vehicleName) {
    msg += ` for ${vehicleName}.`;
  }
  return getWhatsAppUrl(msg, phone);
}

export function getVehicleWhatsAppUrl(vehicleName: string, refId?: string): string {
  let msg = `Hello AmmaTravels, I am interested in renting the ${vehicleName} in Kakinada.`;
  if (refId) {
    msg += ` My enquiry reference ID is ${refId}.`;
  }
  return getWhatsAppUrl(msg);
}

export function getEventWhatsAppUrl(packageName: string, refId?: string): string {
  let msg = `Hello AmmaTravels, I would like to enquire about your "${packageName}" event package in Kakinada.`;
  if (refId) {
    msg += ` My enquiry reference ID is ${refId}.`;
  }
  return getWhatsAppUrl(msg);
}

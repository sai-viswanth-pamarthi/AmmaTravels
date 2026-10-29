import { describe, it, expect } from 'vitest';
import {
  getWhatsAppUrl,
  getVehicleEnquiryWhatsAppUrl,
  getBookingSupportWhatsAppUrl,
  DEFAULT_WHATSAPP_NUMBER,
} from '../src/lib/whatsapp';

describe('Input Validation & Safe Communication Utilities', () => {
  it('formats clean WhatsApp Click-to-Chat URL without symbols in phone', () => {
    const rawNumber = '+91 98765-43210';
    const message = 'Hello Amma Travels, test inquiry.';
    const url = getWhatsAppUrl(message, rawNumber);

    expect(url).toContain('https://wa.me/919876543210');
    expect(url).toContain(encodeURIComponent(message));
  });

  it('generates contextual vehicle enquiry message without personal data leaks', () => {
    const url = getVehicleEnquiryWhatsAppUrl('Royal Enfield Classic 350', '2026-10-20', '2026-10-22');

    expect(url).toContain('Classic%20350');
    expect(url).toContain('Kakinada');
    // Ensure sensitive tokens are never attached
    expect(url).not.toContain('password');
    expect(url).not.toContain('token');
    expect(url).not.toContain('secret');
  });

  it('generates booking support message referencing booking ref', () => {
    const url = getBookingSupportWhatsAppUrl('AT-2026-1001', 'Honda Activa 6G');

    expect(url).toContain('AT-2026-1001');
    expect(url).toContain('Honda%20Activa%206G');
  });
});

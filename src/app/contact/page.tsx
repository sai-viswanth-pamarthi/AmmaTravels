'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  MessageCircle,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { getGeneralSupportWhatsAppUrl } from '@/lib/whatsapp';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const whatsappUrl = getGeneralSupportWhatsAppUrl();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
          Connect with Amma Travels
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Contact & Hub Location
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Have queries about vehicle availability, long-term rentals, or need assistance? Reach out to us directly or visit our Kakinada hub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Office & Depot Info
          </h2>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-center text-gold-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block text-sm">Main Depot Location</strong>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Bhanugudi Junction & Main Road Hub, Kakinada, East Godavari District, Andhra Pradesh, 533003
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-center text-gold-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block text-sm">Operating Hours</strong>
                <p className="text-slate-400 mt-0.5">
                  Monday to Sunday: 06:00 AM – 10:30 PM (24/7 Roadside Assistance)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-center text-gold-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block text-sm">Phone Helpline</strong>
                <p className="text-slate-400 mt-0.5">
                  +91 98765 43210 (Demo Configuration Placeholder)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-center text-gold-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block text-sm">Email</strong>
                <p className="text-slate-400 mt-0.5">contact@ammatravelskkd.com</p>
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="pt-4 border-t border-navy-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Follow & Chat
            </h4>
            <div className="flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://www.instagram.com/ammatravels_kkd/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-navy-950 hover:bg-navy-850 border border-navy-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Send an Enquiry
          </h2>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-navy-950 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Thank You for Contacting Us</h3>
              <p className="text-xs text-slate-400">
                Our Kakinada team has received your enquiry and will respond promptly via call or WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-800 text-gold-400"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Ramesh Reddy"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Enquiry Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the vehicle you need, dates, or outstation plans..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-gold-500 text-navy-950 hover:bg-gold-400 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

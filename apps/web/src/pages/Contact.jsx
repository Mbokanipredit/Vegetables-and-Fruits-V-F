import React, { useEffect, useRef, useState } from 'react';
import { COMPANY_DETAILS } from '../data/productsData';
import { contactApi } from '../services/apiClient';
import { useAtom } from 'jotai';
import { notificationAtom } from '../store/atoms';
import { 
  Phone, Mail, MapPin, ShieldCheck, Download, Send, 
  MessageSquare, Clock, Building, CheckCircle 
} from 'lucide-react';

export default function Contact() {
  const [, setNotification] = useAtom(notificationAtom);
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Initialize Leaflet Map for Nyarugenge, Kigali, Rwanda
  useEffect(() => {
    if (window.L && mapRef.current && !leafletInstance.current) {
      try {
        const kigaliLat = -1.9441;
        const kigaliLng = 30.0619;

        const map = window.L.map(mapRef.current).setView([kigaliLat, kigaliLng], 14);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add custom marker for V&F headquarters
        const marker = window.L.marker([kigaliLat, kigaliLng]).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #1b5e20; font-size: 14px;">Vegetables and Fruits_V&F</strong><br/>
            <span style="font-size: 12px; color: #4b5563;">Rwanda, Kigali, Nyarugenge</span><br/>
            <span style="font-size: 11px; color: #059669; font-weight: bold;">TIN: ${COMPANY_DETAILS.tin}</span>
          </div>
        `).openPopup();

        leafletInstance.current = map;
      } catch (err) {
        console.warn('Leaflet initialization fallback:', err);
      }
    }

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactApi.sendMessage(formData);
      setSentSuccess(true);
      setNotification('Collaboration inquiry sent successfully!');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err) {
      console.error(err);
      alert('Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
        <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider mb-1">
          <MapPin className="w-4 h-4" />
          <span>Location & Direct Contacts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
          Contact V&F Administration & Location Map
        </h1>
        <p className="text-brand-100 text-sm mt-1 max-w-2xl">
          Get in touch with our Kigali headquarters for B2B supply inquiries, custom contract pricing, or visit our local distribution hub in Nyarugenge.
        </p>
      </div>

      {/* Main Grid: Contact Cards + Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contact Cards & Info */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Company Contact Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <img
                src={COMPANY_DETAILS.logoPath}
                alt="V&F Logo"
                className="w-12 h-12 object-contain rounded-full bg-brand-50 p-1 border border-brand-200"
              />
              <div>
                <h3 className="font-extrabold text-xl text-brand-900 font-heading">
                  {COMPANY_DETAILS.name}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">{COMPANY_DETAILS.tagline}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              
              {/* Phone / WhatsApp 1 */}
              <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-brand-100 text-brand-800 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone / WhatsApp</p>
                  <a
                    href={`tel:${COMPANY_DETAILS.phones[0].replace(/\s+/g, '')}`}
                    className="font-bold text-gray-900 hover:text-brand-700 block text-base"
                  >
                    {COMPANY_DETAILS.phones[0]}
                  </a>
                  <a
                    href={`tel:${COMPANY_DETAILS.phones[1].replace(/\s+/g, '')}`}
                    className="font-bold text-gray-900 hover:text-brand-700 block text-base"
                  >
                    {COMPANY_DETAILS.phones[1]}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</p>
                  <a
                    href={`mailto:${COMPANY_DETAILS.email}`}
                    className="font-bold text-gray-900 hover:text-brand-700 text-sm break-all"
                  >
                    {COMPANY_DETAILS.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Physical Address</p>
                  <p className="font-bold text-gray-900 text-sm">{COMPANY_DETAILS.address}</p>
                </div>
              </div>

              {/* Tax ID */}
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-brand-50 border border-brand-200">
                <div className="w-10 h-10 bg-brand-700 text-brand-gold rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-900 uppercase tracking-wider">Tax ID / TIN Number</p>
                  <p className="font-extrabold text-brand-900 text-base font-mono">{COMPANY_DETAILS.tin}</p>
                  <p className="text-[11px] text-brand-700">Official RRA Registered Business</p>
                </div>
              </div>

            </div>

            {/* Downloads */}
            <div className="pt-2">
              <a
                href={COMPANY_DETAILS.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
              >
                <Download className="w-4 h-4 text-brand-gold" />
                <span>Download Official Quotation PDF (2026)</span>
              </a>
            </div>

          </div>

          {/* Quick WhatsApp Box */}
          <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg font-heading">
              <MessageSquare className="w-5 h-5" />
              <span>Instant WhatsApp Chat</span>
            </div>
            <p className="text-xs text-emerald-100">
              Need immediate produce quote or delivery confirmation? Message our team directly on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${COMPANY_DETAILS.whatsapp}?text=Hello%20V%26F%20Team%2C%20I%20would%20like%20to%20inquire%20about%20vegetable%20and%20fruit%20supply%20for%20our%20business.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-emerald-900 font-extrabold px-5 py-2.5 rounded-xl text-xs hover:bg-emerald-50 transition-all shadow"
            >
              Open WhatsApp (+250 788 211 968)
            </a>
          </div>

        </div>

        {/* Right Column: Interactive Location Map & Collaboration Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Map Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-extrabold text-lg text-gray-900 font-heading flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-700" />
                V&F Kigali Distribution Location Map
              </h3>
              <span className="text-xs font-semibold text-brand-700 bg-brand-100 px-2.5 py-1 rounded-full">
                Nyarugenge, Kigali
              </span>
            </div>

            {/* Map Container */}
            <div className="h-96 w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 bg-gray-100 relative">
              <div ref={mapRef} className="w-full h-full"></div>
            </div>

            <p className="text-xs text-gray-500 italic px-2">
              📍 Interactive Map centered on Nyarugenge, Kigali, Rwanda. Serving all major sectors across Kigali city.
            </p>
          </div>

          {/* Collaboration Message Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-extrabold text-xl text-gray-900 font-heading">
                Start a Supply Collaboration
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Send us a message regarding long-term supply contracts, custom sourcing, or partnership requests.
              </p>
            </div>

            {sentSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg">Inquiry Sent Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you for contacting V&F. Our representative will respond to your inquiry within 24 hours.
                </p>
                <button
                  onClick={() => setSentSuccess(false)}
                  className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jean-Luc"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.rw"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+250 788 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="Hotel / Restaurant / Residence"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Collaboration Details / Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your produce volume requirements, desired delivery schedules, or contract questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-700 hover:bg-brand-800 text-white font-extrabold py-3 px-6 rounded-xl shadow flex items-center justify-center gap-2 text-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message to V&F Admin'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

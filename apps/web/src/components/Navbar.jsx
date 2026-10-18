import React from 'react';
import { useAtom } from 'jotai';
import { activeTabAtom, cartItemCountAtom, customerSessionAtom } from '../store/atoms';
import { ShoppingBag, Phone, MapPin, Download, ShieldCheck, Menu, X, User, LogIn } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/productsData';
import { useLang } from '../i18n/useLang';

export default function Navbar() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [cartCount] = useAtom(cartItemCountAtom);
  const [session] = useAtom(customerSessionAtom);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { t, lang, toggle } = useLang();
  const firstName = session?.user?.name?.split(' ')[0];

  const navItems = [
    { id: 'home',    label: t('nav.home') },
    { id: 'catalog', label: t('nav.catalog') },
    { id: 'order',   label: t('nav.cart'), badge: cartCount },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-sm">
      {/* Top Banner Bar */}
      <div className="bg-brand-900 text-brand-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              {t('nav.verified')} | TIN: {COMPANY_DETAILS.tin}
            </span>
            <span className="hidden sm:inline text-brand-300">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              {COMPANY_DETAILS.address}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY_DETAILS.phones[0].replace(/\s+/g, '')}`}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-brand-gold" />
              {COMPANY_DETAILS.phones[0]}
            </a>
            <a
              href={COMPANY_DETAILS.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-700 hover:bg-brand-600 text-white px-2.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              {t('nav.officialPdf')}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Title */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={COMPANY_DETAILS.logoPath}
              alt="Vegetables and Fruits_V&F Logo"
              className="h-14 w-14 object-contain rounded-full shadow-md group-hover:scale-105 transition-transform duration-200"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-brand-900 font-heading">
                  V<span className="text-brand-600">&</span>F
                </span>
                <span className="bg-brand-100 text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-brand-200">
                  {t('nav.b2b')}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-600 tracking-wide">
                {t('nav.tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all relative flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-700 text-white shadow-md shadow-brand-700/20'
                      : 'text-gray-700 hover:bg-brand-50 hover:text-brand-800'
                  }`}
                >
                  {item.label}
                  {item.badge > 0 && (
                    <span className="bg-brand-gold text-brand-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Language Toggle + Account + Cart */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle Button */}
            <button
              id="lang-toggle"
              onClick={toggle}
              title={lang === 'en' ? 'Switch to Kinyarwanda' : 'Hindura Icyongereza'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-black text-gray-700 hover:bg-brand-50 hover:border-brand-300 transition-all select-none"
            >
              <span className={`transition-all ${lang === 'en' ? 'text-brand-700' : 'text-gray-400'}`}>EN</span>
              <span className="text-gray-300">|</span>
              <span className={`transition-all ${lang === 'rw' ? 'text-brand-700' : 'text-gray-400'}`}>RW</span>
            </button>

            <button
              id="nav-account"
              onClick={() => setActiveTab('account')}
              className={`font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 border transition-all ${
                activeTab === 'account'
                  ? 'bg-brand-50 border-brand-300 text-brand-800'
                  : 'border-gray-200 text-gray-700 hover:bg-brand-50 hover:border-brand-200'
              }`}
            >
              {session ? <User className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{session ? firstName : t('nav.login')}</span>
            </button>
            <button
              id="nav-cart"
              onClick={() => setActiveTab('order')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-brand-600/30 flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('nav.cart')}</span>
              {cartCount > 0 && (
                <span className="bg-white text-brand-800 text-xs font-black px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile language toggle */}
            <button
              id="lang-toggle-mobile"
              onClick={toggle}
              className="px-2 py-1.5 rounded-lg border border-gray-200 text-[11px] font-black text-gray-600 hover:bg-brand-50"
            >
              {lang === 'en' ? 'RW' : 'EN'}
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className="p-2 bg-brand-100 text-brand-800 rounded-xl relative"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-900 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-xl focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-brand-gold text-brand-900 font-bold text-xs px-2 py-0.5 rounded-full">
                    {item.badge} {lang === 'en' ? 'items' : 'ibicuruzwa'}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => {
              setActiveTab('account');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'account' ? 'bg-brand-700 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {session ? <User className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{session ? `${lang === 'en' ? 'My Account' : 'Konti Yanjye'} (${firstName})` : t('account.loginTab') + ' / ' + t('account.registerTab')}</span>
          </button>
        </div>
      )}
    </header>
  );
}

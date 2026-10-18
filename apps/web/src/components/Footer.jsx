import React from 'react';
import { useAtom } from 'jotai';
import { activeTabAtom } from '../store/atoms';
import { Phone, Mail, MapPin, Download, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/productsData';
import { useLang } from '../i18n/useLang';

export default function Footer() {
  const [, setActiveTab] = useAtom(activeTabAtom);
  const { t } = useLang();

  return (
    <footer className="bg-brand-900 text-white pt-16 pb-8 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={COMPANY_DETAILS.logoPath}
                alt="V&F Logo"
                className="h-14 w-14 object-contain rounded-full bg-white p-1"
              />
              <div>
                <h3 className="font-extrabold text-2xl tracking-tight text-white font-heading">
                  V<span className="text-brand-gold">&</span>F
                </h3>
                <p className="text-xs text-brand-200 font-medium">{t('nav.tagline')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-gold bg-brand-800/80 px-3 py-2 rounded-lg border border-brand-700 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('footer.taxReg')} (TIN: {COMPANY_DETAILS.tin})</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-lg text-white mb-4 font-heading border-b border-brand-800 pb-2">
              {t('footer.quickNav')}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-2"
                >
                  {t('footer.navHome')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-2"
                >
                  {t('footer.navCatalog')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('order')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-2"
                >
                  {t('footer.navCart')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-2"
                >
                  {t('footer.navContact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('account')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-2"
                >
                  {t('footer.navAccount')}
                </button>
              </li>
            </ul>
          </div>

          {/* Target Industries */}
          <div>
            <h4 className="font-bold text-lg text-white mb-4 font-heading border-b border-brand-800 pb-2">
              {t('footer.supplyServices')}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">{t('footer.svc1')}</li>
              <li className="flex items-center gap-2">{t('footer.svc2')}</li>
              <li className="flex items-center gap-2">{t('footer.svc3')}</li>
              <li className="flex items-center gap-2">{t('footer.svc4')}</li>
              <li className="flex items-center gap-2">{t('footer.svc5')}</li>
            </ul>
          </div>

          {/* Official Contact & PDF Download */}
          <div>
            <h4 className="font-bold text-lg text-white mb-4 font-heading border-b border-brand-800 pb-2">
              {t('footer.contactDocs')}
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <span>{COMPANY_DETAILS.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${COMPANY_DETAILS.phones[0].replace(/\s+/g, '')}`} className="hover:text-white block">
                    {COMPANY_DETAILS.phones[0]}
                  </a>
                  <a href={`tel:${COMPANY_DETAILS.phones[1].replace(/\s+/g, '')}`} className="hover:text-white block">
                    {COMPANY_DETAILS.phones[1]}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-white break-all">
                  {COMPANY_DETAILS.email}
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <a
                href={COMPANY_DETAILS.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-900 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                {t('footer.downloadPdf')}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} Vegetables and Fruits_V&amp;F. {t('footer.copyright')}
            <button
              id="footer-staff-link"
              onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0 }); }}
              className="ml-2 text-brand-800 hover:text-gray-400 transition-colors"
              title="Staff"
            >
              {t('footer.staff')}
            </button>
          </p>
          <p className="flex items-center gap-1">
            {t('footer.b2bPlatform')}
          </p>
        </div>
      </div>
    </footer>
  );
}

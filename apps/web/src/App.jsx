import React from 'react';
import { useAtom } from 'jotai';
import { activeTabAtom, notificationAtom } from './store/atoms';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import OrderNow from './pages/OrderNow';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Account from './pages/Account';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab] = useAtom(activeTabAtom);
  const [notification] = useAtom(notificationAtom);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8faf7]">
      <div>
        <Navbar />

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-brand-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-brand-700 flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-brand-gold" />
            <span className="text-sm font-bold">{notification}</span>
          </div>
        )}

        {/* Dynamic Page Views */}
        <main className="animate-fadeIn">
          {activeTab === 'home' && <Home />}
          {activeTab === 'catalog' && <Catalog />}
          {activeTab === 'order' && <OrderNow />}
          {activeTab === 'contact' && <Contact />}
          {activeTab === 'account' && <Account />}
          {activeTab === 'admin' && <Admin />}
        </main>
      </div>

      <Footer />
    </div>
  );
}

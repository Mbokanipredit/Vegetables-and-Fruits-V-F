import React from 'react';
import { useAtom } from 'jotai';
import { activeTabAtom, cartAtom, notificationAtom } from '../store/atoms';
import { PRODUCTS_DATA, COMPANY_DETAILS } from '../data/productsData';
import { 
  Building2, Utensils, Home as HomeIcon, Store, Truck, 
  CheckCircle2, ArrowRight, ShieldCheck, Download, Plus, ShoppingBag, 
  Sparkles, Clock, DollarSign, Award, Leaf
} from 'lucide-react';

export default function Home() {
  const [, setActiveTab] = useAtom(activeTabAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [, setNotification] = useAtom(notificationAtom);

  const featuredItems = PRODUCTS_DATA.filter((item) => item.popular).slice(0, 8);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.product.id === product.id);
      if (existing) {
        return prevCart.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });

    setNotification(`Added ${product.name} to your Cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient text-white pt-12 pb-20 md:pt-20 md:pb-28 rounded-b-3xl shadow-xl">
        {/* Decorative ambient lighting glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
                Farm-Fresh Produce <br />
                <span className="text-brand-gold">Directly to Your Business</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Supply your hotel, restaurant, residential complex, or supermarket with top-quality fresh vegetables, fruits, herbs, and tubers with daily Kigali deliveries & transparent wholesale pricing.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-sm text-brand-100 font-medium">
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                  56 Standardized Products
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  TIN: {COMPANY_DETAILS.tin}
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-brand-gold" />
                  Daily Kigali Deliveries
                </span>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('order')}
                  className="w-full sm:w-auto bg-brand-gold hover:bg-yellow-400 text-brand-900 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 text-base"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Build Custom Order</span>
                </button>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl border border-white/30 backdrop-blur-md flex items-center justify-center gap-3 transition-all text-base"
                >
                  <span>Explore Price List</span>
                  <ArrowRight className="w-5 h-5 text-brand-gold" />
                </button>
              </div>
            </div>

            {/* Right Badge Graphic Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-brand-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white/95 text-gray-900 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/50 max-w-sm text-center">
                  <img
                    src={COMPANY_DETAILS.logoPath}
                    alt="V&F Official Logo"
                    className="w-44 h-44 mx-auto object-contain drop-shadow-md rounded-full mb-6 p-2 bg-brand-50 border-4 border-brand-200"
                  />
                  <h3 className="font-extrabold text-2xl text-brand-900 font-heading">
                    {COMPANY_DETAILS.name}
                  </h3>
                  <p className="text-xs text-brand-700 font-bold uppercase tracking-wider mt-1">
                    Official 2026 Quotation Catalog
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Location:</span>
                      <span className="text-gray-900 font-bold">Kigali, Nyarugenge</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Price Validity:</span>
                      <span className="text-brand-700 font-bold">{COMPANY_DETAILS.validityDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Currency:</span>
                      <span className="text-gray-900 font-bold">Rwandan Franc (RWF)</span>
                    </div>
                  </div>

                  <a
                    href={COMPANY_DETAILS.pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
                  >
                    <Download className="w-4 h-4 text-brand-gold" />
                    Download Official Quotation PDF
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Target Industries We Serve */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-900 font-heading">
            Who We Supply Across Rwanda
          </h2>
          <p className="text-gray-600 mt-2 text-base">
            We partner with diverse businesses and residential institutions to deliver consistent daily fresh produce tailored to your volume requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Hotels */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-brand-100 text-brand-800 rounded-2xl flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 font-heading">Hotels & Resorts</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Premium grade vegetables, exotic herbs, cherry tomatoes, and fresh fruits for high-end hotel kitchens and breakfast buffets.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('order')}
              className="mt-6 text-brand-700 font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              <span>Setup Hotel Supply</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Restaurants */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-brand-100 text-brand-800 rounded-2xl flex items-center justify-center">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 font-heading">Restaurants & Cafes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Daily fresh delivery of onions, garlic, potatoes, peppers, lettuce, and cooking staples for restaurant culinary operations.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('order')}
              className="mt-6 text-brand-700 font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              <span>Setup Restaurant Supply</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Residences */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-brand-100 text-brand-800 rounded-2xl flex items-center justify-center">
                <HomeIcon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 font-heading">Residences & Estates</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Wholesale bulk food basket packages for residential complexes, embassies, compounds, and household groups.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('order')}
              className="mt-6 text-brand-700 font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              <span>Setup Residential Supply</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4: Supermarkets */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-brand-100 text-brand-800 rounded-2xl flex items-center justify-center">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 font-heading">Supermarkets & Markets</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sorted, packaged, and weighed produce ready for retail supermarket shelves and grocery stores across Kigali.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('order')}
              className="mt-6 text-brand-700 font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              <span>Setup Supermarket Wholesale</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Why Choose V&F B2B Advantages */}
      <section className="bg-brand-50 py-16 border-y border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-900 font-heading">
              Why Business Leaders Choose V&F
            </h2>
            <p className="text-gray-600 mt-2 text-base">
              We eliminate produce supply chain headaches with transparent pricing, guaranteed freshness, and hassle-free ordering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 font-heading">Guaranteed Farm Freshness</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Harvested directly from local Rwandan partner farms, hand-inspected, and delivered within hours to retain nutritional value and taste.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 font-heading">Transparent Wholesale Rates</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Clear itemized pricing in Rwandan Francs (RWF) with no hidden fees. Complete quotation transparency updated according to market availability.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 font-heading">Reliable Daily Logistics</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                On-time Kigali distribution team ensuring your business never runs out of essential ingredients during peak operating hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-brand-900 font-heading">
              Featured Fresh Produce
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-brand-700 font-bold text-sm hover:underline flex items-center gap-1"
          >
            <span>View Full 56 Item List</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between card-hover group"
            >
              <div>
                {/* Product Image */}
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gray-100 mb-3.5">
                  <img
                    src={item.image || item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/95 backdrop-blur-md text-brand-900 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-gray-100">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
                      #{item.id}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-gray-900 group-hover:text-brand-800 transition-colors leading-snug">
                  {item.name}
                </h3>
                {item.kinyarwanda && (
                  <p className="text-xs text-brand-700 font-semibold italic mt-0.5">
                    "{item.kinyarwanda}"
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-gray-500">Unit Price</span>
                    <p className="font-extrabold text-xl text-brand-900 font-heading">
                      {item.price.toLocaleString()} <span className="text-xs text-gray-600 font-normal">RWF / {item.unit}</span>
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(item)}
                className="mt-4 w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Collaboration Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
              Ready to partner with V&F for your business produce supply?
            </h2>
            <p className="text-brand-100 text-base">
              Submit your order request today or contact our team directly for customized contracts, bulk discounts, and scheduled daily deliveries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setActiveTab('order')}
                className="bg-brand-gold hover:bg-yellow-400 text-brand-900 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all text-center"
              >
                Submit Order Request
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all text-center"
              >
                Contact & Location Map
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

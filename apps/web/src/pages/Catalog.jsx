import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { activeCategoryAtom, searchQueryAtom, cartAtom, notificationAtom, activeTabAtom } from '../store/atoms';
import { CATEGORIES, COMPANY_DETAILS } from '../data/productsData';
import { productsApi } from '../services/apiClient';
import { Search, Filter, Plus, Minus, ShoppingBag, Download, Grid, Table as TableIcon, Check } from 'lucide-react';
import { useLang } from '../i18n/useLang';

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useAtom(activeCategoryAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [, setNotification] = useAtom(notificationAtom);
  const [, setActiveTab] = useAtom(activeTabAtom);
  const { t } = useLang();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await productsApi.getProducts(activeCategory, searchQuery);
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, [activeCategory, searchQuery]);

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1;
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.product.id === product.id);
      if (existing) {
        return prevCart.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prevCart, { product, quantity: qty }];
    });
    setNotification(`${t('common.added').replace('!', '')} ${product.name}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider mb-1">
            <span>{t('catalog.headerLabel')}</span>
            <span>•</span>
            <span>{t('catalog.validUntil')} {COMPANY_DETAILS.validityDate}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            {t('catalog.title')}
          </h1>
          <p className="text-brand-100 text-sm mt-1 max-w-xl">
            {t('catalog.desc')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={COMPANY_DETAILS.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-gold hover:bg-yellow-400 text-brand-900 font-bold px-5 py-2.5 rounded-xl shadow flex items-center gap-2 text-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t('catalog.downloadPdf')}</span>
          </a>
          <button
            onClick={() => setActiveTab('order')}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl border border-white/20 text-sm flex items-center gap-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('catalog.viewCart')}</span>
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('catalog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm bg-gray-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded"
              >
                {t('catalog.clear')}
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-semibold text-gray-500">{t('catalog.view')}</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">{t('catalog.grid')}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'table'
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t('catalog.table')}</span>
            </button>
          </div>
        </div>

        {/* Category Scrollable Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-800 text-white shadow-md shadow-brand-800/20'
                    : 'bg-white text-gray-700 hover:bg-brand-50 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Count */}
      <div className="flex justify-between items-center text-xs text-gray-500 font-semibold px-1">
        <span>{t('catalog.showing')} {products.length} {t('catalog.produceItems')}</span>
        <span>{t('catalog.allPricesRWF')}</span>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 text-sm font-medium">{t('catalog.loading')}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-4">
          <p className="text-gray-500 text-base font-semibold">{t('catalog.noResults')} "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All Products');
            }}
            className="bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            {t('catalog.resetFilters')}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((item) => {
            const qty = quantities[item.id] || 1;
            const inCart = cart.find((i) => i.product.id === item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between card-hover relative group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gray-100 mb-3 group">
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
                      <span className="bg-white/95 backdrop-blur-md text-brand-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                        #{item.id}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 group-hover:text-brand-800 transition-colors leading-snug">{item.name}</h3>
                  {item.kinyarwanda && (
                    <p className="text-xs text-brand-700 font-semibold italic mt-0.5">
                      "{item.kinyarwanda}"
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <span className="text-xs text-gray-500">{t('catalog.unitPrice')}</span>
                    <p className="font-extrabold text-lg text-brand-900 font-heading">
                      {item.price.toLocaleString()} <span className="text-xs text-gray-600 font-normal">RWF / {item.unit}</span>
                    </p>
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    <span className="text-xs text-gray-500 font-medium px-2">{t('catalog.qty')} ({item.unit}):</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-7 h-7 bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900">{qty}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-7 h-7 bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`w-full font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-sm ${
                      inCart
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-brand-700 hover:bg-brand-800 text-white'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{t('catalog.inOrder')} ({inCart.quantity} {item.unit})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>{t('catalog.addToCart')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-900 text-white text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">{t('catalog.thNo')}</th>
                  <th className="py-3.5 px-4">{t('catalog.thItem')}</th>
                  <th className="py-3.5 px-4">{t('catalog.thKiny')}</th>
                  <th className="py-3.5 px-4">{t('catalog.thCategory')}</th>
                  <th className="py-3.5 px-4">{t('catalog.thUnit')}</th>
                  <th className="py-3.5 px-4 text-right">{t('catalog.thPrice')}</th>
                  <th className="py-3.5 px-4 text-center">{t('catalog.thAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((item) => {
                  const inCart = cart.find((i) => i.product.id === item.id);
                  return (
                    <tr key={item.id} className="hover:bg-brand-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-500 font-bold">{item.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <span className="font-semibold text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-brand-700 font-medium italic">{item.kinyarwanda || '—'}</td>
                      <td className="py-3 px-4">
                        <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-gray-600">{item.unit}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-brand-900 font-heading text-base">
                        {item.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1 shadow-sm transition-colors ${
                            inCart
                              ? 'bg-emerald-600 text-white'
                              : 'bg-brand-700 hover:bg-brand-800 text-white'
                          }`}
                        >
                          {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{inCart ? `${t('catalog.added')} (${inCart.quantity})` : t('catalog.add')}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

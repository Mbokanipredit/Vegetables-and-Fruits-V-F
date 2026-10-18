import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { customerSessionAtom, activeTabAtom, notificationAtom, cartItemCountAtom } from '../store/atoms';
import { authApi, ordersApi, apiErrorMessage } from '../services/apiClient';
import { User, Mail, Lock, Phone, Building, LogIn, UserPlus, LogOut, ShoppingBag, Package, Eye, EyeOff } from 'lucide-react';

const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
  DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
};

function Field({ icon: Icon, label, id, type = 'text', value, onChange, required, placeholder, autoComplete, trailing }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
        />
        {trailing}
      </div>
    </div>
  );
}

export default function Account() {
  const [session, setSession] = useAtom(customerSessionAtom);
  const [, setActiveTab] = useAtom(activeTabAtom);
  const [, setNotification] = useAtom(notificationAtom);
  const [cartCount] = useAtom(cartItemCountAtom);

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', companyName: '', phone: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (!session?.token) return;
    setOrdersLoading(true);
    ordersApi
      .getMyOrders(session.token)
      .then(setOrders)
      .catch((err) => {
        if (err?.response?.status === 401) setSession(null); // expired session
      })
      .finally(() => setOrdersLoading(false));
  }, [session?.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'login'
          ? await authApi.login(form.email, form.password)
          : await authApi.register(form);
      setSession(result);
      notify(mode === 'login' ? `Welcome back, ${result.user.name}!` : 'Account created successfully!');
      // If they were building a cart, take them straight back to it
      if (cartCount > 0) setActiveTab('order');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setOrders([]);
    notify('You have been logged out');
  };

  /* ---------------- Logged-in view ---------------- */
  if (session?.user) {
    const u = session.user;
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-gold text-brand-900 flex items-center justify-center text-2xl font-black shadow-md">
              {u.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-brand-gold text-xs font-bold uppercase tracking-wider">My Account</p>
              <h1 className="text-3xl font-extrabold font-heading">{u.name}</h1>
              <p className="text-brand-100 text-sm">
                {u.email}
                {u.companyName ? ` · ${u.companyName}` : ''}
                {u.phone ? ` · ${u.phone}` : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              id="account-go-cart"
              onClick={() => setActiveTab('order')}
              className="bg-brand-gold hover:bg-yellow-400 text-brand-900 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" /> Go to Cart
            </button>
            <button
              id="account-logout"
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-700" />
            <h2 className="font-extrabold text-lg text-gray-900 font-heading">My Orders</h2>
          </div>
          {ordersLoading ? (
            <p className="p-10 text-center text-sm text-gray-500">Loading your orders…</p>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
              >
                Browse the catalog
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((o) => (
                <div key={o.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-mono text-xs font-bold text-brand-700">{o.orderNumber}</p>
                    <p className="text-sm text-gray-700">
                      {o.items?.length} item(s) · Delivery {o.deliveryDate || 'ASAP'} ·{' '}
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-brand-900">{o.totalAmount?.toLocaleString()} RWF</span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${STATUS_STYLES[o.status] || ''}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- Login / Register view ---------------- */
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-br from-brand-900 to-brand-700 text-white p-7 text-center">
          <h1 className="text-2xl font-extrabold font-heading">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-brand-100 text-sm mt-1">
            {mode === 'login'
              ? 'Log in to place orders and track deliveries.'
              : 'Register so we know who is ordering and can deliver to you.'}
          </p>
        </div>

        <div className="grid grid-cols-2 p-1.5 m-6 mb-0 bg-gray-100 rounded-xl">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              id={`account-tab-${m}`}
              type="button"
              onClick={() => { setMode(m); setError(''); }}
              className={`py-2 rounded-lg text-sm font-bold transition-all ${
                mode === m ? 'bg-white text-brand-800 shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === 'login' ? 'Log in' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <Field icon={User} id="reg-name" label="Full name" value={form.name} onChange={set('name')} required autoComplete="name" placeholder="e.g. Jean Mugisha" />
              <Field icon={Building} id="reg-company" label="Company / Hotel / Restaurant" value={form.companyName} onChange={set('companyName')} placeholder="Optional" autoComplete="organization" />
              <Field icon={Phone} id="reg-phone" label="Phone / WhatsApp" type="tel" value={form.phone} onChange={set('phone')} required autoComplete="tel" placeholder="+250 7xx xxx xxx" />
            </>
          )}
          <Field icon={Mail} id="auth-email" label="Email" type="email" value={form.email} onChange={set('email')} required autoComplete="email" placeholder="you@example.com" />
          <Field
            icon={Lock}
            id="auth-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ordersApi, authApi, apiErrorMessage } from '../services/apiClient';
import { useAtom } from 'jotai';
import { notificationAtom, adminSessionAtom } from '../store/atoms';
import { 
  ShieldCheck, ShoppingBag, Clock, CheckCircle2, XCircle, 
  Search, RefreshCw, FileText, Phone, Mail, MapPin, Eye, Lock, LogOut, UserCircle 
} from 'lucide-react';

function AdminLogin({ onLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      onLoggedIn(await authApi.adminLogin(email, password));
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 shadow-xl p-7 space-y-4 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-900 text-brand-gold flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 font-heading">Admin sign in</h1>
          <p className="text-xs text-gray-500">Restricted to V&amp;F staff.</p>
        </div>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="username"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
        <button
          id="admin-login-submit"
          type="submit"
          disabled={loading}
          className="w-full bg-brand-900 hover:bg-brand-800 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [adminSession, setAdminSession] = useAtom(adminSessionAtom);
  if (!adminSession?.token) return <AdminLogin onLoggedIn={setAdminSession} />;
  return <AdminDashboard session={adminSession} onLogout={() => setAdminSession(null)} />;
}

function AdminDashboard({ session, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerCount, setCustomerCount] = useState(0);
  const [, setNotification] = useAtom(notificationAtom);

  const handleAuthError = (err) => {
    if (err?.response?.status === 401 || err?.response?.status === 403) onLogout();
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [data, customers] = await Promise.all([
        ordersApi.getOrders(session.token),
        authApi.getCustomers(session.token),
      ]);
      setOrders(data);
      setCustomerCount(customers.length);
    } catch (err) {
      console.error(err);
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus, session.token);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setNotification(`Updated order status to ${newStatus}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      handleAuthError(err);
      alert(apiErrorMessage(err, 'Could not update the order status.'));
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.companyName?.toLowerCase().includes(q) ||
      o.contactPerson?.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q) ||
      o.phone?.includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>V&F Administrative Management Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Client Order Quotation Dashboard
          </h1>
          <p className="text-brand-100 text-sm mt-1 max-w-xl">
            Monitor, confirm, and process inbound vegetable & fruit supply requests from Hotels, Residences, Restaurants & Supermarkets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-brand-100 flex items-center gap-1.5">
            <UserCircle className="w-4 h-4 text-brand-gold" /> {session.user?.email}
          </span>
          <button
            onClick={fetchOrders}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl border border-white/20 text-sm flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            id="admin-logout"
            onClick={onLogout}
            className="bg-white/10 hover:bg-red-500/80 text-white font-bold px-4 py-2.5 rounded-xl border border-white/20 text-sm flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Received Orders</p>
          <p className="text-3xl font-extrabold text-gray-900 font-heading">{orders.length}</p>
          <p className="text-xs text-gray-400">From {customerCount} registered customer account(s)</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Confirmation</p>
          <p className="text-3xl font-extrabold text-amber-900 font-heading">{pendingCount}</p>
          <p className="text-xs text-amber-600">Requires review & follow-up</p>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Confirmed & In Logistics</p>
          <p className="text-3xl font-extrabold text-emerald-900 font-heading">{confirmedCount}</p>
          <p className="text-xs text-emerald-600">Active supply contracts</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Quotation Value</p>
          <p className="text-2xl font-extrabold text-brand-900 font-heading">{totalRevenue.toLocaleString()} RWF</p>
          <p className="text-xs text-gray-400">Cumulative order value</p>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by company, order #, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-brand-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-16 text-center text-gray-500 text-sm">
          Loading order database...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <p className="font-bold text-base">No client orders found matching your filter.</p>
          <p className="text-xs">When users submit orders via the Order Now page, they will appear here in real-time.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-900 text-white text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Client Type</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Delivery Date</th>
                  <th className="py-3.5 px-4 text-right">Total (RWF)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700 text-xs">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-gray-900">
                      {ord.companyName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-brand-50 text-brand-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-brand-200 uppercase">
                        {ord.clientType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <p className="font-semibold text-gray-900">{ord.contactPerson}</p>
                      <p className="text-gray-500">{ord.phone}</p>
                      {ord.user ? (
                        <p className="text-[10px] text-brand-700 font-bold mt-0.5 flex items-center gap-1">
                          <UserCircle className="w-3 h-3" /> {ord.user.email}
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-400 mt-0.5">Guest (no account)</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-600">
                      {ord.deliveryDate || 'ASAP'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-brand-900 font-heading text-base">
                      {ord.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusUpdate(ord.id, e.target.value)}
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          ord.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : ord.status === 'CONFIRMED' || ord.status === 'PROCESSING'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : ord.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="bg-brand-50 hover:bg-brand-100 text-brand-800 p-1.5 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-brand-700">{selectedOrder.orderNumber}</span>
                <h3 className="font-extrabold text-2xl text-gray-900 font-heading">{selectedOrder.companyName}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="text-gray-500 font-semibold">Contact Person:</p>
                <p className="font-bold text-gray-900">{selectedOrder.contactPerson}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Phone / WhatsApp:</p>
                <p className="font-bold text-gray-900">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Email:</p>
                <p className="font-bold text-gray-900">{selectedOrder.email}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Delivery Location:</p>
                <p className="font-bold text-gray-900">{selectedOrder.address}</p>
              </div>
              <div className="col-span-2 border-t border-gray-200 pt-3">
                <p className="text-gray-500 font-semibold">Ordered by account:</p>
                {selectedOrder.user ? (
                  <p className="font-bold text-brand-800">
                    {selectedOrder.user.name} · {selectedOrder.user.email}
                    {selectedOrder.user.phone ? ` · ${selectedOrder.user.phone}` : ''}
                    {selectedOrder.user.companyName ? ` · ${selectedOrder.user.companyName}` : ''}
                  </p>
                ) : (
                  <p className="font-bold text-gray-400">Guest order (placed before accounts were required)</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-gray-900">Ordered Produce Items</h4>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{item.productName}</span>
                      <span className="text-gray-500 ml-2">({item.quantity} {item.unit} @ {item.price.toLocaleString()} RWF)</span>
                    </div>
                    <span className="font-extrabold text-brand-900">{item.subtotal.toLocaleString()} RWF</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-700 text-sm">Total Order Value:</span>
              <span className="font-extrabold text-2xl text-brand-900 font-heading">
                {selectedOrder.totalAmount?.toLocaleString()} RWF
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-5 py-2 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ordersApi } from '../services/apiClient';
import { useAtom } from 'jotai';
import { notificationAtom } from '../store/atoms';
import { 
  ShieldCheck, ShoppingBag, Clock, CheckCircle2, XCircle, 
  Search, RefreshCw, FileText, Phone, Mail, MapPin, Eye 
} from 'lucide-react';

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [, setNotification] = useAtom(notificationAtom);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersApi.apiClient?.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setNotification(`Updated order status to ${newStatus}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.warn('Status update API error, updating state:', err);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
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

        <button
          onClick={fetchOrders}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl border border-white/20 text-sm flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inbound Orders</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Received Orders</p>
          <p className="text-3xl font-extrabold text-gray-900 font-heading">{orders.length}</p>
          <p className="text-xs text-gray-400">All recorded quotation submissions</p>
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

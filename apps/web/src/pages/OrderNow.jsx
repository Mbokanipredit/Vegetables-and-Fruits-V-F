import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { cartAtom, cartTotalAtom, activeTabAtom, notificationAtom } from '../store/atoms';
import { ordersApi } from '../services/apiClient';
import { COMPANY_DETAILS, PRODUCTS_DATA } from '../data/productsData';
import { 
  ShoppingBag, Plus, Minus, Trash2, Send, CheckCircle, 
  Building, User, Mail, Phone, MapPin, Calendar, FileText, 
  MessageSquare, ArrowLeft, Printer, ShieldCheck, Download 
} from 'lucide-react';

export default function OrderNow() {
  const [cart, setCart] = useAtom(cartAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [, setActiveTab] = useAtom(activeTabAtom);
  const [, setNotification] = useAtom(notificationAtom);

  const [formData, setFormData] = useState({
    companyName: '',
    clientType: 'HOTEL',
    contactPerson: '',
    email: '',
    phone: '',
    address: 'Nyarugenge, Kigali',
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuantityChange = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleQuickAdd = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.product.id === product.id);
      if (existing) {
        return prevCart.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setQuickSearch('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Please add at least one produce item to your order before submitting.');
      return;
    }

    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      alert('Please fill in all required contact details.');
      return;
    }

    setSubmitting(true);

    const orderPayload = {
      companyName: formData.companyName,
      clientType: formData.clientType,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      deliveryDate: formData.deliveryDate,
      notes: formData.notes,
      totalAmount: cartTotal,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        unit: item.product.unit,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      })),
    };

    try {
      const response = await ordersApi.createOrder(orderPayload);
      setSubmittedOrder(response);
      setCart([]); // Reset cart
      setNotification('Order submitted successfully to V&F Admin!');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('An error occurred submitting your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate WhatsApp Message text for direct contact
  const getWhatsAppUrl = () => {
    if (!submittedOrder) return '#';
    const itemsList = submittedOrder.items
      .map((i) => `• ${i.productName}: ${i.quantity} ${i.unit} @ ${i.price.toLocaleString()} RWF = ${i.subtotal.toLocaleString()} RWF`)
      .join('%0A');

    const text = `*NEW B2B ORDER - ${submittedOrder.orderNumber}*%0A%0A` +
      `*Company:* ${submittedOrder.companyName} (${submittedOrder.clientType})%0A` +
      `*Contact:* ${submittedOrder.contactPerson}%0A` +
      `*Phone:* ${submittedOrder.phone}%0A` +
      `*Email:* ${submittedOrder.email}%0A` +
      `*Address:* ${submittedOrder.address}%0A` +
      `*Delivery Date:* ${submittedOrder.deliveryDate}%0A%0A` +
      `*ORDERED PRODUCE:*%0A${itemsList}%0A%0A` +
      `*TOTAL AMOUNT:* ${submittedOrder.totalAmount.toLocaleString()} RWF%0A` +
      `*Notes:* ${submittedOrder.notes || 'None'}`;

    return `https://wa.me/250788211968?text=${text}`;
  };

  const quickFilterResults = quickSearch.trim()
    ? PRODUCTS_DATA.filter(
        (p) =>
          p.name.toLowerCase().includes(quickSearch.toLowerCase()) ||
          (p.kinyarwanda && p.kinyarwanda.toLowerCase().includes(quickSearch.toLowerCase()))
      ).slice(0, 6)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider mb-1">
          <ShoppingBag className="w-4 h-4" />
          <span>B2B Quotation & Order Builder</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
          Submit Produce Order Request
        </h1>
        <p className="text-brand-100 text-sm mt-1 max-w-2xl">
          Build your wholesale order from our 56 farm-fresh items. Submit directly to V&F administration for formal quotation confirmation, invoicing, and scheduled daily Kigali delivery.
        </p>
      </div>

      {submittedOrder ? (
        /* Order Submitted Confirmation Screen */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-8 animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Order Sent to Admin
            </span>
            <h2 className="text-3xl font-extrabold text-brand-900 font-heading">
              Thank You! Your Order Has Been Received
            </h2>
            <p className="text-gray-600 text-sm max-w-lg mx-auto">
              Order <span className="font-mono font-bold text-brand-700">{submittedOrder.orderNumber}</span> has been logged into the V&F database. Our supply team will review and contact you shortly.
            </p>
          </div>

          {/* Invoice Summary Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left space-y-4 font-sans text-sm">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <h4 className="font-extrabold text-brand-900 text-lg font-heading">{submittedOrder.companyName}</h4>
                <p className="text-xs text-gray-500">{submittedOrder.contactPerson} • {submittedOrder.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-500">Order Number</p>
                <p className="font-mono font-bold text-brand-700">{submittedOrder.orderNumber}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ordered Items ({submittedOrder.items.length})</p>
              <div className="divide-y divide-gray-200 bg-white rounded-xl border border-gray-200 overflow-hidden">
                {submittedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{item.productName}</span>
                      <span className="text-gray-500 ml-2">({item.quantity} {item.unit} @ {item.price.toLocaleString()} RWF)</span>
                    </div>
                    <span className="font-extrabold text-brand-900">{item.subtotal.toLocaleString()} RWF</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-base font-extrabold text-brand-900 font-heading">
              <span>Total Quotation Amount:</span>
              <span className="text-2xl text-brand-700">{submittedOrder.totalAmount.toLocaleString()} RWF</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all text-sm"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Send Order via WhatsApp (+250 788 211 968)</span>
            </a>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Quotation Receipt</span>
            </button>

            <button
              onClick={() => {
                setSubmittedOrder(null);
                setActiveTab('catalog');
              }}
              className="w-full sm:w-auto bg-brand-700 hover:bg-brand-800 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>New Order</span>
            </button>
          </div>
        </div>
      ) : (
        /* Order Builder Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Cart Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-700" />
                  <h2 className="font-extrabold text-xl text-gray-900 font-heading">Selected Produce Basket</h2>
                </div>
                <span className="bg-brand-100 text-brand-800 font-bold text-xs px-3 py-1 rounded-full">
                  {cart.length} Products Selected
                </span>
              </div>

              {/* Quick Add Product Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Quick add item by name (e.g. Tomatoes, Avocado, Garlic...)"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                />
                {quickFilterResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-20 overflow-hidden divide-y divide-gray-100">
                    {quickFilterResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleQuickAdd(p)}
                        className="p-3 hover:bg-brand-50 cursor-pointer flex justify-between items-center text-xs font-semibold"
                      >
                        <div>
                          <span className="text-gray-900">{p.name}</span>
                          {p.kinyarwanda && <span className="text-brand-700 ml-2">({p.kinyarwanda})</span>}
                        </div>
                        <span className="text-brand-800 font-bold">{p.price.toLocaleString()} RWF / {p.unit} +</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart List */}
              {cart.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 space-y-3">
                  <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto" />
                  <p className="text-gray-500 text-sm font-medium">Your produce basket is currently empty.</p>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-800 transition-colors"
                  >
                    Browse 56 Produce Items
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto pr-1">
                  {cart.map((item) => {
                    const lineTotal = item.product.price * item.quantity;
                    return (
                      <div key={item.product.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 truncate">{item.product.name}</h4>
                          <p className="text-xs text-gray-500">
                            {item.product.price.toLocaleString()} RWF per {item.product.unit}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.product.id, -1)}
                            className="w-6 h-6 bg-white text-gray-700 rounded shadow-xs flex items-center justify-center hover:bg-gray-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.product.id, 1)}
                            className="w-6 h-6 bg-white text-gray-700 rounded shadow-xs flex items-center justify-center hover:bg-gray-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[90px]">
                          <span className="font-extrabold text-sm text-brand-900 font-heading">
                            {lineTotal.toLocaleString()} RWF
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Basket Total Summary */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-700 text-sm">Estimated Total Amount:</span>
                  <span className="font-extrabold text-2xl text-brand-900 font-heading">
                    {cartTotal.toLocaleString()} <span className="text-sm font-normal text-gray-600">RWF</span>
                  </span>
                </div>
              )}
            </div>

            {/* Official Terms & Delivery Info */}
            <div className="bg-brand-50 rounded-2xl p-5 border border-brand-200 text-xs text-brand-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-700" />
                <span>V&F Official Wholesale Terms</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                • Orders are processed immediately by V&F Rwanda logistics.<br />
                • Prices are guaranteed valid until 28 September 2026.<br />
                • Official Tax Invoices (TIN: 156708252) provided upon delivery.
              </p>
            </div>

          </div>

          {/* Right Column: Company & Delivery Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-extrabold text-xl text-gray-900 font-heading">Client Delivery Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Please provide your business and contact info for the quotation contract.</p>
              </div>

              {/* Business / Company Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-brand-700" />
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Kigali Marriott Hotel / Residence Villa"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Client Type Select */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Business Sector / Client Type
                </label>
                <select
                  value={formData.clientType}
                  onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm bg-white"
                >
                  <option value="HOTEL">Hotel & Resort</option>
                  <option value="RESTAURANT">Restaurant & Cafe</option>
                  <option value="RESIDENCE">Residential Estate / Household</option>
                  <option value="SUPERMARKET">Supermarket & Grocery</option>
                  <option value="CATERING">Catering & Events</option>
                  <option value="INSTITUTION">School / Institution</option>
                  <option value="OTHER">Other Business</option>
                </select>
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-700" />
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-700" />
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+250 788 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-700" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="manager@company.rw"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-700" />
                  Delivery Location Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., KN 3 Ave, Nyarugenge, Kigali"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Preferred Delivery Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-700" />
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-sm bg-white"
                />
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Special Notes / Packaging Request
                </label>
                <textarea
                  rows={2}
                  placeholder="Any specific instructions (e.g., extra clean cassava leaves, sliced potatoes, morning 7am delivery...)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 text-xs"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || cart.length === 0}
                className="w-full bg-brand-gold hover:bg-yellow-400 disabled:bg-gray-300 text-brand-900 font-extrabold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all text-base font-heading"
              >
                <Send className="w-5 h-5" />
                <span>{submitting ? 'Submitting Order to Admin...' : 'Submit Order to Admin'}</span>
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}

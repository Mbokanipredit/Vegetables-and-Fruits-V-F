import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Active page view: 'home' | 'catalog' | 'order' | 'contact' | 'account' | 'admin'
export const activeTabAtom = atom('home');

// Customer session: { token, user } | null  (persisted)
export const customerSessionAtom = atomWithStorage('vf_customer_session', null);

// Admin session: { token, user } | null  (persisted separately)
export const adminSessionAtom = atomWithStorage('vf_admin_session', null);

// Catalog filters
export const activeCategoryAtom = atom('All Products');
export const searchQueryAtom = atom('');

// Cart Atom
// Array of { product: Item, quantity: number }
export const cartAtom = atom([]);

// Cart helper computed atoms
export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
});

export const cartItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((count, item) => count + item.quantity, 0);
});

// Toast / Notification atom
export const notificationAtom = atom(null);

// Language: 'en' | 'rw'  (persisted across sessions)
export const langAtom = atomWithStorage('vf_lang', 'en');

// Admin orders state atom
export const ordersListAtom = atom([]);

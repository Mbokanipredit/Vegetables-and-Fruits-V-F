import { atom } from 'jotai';

// Active page view: 'home' | 'catalog' | 'order' | 'contact' | 'admin'
export const activeTabAtom = atom('home');

// Catalog filters
export const activeCategoryAtom = atom('All Products');
export const searchQueryAtom = atom('');

// Order Builder Cart Atom
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

// Admin orders state atom
export const ordersListAtom = atom([]);

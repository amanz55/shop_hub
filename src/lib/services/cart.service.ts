
import { createSignal, createDerived } from '$lib/utils/reactive';
import type { Product } from '$lib/types';

export type CartItem = { id: number; title: string; price: number; image: string; quantity: number };
export type AddToCartStatus = 'idle' | 'pending' | 'success';

const processingQueue: Product[] = [];
let isProcessingQueue = false;

function createCart() {
	const { subscribe, update, set } = createSignal<CartItem[]>([]);
	return {
		subscribe,
		addItem: (product: Product) => {
			update((items) => {
				const existingIndex = items.findIndex((i) => i.id === product.id);
				if (existingIndex > -1) {
					return items.map((item, index) =>
						index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
					);
				}
				return [...items, { ...product, quantity: 1 }];
			});
		},
		removeItem: (itemId: number) => update((items) => items.filter((i) => i.id !== itemId)),
		updateQuantity: (itemId: number, newQuantity: number) => {
			update((items) => {
				if (newQuantity <= 0) return items.filter((i) => i.id !== itemId);
				return items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item));
			});
		},
		clearCart: () => set([])
	};
}

export const cart = createCart();
export const isCartOpen = createSignal(false);
export const itemStatus = createSignal(new Map<number, AddToCartStatus>());

// --- NEW: Global Signal for Checkout Rate Limiting ---
// This will hold the timestamp (in milliseconds) until which checkout is disabled.
export const checkoutRateLimitEnd = createSignal(0);
// ----------------------------------------------------

export function addItemToCart(product: Product) {
	let currentStatuses: Map<number, AddToCartStatus>;
	const unsub = itemStatus.subscribe((s) => (currentStatuses = s));
	unsub();
	if (currentStatuses!.get(product.id) === 'pending') return;

	processingQueue.push(product);
	processQueue();
}

async function processQueue() {
	if (isProcessingQueue || processingQueue.length === 0) return;
	isProcessingQueue = true;
	const product = processingQueue.shift()!;

	itemStatus.update((s) => new Map(s).set(product.id, 'pending'));
	isCartOpen.set(true);
	await new Promise((r) => setTimeout(r, 500));
	cart.addItem(product);
	itemStatus.update((s) => new Map(s).set(product.id, 'success'));
	setTimeout(() => {
		itemStatus.update((s) => {
			const newMap = new Map(s);
			newMap.delete(product.id);
			return newMap;
		});
	}, 2000);
	isProcessingQueue = false;
	processQueue();
}

export const totalItems = createDerived(cart, ($cart) => $cart.reduce((s, i) => s + i.quantity, 0));
export const totalPrice = createDerived(cart, ($cart) => $cart.reduce((s, i) => s + i.price * i.quantity, 0));
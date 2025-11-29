'use client';
import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import supabase from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
	return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
	const [items, setItems] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const local = localStorage.getItem('amor_cart');
                return local ? JSON.parse(local) : [];
            } catch (e) {
                console.error('Error initializing cart from local storage', e);
                return [];
            }
        }
        return [];
    });
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [userId, setUserId] = useState(null);
	const [isLoadingCart, setIsLoadingCart] = useState(false);
	const isSyncingRef = useRef(false);
	const authSubscriptionRef = useRef(null);
	const signingOutRef = useRef(false);
	// Safely get signingOut from auth context (useAuth handles missing context gracefully)
	const authContext = useAuth();
	const signingOut = authContext?.signingOut || false;
	
	// Keep ref in sync with signingOut state for use in listeners
	useEffect(() => {
		signingOutRef.current = signingOut;
	}, [signingOut]);

	// Convert cart item to database format
	const itemToDbFormat = (item) => ({
		product_id: String(item.id),
		product_name: item.name || '',
		product_price: item.price || 0,
		product_image: item.image || '',
		quantity: item.qty || 1,
	});

	// Convert database format to cart item
	const dbToItemFormat = (dbItem) => ({
		id: dbItem.product_id,
		name: dbItem.product_name,
		price: parseFloat(dbItem.product_price),
		image: dbItem.product_image,
		qty: dbItem.quantity,
	});

	// Load cart from Supabase
	const loadCartFromSupabase = async (uid) => {
		if (!supabase || !uid) return [];

		setIsLoadingCart(true);
		try {
			const { data, error } = await supabase
				.from('user_cart')
				.select('*')
				.eq('user_id', uid)
				.order('created_at', { ascending: true });

			if (error) {
				console.error('Error loading cart from Supabase:', error);
				return [];
			}

			const cartItems = (data || []).map(dbToItemFormat);
			saveCartToLocalStorage(cartItems); // Force Mirror
			return cartItems;
		} catch (err) {
			console.error('Error loading cart:', err);
			return [];
		} finally {
			setIsLoadingCart(false);
		}
	};

	// Save cart to Supabase
	const saveCartToSupabase = async (uid, cartItems) => {
		if (!supabase || !uid) return;

		// If already syncing, skip this save - the next change will trigger another save
		// This prevents race conditions while still allowing immediate saves
		if (isSyncingRef.current) {
			return;
		}

		isSyncingRef.current = true;

		try {
            if (cartItems.length === 0) {
                // If cart is empty, delete everything
                await supabase.from('user_cart').delete().eq('user_id', uid);
            } else {
                // Prepare items for upsert
                const dbItems = cartItems.map((item) => ({
                    user_id: uid,
                    ...itemToDbFormat(item),
                }));

                // UPSERT: Updates existing items, inserts new ones
                const { error } = await supabase
                    .from('user_cart')
                    .upsert(dbItems, { onConflict: 'user_id, product_id' });

                if (error) {
                     if (error.code !== '42P01') {
                        console.error('Error syncing cart to Supabase:', error);
                     }
                }
                
                // Clean up stale items (items in DB but not in current cart)
                // Get IDs of items currently in the cart
                const currentProductIds = cartItems.map(item => String(item.id));
                if (currentProductIds.length > 0) {
                     await supabase
                        .from('user_cart')
                        .delete()
                        .eq('user_id', uid)
                        .not('product_id', 'in', `(${currentProductIds.join(',')})`);
                }
            }
		} catch (err) {
			// Only log unexpected errors
			if (err?.code !== '42P01' && err?.message !== 'relation "public.user_cart" does not exist') {
				console.error('Error saving cart:', err);
			}
		} finally {
			isSyncingRef.current = false;
		}
	};

	// Load cart from localStorage (for anonymous users)
	const loadCartFromLocalStorage = () => {
		try {
			const raw = localStorage.getItem('amor_cart');
			if (raw) return JSON.parse(raw);
		} catch (err) {
			console.error('Error loading cart from localStorage:', err);
		}
		return [];
	};

	// Save cart to localStorage (for anonymous users)
	const saveCartToLocalStorage = (cartItems) => {
		try {
			localStorage.setItem('amor_cart', JSON.stringify(cartItems));
		} catch (err) {
			console.error('Error saving cart to localStorage:', err);
		}
	};

	// Initialize cart based on auth state
	useEffect(() => {
		if (!supabase) {
			// Fallback to localStorage if Supabase is not configured
			const localCart = loadCartFromLocalStorage();
			setItems(localCart);
			setIsLoading(false);
			return;
		}

		const initCart = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			const currentUserId = user?.id || null;
			setUserId(currentUserId);

			if (currentUserId) {
				// User is logged in - load from Supabase
				const cartItems = await loadCartFromSupabase(currentUserId);
				setItems(cartItems);
			} else {
				// User is anonymous - load from localStorage
				const localCart = loadCartFromLocalStorage();
				setItems(localCart);
			}

			setIsLoading(false);
		};

		initCart();

		// Listen for auth state changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
			const newUserId = session?.user?.id || null;
			
			// Handle the auth state change
			if (newUserId) {
				// User logged in - always load their cart from Supabase
				// This ensures we get the correct cart for the logged-in user
				setUserId(newUserId);
				const cartItems = await loadCartFromSupabase(newUserId);
				setItems(cartItems);
			} else {
				// User logged out - clear in-memory cart state (but don't delete from DB)
				// The cart in DB is preserved and keyed by user.id, so it will load when that user logs back in
				// Note: We clear in-memory cart even during sign-out because:
				// 1. Cart syncing is paused (signingOut check in useEffect)
				// 2. Cart in DB is never deleted (clear() function checks signingOut)
				// 3. Page will redirect anyway, so in-memory state will reset
				setUserId(null);
				setItems([]);
				// Load anonymous cart from localStorage (only if not signing out to avoid race)
				if (!signingOutRef.current) {
					const localCart = loadCartFromLocalStorage();
					setItems(localCart);
				}
			}
		});

		authSubscriptionRef.current = subscription;

		return () => {
			if (subscription) {
				try {
					subscription.unsubscribe();
				} catch (err) {
					console.error('Error unsubscribing from cart auth listener:', err);
				}
			}
		};
	}, []);

	// Sync cart to persistence layers when items change
	useEffect(() => {
		// Don't save if we're still loading initial state, loading a cart, or signing out
		if (isLoading || isLoadingCart || signingOut) {
			return;
		}

		// Always save to localStorage for cross-tab availability
		saveCartToLocalStorage(items);

		// Also save to Supabase for logged-in users for long-term persistence
		if (userId && supabase) {
			saveCartToSupabase(userId, items);
		}
	}, [items, userId, isLoading, isLoadingCart, signingOut]);

	const addItem = (product) => {
		setItems((prev) => {
			const existing = prev.find((p) => p.id === product.id);
			let newItems;
			if (existing) {
				newItems = prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
			} else {
				newItems = [...prev, { ...product, qty: 1 }];
			}
			saveCartToLocalStorage(newItems); // Instant Mirror
			return newItems;
		});
		setIsOpen(true);
	};

	const removeItem = (id) => {
		setItems((prev) => {
            // Check if item exists and get current qty
            const existingItem = prev.find(p => p.id === id);
            if (!existingItem) return prev;

            let newItems;
            if (existingItem.qty > 1) {
                // Decrement
                newItems = prev.map(p => p.id === id ? { ...p, qty: p.qty - 1 } : p);
            } else {
                // Remove
                newItems = prev.filter((p) => p.id !== id);
            }
			
			saveCartToLocalStorage(newItems); // Instant Mirror
			return newItems;
		});
	};

	const updateQty = (id, qty) => {
		setItems((prev) => {
			const newItems = prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p));
			saveCartToLocalStorage(newItems); // Instant Mirror
			return newItems;
		});
	};

	const clear = () => {
		// Never clear cart from DB during sign-out - preserve user's cart
		if (signingOut) {
			console.log('Sign-out in progress: skipping cart clear to preserve DB cart');
			return;
		}
		
		setItems([]);
		// Clear from Supabase if user is logged in (only if not signing out)
		if (userId && supabase) {
			supabase.from('user_cart').delete().eq('user_id', userId).catch(console.error);
		}
		// Clear localStorage (for anonymous users)
		try {
			localStorage.removeItem('amor_cart');
		} catch (err) {
			console.error('Error clearing localStorage:', err);
		}
	};

	// Clear in-memory cart on sign-out (but preserve DB cart)
	const clearInMemoryCart = () => {
		setItems([]);
		// Don't delete from DB - cart is preserved and keyed by user.id
		// localStorage is cleared by AuthContext during sign-out
	};

	const toggle = () => setIsOpen((v) => !v);
	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	const total = useMemo(() => {
		return items.reduce((sum, p) => sum + (p.price || 0) * (p.qty || 1), 0);
	}, [items]);

	const value = useMemo(
		() => ({ items, addItem, removeItem, updateQty, clear, total, isOpen, toggle, open, close, isLoading }),
		[items, total, isOpen, isLoading]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};





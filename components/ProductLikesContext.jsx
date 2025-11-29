'use client';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import supabase from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import products from '../app/data/products.json';

const ProductLikesContext = createContext(null);

export const useProductLikes = () => {
	const context = useContext(ProductLikesContext);
	if (!context) {
		return {
			likeCounts: {},
			userLikes: new Set(),
			isLoading: true,
			refreshLikes: async () => {},
		};
	}
	return context;
};

export const ProductLikesProvider = ({ children }) => {
	const [likeCounts, setLikeCounts] = useState(() => {
        if (typeof window !== 'undefined') {
             try {
                const local = localStorage.getItem('amor_like_counts');
                return local ? JSON.parse(local) : {};
             } catch (e) {
                 return {};
             }
        }
        return {};
    });
	const [userLikes, setUserLikes] = useState(() => {
        if (typeof window !== 'undefined') {
             try {
                const local = localStorage.getItem('amor_user_likes');
                return local ? new Set(JSON.parse(local)) : new Set();
             } catch (e) {
                 return new Set();
             }
        }
        return new Set();
    });
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useAuth();

	// Batch fetch all like counts for all products in a single query (fastest possible)
	const fetchAllLikeCounts = useCallback(async () => {
		if (!supabase) {
			setIsLoading(false);
			return {};
		}

		try {
			// Get all product IDs as strings
			const productIds = products.map(p => String(p.id));

			// Initialize counts for all products
			const counts = {};
			productIds.forEach(id => {
				counts[id] = 0;
			});

			// Single query to get all likes - only select product_id for minimal data transfer
			const { data, error } = await supabase
				.from('product_likes')
				.select('product_id');

			if (error) {
				// Only log if it's not a permissions error
				if (error.code !== 'PGRST116' && error.message !== 'permission denied for table product_likes') {
					console.error('Error fetching all like counts:', error);
				}
				return counts; // Return initialized counts
			}

			// Count likes per product (fast in-memory operation)
			if (data && data.length > 0) {
				data.forEach(like => {
					const productId = String(like.product_id);
					if (counts[productId] !== undefined) {
						counts[productId] = (counts[productId] || 0) + 1;
					}
				});
			}

			return counts;
		} catch (err) {
			console.error('Unexpected error fetching all like counts:', err);
			// Return initialized counts on error
			const productIds = products.map(p => String(p.id));
			const counts = {};
			productIds.forEach(id => {
				counts[id] = 0;
			});
			return counts;
		}
	}, []);

	// Batch fetch all user likes in a single query
	const fetchUserLikes = useCallback(async (userId) => {
		if (!supabase || !userId) {
			return new Set();
		}

		try {
			// Get all product IDs as strings
			const productIds = products.map(p => String(p.id));

			// Single query to get all products the user has liked
			const { data, error } = await supabase
				.from('product_likes')
				.select('product_id')
				.eq('user_id', userId)
				.in('product_id', productIds);

			if (error) {
				console.error('Error fetching user likes:', error);
				return new Set();
			}

			// Convert to Set for fast lookup
			const likedProducts = new Set();
			if (data) {
				data.forEach(like => {
					likedProducts.add(String(like.product_id));
				});
			}

			return likedProducts;
		} catch (err) {
			console.error('Unexpected error fetching user likes:', err);
			return new Set();
		}
	}, []);

	// Refresh all likes data
	const refreshLikes = useCallback(async () => {
		if (!supabase) return;

		// Fetch like counts and user likes in parallel for maximum speed
		const [counts, userLikedSet] = await Promise.all([
			fetchAllLikeCounts(),
			user ? fetchUserLikes(user.id) : Promise.resolve(new Set()),
		]);

		setLikeCounts(counts);
		setUserLikes(userLikedSet);
        
        // Persist to Local Storage immediately
        if (typeof window !== 'undefined') {
            localStorage.setItem('amor_like_counts', JSON.stringify(counts));
            localStorage.setItem('amor_user_likes', JSON.stringify(Array.from(userLikedSet)));
        }

		setIsLoading(false);
	}, [fetchAllLikeCounts, fetchUserLikes, user]);

	// Load likes on mount and when user changes
	useEffect(() => {
		refreshLikes();
	}, [refreshLikes]);

	// Listen for auth state changes to refresh user likes
	useEffect(() => {
		if (!supabase) return;

		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
			const newUserId = session?.user?.id || null;
			
			// Refresh user likes when auth state changes
			if (newUserId) {
				const userLikedSet = await fetchUserLikes(newUserId);
				setUserLikes(userLikedSet);
			} else {
				setUserLikes(new Set());
			}
		});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [fetchUserLikes]);

	const value = useMemo(
		() => ({
			likeCounts,
			userLikes,
			isLoading,
			refreshLikes,
		}),
		[likeCounts, userLikes, isLoading, refreshLikes]
	);

	return <ProductLikesContext.Provider value={value}>{children}</ProductLikesContext.Provider>;
};


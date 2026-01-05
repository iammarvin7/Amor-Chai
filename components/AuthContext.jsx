'use client';
import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import supabase from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		// Return a safe default if context is not available
		return {
			user: null,
			session: null,
			isLoading: true,
			signingOut: false,
			signOutSuccessMessage: null,
			clearSignOutMessage: () => {},
		};
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [signingOut, setSigningOut] = useState(false);
	const [signOutSuccessMessage, setSignOutSuccessMessage] = useState(null);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [authModalTab, setAuthModalTab] = useState('login');
	const authSubscriptionRef = useRef(null);
	const signOutInProgressRef = useRef(false);

	const openAuthModal = (tab = 'login') => {
		setAuthModalTab(tab);
		setIsAuthModalOpen(true);
	};

	const closeAuthModal = () => {
		setIsAuthModalOpen(false);
	};

	// Clear all storage related to auth and session
	const clearAllStorage = useCallback(() => {
		try {
			// Clear cart localStorage
			localStorage.removeItem('amor-cart');

			// Clear all Supabase-related localStorage items
			const localStorageKeys = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth-token'))) {
					localStorageKeys.push(key);
				}
			}
			localStorageKeys.forEach(key => localStorage.removeItem(key));

			// Clear all Supabase-related sessionStorage items
			const sessionStorageKeys = [];
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key && (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth-token'))) {
					sessionStorageKeys.push(key);
				}
			}
			sessionStorageKeys.forEach(key => sessionStorage.removeItem(key));
		} catch (err) {
			console.error('Error clearing storage:', err);
		}
	}, []);

	// Unsubscribe from all auth listeners
	const cleanupAuthListeners = useCallback(() => {
		if (authSubscriptionRef.current) {
			try {
				authSubscriptionRef.current.unsubscribe();
			} catch (err) {
				console.error('Error unsubscribing from auth listener:', err);
			}
			authSubscriptionRef.current = null;
		}
	}, []);

	// Robust sign-out handler - Instant and Optimistic
	const handleSignOut = useCallback(async () => {
		// 1. Optimistic Update: clear UI state immediately
		setUser(null);
		setSession(null);
		
		// 2. Clear all local storage immediately
		clearAllStorage();

		// 3. Fire and forget Supabase sign out
		// We don't await this because we want the UI to be instant for the user.
		// Even if this fails network-wise, the user is effectively signed out locally.
		try {
			if (supabase) supabase.auth.signOut();
		} catch (err) {
			console.error('Background sign-out error:', err);
		}

		// 4. Redirect to home if needed (optional) 
		// Since we cleared state, the UI should update automatically.
		// We can force a soft navigation to home to be sure.
        // window.location.href = '/'; // Hard reload is safest for clearing state but slower. 
        // Let's rely on state update for "Instant" feel.
	}, [clearAllStorage]);

	// Initialize auth state and set up listener
	useEffect(() => {
		if (!supabase) {
			setIsLoading(false);
			return;
		}

		let mounted = true;

		const initAuth = async () => {
			try {
				const { data: { session: currentSession }, error } = await supabase.auth.getSession();
				
				if (!mounted) return;

				if (error) {
					console.error('Error getting session:', error);
					setUser(null);
					setSession(null);
				} else {
					setSession(currentSession);
					setUser(currentSession?.user ?? null);
				}
			} catch (err) {
				console.error('Error initializing auth:', err);
				if (mounted) {
					setUser(null);
					setSession(null);
				}
			} finally {
				if (mounted) {
					setIsLoading(false);
				}
			}
		};

		initAuth();

		// Set up auth state change listener
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
			// Don't process auth changes if sign-out is in progress
			if (signOutInProgressRef.current && event === 'SIGNED_OUT') {
				return;
			}

			if (!mounted) return;

			setSession(newSession);
			setUser(newSession?.user ?? null);

			// Handle specific events
			if (event === 'SIGNED_OUT') {
				// Clear state on sign-out event
				setUser(null);
				setSession(null);
			}
		});

		authSubscriptionRef.current = subscription;

		return () => {
			mounted = false;
			if (subscription) {
				try {
					subscription.unsubscribe();
				} catch (err) {
					console.error('Error unsubscribing on cleanup:', err);
				}
			}
		};
	}, []);

	const value = useMemo(
		() => ({
			user,
			session,
			isLoading,
			signingOut,
			signOutSuccessMessage,
			isAuthModalOpen,
			authModalTab,
			openAuthModal,
			closeAuthModal,
			handleSignOut,
			clearSignOutMessage: () => setSignOutSuccessMessage(null),
		}),
		[user, session, isLoading, signingOut, signOutSuccessMessage, isAuthModalOpen, authModalTab, handleSignOut]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


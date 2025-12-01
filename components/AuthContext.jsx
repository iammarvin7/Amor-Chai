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
			showReloadAlert: false,
			handleSignOut: async () => {},
			clearSignOutMessage: () => {},
			dismissReloadAlert: () => {},
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
	const [showReloadAlert, setShowReloadAlert] = useState(false);
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

	// Robust sign-out handler - atomic and idempotent
	const handleSignOut = useCallback(async (showErrorToast = null) => {
		// Prevent multiple simultaneous sign-out attempts (idempotent)
		if (signOutInProgressRef.current) {
			console.warn('Sign-out already in progress, ignoring duplicate call');
			return;
		}

		if (!supabase) {
			console.error('Supabase client not available');
			if (showErrorToast) showErrorToast('Sign-out failed: Supabase not configured');
			return;
		}

		signOutInProgressRef.current = true;
		setSigningOut(true);

		let signOutCompleted = false;
		let shouldRedirect = false;

		try {
			// Step 1: Unsubscribe from auth listeners to prevent race conditions
			cleanupAuthListeners();

			// Step 2: Sign out from Supabase with timeout to prevent hanging
			let signOutError = null;
			try {
				const signOutPromise = supabase.auth.signOut();
				const timeoutPromise = new Promise((_, reject) => 
					setTimeout(() => reject(new Error('Sign-out timeout after 10 seconds')), 10000)
				);

				const result = await Promise.race([signOutPromise, timeoutPromise]);
				// If result is an error object, extract the error
				if (result && typeof result === 'object' && 'error' in result) {
					signOutError = result.error;
				} else if (result instanceof Error) {
					signOutError = result;
				}
			} catch (error) {
				console.error('Sign-out failed or timed out:', error);
				signOutError = error;
			}

			// Step 3: Verify session is null (with retry if needed)
			if (!signOutError) {
				let sessionCheck = await supabase.auth.getSession();
				if (sessionCheck.data?.session) {
					console.warn('Session still exists after signOut, retrying...');
					// Retry sign-out once with timeout
					try {
						const retryPromise = supabase.auth.signOut();
						const retryTimeout = new Promise((_, reject) => 
							setTimeout(() => reject(new Error('Retry sign-out timeout')), 5000)
						);
						const retryResult = await Promise.race([retryPromise, retryTimeout]);
						if (retryResult?.error) {
							console.error('Retry signOut error:', retryResult.error);
						}
						// Wait a bit for the session to clear
						await new Promise(resolve => setTimeout(resolve, 200));
						sessionCheck = await supabase.auth.getSession();
						
						if (sessionCheck.data?.session) {
							console.error('Session still exists after retry - proceeding with cleanup anyway');
						}
					} catch (retryError) {
						console.error('Retry sign-out failed:', retryError);
					}
				}
			}

			// Step 4: Clear all storage (only after signOut completes)
			clearAllStorage();

			// Step 5: Reset React state
			setUser(null);
			setSession(null);

			// Step 6: Show reload alert (don't redirect automatically)
			setSignOutSuccessMessage('Signed out successfully. Please reload the page.');
			setShowReloadAlert(true);

			signOutCompleted = true;
			// Don't redirect - let user reload manually
			shouldRedirect = false;

		} catch (error) {
			console.error('Error during sign-out:', error);
			
			// Fallback: manual cleanup even if signOut failed or hung
			try {
				console.log('Performing manual cleanup after sign-out error');
				cleanupAuthListeners();
				clearAllStorage();
				setUser(null);
				setSession(null);
				shouldRedirect = true;
			} catch (fallbackError) {
				console.error('Error in fallback cleanup:', fallbackError);
				// Force redirect as last resort
				shouldRedirect = true;
			}

			if (showErrorToast) {
				showErrorToast('Sign-out completed with errors, but you have been logged out locally.');
			}
		} finally {
			// Always reset the signingOut flag
			setSigningOut(false);
			signOutInProgressRef.current = false;

			// Only redirect on error fallback, not on successful sign-out
			if (shouldRedirect && !signOutCompleted) {
				// Only redirect if there was an error and we need fallback cleanup
				setTimeout(() => {
					window.location.replace('/');
				}, 100);
			}
		}
	}, [clearAllStorage, cleanupAuthListeners]);

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
			showReloadAlert,
			isAuthModalOpen,
			authModalTab,
			openAuthModal,
			closeAuthModal,
			handleSignOut,
			clearSignOutMessage: () => setSignOutSuccessMessage(null),
			dismissReloadAlert: () => setShowReloadAlert(false),
		}),
		[user, session, isLoading, signingOut, signOutSuccessMessage, showReloadAlert, isAuthModalOpen, authModalTab, handleSignOut]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


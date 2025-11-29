'use client';
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Toast } from './Toast';

const ToastContext = createContext(null);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		return {
			showToast: () => {},
		};
	}
	return context;
};

export const ToastProvider = ({ children }) => {
	const [toast, setToast] = useState(null);
	// Use a ref to track toast ID counter to ensure unique IDs without Date.now()
	// This prevents any potential hydration issues if toasts were somehow rendered during SSR
	const toastIdRef = useRef(0);

	const showToast = useCallback((message, duration = 5000) => {
		// Generate ID only on client-side to avoid any potential hydration mismatches
		// Using a counter instead of Date.now() ensures deterministic behavior
		const id = ++toastIdRef.current;
		setToast({ message, duration, id });
	}, []);

	const hideToast = useCallback(() => {
		setToast(null);
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{toast && (
				<Toast
					key={toast.id}
					message={toast.message}
					duration={toast.duration}
					onClose={hideToast}
				/>
			)}
		</ToastContext.Provider>
	);
};


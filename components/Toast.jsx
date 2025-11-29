'use client';
import { useEffect, useState } from 'react';

export const Toast = ({ message, onClose, duration = 5000 }) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Trigger fade-in animation
		setIsVisible(true);

		// Auto-dismiss after duration
		const timer = setTimeout(() => {
			setIsVisible(false);
			// Wait for fade-out animation before calling onClose
			setTimeout(() => {
				onClose();
			}, 300);
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	if (!message) return null;

	return (
		<div
			className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ${
				isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
			}`}
		>
			<div className="bg-white rounded-lg shadow-xl border border-gray-200 px-6 py-4 flex items-center gap-3 max-w-md mx-4">
				<svg
					className="h-5 w-5 text-green-500 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p className="text-sm font-medium text-gray-900 flex-1">{message}</p>
				<button
					onClick={() => {
						setIsVisible(false);
						setTimeout(() => onClose(), 300);
					}}
					className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
					aria-label="Close"
				>
					<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};


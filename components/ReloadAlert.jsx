'use client';
import { useEffect, useRef } from 'react';

export const ReloadAlert = ({ show, onReload, onDismiss }) => {
	const alertShownRef = useRef(false);

	useEffect(() => {
		if (show && !alertShownRef.current) {
			// Show browser alert as well for maximum visibility (only once)
			alert('Signed out successfully. Please reload the page to complete the sign-out process.');
			alertShownRef.current = true;
		}
		if (!show) {
			// Reset when alert is dismissed
			alertShownRef.current = false;
		}
	}, [show]);

	if (!show) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-md w-full mx-4">
				<div className="flex items-start gap-4">
					<div className="flex-shrink-0">
						<svg
							className="h-6 w-6 text-blue-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Signed Out Successfully
						</h3>
						<p className="text-sm text-gray-700 mb-4">
							Please reload the page to complete the sign-out process and ensure all session data is cleared.
						</p>
						<div className="flex gap-3">
							<button
								onClick={onReload}
								className="flex-1 rounded-lg bg-brand-pink2 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
							>
								Reload Page
							</button>
							<button
								onClick={onDismiss}
								className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
							>
								Dismiss
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};


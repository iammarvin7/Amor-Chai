'use client';
import { useRef, useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabaseClient';
import Link from 'next/link';

const CartDrawer = () => {
	const { items, removeItem, updateQty, total, isOpen, close, clear } = useCart();
	const { user, signingOut, handleSignOut } = useAuth();
	const [notice, setNotice] = useState('');
	const [userName, setUserName] = useState('');
	const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
	
	const isLoggedIn = !!user;

	// Update userName from auth context
	useEffect(() => {
		if (user) {
			setUserName(user.user_metadata?.first_name || '');
		} else {
			setUserName('');
		}
	}, [user]);

	// Show error toast helper
	const showErrorToast = (message) => {
		setNotice(message);
		setTimeout(() => setNotice(''), 5000);
	};

	const onSignOut = async () => {
		if (items.length > 0) {
			// Show confirmation if cart has items
			setShowSignOutConfirm(true);
			return;
		}
		// No items, sign out directly
		await handleSignOut(showErrorToast);
	};

	const confirmSignOut = async () => {
		// User confirmed, proceed with sign out
		setShowSignOutConfirm(false);
		await handleSignOut(showErrorToast);
	};

	return (
		<>
			<div
				className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
				aria-hidden={!isOpen}
			>
				<div className="flex h-full flex-col">
				<div className="flex items-center justify-between border-b p-4">
					<h2 className="text-lg font-bold">{userName ? `${userName}'s Cart` : 'Your Cart'}</h2>
					<button className="rounded-md p-2 hover:bg-gray-100" onClick={close} aria-label="Close cart">
						✕
					</button>
				</div>
				<div className="flex-1 overflow-y-auto p-4">
					{items.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center px-6 mt-auto">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-200 mb-4">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
							</svg>
							<h3 className="text-base font-medium text-gray-900">Your cart is empty</h3>
							<p className="text-sm text-gray-400 mt-1">
								Time to add some flavor?
							</p>
							<Link
								href="/products"
								onClick={close}
								className="mt-4 px-6 py-2 bg-black text-white text-sm rounded-full hover:opacity-80 transition-opacity w-fit"
							>
								Browse Products
							</Link>
						</div>
					) : (
						<ul className="space-y-4">
							{items.map((item) => (
								<li key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
									<img
										src={item.image}
										alt={item.name}
										className="h-16 w-16 rounded object-cover"
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate font-semibold">{item.name}</p>
										<p className="text-sm text-gray-600">${item.price?.toFixed(2)}</p>
										<div className="mt-2 inline-flex items-center gap-2">
											<button
												className="rounded border px-2"
												onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
											>
												-
											</button>
											<span className="w-6 text-center">{item.qty || 1}</span>
											<button
												className="rounded border px-2"
												onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
											>
												+
											</button>
										</div>
									</div>
									<button
										className="rounded-md p-2 text-red-500 hover:bg-red-50"
										onClick={() => removeItem(item.id)}
									>
										Remove
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="border-t p-4">
					{items.length > 0 && (
						<>
							<div className="flex items-center justify-between">
								<p className="text-lg font-bold">Total</p>
								<p className="text-lg font-bold">${total.toFixed(2)}</p>
							</div>
							<div className="mt-3 flex gap-2">
								<a
									href={`/checkout`}
									target="_blank"
									rel="noopener noreferrer"
									className={`flex-1 text-center rounded-lg bg-brand-pink2 px-4 py-2 font-semibold text-white ${!items.length ? 'opacity-60 pointer-events-none' : ''}`}
									onClick={(e) => { if (!items.length) e.preventDefault(); }}
								>
									Checkout
								</a>
								<button className="rounded-lg border px-4 py-2" onClick={clear}>
									Clear
								</button>
							</div>
						</>
					)}
					<p className="mt-2 text-xs text-gray-600">
						Delivery can only be done within 10 miles of Cape Girardeau, MO.
					</p>
					{notice ? (
						<p className="mt-3 text-sm text-red-600">{notice}</p>
					) : null}
					{isLoggedIn && (
						<button
							onClick={onSignOut}
							disabled={signingOut}
							className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{signingOut ? 'Signing out...' : 'Sign Out'}
						</button>
					)}
				</div>
			</div>
			{/* Sign out confirmation modal */}
			{showSignOutConfirm && (
				<div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
						<h3 className="text-lg font-bold mb-2">Warning: Cart Items Will Be Lost</h3>
						<p className="text-gray-700 mb-4">
							You have {items.length} item{items.length !== 1 ? 's' : ''} in your cart. Signing out will clear your cart. Are you sure you want to continue?
						</p>
						<div className="flex gap-3">
							<button
								onClick={confirmSignOut}
								disabled={signingOut}
								className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{signingOut ? 'Signing out...' : 'Yes, Sign Out'}
							</button>
							<button
								onClick={() => setShowSignOutConfirm(false)}
								disabled={signingOut}
								className="flex-1 rounded-lg border px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
		</>
	);
};

export default CartDrawer;




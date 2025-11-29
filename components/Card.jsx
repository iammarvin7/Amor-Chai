'use client';
/* eslint-disable @next/next/no-img-element */
import { useCart } from "./CartContext";
import { useProductLikes } from "./ProductLikesContext";
import { useAuth } from "./AuthContext";
import supabase from '../lib/supabaseClient';

const Card = ({ product }) => {
	const imageUrl = product.image;
	const { addItem } = useCart();
	const { likeCounts, userLikes, refreshLikes } = useProductLikes();
	const { user } = useAuth();
			const productId = String(product.id);
			
	// Get like count and hasLiked from context (instant, no loading)
	const likeCount = likeCounts[productId] || 0;
	const hasLiked = userLikes.has(productId);
	const userId = user?.id || null;

	const handleLike = async () => {
		if (!supabase) {
			alert('Database connection not available');
			return;
		}

		if (!userId) {
			alert('Please sign in to like products');
			return;
		}

		try {
			if (hasLiked) {
				// Unlike: remove from database
				const { error } = await supabase
					.from('product_likes')
					.delete()
					.eq('product_id', productId)
					.eq('user_id', userId);

				if (error) {
					console.error('Error unliking product:', {
						message: error.message,
						code: error.code,
						details: error.details,
						productId: productId
					});
					alert('Failed to unlike product. Please try again.');
				} else {
					// Refresh all likes to get accurate counts (fast - single query)
					await refreshLikes();
				}
			} else {
				// Like: add to database
				const { error } = await supabase
					.from('product_likes')
					.insert({
						product_id: productId,
						user_id: userId,
					});

				if (error) {
					if (error.code === '23505') {
						// Unique constraint violation - user already liked (race condition)
						// Just refresh to sync
						await refreshLikes();
					} else {
						console.error('Error liking product:', {
							message: error.message,
							code: error.code,
							details: error.details,
							productId: productId
						});
						alert('Failed to like product. Please try again.');
					}
				} else {
					// Refresh all likes to get accurate counts (fast - single query)
					await refreshLikes();
				}
			}
		} catch (err) {
			console.error('Unexpected error:', err);
			alert('An unexpected error occurred. Please try again.');
		}
	};

	return (
		<div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
			<div className="relative">
				<img
					className="h-36 w-full object-cover sm:h-64 md:h-72 lg:h-80"
					src={imageUrl}
					alt={product.name}
					loading="lazy"
				/>
				<div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 rounded-full overflow-hidden shadow-sm">
					<button
						onClick={handleLike}
						className={`p-1.5 sm:p-2 transition-colors ${
							hasLiked
								? 'text-red-500'
								: 'text-gray-600 hover:text-red-500'
						}`}
						aria-label={hasLiked ? 'Unlike product' : 'Like product'}
					>
						<svg
							className="w-4 h-4 sm:w-5 sm:h-5"
							fill={hasLiked ? 'currentColor' : 'none'}
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
					</button>
					<span className="pr-2 text-[10px] sm:text-xs font-semibold text-gray-700">
						{likeCount}
					</span>
				</div>
			</div>
			<div className="flex flex-1 flex-col gap-1 p-3 pb-16 sm:gap-2 sm:p-5 sm:pb-24">
				<h3 className="text-sm font-bold text-gray-800 sm:text-xl line-clamp-1">{product.name}</h3>
				{product.size && <h4 className="text-[10px] font-medium text-gray-500 sm:text-sm">{product.size}</h4>}
				<h4 className="pt-0.5 text-sm font-semibold text-brand-pink2 sm:pt-2 sm:text-lg">
					Starting at ${product.price}
				</h4>
				<p className="text-[10px] leading-snug text-gray-600 sm:text-sm line-clamp-2">
					Ingredients: {product.description}
				</p>
				{product.flavors && (
					<p className="text-[10px] italic text-gray-600 sm:text-sm line-clamp-1">
						Flavors: {product.flavors.join(', ')}
					</p>
				)}
			</div>
			<div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-5">
				<button
					type="button"
					onClick={() => addItem(product)}
					className="pointer-events-auto w-full rounded-lg border-2 border-brand-pink2 px-3 py-2 text-xs font-semibold text-brand-pink2 transition-all duration-300 hover:bg-brand-pink2 hover:text-white sm:px-5 sm:py-3 sm:text-base"
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default Card;

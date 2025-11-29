'use client';
export default function Error({ error, reset }) {
	return (
		<div className="mx-auto max-w-2xl p-6 text-center">
			<h2 className="text-2xl font-bold">Something went wrong</h2>
			<p className="mt-2 text-sm text-gray-600">{error?.message || 'An unexpected error occurred.'}</p>
			<button
				onClick={() => reset()}
				className="mt-4 rounded-lg bg-brand-pink2 px-4 py-2 font-semibold text-white"
			>
				Try again
			</button>
		</div>
	);
}





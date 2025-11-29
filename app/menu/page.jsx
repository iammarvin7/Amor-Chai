/* eslint-disable @next/next/no-img-element */
export const metadata = { title: "Menu | Amor + Chai" };

const MenuPage = () => {
	return (
		<section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
			{/* Stacked, larger menu images for readability */}
			<div className="mx-auto flex max-w-4xl flex-col gap-8">
				<img
					className="w-full rounded-2xl border border-gray-200 bg-white/60 p-3 shadow-sm object-contain"
					style={{ maxHeight: 900 }}
					src="/assets/Menu1.png"
					alt="Menu 1"
				/>
				<img
					className="w-full rounded-2xl border border-gray-200 bg-white/60 p-3 shadow-sm object-contain"
					style={{ maxHeight: 900 }}
					src="/assets/Menu2.png"
					alt="Menu 2"
				/>
			</div>
		</section>
	);
};

export default MenuPage;



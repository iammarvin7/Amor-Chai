/* eslint-disable @next/next/no-img-element */
export const metadata = { title: "Recipes | Amor + Chai" };

const RecipePage = () => {
	return (
		<section className="mx-auto max-w-6xl px-0 py-8 sm:px-4 md:py-10">
			<h1 className="px-4 text-center text-xl font-extrabold text-gray-800 sm:text-2xl">
				Crafting the Chai Experience: Recipes Featuring Our Loose Tea Blends
			</h1>

			{/* Mobile: horizontal snaps carousel */}
			<div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:hidden">
				{["/assets/sigChaiMasala.png", "/assets/LavChaiMasala.png", "/assets/MintChaiMasala.png", "/assets/RoseChaiMasala.png"].map(
					(src, idx) => (
						<img
							key={idx}
							className="h-96 min-w-[85%] snap-center rounded-2xl object-cover shadow-glow"
							src={src}
							alt={`Recipe ${idx + 1}`}
						/>
					)
				)}
			</div>

			{/* Tablet and up: grid */}
			<div className="mx-auto mt-6 hidden max-w-6xl grid-cols-2 gap-6 px-4 sm:grid">
				{["/assets/sigChaiMasala.png", "/assets/LavChaiMasala.png", "/assets/MintChaiMasala.png", "/assets/RoseChaiMasala.png"].map(
					(src, idx) => (
						<img
							key={idx}
							className="w-full rounded-2xl shadow-glow transition-transform duration-500 hover:-translate-y-1 hover:shadow-glowHover"
							src={src}
							alt={`Recipe ${idx + 1}`}
						/>
					)
				)}
			</div>
		</section>
	);
};

export default RecipePage;



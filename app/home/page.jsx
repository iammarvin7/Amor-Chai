/* eslint-disable @next/next/no-img-element */
const HomePage = () => {
	return (
		<section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-6 lg:px-8 lg:py-12">
			<video
				className="order-1 h-56 w-full rounded-xl object-cover shadow-md sm:h-64 md:order-2 md:h-72 lg:order-3 lg:col-span-2 lg:h-auto"
				src="/assets/video1.mp4"
				autoPlay
				muted
				loop
			/>
			<img
				className="order-2 h-56 w-full rounded-xl object-cover shadow-md sm:h-64 md:order-3 md:h-72 md:col-span-1 lg:order-2 lg:col-span-2 lg:h-auto"
				src="/assets/poster1.png"
				alt="Poster 1"
			/>
			<img
				className="order-3 h-56 w-full rounded-xl object-cover shadow-md sm:h-64 md:order-1 md:h-72 md:col-span-2 lg:order-1 lg:col-span-4 lg:h-auto"
				src="/assets/poster3.png"
				alt="Poster 3"
			/>
			<img
				className="order-4 h-56 w-full rounded-xl object-cover shadow-md sm:h-64 md:order-4 md:h-72 md:col-span-2 lg:order-4 lg:col-span-4 lg:h-auto"
				src="/assets/poster2.png"
				alt="Poster 2"
			/>
		</section>
	);
};

export default HomePage;





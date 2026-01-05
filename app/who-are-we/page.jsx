import { Great_Vibes, Oswald, Montserrat } from 'next/font/google';
import Image from 'next/image';

export const metadata = { title: "Who Are We | Amor + Chai" };

const greatVibes = Great_Vibes({
	weight: '400',
	subsets: ['latin'],
	variable: '--font-great-vibes',
});

const oswald = Oswald({
	subsets: ['latin'],
	variable: '--font-oswald',
});

const montserrat = Montserrat({
	subsets: ['latin'],
	variable: '--font-montserrat',
});

const WhoAreWePage = () => {
	return (
		<main className={`${oswald.variable} ${montserrat.variable} ${greatVibes.variable} w-full text-[var(--theme-text)]`} style={{ backgroundColor: 'var(--theme-secondary)' }}>
			
			{/* Hero / Header Section */}
			<section className="relative px-6 pt-16 pb-12 md:pb-20 lg:px-12 overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--theme-tertiary), var(--theme-secondary))' }}>
				<div className="mx-auto max-w-7xl relative">
					{/* Decorative AMOR - Top Left */}
					<h1 className="font-oswald text-[12vw] leading-[0.8] font-bold select-none absolute top-0 left-0 -translate-y-1/2 -translate-x-4 z-0 opacity-10" style={{ color: 'var(--theme-primary2)' }}>
						AMOR
					</h1>
					
					{/* Decorative CHAI - Bottom Right */}
					<h1 className="font-oswald text-[12vw] leading-[0.8] font-bold select-none absolute bottom-0 right-4 translate-y-1/2 translate-x-0 z-0 opacity-10 text-right" style={{ color: 'var(--theme-primary2)' }}>
						CHAI
					</h1>
					
					<div className="relative z-10 mt-12 md:mt-20">
						<h2 className="font-oswald text-4xl md:text-6xl lg:text-7xl uppercase font-black tracking-tight leading-none mb-6" style={{ color: 'var(--theme-text)' }}>
							IT ALL STARTS WITH <br /> THE PERFECT CUP
						</h2>
						<p className="font-montserrat text-base md:text-lg font-medium leading-relaxed max-w-2xl border-l-4 pl-6" style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-text)' }}>
							AMOR + CHAI began as a simple idea between college students who shared a love for bold flavors, warm spices, and meaningful moments. 
							What started as brewing chai for friends between classes quickly turned into something bigger.
						</p>
					</div>
				</div>
			</section>

			{/* The Ritual - High Contrast Section */}
			<section className="py-16 px-6 lg:px-12 text-white" style={{ backgroundColor: '#18181b' }}>
				<div className="mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12">
					<div className="lg:w-[60%] flex flex-col md:flex-row items-center md:items-start gap-8">
						{/* Founder Image */}
						<div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
							<Image
								src="/assets/owner.jpg"
								alt="Tsunami - Founder"
								fill
								className="rounded-full object-cover border-4 border-zinc-700 shadow-2xl"
								sizes="(max-width: 768px) 192px, 224px"
							/>
							{/* Decorative circle element */}
							<div className="absolute inset-0 rounded-full border border-amber-500/30 scale-110"></div>
						</div>

						{/* Founder Text */}
						<div className="text-center md:text-left">
							<span className="font-oswald uppercase tracking-widest text-sm font-bold mb-2 block" style={{ color: 'var(--theme-primary)' }}>The Founder</span>
							<h3 className="font-oswald text-5xl md:text-6xl font-bold mb-5">TSUNAMI</h3>
							<p className="font-montserrat text-gray-400 text-base md:text-lg leading-relaxed mb-6">
								As a pre-med student working toward becoming a physician, I’ve learned that healing isn’t only found in clinics and hospitals, but also in the small, human moments we share.
							</p>
						</div>
					</div>
					<div className="lg:w-[40%] relative p-8 md:p-10 rounded-sm border border-zinc-700 transform md:-rotate-1 hover:rotate-0 transition-transform duration-500 ease-out" style={{ backgroundColor: '#27272a' }}>
						<div className="absolute -top-4 -left-4 text-6xl font-serif opacity-50" style={{ color: 'var(--theme-primary)' }}>"</div>
						<blockquote className="font-oswald text-xl md:text-2xl uppercase leading-normal tracking-wide">
							For me, chai is more than a drink—it’s a ritual, a reminder of culture, and a form of care.
						</blockquote>
						<div className="mt-6 flex items-center gap-3">
							<div className="h-[2px] w-12" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
							<span className="font-montserrat font-bold text-xs tracking-wider uppercase" style={{ color: 'var(--theme-primary)' }}>Founder of AMOR + CHAI</span>
						</div>
					</div>
				</div>
			</section>

			{/* The Vision / Origin Section */}
			<section className="py-16 px-6 lg:px-12" style={{ backgroundColor: 'var(--theme-card)' }}>
				<div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					<div className="order-2 md:order-1 space-y-8">
						<div>
							<h4 className="font-oswald text-3xl font-bold uppercase mb-3" style={{ color: 'var(--theme-text)' }}>From Campus to Community</h4>
							<p className="font-montserrat text-base md:text-lg leading-relaxed" style={{ color: 'var(--theme-text-light)' }}>
								Hand-blended chai made with care, shared at campus events, pop-ups, and vendor markets. Every cup became a way to slow down, connect, and bring a little comfort into busy lives.
							</p>
						</div>
						<div>
							<h4 className="font-oswald text-3xl font-bold uppercase mb-3" style={{ color: 'var(--theme-text)' }}>Growing Our Dreams</h4>
							<p className="font-montserrat text-base md:text-lg leading-relaxed" style={{ color: 'var(--theme-text-light)' }}>
								We’re excited to expand beyond campus, explore new flavors, and build something lasting—alongside our careers and passions. This business is rooted in love, learning, and growth, and we’re just getting started.
							</p>
						</div>
						
						<div className="pt-6">
							<div className={`text-4xl md:text-5xl ${greatVibes.className}`} style={{ color: 'var(--theme-primary2)' }}>
								With Love,<br />
								<span className="ml-8">Tsunami</span>
							</div>
						</div>
					</div>

					{/* Decorative Logic - Placeholder for where an image could go in the future */}
					<div className="order-1 md:order-2 relative h-full min-h-[350px] flex items-center justify-center p-8 rounded-full md:rounded-l-full md:rounded-r-none" style={{ backgroundColor: 'var(--theme-secondary)', opacity: 0.3 }}>
						<div className="text-center font-oswald space-y-2 transform rotate-12 select-none" style={{ color: 'var(--theme-primary)' }}>
							<span className="block text-8xl font-black">AMOR</span>
							<span className="block text-8xl font-black">+</span>
							<span className="block text-8xl font-black">CHAI</span>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default WhoAreWePage;




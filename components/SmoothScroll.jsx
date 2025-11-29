'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = () => {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 0.5,
			easing: (t) => 1 - Math.pow(1 - t, 3),
			smoothWheel: true,
			wheelMultiplier: 2.0,
			smoothTouch: true,
			touchMultiplier: 1.3,
		});

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		const id = requestAnimationFrame(raf);
		return () => {
			cancelAnimationFrame(id);
			lenis.destroy();
		};
	}, []);

	return null;
};

export default SmoothScroll;



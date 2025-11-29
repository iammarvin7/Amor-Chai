'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { useCart } from './CartContext';

const CursorGlow = () => {
	const dotRef = useRef(null);
	const { theme } = useTheme();
	const { isOpen: isCartOpen } = useCart();

	useEffect(() => {
		const el = dotRef.current;
		if (!el || isCartOpen) return;
		let rafId = 0;
		let targetX = 0;
		let targetY = 0;
		let x = 0;
		let y = 0;

		const onMove = (e) => {
			targetX = e.clientX;
			targetY = e.clientY;
		};

		const loop = () => {
			x += (targetX - x) * 0.15;
			y += (targetY - y) * 0.15;
			el.style.transform = `translate3d(${x - 150}px, ${y - 150}px, 0)`;
			rafId = requestAnimationFrame(loop);
		};

		window.addEventListener('pointermove', onMove, { passive: true });
		rafId = requestAnimationFrame(loop);
		return () => {
			window.removeEventListener('pointermove', onMove);
			cancelAnimationFrame(rafId);
		};
	}, [isCartOpen]);

	// Convert hex colors to rgba for the gradient
	const hexToRgba = (hex, alpha) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	if (isCartOpen) return null;

	return (
		<div
			ref={dotRef}
			className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-[300px] w-[300px] rounded-full opacity-40 blur-3xl md:block"
			style={{
				background: `radial-gradient(120px 120px at center, ${hexToRgba(theme.colors.primary, 0.45)}, ${hexToRgba(theme.colors.secondary, 0.25)} 40%, rgba(255,255,255,0) 70%)`,
			}}
		/>
	);
};

export default CursorGlow;





'use client';
import { useEffect, useRef } from 'react';

/**
 * A lightweight 3D-feel tilt image that subtly rotates and translates
 * toward the cursor and recenters on leave.
 */
const HeroTiltImage = ({ src, alt = 'Image', className = '' }) => {
	const wrapperRef = useRef(null);
	const imgRef = useRef(null);
	const rafRef = useRef(0);

	useEffect(() => {
		const box = wrapperRef.current;
		const img = imgRef.current;
		if (!box || !img) return;

		let target = { rx: 0, ry: 0, tx: 0, ty: 0 };
		let state = { rx: 0, ry: 0, tx: 0, ty: 0 };

		const onMove = (e) => {
			const rect = box.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5..0.5
			const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5..0.5
			target.ry = x * 10;   // yaw
			target.rx = -y * 8;   // pitch
			target.tx = x * 16;   // translate X
			target.ty = y * 12;   // translate Y
		};

		const onLeave = () => {
			target = { rx: 0, ry: 0, tx: 0, ty: 0 };
		};

		const loop = () => {
			state.rx += (target.rx - state.rx) * 0.12;
			state.ry += (target.ry - state.ry) * 0.12;
			state.tx += (target.tx - state.tx) * 0.12;
			state.ty += (target.ty - state.ty) * 0.12;
			img.style.transform = `translate3d(${state.tx}px, ${state.ty}px, 0) rotateX(${state.rx}deg) rotateY(${state.ry}deg)`;
			rafRef.current = requestAnimationFrame(loop);
		};
		rafRef.current = requestAnimationFrame(loop);

		box.addEventListener('pointermove', onMove, { passive: true });
		box.addEventListener('pointerleave', onLeave);
		return () => {
			cancelAnimationFrame(rafRef.current);
			box.removeEventListener('pointermove', onMove);
			box.removeEventListener('pointerleave', onLeave);
		};
	}, []);

	return (
		<div
			ref={wrapperRef}
			className={`relative select-none will-change-transform ${className}`}
			style={{ perspective: '1000px' }}
		>
			<img
				ref={imgRef}
				src={src}
				alt={alt}
				className="h-full w-full rounded-3xl border border-white/60 bg-white/60 object-cover shadow-md backdrop-blur"
				suppressHydrationWarning
			/>
		</div>
	);
};

export default HeroTiltImage;



'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

/**
 * Pixel-grid hover glow:
 * - Renders a fixed 10px grid.
 * - Cells near the cursor "light up" with a pink glow and decay over time.
 * - No trailing particle line; spacing is uniform, like hovering a pixelated image.
 */
const PinkPixelsCanvas = () => {
	const canvasRef = useRef(null);
	const rafRef = useRef(0);
	const colorsRef = useRef({ base: '#ff647e', hi: '#f88c97' });
	const { theme } = useTheme();

	// Update colors ref when theme changes
	useEffect(() => {
		colorsRef.current = {
			base: theme.colors.primary2,
			hi: theme.colors.primary,
		};
	}, [theme]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');

		// Sizing / DPR
		let width = 0;
		let height = 0;
		const CELL = 10;            // 10px cells as requested
		const DECAY = 0.9;          // glow fade
		const BOOST = 0.9;          // glow strength per frame at cursor (single cell)
		let dpr = Math.min(2, window.devicePixelRatio || 1);

		let cols = 0;
		let rows = 0;
		let heat = new Float32Array(1);

		const resize = () => {
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			canvas.width = Math.max(1, Math.floor(width * dpr));
			canvas.height = Math.max(1, Math.floor(height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			cols = Math.max(1, Math.ceil(width / CELL));
			rows = Math.max(1, Math.ceil(height / CELL));
			heat = new Float32Array(rows * cols);
		};
		resize();

		// Cursor state
		const cursor = { x: -9999, y: -9999, active: false };
		const onMove = (e) => {
			const rect = canvas.getBoundingClientRect();
			cursor.x = e.clientX - rect.left;
			cursor.y = e.clientY - rect.top;
			cursor.active = cursor.x >= 0 && cursor.y >= 0 && cursor.x <= width && cursor.y <= height;
		};
		const onLeave = () => {
			cursor.active = false;
		};

		const loop = () => {
			// Decay all cells
			for (let i = 0; i < heat.length; i++) heat[i] *= DECAY;

			// Add glow only to the single cell under the cursor (no neighbors)
			if (cursor.active) {
				const cx = Math.floor(cursor.x / CELL);
				const cy = Math.floor(cursor.y / CELL);
				if (cx >= 0 && cy >= 0 && cx < cols && cy < rows) {
					const idx = cy * cols + cx;
					heat[idx] = Math.min(1, heat[idx] + BOOST);
				}
			}

			// Draw grid cells that have visible heat
			ctx.clearRect(0, 0, width, height);
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const v = heat[y * cols + x];
					if (v < 0.03) continue;
					const px = x * CELL;
					const py = y * CELL;
					// Outer square (glow)
					ctx.globalAlpha = Math.min(1, v * 0.9);
					ctx.fillStyle = colorsRef.current.base;
					ctx.fillRect(px, py, CELL, CELL);
					// Inner highlight to amplify "pixel" feeling
					if (v > 0.25) {
						ctx.globalAlpha = Math.min(1, v * 0.6);
						ctx.fillStyle = colorsRef.current.hi;
						ctx.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
					}
				}
			}
			ctx.globalAlpha = 1;

			rafRef.current = requestAnimationFrame(loop);
		};
		rafRef.current = requestAnimationFrame(loop);

		// Events
		window.addEventListener('pointermove', onMove, { passive: true });
		window.addEventListener('pointerleave', onLeave);
		window.addEventListener('resize', resize);

		return () => {
			cancelAnimationFrame(rafRef.current);
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerleave', onLeave);
			window.removeEventListener('resize', resize);
		};
	}, []);

	return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />;
};

export default PinkPixelsCanvas;



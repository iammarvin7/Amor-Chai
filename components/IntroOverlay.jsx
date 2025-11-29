'use client';
import { useEffect, useRef, useState } from 'react';

const IntroOverlay = ({ text = 'Amor + Chai', targetSelector = '#landing-title', onDone }) => {
	// Use a mounted state to ensure we only check sessionStorage on the client
	// This prevents hydration mismatches between server and client
	const [mounted, setMounted] = useState(false);
	const [show, setShow] = useState(true); // Start with true, will be updated in useEffect
	const [displayText, setDisplayText] = useState('');
	const containerRef = useRef(null);
	const textRef = useRef(null);

	// Check sessionStorage only after component mounts on the client
	useEffect(() => {
		setMounted(true);
		try {
			const alreadyShown = sessionStorage.getItem('amorchai_intro_shown') === '1';
			if (alreadyShown) {
				setShow(false);
				if (typeof onDone === 'function') onDone();
			}
		} catch {
			// If sessionStorage is unavailable, keep show as true
		}
	}, [onDone]);

	useEffect(() => {
		// Wait for component to mount before running animation
		if (!mounted) return;
		
		// If intro was already shown this session, immediately signal done and skip.
		if (!show) {
			if (typeof onDone === 'function') onDone();
			return;
		}

		let cancelled = false;

		const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

		const type = async (word, speed = 140) => {
			for (let i = 1; i <= word.length; i++) {
				if (cancelled) return;
				setDisplayText(word.slice(0, i));
				await sleep(speed);
			}
		};

		const erase = async (speed = 90) => {
			let current = displayText;
			while (current.length && !cancelled) {
				current = current.slice(0, -1);
				setDisplayText(current);
				await sleep(speed);
			}
		};

		const eraseTo = async (keepCount = 0, speed = 90, initial) => {
			let current = typeof initial === 'string' ? initial : displayText;
			while (current.length > keepCount && !cancelled) {
				current = current.slice(0, -1);
				setDisplayText(current);
				await sleep(speed);
			}
		};

		const typeAppend = async (suffix, speed = 140) => {
			let acc = '';
			for (let i = 0; i < suffix.length; i++) {
				if (cancelled) return;
				acc += suffix[i];
				setDisplayText((prev) => prev + suffix[i]);
				await sleep(speed);
			}
		};

		const morphToTarget = async () => {
			const target = document.querySelector(targetSelector);
			const el = textRef.current;
			const container = containerRef.current;
			if (!target || !el || !container) return finish();

			// Ensure target is not visually present to avoid duplicate during morph
			// Parent should reveal it after onDone

			// Measure rects
			const sourceRect = el.getBoundingClientRect();
			const targetRect = target.getBoundingClientRect();
			const sourceCenterX = sourceRect.left + sourceRect.width / 2;
			const sourceCenterY = sourceRect.top + sourceRect.height / 2;
			const targetCenterX = targetRect.left + targetRect.width / 2;
			const targetCenterY = targetRect.top + targetRect.height / 2;

			const dx = targetCenterX - sourceCenterX;
			const dy = targetCenterY - sourceCenterY;
			const scaleX = targetRect.width / Math.max(1, sourceRect.width);
			const scaleY = targetRect.height / Math.max(1, sourceRect.height);

			// Prepare styles
			el.style.willChange = 'transform';
			el.style.transformOrigin = 'center center';

			// Animate text movement and scale
			const textAnim = el.animate(
				[
					{ transform: 'translate3d(0,0,0) scale(1, 1)' },
					{ transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scaleX}, ${scaleY})` },
				],
				{ duration: 800, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
			);

			// Fade the white backdrop while morphing
			const bgAnim = container.animate(
				[{ backgroundColor: 'rgba(255,255,255,0.9)' }, { backgroundColor: 'rgba(255,255,255,0)' }],
				{ duration: 800, easing: 'linear', fill: 'forwards' }
			);

			await Promise.allSettled([textAnim.finished, bgAnim.finished]);
			finish();
		};

		const finish = () => {
			if (cancelled) return;
			setShow(false);
			try {
				sessionStorage.setItem('amorchai_intro_shown', '1');
			} catch {}
			if (typeof onDone === 'function') onDone();
		};

		const run = async () => {
			// AMAZING CHAI -> erase back to "AM" -> append "OR + CHAI" -> morph
			const first = 'AMAZING CHAI';
			await sleep(80);
			await type(first, 160);
			await sleep(650);
			await eraseTo(2, 110, first); // keep "AM"
			await sleep(240);
			await typeAppend('OR + CHAI', 160);
			await sleep(500);
			await morphToTarget();
		};

		run();
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mounted, show]);

	// Don't render until mounted to prevent hydration mismatch
	if (!mounted || !show) return null;

	return (
		<div ref={containerRef} className="pointer-events-none fixed inset-0 z-[80] grid place-items-center bg-white/90 backdrop-blur-sm">
			<h1 ref={textRef} className="select-none text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
				{displayText}
			</h1>
		</div>
	);
};

export default IntroOverlay;




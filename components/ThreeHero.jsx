'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeHero = () => {
	const containerRef = useRef(null);
	const rendererRef = useRef(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const scene = new THREE.Scene();
		scene.background = null;

		const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
		camera.position.set(0, 0, 5);

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.shadowMap.enabled = true;
		container.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		// Lights
		scene.add(new THREE.AmbientLight(0xffffff, 0.7));
		const dir = new THREE.DirectionalLight(0xffffff, 1.2);
		dir.position.set(3, 3, 3);
		dir.castShadow = true;
		scene.add(dir);

		// Objects
		const glass = new THREE.MeshPhysicalMaterial({
			color: new THREE.Color('#ffffff'),
			metalness: 0.8,
			roughness: 0.15,
			reflectivity: 1.0,
			thickness: 0.6,
			transmission: 0.6,
			ior: 1.2,
			clearcoat: 1,
			clearcoatRoughness: 0.1,
		});
		const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 0), glass);
		ico.castShadow = true;
		ico.receiveShadow = true;
		scene.add(ico);

		const ringMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#ff7a93'), metalness: 0.6, roughness: 0.2 });
		const ring = new THREE.Mesh(new THREE.TorusKnotGeometry(1.6, 0.04, 256, 64, 2, 3), ringMat);
		ring.position.z = -0.3;
		scene.add(ring);

		// Follow cursor
		const target = { rx: 0, ry: 0 };
		const state = { rx: 0, ry: 0 };
		const onMove = (e) => {
			const rect = renderer.domElement.getBoundingClientRect();
			const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
			const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
			target.ry = dx * 0.9;
			target.rx = -dy * 0.7;
		};
		window.addEventListener('pointermove', onMove, { passive: true });

		let stop = false;
		const clock = new THREE.Clock();
		const animate = () => {
			if (stop) return;
			const dt = clock.getDelta();
			state.rx += (target.rx - state.rx) * 0.08;
			state.ry += (target.ry - state.ry) * 0.08;
			ico.rotation.x = state.rx;
			ico.rotation.y = state.ry;
			ring.rotation.z += dt * 0.4;
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		};
		animate();

		const onResize = () => {
			if (!rendererRef.current) return;
			const w = container.clientWidth;
			const h = Math.max(1, container.clientHeight);
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		};
		window.addEventListener('resize', onResize);

		return () => {
			stop = true;
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('resize', onResize);
			if (rendererRef.current) {
				container.removeChild(rendererRef.current.domElement);
				rendererRef.current.dispose();
				rendererRef.current = null;
			}
			// Dispose geometries/materials
			ico.geometry.dispose();
			glass.dispose();
			ring.geometry.dispose();
			ringMat.dispose();
		};
	}, []);

	return (
		<section className="relative mx-auto flex min-h-[90vh] w-full items-center justify-center overflow-hidden">
			<div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />
			<div ref={containerRef} className="absolute inset-0" />
		</section>
	);
};

export default ThreeHero;



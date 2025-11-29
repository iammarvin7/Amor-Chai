'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const Analytics = ({ measurementId }) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (!measurementId) return;
		const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
		if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
			window.gtag('config', measurementId, {
				page_path: url,
			});
		}
	}, [pathname, searchParams, measurementId]);

	return null;
};

export default Analytics;



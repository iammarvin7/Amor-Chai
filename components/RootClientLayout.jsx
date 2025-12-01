'use client';

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';
import Footer from './Footer';
import SmoothScroll from './SmoothScroll';
import CursorGlow from './CursorGlow';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './ToastContext';
import { ProductLikesProvider } from './ProductLikesContext';
import { ThemeProvider } from './ThemeContext';
import CartDrawer from './CartDrawer';
import ThemeSwitcher from './ThemeSwitcher';
import Script from 'next/script';
import Analytics from './Analytics';
import PageContentWrapper from './PageContentWrapper';
import AuthModal from './AuthModal';

export default function RootClientLayout({ children }) {
	const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-1MB25XJPRV';
	const pathname = usePathname();
	const isDistractionFree = ['/checkout', '/return'].includes(pathname);

	return (
        <>
            {/* GA4 */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
                `}
            </Script>
            <Analytics measurementId={GA_MEASUREMENT_ID} />
            <ThemeProvider>
                <SmoothScroll />
                <ThemeSwitcher />
                <ToastProvider>
                    <AuthProvider>
                        <ProductLikesProvider>
                            <CartProvider>
                                <CursorGlow />
                                <AuthModal />
                                {!isDistractionFree && <CartDrawer />}
                                <PageContentWrapper>
                                    <div className="flex min-h-screen flex-col">
                                        {!isDistractionFree && <NavBar />}
                                        <main className="flex-1">{children}</main>
                                        {!isDistractionFree && <Footer />}
                                    </div>
                                </PageContentWrapper>
                            </CartProvider>
                        </ProductLikesProvider>
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </>
	);
}

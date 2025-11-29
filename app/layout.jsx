import './globals.css';
import RootClientLayout from '../components/RootClientLayout';

/**
 * This is the root server-side layout for the application.
 *
 * It is a server component, which allows it to export metadata that is
 * applied to the document head, including the site title, description, and favicon.
 *
 * It renders the RootClientLayout, which contains all the client-side
 * providers and logic that require hooks like `usePathname`.
 */

// Export metadata to be applied to the <head> of the document
export const metadata = {
	title: "Amor + Chai",
	description: "Crafting the Chai Experience",
	icons: { 
        icon: '/favicon.png' 
    },
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning className="min-h-screen bg-fixed text-black antialiased" style={{
				background: 'var(--theme-gradient)'
			}}>
                <RootClientLayout>
                    {children}
                </RootClientLayout>
			</body>
		</html>
	);
}
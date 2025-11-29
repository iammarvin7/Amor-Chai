'use client';
import { useTheme } from './ThemeContext';
import { useState } from 'react';

const ThemeSwitcher = () => {
	const { currentThemeName, setTheme, theme } = useTheme();
	const [isHovered, setIsHovered] = useState(false);

	const toggleTheme = () => {
		// Cycle through: pink → purple → chai → orange → matcha → pink
		const themeOrder = ['pink', 'purple', 'chai', 'orange', 'matcha'];
		const currentIndex = themeOrder.indexOf(currentThemeName);
		const nextIndex = (currentIndex + 1) % themeOrder.length;
		setTheme(themeOrder[nextIndex]);
	};

	return (
		<button
			onClick={toggleTheme}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="fixed bottom-6 left-6 z-50 flex items-center justify-center overflow-hidden bg-white/90 backdrop-blur-md transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2"
			style={{
				// Circular when idle (44px), pill when hovered (expands to fit content)
				width: isHovered ? '88px' : '44px',
				height: '44px',
				paddingLeft: isHovered ? '16px' : '0',
				paddingRight: isHovered ? '16px' : '0',
				borderRadius: '9999px',
				// Scale and glow on hover
				transform: isHovered ? 'scale(1.07)' : 'scale(1)',
				border: `1.5px solid ${theme.colors.primary2}30`,
				boxShadow: isHovered 
					? `0 4px 20px ${theme.colors.primary2}30, 0 2px 8px ${theme.colors.primary2}20`
					: `0 0 0 1px ${theme.colors.primary2}20`,
			}}
			aria-label="Change theme"
		>
			{/* Icon - always visible, centered when circular */}
			<svg
				className="h-5 w-5 flex-shrink-0 transition-transform duration-500"
				style={{
					transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
					color: theme.colors.primary2,
					position: isHovered ? 'static' : 'absolute',
				}}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
				/>
			</svg>
			
			{/* "Theme" text - only visible on hover */}
			<span
				className="text-xs font-medium whitespace-nowrap transition-all duration-500"
				style={{
					color: theme.colors.primary2,
					opacity: isHovered ? 1 : 0,
					width: isHovered ? 'auto' : '0',
					marginLeft: isHovered ? '8px' : '0',
					pointerEvents: 'none',
				}}
			>
				Theme
			</span>
		</button>
	);
};

export default ThemeSwitcher;


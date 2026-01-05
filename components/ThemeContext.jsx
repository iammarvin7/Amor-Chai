'use client';
import { createContext, useContext, useEffect, useState } from 'react';

// Pink Theme - Soft, pastel, creamy pink gradient
export const pinkTheme = {
	name: 'Pink',
	colors: {
		// Primary colors
		primary: '#f88c97',      // brand-pink (main accent)
		primary2: '#ff647e',     // brand-pink2 (darker accent)
		secondary: '#ffe0b2',    // brand-peach (lighter complement)
		tertiary: '#f7e8ba',     // brand-cream (lightest complement)
		// Extended palette
		text: '#1f2937',         // dark gray for text
		textLight: '#6b7280',    // medium gray for secondary text
		button: '#ff647e',       // button background
		buttonHover: '#f88c97',  // button hover state
		buttonText: '#ffffff',   // button text
		border: '#ff647e',       // border color
		borderLight: '#ffe0b2',  // light border
		badge: '#f7e8ba',        // badge background
		badgeText: '#1f2937',    // badge text
		icon: '#ff647e',         // icon color
		card: '#ffffff',         // card background
		cardBorder: '#ffe0b2',   // card border
	},
	gradient: {
		// Simple 3-stop gradient for pink theme
		value: 'linear-gradient(to bottom right, #f7e8ba, #ffe0b2, #f88c97)',
		// Keep individual stops for reference
		from: '#f7e8ba',         // cream (lightest)
		via: '#ffe0b2',          // peach (middle)
		to: '#f88c97',           // pink (darkest)
	},
	glow: {
		shadow: '0 0 15px 7px rgba(255, 195, 216, 0.8), 0 0 8px 1px rgba(255, 255, 255, 1)',
		shadowHover: '0 8px 25px 5px rgb(250, 149, 182), 0 0 15px 3px rgb(241, 194, 147)',
	},
};

// Purple Theme - Multi-stop gradient with soft pastel palette
export const purpleTheme = {
	name: 'Purple',
	colors: {
		// Primary colors
		primary: '#B39CFF',      // middle purple (main accent)
		primary2: '#8C6CFF',     // deeper purple/violet (darker accent)
		secondary: '#D4C5FF',    // very light purple (lighter complement)
		tertiary: '#E3D4FF',     // light lavender (lightest complement)
		// Extended palette
		text: '#1f2937',         // dark gray for text
		textLight: '#6b7280',    // medium gray for secondary text
		button: '#8C6CFF',       // button background (violet)
		buttonHover: '#B39CFF',  // button hover state
		buttonText: '#ffffff',   // button text
		border: '#8C6CFF',       // border color (violet)
		borderLight: '#D4C5FF',  // light border (very light purple)
		badge: '#E3D4FF',        // badge background (light lavender)
		badgeText: '#1f2937',    // badge text
		icon: '#8C6CFF',         // icon color (violet)
		card: '#ffffff',         // card background
		cardBorder: '#D4C5FF',   // card border (very light purple)
	},
	gradient: {
		// Soft 3-stop gradient (light lavender -> soft violet)
		value: 'linear-gradient(to bottom right, #E3D4FF, #D4C5FF, #B39CFF)',
		// Keep individual stops for reference
		from: '#E3D4FF',
		via: '#D4C5FF',
		to: '#B39CFF',
	},
	glow: {
		shadow: '0 0 15px 7px rgba(140, 108, 255, 0.6), 0 0 8px 1px rgba(255, 255, 255, 0.8)',
		shadowHover: '0 8px 25px 5px rgba(140, 108, 255, 0.5), 0 0 15px 3px rgba(212, 197, 255, 0.6)',
	},
};

// Chai Theme - Warm, spicy, creamy caramel gradient
export const chaiTheme = {
	name: 'Chai',
	colors: {
		// Primary colors
		primary: '#DF8142',      // warm orange (main accent)
		primary2: '#92664A',     // medium brown (darker accent)
		secondary: '#EEB38C',    // light cream (lighter complement)
		tertiary: '#F5D5B8',     // very light cream (lightest complement)
		// Extended palette
		text: '#1f2937',         // dark gray for text
		textLight: '#6b7280',     // medium gray for secondary text
		button: '#92664A',       // button background (medium brown)
		buttonHover: '#DF8142',  // button hover state (warm orange)
		buttonText: '#ffffff',   // button text
		border: '#92664A',       // border color (medium brown)
		borderLight: '#EEB38C',  // light border (light cream)
		badge: '#F5D5B8',        // badge background (very light cream)
		badgeText: '#5A270F',    // badge text (dark brown)
		icon: '#92664A',         // icon color (medium brown)
		card: '#ffffff',         // card background
		cardBorder: '#EEB38C',  // card border (light cream)
	},
	gradient: {
		// Soft 3-stop gradient (creamy caramel)
		value: 'linear-gradient(to bottom right, #F5D5B8, #EEB38C, #DF8142)',
		// Keep individual stops for reference
		from: '#F5D5B8',
		via: '#EEB38C',
		to: '#DF8142',
	},
	glow: {
		shadow: '0 0 15px 7px rgba(146, 102, 74, 0.6), 0 0 8px 1px rgba(255, 255, 255, 0.8)',
		shadowHover: '0 8px 25px 5px rgba(223, 129, 66, 0.5), 0 0 15px 3px rgba(238, 179, 140, 0.6)',
	},
};

// Orange Theme - Bright, vibrant, sunny orange gradient
export const orangeTheme = {
	name: 'Orange',
	colors: {
		// Primary colors
		primary: '#F97432',      // Crayola's Orange (main accent)
		primary2: '#FF7000',     // Philippine Orange (darker accent)
		secondary: '#FFAC4A',    // Pastel Orange (lighter complement)
		tertiary: '#FFE9C9',     // Blanched Almond (lightest complement)
		// Extended palette
		text: '#1f2937',         // dark gray for text
		textLight: '#6b7280',    // medium gray for secondary text
		button: '#F97432',       // button background
		buttonHover: '#FFAC4A',  // button hover state
		buttonText: '#ffffff',   // button text
		border: '#F97432',       // border color
		borderLight: '#FFAC4A',  // light border
		badge: '#FFE9C9',        // badge background
		badgeText: '#1f2937',    // badge text
		icon: '#F97432',         // icon color
		card: '#ffffff',         // card background
		cardBorder: '#FFAC4A',   // card border
	},
	gradient: {
		// Soft 3-stop gradient (pastel orange)
		value: 'linear-gradient(to bottom right, #FFE9C9, #FFAC4A, #F97432)',
		// Keep individual stops for reference
		from: '#FFE9C9',
		via: '#FFAC4A',
		to: '#F97432',
	},
	glow: {
		shadow: '0 0 15px 7px rgba(249, 116, 50, 0.6), 0 0 8px 1px rgba(255, 255, 255, 0.8)',
		shadowHover: '0 8px 25px 5px rgba(255, 112, 0, 0.5), 0 0 15px 3px rgba(255, 172, 74, 0.6)',
	},
};

// Matcha Theme - Earthy, green, natural gradient
export const matchaTheme = {
	name: 'Matcha',
	colors: {
		// Primary colors
		primary: '#75975e',      // Darkest Green
		primary2: '#5A7D45',     // Even Darker Green
		secondary: '#a3c585',    // Mid Green
		tertiary: '#ddead1',     // Lightest Green
		// Extended palette
		text: '#1f2937',         // dark gray for text
		textLight: '#6b7280',    // medium gray for secondary text
		button: '#75975e',       // button background
		buttonHover: '#a3c585',  // button hover state
		buttonText: '#ffffff',   // button text
		border: '#75975e',       // border color
		borderLight: '#ddead1',  // light border
		badge: '#ddead1',        // badge background
		badgeText: '#1f2937',    // badge text
		icon: '#75975e',         // icon color
		card: '#ffffff',         // card background
		cardBorder: '#a3c585',   // card border
	},
	gradient: {
		// Linear gradient from top-left to bottom-right, smooth transition
		value: 'linear-gradient(to bottom right, #ddead1, #a3c585, #75975e)',
		// Keep individual stops for reference
		from: '#ddead1',
		via: '#a3c585',
		to: '#75975e',
	},
	glow: {
		shadow: '0 0 15px 7px rgba(117, 151, 94, 0.6), 0 0 8px 1px rgba(255, 255, 255, 0.8)',
		shadowHover: '0 8px 25px 5px rgba(163, 197, 133, 0.5), 0 0 15px 3px rgba(221, 234, 209, 0.6)',
	},
};

// Theme definitions object
export const themes = {
	pink: pinkTheme,
	purple: purpleTheme,
	chai: chaiTheme,
	orange: orangeTheme,
	matcha: matchaTheme,
};

const ThemeContext = createContext({
	theme: themes.pink,
	setTheme: () => {},
	currentThemeName: 'pink',
});

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

export const ThemeProvider = ({ children }) => {
	const [currentThemeName, setCurrentThemeName] = useState('pink');
	const [mounted, setMounted] = useState(false);

	// Initialize theme from localStorage on mount (client-side only)
	useEffect(() => {
		setMounted(true);
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme && themes[savedTheme]) {
			setCurrentThemeName(savedTheme);
		}
	}, []);

	// Apply theme to CSS variables and document
	useEffect(() => {
		if (!mounted) return;
		
		const theme = themes[currentThemeName];
		const root = document.documentElement;

		// Set primary color CSS variables
		root.style.setProperty('--theme-primary', theme.colors.primary);
		root.style.setProperty('--theme-primary2', theme.colors.primary2);
		root.style.setProperty('--theme-secondary', theme.colors.secondary);
		root.style.setProperty('--theme-tertiary', theme.colors.tertiary);
		
		// Set gradient CSS variables
		// All themes now use gradient.value for consistency
		root.style.setProperty('--theme-gradient', theme.gradient.value);
		
		// Keep individual stops for backward compatibility
		root.style.setProperty('--theme-gradient-from', theme.gradient.from);
		if (theme.gradient.via) {
			root.style.setProperty('--theme-gradient-via', theme.gradient.via);
		}
		root.style.setProperty('--theme-gradient-to', theme.gradient.to);
		
		// Set extended palette CSS variables
		root.style.setProperty('--theme-text', theme.colors.text);
		root.style.setProperty('--theme-text-light', theme.colors.textLight);
		root.style.setProperty('--theme-button', theme.colors.button);
		root.style.setProperty('--theme-button-hover', theme.colors.buttonHover);
		root.style.setProperty('--theme-button-text', theme.colors.buttonText);
		root.style.setProperty('--theme-border', theme.colors.border);
		root.style.setProperty('--theme-border-light', theme.colors.borderLight);
		root.style.setProperty('--theme-badge', theme.colors.badge);
		root.style.setProperty('--theme-badge-text', theme.colors.badgeText);
		root.style.setProperty('--theme-icon', theme.colors.icon);
		root.style.setProperty('--theme-card', theme.colors.card);
		root.style.setProperty('--theme-card-border', theme.colors.cardBorder);
		
		// Set glow CSS variables
		root.style.setProperty('--theme-glow-shadow', theme.glow.shadow);
		root.style.setProperty('--theme-glow-shadow-hover', theme.glow.shadowHover);

		// Save to localStorage
		localStorage.setItem('theme', currentThemeName);
	}, [currentThemeName, mounted]);

	const setTheme = (themeName) => {
		if (themes[themeName]) {
			setCurrentThemeName(themeName);
		}
	};

	const value = {
		theme: themes[currentThemeName],
		setTheme,
		currentThemeName,
	};

	// Prevent hydration mismatch by not rendering theme-dependent content until mounted
	if (!mounted) {
		return <>{children}</>;
	}

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx,mdx}",
		"./components/**/*.{js,jsx,ts,tsx,mdx}",
		"./pages/**/*.{js,jsx,ts,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					pink: "var(--theme-primary)",
					pink2: "var(--theme-primary2)",
					peach: "var(--theme-secondary)",
					cream: "var(--theme-tertiary)",
				},
				matcha: {
					lightest: '#ddead1',
					mid: '#a3c585',
					darkest: '#75975e',
				},
			},
			boxShadow: {
				glow: "var(--theme-glow-shadow)",
				glowHover: "var(--theme-glow-shadow-hover)",
			},
		},
	},
	plugins: [],
};





const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer className="mt-auto w-full">
			<div className="mx-auto max-w-7xl px-4 py-3 text-center text-sm tracking-wide text-black/80 md:text-base">
				&copy; {year}, Amor + Chai | Made with <span aria-hidden="true">❤</span>
			</div>
		</footer>
	);
};

export default Footer;





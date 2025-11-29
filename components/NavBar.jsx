"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { ReloadAlert } from "./ReloadAlert";
import AuthButtons from "./AuthButtons";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const instagramUrl = "https://www.instagram.com/drinkamorchai/";
  const { items, toggle } = useCart();
  const { user, signOutSuccessMessage, showReloadAlert, clearSignOutMessage, dismissReloadAlert } = useAuth();
  const { showToast } = useToast();
  const loggedIn = !!user;
  const userName = user?.user_metadata?.first_name || "";

  // Show toast when sign-out succeeds
  useEffect(() => {
    if (signOutSuccessMessage) {
      showToast(signOutSuccessMessage, 8000); // Show for 8 seconds
      clearSignOutMessage();
    }
  }, [signOutSuccessMessage, showToast, clearSignOutMessage]);

  // Handle reload
  const handleReload = () => {
    window.location.reload();
  };

  const navItem =
    "px-3 py-2 text-sm md:text-base font-semibold text-black hover:text-brand-pink2 transition-colors";

  return (
    <>
      <ReloadAlert
        show={showReloadAlert}
        onReload={handleReload}
        onDismiss={dismissReloadAlert}
      />
      <nav className="sticky top-0 z-50 w-full border-b border-white/60 bg-white/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Left: Logo */}
        <Link href="/" className="shrink-0" aria-label="Amor + Chai Landing">
          <img
            src="/assets/logo.png"
            alt="Amor + Chai logo"
            width={160}
            height={64}
            className="h-14 w-auto transition-transform hover:scale-105 md:h-20"
            suppressHydrationWarning
          />
        </Link>

        {/* Desktop: Nav links + Auth/Cart + Instagram */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/home" className={navItem}>
              HOME
            </Link>
            <Link href="/menu" className={navItem}>
              MENU
            </Link>
            <Link href="/offers" className={navItem}>
              OFFERS
            </Link>
            <Link href="/recipes" className={navItem}>
              RECIPES
            </Link>
            <Link href="/products" className={navItem}>
              PRODUCTS
            </Link>
            <Link href="/who-are-we" className={navItem}>
              WHO ARE WE?
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {loggedIn ? (
              <button
                onClick={toggle}
                className="relative rounded-md border p-2 hover:bg-white/40 transition-colors"
                aria-label="Open cart"
              >
                <svg
                  className="h-6 w-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-pink2 text-xs font-bold text-white">
                  {items.reduce((sum, i) => sum + (i.qty || 1), 0)}
                </span>
              </button>
            ) : (
              <AuthButtons />
            )}
            <a
              className="inline-flex pl-8"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img
                src="/assets/instagram.png"
                alt="Instagram"
                width={36}
                height={36}
                className="mt-1 h-7 w-7 transition-transform hover:scale-110 md:h-8 md:w-8"
                suppressHydrationWarning
              />
            </a>
          </div>
        </div>

        {/* Mobile: Auth/Cart + Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {loggedIn ? (
            <button
              onClick={toggle}
              className="relative p-2 text-gray-800 hover:bg-white/40 rounded-full transition-colors"
              aria-label="Open cart"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink2 text-[10px] font-bold text-white">
                  {items.reduce((sum, i) => sum + (i.qty || 1), 0)}
                </span>
              )}
            </button>
          ) : (
            <AuthButtons />
          )}

          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-brand-pink2"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Floating Menu */}
      {isOpen && (
        <div className="absolute top-16 right-4 w-64 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-4 z-50 border border-gray-100 transform transition-all md:hidden flex flex-col gap-2">
            <Link
              href="/home"
              className={navItem}
              onClick={() => setIsOpen(false)}
            >
              HOME
            </Link>
            <Link
              href="/menu"
              className={navItem}
              onClick={() => setIsOpen(false)}
            >
              MENU
            </Link>
            <Link
              href="/offers"
              className={navItem}
              onClick={() => setIsOpen(false)}
            >
              OFFERS
            </Link>
            <Link
              href="/recipes"
              className={navItem}
              onClick={() => setIsOpen(false)}
            >
              RECIPES
            </Link>
            <Link
              href="/products"
              className={navItem}
              onClick={() => setIsOpen(false)}
            >
              PRODUCTS
            </Link>
            <Link
              href="/who-are-we"
              className={navItem}
              onClick={() => setIsOpen(false)}
            >
              WHO ARE WE?
            </Link>
            <a
              className="px-3 py-2 inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-brand-pink2 transition-colors"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img
                src="/assets/instagram.png"
                alt="Instagram"
                width={24}
                height={24}
                suppressHydrationWarning
              />
              <span>Instagram</span>
            </a>
        </div>
      )}
    </nav>
    </>
  );
};

export default NavBar;

"use client";
import { useEffect, useState } from "react";

const TabButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold ${
      active ? "text-black" : "text-gray-500"
    } rounded-md hover:bg-gray-100`}
  >
    {children}
  </button>
);

const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("login"); // 'login' | 'signup'

  useEffect(() => {
    // Show once per session, on first scroll/wheel
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("amorchai_auth_shown") === "1") return;

    const onTrigger = () => {
      setOpen(true);
      sessionStorage.setItem("amorchai_auth_shown", "1");
      window.removeEventListener("wheel", onTrigger);
      window.removeEventListener("scroll", onTrigger);
      window.removeEventListener("touchmove", onTrigger);
    };
    window.addEventListener("wheel", onTrigger, { passive: true });
    window.addEventListener("scroll", onTrigger, { passive: true });
    window.addEventListener("touchmove", onTrigger, { passive: true });
    return () => {
      window.removeEventListener("wheel", onTrigger);
      window.removeEventListener("scroll", onTrigger);
      window.removeEventListener("touchmove", onTrigger);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/50 bg-white/95 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <TabButton active={tab === "login"} onClick={() => setTab("login")}>
              Login
            </TabButton>
            <TabButton
              active={tab === "signup"}
              onClick={() => setTab("signup")}
            >
              Sign up
            </TabButton>
          </div>
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {tab === "login" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Logged in (demo)");
              setOpen(false);
            }}
            className="flex flex-col gap-3"
          >
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
              placeholder="you@example.com"
            />
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
              placeholder="••••••••"
            />
            <button className="mt-2 rounded-lg bg-brand-pink2 px-4 py-2 font-semibold text-white hover:opacity-90">
              Login
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Signed up (demo)");
              setOpen(false);
            }}
            className="flex flex-col gap-3"
          >
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
              placeholder="Your name"
            />
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
              placeholder="you@example.com"
            />
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
              placeholder="Create a password"
            />
            <button className="mt-2 rounded-lg bg-brand-pink2 px-4 py-2 font-semibold text-white hover:opacity-90">
              Create account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

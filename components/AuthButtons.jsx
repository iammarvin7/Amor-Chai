"use client";
import { useState, useEffect, useRef } from "react";
import supabase from "../lib/supabaseClient";

const AuthButtons = () => {
  const [mode, setMode] = useState(null); // null | 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const modalRef = useRef(null);

  const disabled = !supabase;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Check if click is not on the trigger buttons
        const target = event.target;
        if (!target.closest("button[data-auth-trigger]")) {
          setMode(null);
          setEmail("");
          setPassword("");
          setConfirm("");
          setFirstName("");
          setLastName("");
          setMessage("");
        }
      }
    };

    if (mode) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) {
      setMessage("Supabase not configured.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        try {
          await supabase.from("users").upsert({ email });
          console.log("Saved email to users:", email);
        } catch (e) {
          console.log("Save email error:", e?.message || e);
        }
        setMessage("Logged in!");
        // Close modal after successful login
        setTimeout(() => {
          setMode(null);
          setEmail("");
          setPassword("");
          setConfirm("");
          setFirstName("");
          setLastName("");
          setMessage("");
        }, 1000);
      } else {
        if (password !== confirm) throw new Error("Passwords do not match.");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName, last_name: lastName } },
        });
        if (error) throw error;
        try {
          await supabase.from("users").upsert({
            email,
            first_name: firstName,
            last_name: lastName,
          });
          console.log("Saved email to users:", email);
        } catch (e) {
          console.log("Save email error:", e?.message || e);
        }
        setMessage(
          "Signed up! Check your inbox if email confirmation is required."
        );
        // Close modal after successful signup
        setTimeout(() => {
          setMode(null);
          setEmail("");
          setPassword("");
          setConfirm("");
          setFirstName("");
          setLastName("");
          setMessage("");
        }, 2000);
      }
    } catch (err) {
      setMessage(err.message || "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setMode(null);
    setEmail("");
    setPassword("");
    setConfirm("");
    setFirstName("");
    setLastName("");
    setMessage("");
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          data-auth-trigger
          disabled={disabled}
          onClick={() => setMode("login")}
          className="rounded-full border-2 border-brand-pink2 px-3 py-1.5 text-xs font-semibold text-brand-pink2 transition-all hover:-translate-y-0.5 hover:bg-brand-pink2 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Login
        </button>
        <button
          data-auth-trigger
          disabled={disabled}
          onClick={() => setMode("signup")}
          className="rounded-full bg-brand-pink2 px-3 py-1.5 text-xs font-semibold text-white shadow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sign up
        </button>
      </div>

      {/* Modal overlay */}
      {mode && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6"
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl border border-white/20 bg-white/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl mx-auto my-auto"
          >
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-gray-900 pr-6">
              {mode === "login" ? "Login" : "Sign Up"}
            </h2>

            {mode === "login" && (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 sm:gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-md border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-brand-pink2"
                  required
                />
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="rounded-md border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-brand-pink2"
                  required
                />
                <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto rounded-lg bg-brand-pink2 px-4 py-2 text-sm sm:text-base font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    {loading ? "Please wait..." : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-xs sm:text-sm text-gray-600 hover:underline text-center sm:text-left"
                  >
                    Cancel
                  </button>
                </div>
                {message && (
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    {message}
                  </p>
                )}
              </form>
            )}

            {mode === "signup" && (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 sm:gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="rounded-md border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-brand-pink2"
                  required
                />
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="rounded-md border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-brand-pink2"
                  required
                />
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-md border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-brand-pink2"
                  required
                />
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="rounded-md border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-brand-pink2"
                  required
                />
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="confirm password"
                  className="rounded-md border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-brand-pink2"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  Sign up to save your cart across visits.
                </p>
                <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto rounded-lg bg-brand-pink2 px-4 py-2 text-sm sm:text-base font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    {loading ? "Please wait..." : "Create account"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-xs sm:text-sm text-gray-600 hover:underline text-center sm:text-left"
                  >
                    Cancel
                  </button>
                </div>
                {message && (
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    {message}
                  </p>
                )}
              </form>
            )}

            {disabled && (
              <p className="mt-2 text-xs text-gray-500 break-words">
                Configure Supabase in .env: NEXT_PUBLIC_SUPABASE_URL,
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AuthButtons;

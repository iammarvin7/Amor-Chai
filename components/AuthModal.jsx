"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import supabase from "../lib/supabaseClient";

const TabButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold ${
      active ? "text-black border-b-2 border-brand-pink2" : "text-gray-500 hover:text-gray-700"
    } transition-colors`}
  >
    {children}
  </button>
);

const AuthModal = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const modalRef = useRef(null);

  // If tab changes externally, update internal state if needed or just rely on context
  // But we need to switch between modes.
  const mode = authModalTab; // 'login' or 'signup'

  const disabled = !supabase;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeAuthModal();
      }
    };

    if (isAuthModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isAuthModalOpen, closeAuthModal]);

  // Reset form when opening/closing
  useEffect(() => {
    if (!isAuthModalOpen) {
      setLoading(false);
      setMessage("");
      setShowSuccess(false);
    }
  }, [isAuthModalOpen]);

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
        
        // Try to update user table if needed
        try {
          await supabase.from("users").upsert({ email });
        } catch (e) {
          console.log("Save email error:", e?.message || e);
        }
        
        setMessage("Logged in!");
        setTimeout(() => {
          closeAuthModal();
          // Clear form
          setEmail("");
          setPassword("");
        }, 500);
      } else {
        // Signup
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
        } catch (e) {
           console.log("Save email error:", e?.message || e);
        }
        
        setShowSuccess(true);
        setMessage("");
      }
    } catch (err) {
      setMessage(err.message || "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/50 bg-white/95 p-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <svg className="w-16 h-16 text-rose-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re almost there!</h2>
            <p className="text-gray-600 mb-8 max-w-xs">
              We&apos;ve sent a verification link to your email. Please click it to unlock your account.
            </p>
            <a 
              href="https://mail.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-rose-500 text-white rounded-full px-6 py-3 font-bold shadow-lg hover:bg-rose-600 transition-colors w-full sm:w-auto"
            >
              Open Gmail
            </a>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-center gap-4 border-b border-gray-100 pb-2">
              <TabButton active={mode === "login"} onClick={() => openAuthModal("login")}>
                Login
              </TabButton>
              <TabButton active={mode === "signup"} onClick={() => openAuthModal("signup")}>
                Sign Up
              </TabButton>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-center text-gray-900">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === "signup" && (
                <div className="flex gap-2">
                  <div className="w-1/2">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
                        required
                      />
                  </div>
                  <div className="w-1/2">
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
                        required
                      />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
                    required
                  />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
                  required
                />
              </div>

              {mode === "signup" && (
                <div>
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-pink2"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Sign up to save your cart across visits.
                    </p>
                </div>
              )}

              {message && (
                <div className={`text-sm p-2 rounded ${message.includes('success') || message.includes('Logged') || message.includes('Signed') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </div>
              )}

              <div className="mt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading || disabled}
                  className="w-full rounded-lg bg-brand-pink2 px-4 py-2.5 font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60 transition-all"
                >
                  {loading ? "Please wait..." : (mode === "login" ? "Login" : "Create Account")}
                </button>
                            <button
                              type="button"
                              onClick={closeAuthModal}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                        </>
                        )}
        {disabled && (
           <p className="mt-4 text-xs text-gray-400 text-center">
             System configuration required (Supabase)
           </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
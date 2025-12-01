"use client";
import { useAuth } from "./AuthContext";
import supabase from "../lib/supabaseClient";

const AuthButtons = () => {
  const { openAuthModal } = useAuth();
  const disabled = !supabase;

  return (
    <div className="flex gap-2">
      <button
        data-auth-trigger
        disabled={disabled}
        onClick={() => openAuthModal('login')}
        className="rounded-full border-2 border-brand-pink2 px-3 py-1.5 text-xs font-semibold text-brand-pink2 transition-all hover:-translate-y-0.5 hover:bg-brand-pink2 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        Login
      </button>
      <button
        data-auth-trigger
        disabled={disabled}
        onClick={() => openAuthModal('signup')}
        className="rounded-full bg-brand-pink2 px-3 py-1.5 text-xs font-semibold text-white shadow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Sign up
      </button>
    </div>
  );
};

export default AuthButtons;
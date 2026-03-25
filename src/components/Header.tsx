import { useState } from "react";
import { motion } from "framer-motion";
import { Bike, Brain, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openLogin = () => {
    setAuthMode("login");
    setShowAuth(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setShowAuth(true);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl px-5 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center neon-glow">
            <Bike className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
              ParkSmart <span className="neon-text">AI</span>
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Smart parking for two-wheelers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Brain className="w-3.5 h-3.5 text-primary animate-pulse-neon" />
            <span className="hidden sm:inline">AI-Powered</span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-mono text-primary font-semibold">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-muted-foreground hover:text-neon-red bg-secondary/50 border border-border hover:border-neon-red/30 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openLogin}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-semibold text-foreground bg-secondary/50 border border-border hover:border-primary/40 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={openSignup}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-primary text-primary-foreground neon-glow hover:opacity-90 transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </motion.header>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode={authMode}
      />
    </>
  );
}

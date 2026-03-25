import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, AlertTriangle, Skull, LogIn } from "lucide-react";
import { ScoredSpot } from "@/data/parkingSpots";
import { useAuth } from "@/contexts/AuthContext";
import { apiSubmitReport } from "@/services/api";
import AuthModal from "@/components/AuthModal";

interface ReportModalProps {
  spot: ScoredSpot;
  onClose: () => void;
  onSubmit: () => void;
}

const reportTypes = [
  { type: "safe" as const, label: "Safe", icon: Shield, desc: "Well-lit, no issues", color: "text-neon-green", bg: "bg-neon-green/10 border-neon-green/20 hover:bg-neon-green/20" },
  { type: "fine" as const, label: "Fine Risk", icon: AlertTriangle, desc: "Saw tickets/towing", color: "text-neon-amber", bg: "bg-neon-amber/10 border-neon-amber/20 hover:bg-neon-amber/20" },
  { type: "theft" as const, label: "Theft", icon: Skull, desc: "Theft or vandalism", color: "text-neon-red", bg: "bg-neon-red/10 border-neon-red/20 hover:bg-neon-red/20" },
];

export default function ReportModal({ spot, onClose, onSubmit }: ReportModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handle = async (type: "safe" | "fine" | "theft") => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setError("");
      await apiSubmitReport(spot.id, type);
      setSubmitted(true);
      onSubmit();
      setTimeout(onClose, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-bold text-foreground">Report: {spot.name}</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAuthenticated && (
              <div className="mb-4 p-3 rounded-lg bg-neon-amber/10 border border-neon-amber/20 text-neon-amber text-xs font-mono flex items-center gap-2">
                <LogIn className="w-4 h-4 shrink-0" />
                Sign in required to submit reports
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-neon-red/10 border border-neon-red/20 text-neon-red text-xs font-mono">
                {error}
              </div>
            )}

            {submitted ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-8">
                <div className="text-4xl mb-2">✅</div>
                <p className="font-mono text-sm text-primary">Report submitted!</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-mono text-muted-foreground">Help other riders by reporting conditions</p>
                {reportTypes.map((rt) => (
                  <button
                    key={rt.type}
                    onClick={() => handle(rt.type)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${rt.bg}`}
                  >
                    <rt.icon className={`w-5 h-5 ${rt.color}`} />
                    <div className="text-left">
                      <div className={`text-sm font-mono font-semibold ${rt.color}`}>{rt.label}</div>
                      <div className="text-xs text-muted-foreground">{rt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
}

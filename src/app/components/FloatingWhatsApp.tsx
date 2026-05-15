import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <>
      {/* Pulse ring animation behind the button */}
      <div className="fixed bottom-8 right-8 z-40 pointer-events-none">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-[var(--color-accent-gold)]/30"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 rounded-full border-2 border-[var(--color-accent-gold)]/20"
          animate={{
            scale: [1, 2.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Main floating button */}
      <motion.a
        href="https://wa.me/27792732401"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[10004] flex items-center justify-center w-20 h-20 bg-[var(--color-accent-gold)] text-[var(--color-bg-primary)] rounded-full shadow-[var(--shadow-orb)] hover:w-64 transition-all duration-500 group overflow-hidden glass-button-primary"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6, type: "spring" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.div>
        <span className="font-semibold overflow-hidden max-w-0 group-hover:max-w-[150px] transition-all duration-500 whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>
          Chat with us
        </span>
      </motion.a>
    </>
  );
}
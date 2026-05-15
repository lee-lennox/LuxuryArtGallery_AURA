import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa6";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <motion.footer ref={ref} className="relative z-[10000] py-12 px-8 bg-[var(--color-bg-primary)] overflow-hidden" style={{ position: 'relative' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)]/50 to-transparent pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto relative z-[10001] glass-card rounded-2xl p-8 md:p-12 border border-[var(--color-accent-gold)]/10 pointer-events-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left: AURA logo */}
          <div className="text-center md:text-left">
            <h3
              className="text-3xl mb-2 tracking-widest text-[var(--color-accent-gold)] cinematic-glow"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AURA
            </h3>
            <p
              className="text-sm text-[var(--color-text-muted)]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Contemporary Art Gallery
            </p>
          </div>

          {/* Center: Navigation */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-12 gap-y-4">
            <div>
              <h4
                className="text-sm uppercase tracking-wider mb-4 text-[var(--color-text-primary)]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore
              </h4>
              <ul
                className="space-y-2 text-sm text-[var(--color-text-muted)]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <li><a href="#home" className="hover:text-[var(--color-accent-gold)] transition-colors">Home</a></li>
                <li><a href="#exhibition" className="hover:text-[var(--color-accent-gold)] transition-colors">Exhibition</a></li>
                <li><a href="#artists" className="hover:text-[var(--color-accent-gold)] transition-colors">Artists</a></li>
                <li><a href="#pricing" className="hover:text-[var(--color-accent-gold)] transition-colors">Pricing</a></li>
                <li><a href="#contact" className="hover:text-[var(--color-accent-gold)] transition-colors">Contact</a></li>
                <li><a href="https://wa.me/27792732401" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent-gold)] transition-colors">Book Artwork</a></li>
              </ul>
            </div>
          </div>

          {/* Right: Social icons */}
          <div className="flex gap-6">
            <motion.a
              href="https://wa.me/27792732401"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-gold)] transition-colors duration-300 relative group"
              whileHover={{ scale: 1.2, boxShadow: "0 0 15px var(--color-accent-gold)" }}
              style={{ borderRadius: '50%' }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/kunningarts?igsh=MWdjZjl2ODd0NGNkcA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-gold)] transition-colors duration-300 relative group"
              whileHover={{ scale: 1.2, boxShadow: "0 0 15px var(--color-accent-gold)" }}
              style={{ borderRadius: '50%' }}
            >
              <FaInstagram className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://www.tiktok.com/@kunning.art?_r=1&_t=ZS-96GqMpfLXy1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-gold)] transition-colors duration-300 relative group"
              whileHover={{ scale: 1.2, boxShadow: "0 0 15px var(--color-accent-gold)" }}
              style={{ borderRadius: '50%' }}
            >
              <FaTiktok className="w-6 h-6" />
            </motion.a>
          </div>
        </div>

        {/* Final Line */}
        <div // Changed from motion.div to div to ensure immediate visibility
          className="mt-12 pt-8 border-t border-[var(--color-accent-gold)]/10 text-center text-sm text-[var(--color-text-muted)] relative z-[10002]" // Explicitly high z-index
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <p className="mb-2">“Art does not end here — it continues in imagination.”</p>
          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} AURA Gallery. All rights reserved. | Developed by <span className="text-[var(--color-accent-gold)]">Tech On Peak</span>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
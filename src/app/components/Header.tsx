import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export function Header() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  // Show header after initial void scene (e.g., after 3000ms or a specific scroll point)
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  // Scroll-based visibility and dissolve effect
  const opacity = useTransform(scrollY, [0, 300], [1, 0.9]); // Visible at top, stays mostly visible
  const y = useTransform(scrollY, [0, 300], [0, -5]); // Slight movement

  return (
    <motion.nav
      ref={ref}
      initial={{ y: -100, opacity: 0 }}
      animate={isVisible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      style={{ y, opacity }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} // Cinematic Quint Easing
      className="fixed top-0 left-0 right-0 z-[10003] px-8 py-6 pointer-events-auto" // Ensure header itself is clickable
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 glass-card rounded-full" />
      
      <div className="max-w-[1800px] mx-auto flex items-center justify-between relative z-[10004] pointer-events-auto"> {/* Ensure header content is above all overlays */}
        {/* Left: AURA logo */}
        <motion.a
          href="#home"
          className="text-2xl font-bold tracking-[0.3em] text-[var(--color-accent-gold)] cinematic-glow"
          style={{ fontFamily: "'Playfair Display', serif" }}
          whileHover={{ scale: 1.05 }}
        >
          AURA
        </motion.a>

        {/* Center navigation - Delayed Entrance */}
        <div className="flex items-center gap-10">
          {["Home", "Exhibition", "Artists", "Pricing", "Contact"].map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (0.1 * index), duration: 1, ease: "easeOut" }}
              className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent-gold)] transition-colors duration-500 tracking-[0.2em] uppercase hidden md:block relative group"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {item}
              {/* Underline animation */}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--color-accent-gold)] transition-all duration-500 group-hover:w-full" />
            </motion.a>
          ))}
        </div>
          
        {/* Right: "Book on WhatsApp" button (glowing orb style) */}
        <motion.a
          href="https://wa.me/27792732401"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-12 h-12 bg-[var(--color-accent-gold)] text-[var(--color-bg-primary)] rounded-full shadow-[var(--shadow-orb)] hover:w-48 transition-all duration-500 group overflow-hidden cinematic-glow-button"
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
            <MessageCircle className="w-5 h-5" />
          </motion.div>
          <span className="font-semibold overflow-hidden max-w-0 group-hover:max-w-[120px] transition-all duration-500 whitespace-nowrap ml-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Book on WhatsApp
          </span>
          {/* Glowing Orb Effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--color-accent-gold)] opacity-0"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.a>
      </div>
    </motion.nav>
  );
}
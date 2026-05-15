import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa6";

export function Contact() {
  return (
    <section id="contact" className="relative w-full py-12 px-8 bg-[var(--color-bg-primary)] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)]/30 to-[var(--color-bg-primary)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[var(--color-accent-gold)] opacity-[0.03] blur-[250px] rounded-full animate-pulse-glow" />
      
      <div className="max-w-[1200px] mx-auto relative z-[10005] pointer-events-auto"> {/* Pinned above overlays */}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-sm text-[var(--color-accent-gold)] uppercase mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Connect With Us
          </motion.p>
          
          <h2
            className="text-5xl md:text-7xl mb-8 text-[var(--color-text-primary)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Get in Touch
          </h2>
          
          <p
            className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Have questions about our collection or want to inquire about a piece?
            <br />
            We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ y: -15, scale: 1.03, boxShadow: "var(--shadow-glow-gold)" }}
            className="group relative"
          >
            <div className="glass-card rounded-2xl p-10 text-center h-full transition-all duration-700 hover:border-[var(--color-accent-gold)]/40 cinematic-glow">
              <div className="w-20 h-20 rounded-full bg-[var(--color-accent-gold)]/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-[var(--color-accent-gold)]/20 transition-colors duration-500">
                <MessageCircle className="w-10 h-10 text-[var(--color-accent-gold)]" />
              </div>
              
              <h3
                className="text-2xl mb-4 text-[var(--color-text-primary)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                WhatsApp
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Chat with us directly for quick responses
              </p>
              <a
                href="https://wa.me/27792732401"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 font-semibold rounded-lg transition-all duration-300 glass-button-primary"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Chat Now
              </a>
            </div>
            
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent-gold)]/0 via-[var(--color-accent-gold)]/5 to-[var(--color-accent-gold)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10 rounded-2xl" />
          </motion.div>

          {/* Instagram */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -15, scale: 1.03, boxShadow: "var(--shadow-glow-gold)" }}
            className="group relative"
          >
            <div className="glass-card rounded-2xl p-10 text-center h-full transition-all duration-700 hover:border-[var(--color-accent-gold)]/40 cinematic-glow">
              <div className="w-20 h-20 rounded-full bg-[var(--color-accent-gold)]/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-[var(--color-accent-gold)]/20 transition-colors duration-500">
                <FaInstagram className="w-10 h-10 text-[var(--color-accent-gold)]" />
              </div>
              
              <h3
                className="text-2xl mb-4 text-[var(--color-text-primary)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Instagram
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Follow us for daily art inspiration
              </p>
              <a
                href="https://www.instagram.com/kunningarts?igsh=MWdjZjl2ODd0NGNkcA=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 border border-[var(--color-accent-gold)] text-[var(--color-accent-gold)] font-semibold rounded-lg hover:bg-[var(--color-accent-gold)]/10 transition-all duration-300 cinematic-glow-button"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                @kunningarts
              </a>
            </div>
            
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent-gold)]/0 via-[var(--color-accent-gold)]/5 to-[var(--color-accent-gold)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10 rounded-2xl" />
          </motion.div>

          {/* TikTok */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ y: -15, scale: 1.03, boxShadow: "var(--shadow-glow-gold)" }}
            className="group relative"
          >
            <div className="glass-card rounded-2xl p-10 text-center h-full transition-all duration-700 hover:border-[var(--color-accent-gold)]/40 cinematic-glow">
              <div className="w-20 h-20 rounded-full bg-[var(--color-accent-gold)]/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-[var(--color-accent-gold)]/20 transition-colors duration-500">
                <FaTiktok className="w-10 h-10 text-[var(--color-accent-gold)]" />
              </div>
              
              <h3
                className="text-2xl mb-4 text-[var(--color-text-primary)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                TikTok
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Watch behind-the-scenes content
              </p>
              <a
                href="https://www.tiktok.com/@kunning.art?_r=1&_t=ZS-96GqMpfLXy1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 border border-[var(--color-accent-gold)] text-[var(--color-accent-gold)] font-semibold rounded-lg hover:bg-[var(--color-accent-gold)]/10 transition-all duration-300 cinematic-glow-button"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                @kunning.art
              </a>
            </div>
            
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent-gold)]/0 via-[var(--color-accent-gold)]/5 to-[var(--color-accent-gold)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10 rounded-2xl" />
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            AURA Gallery is open for inquiries Monday through Saturday, 9:00 AM - 6:00 PM SAST.
            <br />
            For urgent matters, WhatsApp is available 24/7.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
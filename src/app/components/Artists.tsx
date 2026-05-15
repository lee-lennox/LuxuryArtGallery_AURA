import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// Import profile image
import profileImage from "../../Profile/profile2.jpeg";

export function Artists() {
  
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      id="artists" 
      className="min-h-screen py-12 px-8 bg-[var(--color-bg-primary)] relative overflow-hidden flex items-center"
      onClick={() => setIsSelected(true)}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 deep-space" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[var(--color-accent-gold)] opacity-[0.04] blur-[350px] rounded-full animate-pulse-glow" />

      <div className="max-w-[1600px] mx-auto relative z-10 w-full">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: "1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
          viewport={{ once: true }}
          transition={{ duration: 1 }} 
          className="text-center mb-4"
        >
          <p
            className="text-sm text-[var(--color-accent-gold)] uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Featured Artist
          </p>
        </motion.div>

        {/* Giant Typography - ALANE KHOZA on same line */}
        <div className="relative">
          {/* ALANE KHOZA - Single line */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center mb-6"
          >
            <h2 
              className="text-[clamp(2.5rem,10vw,8rem)] font-bold leading-none tracking-tighter whitespace-nowrap"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="bg-gradient-to-b from-[var(--color-text-primary)] via-[var(--color-text-primary)] to-[var(--color-text-muted)] bg-clip-text text-transparent cinematic-glow">
                ALANE&nbsp;&nbsp;KHOZA
              </span>
            </h2>
          </motion.div>

          {/* Central Portrait Artwork */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 md:mt-8 z-[10000]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-200px" }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.6 }}
              className="w-[250px] h-[350px] md:w-[350px] md:h-[450px] z-0 relative"
            >
              {/* Artwork Frame with profile image */}
              <div className="relative w-full h-full">
                {/* Outer glow */}
                <div className="absolute -inset-10 bg-gradient-radial from-[var(--color-accent-gold)]/25 via-transparent to-transparent blur-3xl animate-pulse-glow" />
                
                {/* Gold frame */}
                <div className="absolute inset-0 border-4 border-[var(--color-accent-gold)]/40 rounded-sm" />
                
                {/* Inner frame */}
                <div className="absolute inset-4 border-2 border-[var(--color-accent-gold)]/30 rounded-sm" />
                
                {/* Profile Image */}
                <div className="absolute inset-8 rounded-sm overflow-hidden">
                  <img 
                    src={profileImage} 
                    alt="Alane Khoza"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
              
            {/* Artist Info (Tagline, Description, CTA) */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md md:max-w-xl relative z-10">
              {/* Artist Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mb-2"
              >
                <p
                  className="text-xl md:text-2xl text-[var(--color-text-muted)] italic"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  "Emotion translated through texture, movement, and soul."
                </p>
              </motion.div>

              {/* Artist Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1 }} 
                className="mb-4"
              >
                <p
                  className="text-[var(--color-text-muted)] leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Alane Khoza creates visceral experiences that transcend traditional boundaries.
                  Each piece is a portal into the depths of human emotion, rendered through
                  masterful technique and unbridled creative vision.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2 }} 
                className="mt-4"
              >
                <motion.a
                  href="#pricing"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block px-10 py-4 border border-[var(--color-accent-gold)]/50 text-[var(--color-accent-gold)] text-sm font-semibold tracking-[0.2em] uppercase rounded-sm transition-all duration-500 hover:bg-[var(--color-accent-gold)]/10 hover:border-[var(--color-accent-gold)]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  View Collection
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TunnelSection } from "./components/Tunnel";
import { ImmersiveArtworkExperience } from "./components/ImmersiveArtworkExperience";
import { Artists } from "./components/Artists";
import { Pricing } from "./components/Pricing";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { motion } from "framer-motion";
import { PaintSystem } from "./components/PaintSystem";

// Import local images from src/images (using relative paths)
import art1 from "../images/art-1.jpeg";
import art2 from "../images/art-2.jpeg";
import art3 from "../images/art-3.jpeg";
import art4 from "../images/art-4.jpeg";
import art5 from "../images/art-5.jpeg";
import art6 from "../images/art-6.jpeg";
import art7 from "../images/art-7.png";
import art8 from "../images/art-8.jpeg";
import art9 from "../images/art-9.jpeg";
import art10 from "../images/art-10.jpeg";
import art11 from "../images/art-11.jpeg";
import art12 from "../images/art-12.jpeg";

// Artwork data using local images
const artworks = [
  { id: 1, imageUrl: art1, title: "Ethereal Dawn", artist: "Aria Nightingale", medium: "Oil on Canvas" },
  { id: 2, imageUrl: art2, title: "Urban Symphony", artist: "Kairos Vale", medium: "Mixed Media" },
  { id: 3, imageUrl: art3, title: "Silent Whispers", artist: "Luna Ashford", medium: "Watercolor" },
  { id: 4, imageUrl: art4, title: "Crimson Tide", artist: "Orion Blackwood", medium: "Acrylic" },
  { id: 5, imageUrl: art5, title: "Golden Hour", artist: "Seraphina Moon", medium: "Oil on Canvas" },
  { id: 6, imageUrl: art6, title: "Abstract Flow", artist: "Zephyr Storm", medium: "Digital Art" },
  { id: 7, imageUrl: art7, title: "Luminous Dreams", artist: "Aurora Skye", medium: "Mixed Media" },
  { id: 8, imageUrl: art8, title: "Midnight Reverie", artist: "Atlas Grey", medium: "Charcoal" },
  { id: 9, imageUrl: art9, title: "Ocean's Memory", artist: "Marina Wells", medium: "Watercolor" },
  { id: 10, imageUrl: art10, title: "Fractured Light", artist: "Phoenix Ray", medium: "Photography" },
  { id: 11, imageUrl: art11, title: "Velvet Shadows", artist: "Raven Dark", medium: "Oil on Canvas" },
  { id: 12, imageUrl: art12, title: "Celestial Dance", artist: "Cosmos Reed", medium: "Acrylic" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] relative">
      {/* Grain texture overlay */}
      <div className="grain-overlay" />
      {/* Global Paint System Overlay */}
      <PaintSystem />

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* 3D Art Tunnel Section (SCENE 5) */}
      <TunnelSection artworks={artworks} />

      {/* Immersive Artwork Experience (SCENE 7) */}
      <ImmersiveArtworkExperience />

      {/* Artists Section */}
      <Artists />

      {/* Art Pricing Section */}
      <Pricing /> {/* This is the 3D pricing carousel */}

      {/* Contact Section */}
      <Contact />

      {/* Final Section - The Exit */}
      <section className="relative w-full h-screen bg-[var(--color-bg-primary)] flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="text-[clamp(4rem,15vw,14rem)] font-bold tracking-[0.2em] text-[var(--color-text-primary)] cinematic-glow"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            AURA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.5 }}
            className="text-2xl md:text-3xl font-light text-[var(--color-text-muted)] mt-8 tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Art that lives beyond the canvas.
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
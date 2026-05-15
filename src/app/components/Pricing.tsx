import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo, Suspense } from "react";
import { Float, Environment, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface PricingTier {
  category: string;
  items: {
    size: string;
    code: string;
    price: number;
    dimensions: string;
    description: string;
  }[];
}

const pricingCategories: PricingTier[] = [
  {
    category: "Signature Works",
    items: [
      {
        size: "A0",
        code: "R3,500",
        price: 3500,
        dimensions: "840 × 1190mm",
        description: "Statement Piece"
      },
      {
        size: "A1",
        code: "R2,000",
        price: 2000,
        dimensions: "600 × 900mm",
        description: "Gallery Scale Piece"
      },
      {
        size: "A2",
        code: "R1,500",
        price: 1500,
        dimensions: "400 × 600mm",
        description: "Collector's Piece"
      }
    ]
  },
  {
    category: "Standard Range",
    items: [
      {
        size: "A3",
        code: "R600",
        price: 600,
        dimensions: "300 × 400mm",
        description: "Standard Artwork"
      }
    ]
  },
  {
    category: "Entry Range",
    items: [
      {
        size: "A4",
        code: "R450",
        price: 450,
        dimensions: "200 × 300mm",
        description: "Personal Scale Artwork"
      },
      {
        size: "A5",
        code: "R250",
        price: 250,
        dimensions: "150 × 200mm",
        description: "Study Artwork"
      }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function PricingCard3D({ item, index, total, radius = 9 }: { item: any, index: number, total: number, radius?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const angle = (index / total) * Math.PI * 2;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.2;
    }
  });

  const getWhatsAppMessage = (item: any) => {
    return `Hi AURA, I would like to book an ${item.size} ${item.description} artwork (${item.code}).`;
  };

  return (
    <group 
      ref={groupRef} 
      position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
      rotation={[0, angle, 0]}
    >
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
        {/* Main 3D Card Frame */}
        <mesh>
          <boxGeometry args={[4.5, 6, 0.1]} />
          <meshStandardMaterial 
            color="#0D0D10" 
            metalness={0.9} 
            roughness={0.1} 
            transparent 
            opacity={0.9}
          />
        </mesh>
        
        {/* Gold Border Mesh */}
        <mesh position={[0, 0, 0.051]}>
          <planeGeometry args={[4.3, 5.8]} />
          <meshStandardMaterial color="#D6B47C" metalness={1} roughness={0.1} wireframe />
        </mesh>

        {/* Interactive UI Overlay */}
        <Html transform distanceFactor={8} position={[0, 0, 0.06]} pointerEvents="auto">
          <div className="w-[300px] text-center p-6 flex flex-col items-center backdrop-blur-xl border border-[var(--color-accent-gold)]/20 rounded-xl bg-black/60 shadow-2xl pointer-events-auto">
            <h3 className="text-4xl font-serif mb-2 text-white">{item.size}</h3> {/* Slightly smaller size */}
            <p className="text-[var(--color-accent-gold)] tracking-[0.2em] mb-2 uppercase text-[10px] font-medium">{item.dimensions}</p> {/* Less bold, less margin */}
            <p className="text-[10px] text-[var(--color-text-muted)]/70 italic mb-4 leading-tight">"{item.description}"</p> {/* Smaller, lighter, less margin, tighter leading */}
            <div className="text-4xl text-white mb-8 font-light tracking-tighter">{item.code}</div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/27792732401?text=${encodeURIComponent(getWhatsAppMessage(item))}`, '_blank');
              }}
              className="px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 cursor-pointer relative z-50 pointer-events-auto glass-button-primary shadow-2xl"
            >
              Book Piece
            </button>
          </div>
        </Html>
      </Float>
    </group>
  );
}

function PricingCarousel({ items }: { items: any[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <PricingCard3D key={item.size} item={item} index={i} total={items.length} />
      ))}
    </group>
  );
}

export function Pricing() {
  const allItems = useMemo(() => pricingCategories.flatMap(c => c.items), []);

  return (
    <section id="pricing" className="relative w-full h-screen bg-[var(--color-bg-primary)] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)]/50 to-[var(--color-bg-primary)] pointer-events-none" />

      {/* Floating light effects - Enhanced */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--color-accent-gold)] opacity-[0.02] blur-[200px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[var(--color-cream-glow)] opacity-[0.02] blur-[150px] rounded-full" />
      
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }} 
          className="text-left px-8 w-full md:w-1/2 lg:w-1/3 z-[10005] pointer-events-auto"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-sm text-[var(--color-accent-gold)] uppercase mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Art 
            <br/>Collection 
            <br/>Pricing
          </motion.p>
          
          <h2
            className="text-3xl md:text-5xl mb-6 text-[var(--color-text-primary)]" // Slightly smaller heading
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Collectible <br />Works
          </h2>
          
          <p
            className="text-lg text-[var(--color-text-muted)]/80 max-w-xl leading-relaxed text-left" // Shifted to left
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Each piece is a unique
            <br />expression of artistic
            <br />vision, available in
            <br />various sizes
            <br />to complement your space.
          </p>
        </motion.div>
      </div>

      {/* 3D Arena with Spinning Carousel */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 lg:w-2/3 z-[10005]"> {/* Canvas container above overlays */}
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#D6B47C" />
          <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={1} color="#F4EEE6" />
          
          <Suspense fallback={null}>
            <PricingCarousel items={allItems} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
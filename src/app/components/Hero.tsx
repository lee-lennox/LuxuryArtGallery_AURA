import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Float, Environment, Stars, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Note: art-7 is reserved for the Featured Collection only

// --- SCENE 2: FLOATING ART TOOLS (Dimmed for subtlety) ---
function FloatingTool({ index, total, radius = 4, type = 'pencil' }: { index: number; total: number; radius?: number; type?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const angle = (index / total) * Math.PI * 2;
  const zPosition = Math.sin(index * 0.5) * -15 - 8;
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const currentAngle = angle + time * 0.1;
      
      groupRef.current.position.x = Math.cos(currentAngle) * radius;
      groupRef.current.position.y = Math.sin(time * 0.3 + index) * 2;
      groupRef.current.position.z = zPosition;
      
      groupRef.current.lookAt(0, 0, 10);
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2 + index) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        {type === 'pencil' && (
          <mesh ref={meshRef}>
            <cylinderGeometry args={[0.1, 0.1, 3, 16]} />
            <meshStandardMaterial color="#A0522D" metalness={0.1} roughness={0.9} transparent opacity={0.25} />
            <mesh position={[0, 1.5, 0]}>
              <coneGeometry args={[0.15, 0.5, 16]} />
              <meshStandardMaterial color="#F0E68C" metalness={0.1} roughness={0.9} transparent opacity={0.25} />
            </mesh>
          </mesh>
        )}
        {type === 'brush' && (
          <mesh ref={meshRef}>
            <cylinderGeometry args={[0.15, 0.15, 4, 16]} />
            <meshStandardMaterial color="#8B4513" metalness={0.1} roughness={0.9} transparent opacity={0.25} />
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.3, 0.1, 1, 16]} />
              <meshStandardMaterial color="#5C4033" metalness={0.1} roughness={0.9} transparent opacity={0.25} />
            </mesh>
          </mesh>
        )}
        {type === 'paint_tube' && (
          <mesh ref={meshRef}>
            <cylinderGeometry args={[0.2, 0.2, 2, 16]} />
            <meshStandardMaterial color="#FF0000" metalness={0.2} roughness={0.8} transparent opacity={0.25} />
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#FF0000" metalness={0.2} roughness={0.8} transparent opacity={0.25} />
            </mesh>
          </mesh>
        )}
        {type === 'canvas_frame' && (
          <mesh ref={meshRef}>
            <boxGeometry args={[3, 4, 0.1]} />
            <meshStandardMaterial color="#8B4513" metalness={0.2} roughness={0.8} transparent opacity={0.2} />
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[2.8, 3.8]} />
              <meshStandardMaterial color="#F4EEE6" transparent opacity={0.15} />
            </mesh>
          </mesh>
        )}
      </Float>
    </group>
  );
}

// Particles for the tunnel (dimmed)
function TunnelParticles({ count = 500, isScrolling = false, isSelected = false }: { count?: number; isScrolling?: boolean; isSelected?: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 4;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 30;
      const z = -Math.random() * 40 - 5;
      temp.push({ x, y, z });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
    if (materialRef.current) {
      const targetOpacity = (isScrolling || !isSelected) ? 0 : 0.3;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.02}
        color="#D6B47C"
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Central glowing orb (dimmed)
function VoidOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, -15]}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial 
          color="#D6B47C"
          metalness={0.5}
          roughness={0.3}
          emissive="#D6B47C"
          emissiveIntensity={0.2}
          transparent
          opacity={0.5}
          wireframe
        />
      </mesh>
      <mesh position={[0, 0, -15]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
          color="#D6B47C"
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

// Hero Artwork removed - blank canvas no longer displayed on home page

// --- MAIN HERO SCENE (R3F) ---
function HeroCanvasScene({ scrollProgress, isScrolling, isSelected }: { scrollProgress: any; isScrolling: boolean; isSelected: boolean }) {
  const { camera, mouse } = useThree();

  const voidOpacity = useTransform(scrollProgress, [0, 0.03], [1, 0]);
  const toolsOpacity = useTransform(scrollProgress, [0.03, 0.15, 0.25, 0.35], [0, 1, 1, 0]);

  const toolTypes = useMemo(() => ['pencil', 'brush', 'paint_tube', 'canvas_frame'], []);

  useFrame((state) => {
    const currentScroll = scrollProgress.get();

    if (currentScroll < 0.6) {
      const zPos = 8 - (currentScroll * 12);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, zPos, 0.05);
      camera.lookAt(0, 0, 0);
    } else {
      const zPos = 8 - (0.6 * 12);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, zPos, 0.05);
      camera.lookAt(0, 0, 0);
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 2, 0.02);
  });
  
  return (
    <>
      <ambientLight intensity={0.1} color="#F4EEE6" />
      <pointLight position={[0, 0, 10]} intensity={3} color="#D6B47C" />
      <spotLight position={[0, 20, 0]} intensity={2} color="#F4EEE6" />
      
      <Environment preset="city" />
      
      <Stars
        radius={200}
        depth={150}
        count={3000}
        factor={2}
        saturation={0}
        fade
        speed={0.2}
      />
      
      <motion.group style={{ opacity: voidOpacity }}>
        <VoidOrb />
      </motion.group>

      <motion.group style={{ opacity: toolsOpacity }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <FloatingTool key={i} index={i} total={10} radius={5} type={toolTypes[i % toolTypes.length]} />
        ))}
      </motion.group>


      <TunnelParticles count={500} isScrolling={isScrolling} isSelected={isSelected} />
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [showVoidIntro, setShowVoidIntro] = useState(true);
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowVoidIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const auraLogoHtmlOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0]);
  const heroTextOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const heroButtonsOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);

  return (
    <div ref={ref} id="home" className="relative h-[200vh]" style={{ position: 'relative', width: '100%', display: 'block' }}>
      <div className="relative sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden" style={{ position: 'relative' }}>
      <AnimatePresence>
        {showVoidIntro && (
          <motion.div 
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="text-6xl md:text-9xl font-bold tracking-[0.4em] text-[var(--color-accent-gold)] blur-sm animate-pulse-glow"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AURA
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-[1]">
        <Canvas 
          gl={{ antialias: true, alpha: true }} 
          dpr={[1, 2]}
          onPointerDown={() => setIsSelected(true)}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
          <color attach="background" args={["#030303"]} />
          <fog attach="fog" args={["#030303", 10, 60]} />
          <Suspense fallback={null}>
            <HeroCanvasScene scrollProgress={scrollYProgress} isScrolling={isScrolling} isSelected={isSelected} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* AURA Logo - fades out quickly */}
      <motion.div style={{ opacity: auraLogoHtmlOpacity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] text-center px-8 pointer-events-auto">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="text-[clamp(4rem,15vw,14rem)] font-bold tracking-[0.2em] text-[var(--color-text-primary)]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          AURA
        </motion.h1>
      </motion.div>

      {/* Hero Text - appears after logo fades */}
      <motion.div style={{ opacity: heroTextOpacity }} className="absolute top-1/2 left-[10%] -translate-y-1/2 z-[10000] text-left px-8 pointer-events-auto max-w-lg">
        <h1 className="text-5xl md:text-7xl font-serif text-[var(--color-text-primary)] tracking-[0.1em] mb-4">AURA</h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 1.5 }}
          className="text-2xl md:text-3xl font-light text-[var(--color-text-muted)] mb-6 tracking-[0.5em] uppercase"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Contemporary Art Gallery
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 2 }}
          className="text-xl text-[var(--color-text-muted)] italic"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          "Emotion captured beyond the canvas."
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          style={{ opacity: heroButtonsOpacity }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 2.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-start items-start mt-12"
        >
          <motion.a
            href="#exhibition"
            whileHover={{ scale: 1.05, boxShadow: "var(--shadow-glow-gold)" }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-5 text-sm font-semibold tracking-[0.2em] uppercase rounded-lg transition-all duration-500 pointer-events-auto glass-button-primary"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Enter Gallery
          </motion.a>
          
          <motion.a
            href="https://wa.me/27792732401"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, borderColor: "var(--color-accent-gold)" }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-5 border border-[var(--color-text-muted)]/30 text-[var(--color-text-primary)] text-sm font-semibold tracking-[0.2em] uppercase rounded-lg transition-all duration-500 hover:bg-[var(--color-accent-gold)]/10 glass-button"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Book Artwork
          </motion.a>
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div style={{ opacity: scrollIndicatorOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.4em]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 15, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-24 bg-gradient-to-b from-[var(--color-accent-gold)] via-[var(--color-accent-gold)] to-transparent"
        />
      </motion.div>
      </div>
    </div>
  );
}
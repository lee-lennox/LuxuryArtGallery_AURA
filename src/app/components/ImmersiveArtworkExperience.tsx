import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { 
  Environment, 
  Float, 
  MeshReflectorMaterial,
  Stars,
  Html
} from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

interface ArtworkData {
  id: number;
  imageUrl: string;
  title: string;
  artist: string;
  medium: string;
}

interface ImmersiveArtworkExperienceProps {
  artworks?: ArtworkData[];
}

// Default artworks using local images (relative paths for Vite)
const defaultArtworks: ArtworkData[] = [
  { id: 1, imageUrl: new URL("../../images/art-1.jpeg", import.meta.url).href, title: "Ethereal Dawn", artist: "Aria Nightingale", medium: "Oil on Canvas" },
  { id: 2, imageUrl: new URL("../../images/art-2.jpeg", import.meta.url).href, title: "Urban Symphony", artist: "Kairos Vale", medium: "Mixed Media" },
  { id: 3, imageUrl: new URL("../../images/art-3.jpeg", import.meta.url).href, title: "Silent Whispers", artist: "Luna Ashford", medium: "Watercolor" },
  { id: 4, imageUrl: new URL("../../images/art-4.jpeg", import.meta.url).href, title: "Crimson Tide", artist: "Orion Blackwood", medium: "Acrylic" },
  { id: 5, imageUrl: new URL("../../images/art-5.jpeg", import.meta.url).href, title: "Golden Hour", artist: "Seraphina Moon", medium: "Oil on Canvas" },
  { id: 6, imageUrl: new URL("../../images/art-6.jpeg", import.meta.url).href, title: "Abstract Flow", artist: "Zephyr Storm", medium: "Digital Art" },
  { id: 7, imageUrl: new URL("../../images/art-7.png", import.meta.url).href, title: "Luminous Dreams", artist: "Aurora Skye", medium: "Mixed Media" },
  { id: 8, imageUrl: new URL("../../images/art-8.jpeg", import.meta.url).href, title: "Midnight Reverie", artist: "Atlas Grey", medium: "Charcoal" },
];

// Floating particles component
function Particles({ count = 200, isScrolling = false, isSelected = false }: { count?: number; isScrolling?: boolean; isSelected?: boolean }) {
  const mesh = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const { viewport } = useThree();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 3;
      const y = (Math.random() - 0.5) * viewport.height * 3;
      const z = (Math.random() - 0.5) * 20;
      temp.push({ x, y, z });
    }
    return temp;
  }, [count, viewport]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.015;
    }
    if (materialRef.current) {
      const targetOpacity = (isScrolling || !isSelected) ? 0 : 0.5;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);
    }
  });

  return (
    <points ref={mesh}>
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
        size={0.025}
        color="#C6A16E"
        transparent
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Image texture loader component
function ArtworkTexture({ url, onError }: { url: string; onError?: () => void }) {
  const texture = useLoader(THREE.TextureLoader, url, 
    undefined, 
    (err) => {
      console.error('Failed to load texture:', err);
      if (onError) onError();
    }
  );
  
  return <primitive object={texture} attach="map" />;
}

// Artwork frame component with 3D effects - always faces camera (billboard style)
function ImmersiveArtworkItem({ artwork, index, total }: { artwork: ArtworkData; index: number; total: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  
  // Arrange artworks in a more visible elliptical pattern (front-facing)
  const angle = (index / total) * Math.PI * 2;
  const radiusX = 5 + Math.random() * 3;
  const radiusY = 3 + Math.random() * 2;
  const baseX = Math.cos(angle) * radiusX;
  const baseY = Math.sin(angle * 2) * radiusY;
  const baseZ = -8 + Math.random() * 4; // Keep all artworks in front, not wrapping around
  
  // Each artwork has a unique phase for organic movement
  const phase = index * 0.7;
  const speed = 0.3 + Math.random() * 0.2;
  
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Smooth floating movement - more pronounced
      groupRef.current.position.x = baseX + Math.sin(time * speed + phase) * 1;
      groupRef.current.position.y = baseY + Math.cos(time * speed * 0.7 + phase) * 0.5;
      // Minimal Z movement to keep artworks facing forward
      groupRef.current.position.z = baseZ + Math.sin(time * speed * 0.3 + phase) * 0.5;
      
      // ALWAYS FACE THE CAMERA (billboard effect)
      meshRef.current.lookAt(camera.position.x, camera.position.y, camera.position.z);
      
      // Very subtle tilt for natural feel (no full rotation)
      const subtleTiltX = Math.sin(time * 0.15 + phase) * 0.05;
      const subtleTiltY = Math.sin(time * 0.1 + phase) * 0.05;
      meshRef.current.rotation.x += (subtleTiltX - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (subtleTiltY - meshRef.current.rotation.y) * 0.05;
      
      // Scale up slightly on hover
      const targetScale = hovered ? 1.15 : 1;
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      meshRef.current.scale.set(newScale, newScale, newScale);
    }
  });

  return (
    <group ref={groupRef} position={[baseX, baseY, baseZ]}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Thinner frame - only visible edges */}
        <boxGeometry args={[3, 4, 0.1]} />
        <meshStandardMaterial 
          color={hovered ? "#2a2b2e" : "#16171A"} 
          metalness={0.8}
          roughness={0.2}
          emissive="#D6B47C"
          emissiveIntensity={hovered ? 0.3 : 0}
        />
        {/* Frame border glow - only on edges */}
        <mesh position={[0, 0, -0.01]} scale={[1.03, 1.03, 1]}>
          <boxGeometry args={[3, 4, 0.02]} />
          <meshStandardMaterial 
            color="#D6B47C" 
            transparent 
            opacity={hovered ? 0.5 : 0.15}
            emissive="#D6B47C"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Artwork surface - only on front face */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2.85, 3.85]} />
          <meshBasicMaterial side={THREE.FrontSide}>
            <ArtworkTexture url={artwork.imageUrl} />
          </meshBasicMaterial>
        </mesh>
        {/* Spotlight effect */}
        <pointLight 
          position={[0, 2, 1]} 
          intensity={hovered ? 2 : 0.8} 
          color="#D6B47C" 
          distance={5}
        />
      </mesh>
    </group>
  );
}

// Main carousel component - slowly rotates the entire scene
function ImmersiveArtworkScene({ artworks }: { artworks: ArtworkData[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slowly rotate the entire collection
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {artworks.map((artwork, index) => (
          <ImmersiveArtworkItem
            key={artwork.id}
            artwork={artwork}
            index={index}
            total={artworks.length}
          />
      ))}
    </group>
  );
}

// Scene setup with lighting and environment
function ImmersiveArtworkCanvasScene({ artworks, isScrolling, isSelected }: { artworks: ArtworkData[]; isScrolling: boolean; isSelected: boolean }) {
  return (
    <>
      {/* Lighting - Cinematic setup */}
      <ambientLight intensity={0.15} color="#FAEDCD" />
      <spotLight
        position={[10, 10, 10]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        color="#C6A16E"
        castShadow
      />
      <spotLight
        position={[-10, 10, 10]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        color="#FAEDCD"
      />
      <pointLight position={[0, -5, 5]} intensity={0.6} color="#C6A16E" />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Floating particles */}
      <Particles count={200} isScrolling={isScrolling} isSelected={isSelected} />
      
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0F0F10"
          metalness={0.5}
          mirror={0}
        />
      </mesh>
      
      {/* Main carousel */}
      <ImmersiveArtworkScene artworks={artworks} />
    </>
  );
}

// Main Gallery component
export function ImmersiveArtworkExperience({ artworks: propArtworks }: ImmersiveArtworkExperienceProps = {}) {
  const artworks = propArtworks || defaultArtworks;
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
    <section id="exhibition" className="relative w-full h-screen bg-[var(--color-bg-primary)]" style={{ position: 'relative' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[var(--color-accent-gold)] opacity-[0.02] blur-[200px] rounded-full" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }} 
        className="absolute inset-y-0 right-0 z-[10000] p-8 md:p-12 text-right pointer-events-auto w-full md:w-1/2 lg:w-2/3 flex flex-col justify-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-sm text-[var(--color-accent-gold)] uppercase mb-4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          The Collection
        </motion.p>
        
        <h2
          className="text-4xl md:text-6xl mb-6 text-[var(--color-text-primary)]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Featured Collection
        </h2>
        <p
          className="text-lg text-[var(--color-text-muted)] max-w-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          A carefully curated selection of extraordinary works from AURA Gallery that push the boundaries of
          contemporary expression
        </p>
      </motion.div>

      {/* 3D Canvas */}
      <div className="absolute inset-y-0 left-0 w-full md:w-1/2 lg:w-1/3 z-[10005]">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          onPointerDown={() => setIsSelected(true)}
        >
          <color attach="background" args={["#0D0D10"]} /> {/* Rich Charcoal */}
          <fog attach="fog" args={["#0D0D10", 10, 40]} />

          <Suspense fallback={null}>
            <ImmersiveArtworkCanvasScene artworks={artworks} isScrolling={isScrolling} isSelected={isSelected} />
          </Suspense>
        </Canvas>
      </div>

      {/* Minimal scroll indicator - no text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-16 bg-gradient-to-b from-[var(--color-accent-gold)] via-[var(--color-accent-gold)] to-transparent opacity-40"
        />
      </motion.div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        {artworks.slice(0, 8).map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full bg-[var(--color-text-muted)]/30"
            whileHover={{ scale: 1.5, backgroundColor: "var(--color-accent-gold)" }}
          />
        ))}
      </div>
    </section>
  );
}
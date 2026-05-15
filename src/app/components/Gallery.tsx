import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { 
  ScrollControls, 
  useScroll, 
  Environment, 
  Float, 
  MeshReflectorMaterial,
  Stars,
  Text as ThreeText,
  Html
} from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// Import local images from src/images
import art1 from "@/images/art-1.jpeg";
import art2 from "@/images/art-2.jpeg";
import art3 from "@/images/art-3.jpeg";
import art4 from "@/images/art-4.jpeg";
import art5 from "@/images/art-5.jpeg";
import art6 from "@/images/art-6.jpeg";

interface ArtworkData {
  id: number;
  imageUrl: string;
  title: string;
  artist: string;
  medium: string;
}

const artworks: ArtworkData[] = [
  {
    id: 1,
    imageUrl: art1,
    title: "Silent Observer",
    artist: "Declan Sun",
    medium: "Abstract Painting"
  },
  {
    id: 2,
    imageUrl: art2,
    title: "Vibrant Abstraction",
    artist: "Maximus Beaumont",
    medium: "Digital Art"
  },
  {
    id: 3,
    imageUrl: art3,
    title: "Wall of Expression",
    artist: "Christian Wiediger",
    medium: "Contemporary Art"
  },
  {
    id: 4,
    imageUrl: art4,
    title: "Botanical Study",
    artist: "Birmingham Museums",
    medium: "Illustration"
  },
  {
    id: 5,
    imageUrl: art5,
    title: "Fluid Motion",
    artist: "Logan Voss",
    medium: "Digital Abstract"
  },
  {
    id: 6,
    imageUrl: art6,
    title: "Gallery Hall",
    artist: "Far Chinberdiev",
    medium: "Modern Art"
  },
  //{
  //   id: 7,
  //   imageUrl: "/src/images/art-7.jpg",
  //   title: "Interactive Projection",
  //   artist: "上海老的",
  //   medium: "Digital Installation"
  // },
  // {
  //   id: 8,
  //   imageUrl: "/src/images/art-8.jpg",
  //   title: "Museum Masterpiece",
  //   artist: "Declan Sun",
  //   medium: "Classic Painting"
  // },
  // {
  //   id: 9,
  //   imageUrl: "/src/images/art-9.jpg",
  //   title: "Organic Shapes",
  //   artist: "NYPL Collection",
  //   medium: "Abstract Illustration"
  // },
  // {
  //   id: 10,
  //   imageUrl: "/src/images/art-10.jpg",
  //   title: "Triptych",
  //   artist: "Jason Sung",
  //   medium: "Contemporary Art"
  // },
  // {
  //   id: 11,
  //   imageUrl: "/src/images/art-11.jpg",
  //   title: "Industrial Dreams",
  //   artist: "Birmingham Museums",
  //   medium: "Illustration"
  // },
  // {
  //   id: 12,
  //   imageUrl: "/src/images/art-12.jpg",
  //   title: "Contemplation",
  //   artist: "Egor Myznik",
  //   medium: "Gallery Scene"
  // }
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

// Artwork frame component with 3D effects
function FloatingArtArenaItem({ artwork, index }: { artwork: ArtworkData; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Random asymmetrical positions
  const x = (index % 2 === 0 ? -1 : 1) * (3 + Math.random() * 4);
  const y = (Math.random() - 0.5) * 10;
  const z = -Math.random() * 20;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.005;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <boxGeometry args={[3, 4, 0.1]} />
      <meshStandardMaterial color="#16171A" metalness={0.8} />
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.8, 3.8]} />
        <meshBasicMaterial>
          <ArtworkTexture url={artwork.imageUrl} />
        </meshBasicMaterial>
      </mesh>
    </mesh>
  );
}

// Main carousel component
function Carousel() {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 4;
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // The individual artworks handle their own rotation
      // This group can add subtle overall movement if needed
    }
  });

  return (
    <group ref={groupRef}>
      {artworks.map((artwork, index) => (
        <FloatingArtArenaItem
          key={artwork.id}
          artwork={artwork}
          index={index}
          total={artworks.length}
          radius={radius}
        />
      ))}
    </group>
  );
}

// Scene setup with lighting and environment
function Scene({ isScrolling, isSelected }: { isScrolling: boolean; isSelected: boolean }) {
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
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
      <Carousel />
    </>
  );
}

// Main Gallery component
export function Gallery() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
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
        className="absolute inset-y-0 left-0 z-10 p-8 md:p-12 text-left pointer-events-none w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center"
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
          <br/> carefully curated selection of
          <br />extraordinary works from AURA
          <br />Gallery that push the boundaries
          <br />of contemporary expression
        </p>
      </motion.div>

      {/* 3D Canvas */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 lg:w-2/3 z-[1]"> {/* Ensure 3D canvas is behind content but above default */}
        <Canvas
          camera={{ position: [0, 0, 12], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          onPointerDown={() => setIsSelected(true)}
        >
          <color attach="background" args={["#0B0B0D"]} />
          <fog attach="fog" args={["#0B0B0D", 10, 30]} />
          
          <Suspense fallback={null}>
            <Scene isScrolling={isScrolling} isSelected={isSelected} />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.3em]" style={{ fontFamily: "'Inter', sans-serif" }}>
          
        </span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-20 bg-gradient-to-b from-[var(--color-accent-gold)] via-[var(--color-accent-gold)] to-transparent opacity-60"
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

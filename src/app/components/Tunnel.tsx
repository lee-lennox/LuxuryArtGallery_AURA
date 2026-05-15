import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Float, Environment, Stars, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll } from "motion/react";

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

// Tunnel Ring Component - Creates the tunnel effect
function TunnelRing({ index, total, radius = 5 }: { index: number; total: number; radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const zPosition = (index / total) * -50 - 10; // Deeper tunnel

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.03 + (index * 0.1);

      // Breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.4 + index * 0.2) * 0.01;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0, zPosition]}>
      {/* Main ring */}
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#D6B47C"
          metalness={0.9}
          roughness={0.2}
          emissive="#D6B47C"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5 - (index / total) * 0.3}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.98, 0.01, 16, 100]} />
        <meshBasicMaterial
          color="#D6B47C"
          transparent
          opacity={0.2 - (index / total) * 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Floating Artwork in Tunnel
function FloatingTunnelArtwork({ artwork, index, total, radius = 4 }: { artwork: any; index: number; total: number; radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [revealed, setRevealed] = useState(false);

  const angle = (index / total) * Math.PI * 2;
  const zPosition = Math.sin(index * 0.7) * -20 - 15; // Spread artworks deeper

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const currentAngle = angle + time * 0.05; // Slower rotation

      groupRef.current.position.x = Math.cos(currentAngle) * radius;
      groupRef.current.position.y = Math.sin(time * 0.2 + index) * 1.5; // Subtle vertical float
      groupRef.current.position.z = zPosition;

      // Slowly rotate to face camera, but with a slight offset for depth
      const targetLookAt = new THREE.Vector3(state.camera.position.x * 0.5, state.camera.position.y * 0.5, state.camera.position.z + 10);
      groupRef.current.lookAt(targetLookAt);

      // Reveal animation based on distance to camera
      if (!revealed && state.camera.position.z - groupRef.current.position.z < 30) {
        setRevealed(true);
      }
      if (revealed) {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(0.1, 0.1, 0.1), 0.05);
      }
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1 + index) * 0.05; // Subtle artwork rotation
      // Simulate "bleed color edges" with a subtle emissive pulse
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
      }
    }
  });

  return (
    <group ref={groupRef} scale={[0.1, 0.1, 0.1]}> {/* Start small for reveal */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <boxGeometry args={[2.5, 3.5, 0.05]} /> {/* Larger artworks */}
          <meshStandardMaterial
            color="#D6B47C"
            metalness={0.8}
            roughness={0.2}
            emissive="#D6B47C"
            emissiveIntensity={0.2}
          />
          {/* Inner artwork surface */}
          <mesh position={[0, 0, 0.03]} scale={0.95}>
            <planeGeometry args={[2.3, 3.3]} />
            <meshBasicMaterial>
              <ArtworkTexture url={artwork.imageUrl} />
            </meshBasicMaterial>
          </mesh>
        </mesh>
      </Float>
    </group>
  );
}

// Particles for the tunnel
function TunnelParticles({ count = 1000, isScrolling = false, isSelected = false }: { count?: number; isScrolling?: boolean; isSelected?: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 6; // Wider spread
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 40; // More vertical spread
      const z = -Math.random() * 60 - 10; // Deeper particles
      temp.push({ x, y, z });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.01; // Slower rotation
    }
    if (materialRef.current) {
      const targetOpacity = (isScrolling || !isSelected) ? 0 : 0.6;
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
        size={0.04} // Slightly larger particles
        color="#D6B47C"
        transparent
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Tunnel Scene
export function Tunnel({ scrollProgress, artworks, isScrolling, isSelected }: { scrollProgress: any; artworks: any[]; isScrolling: boolean; isSelected: boolean }) {
  const ringCount = 30; // More rings for deeper tunnel
  const artworkCount = artworks.length;
  const { camera, mouse } = useThree();

  useFrame((state) => {
    // Cinematic camera movement based on scroll and mouse
    const zPos = 8 - (scrollProgress.get() * 80); // Much deeper scroll effect
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, zPos, 0.05);

    // Parallax reaction to mouse
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 3, 0.02); // More sensitive mouse
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 3, 0.02);
    camera.lookAt(0, 0, -50); // Look deeper into the tunnel
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} color="#F4EEE6" />
      <pointLight position={[0, 0, 15]} intensity={4} color="#D6B47C" />
      <spotLight position={[0, 30, 0]} intensity={2.5} color="#F4EEE6" />

      {/* Environment */}
      <Environment preset="city" />

      {/* Deep space stars */}
      <Stars
        radius={200}
        depth={150}
        count={8000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Tunnel rings */}
      {Array.from({ length: ringCount }).map((_, i) => (
        <TunnelRing key={i} index={i} total={ringCount} radius={6} />
      ))}

      {/* Floating artworks */}
      {artworks.map((artwork, i) => (
        <FloatingTunnelArtwork key={artwork.id} artwork={artwork} index={i} total={artworkCount} radius={5} />
      ))}

      {/* Particles */}
      <TunnelParticles count={1000} isScrolling={isScrolling} isSelected={isSelected} />
    </>
  );
}

export function TunnelSection({ artworks }: { artworks: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} id="tunnel" className="relative w-full h-[300vh] bg-[var(--color-bg-primary)]" style={{ position: 'relative' }}>
      <div className="sticky top-0 left-0 w-full h-screen z-[1]"> {/* Ensure this div is behind interactive content but above default */}
        <Canvas 
          gl={{ antialias: true, alpha: true }} 
          dpr={[1, 2]}
          onPointerDown={() => setIsSelected(true)}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
          <color attach="background" args={["#030303"]} />
          <fog attach="fog" args={["#030303", 10, 100]} />
          <Suspense fallback={null}>
            <Tunnel scrollProgress={scrollYProgress} artworks={artworks} isScrolling={isScrolling} isSelected={isSelected} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
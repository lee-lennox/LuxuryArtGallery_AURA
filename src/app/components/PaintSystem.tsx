import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

// Warm gold/amber smoke palette - radial blend of pale gold, honey, and soft bronze
const watercolorColors = [
  "rgba(245, 220, 160, ", // Pale gold
  "rgba(230, 195, 100, ", // Honey gold
  "rgba(218, 175, 80, ",  // Rich gold
  "rgba(200, 155, 70, ",  // Soft bronze
  "rgba(235, 210, 140, ", // Light amber
  "rgba(190, 145, 60, ",  // Deep bronze
];

export function PaintSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
  const animationRef = useRef<number>();
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastEmitTimeRef = useRef<number>(0); // Track last particle emission time

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.lastX = mouseRef.current.x;
      mouseRef.current.lastY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Add particles on mouse move - max 1 particle every ~35ms (28/sec)
      const now = performance.now();
      if (!isScrollingRef.current && now - lastEmitTimeRef.current >= 35) {
        const dx = mouseRef.current.x - mouseRef.current.lastX;
        const dy = mouseRef.current.y - mouseRef.current.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only emit if mouse has moved (avoid stationary particles)
        if (distance > 0.5) {
          const color = watercolorColors[Math.floor(Math.random() * watercolorColors.length)];
          const size = Math.random() * 6 + 3; // Small smoke-like particles (3-9px)
          
          particlesRef.current.push({
            x: mouseRef.current.x + (Math.random() - 0.5) * 20,
            y: mouseRef.current.y + (Math.random() - 0.5) * 20,
            vx: dx * 0.1 + (Math.random() - 0.5) * 2,
            vy: dy * 0.1 + (Math.random() - 0.5) * 2,
            size: size,
            opacity: Math.random() * 0.4 + 0.6,
            color: color,
            life: 1,
            maxLife: Math.random() * 20 + 74, // ~1.4 seconds (74-94 frames at 60fps)
          });
          
          lastEmitTimeRef.current = now;
        }
      }
    };

    // Track touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.lastX = mouseRef.current.x;
        mouseRef.current.lastY = mouseRef.current.y;
        mouseRef.current.x = touch.clientX;
        mouseRef.current.y = touch.clientY;

        // Touch: max 1 particle every ~35ms (28/sec)
        const now = performance.now();
        if (!isScrollingRef.current && now - lastEmitTimeRef.current >= 35) {
          const dx = mouseRef.current.x - mouseRef.current.lastX;
          const dy = mouseRef.current.y - mouseRef.current.lastY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0.5) {
            const color = watercolorColors[Math.floor(Math.random() * watercolorColors.length)];
            const size = Math.random() * 6 + 3;
            
            particlesRef.current.push({
              x: mouseRef.current.x + (Math.random() - 0.5) * 20,
              y: mouseRef.current.y + (Math.random() - 0.5) * 20,
              vx: dx * 0.1 + (Math.random() - 0.5) * 2,
              vy: dy * 0.1 + (Math.random() - 0.5) * 2,
              size: size,
              opacity: Math.random() * 0.4 + 0.6,
              color: color,
              life: 1,
              maxLife: Math.random() * 20 + 74,
            });
            
            lastEmitTimeRef.current = now;
          }
        }
      }
    };

    // Handle scroll to temporarily hide particles
    const handleScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Apply drag
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        // Update life
        p.life -= 1 / p.maxLife;
        
        // Grow very slightly (smoke expands slowly)
        p.size += 0.02;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle with soft edge
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, p.color + (p.opacity * p.life) + ")");
        gradient.addColorStop(0.5, p.color + (p.opacity * p.life * 0.5) + ")");
        gradient.addColorStop(1, p.color + "0)");

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Limit particles to prevent performance issues
      if (particles.length > 500) {
        particles.splice(0, particles.length - 500);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
      style={{ 
        pointerEvents: 'none',
        touchAction: 'none'
      }}
    />
  );
}
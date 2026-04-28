"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, useVelocity, useSpring } from "framer-motion";

function AbstractShape() {
  const pointsRef = useRef<THREE.Points>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const particleCount = 4000;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color("#00F0FF");
    const color2 = new THREE.Color("#8A2BE2");

    for (let i = 0; i < particleCount; i++) {
      const progress = i / particleCount;
      const y = (progress - 0.5) * 20; // Height spread from -10 to 10
      
      const radius = 2 + (Math.random() * 0.6 - 0.3); // Thickness of the helix arm
      const angle = y * 1.5 + (Math.random() * 0.4 - 0.2); // Twist calculation
      
      const isSecondStrand = i % 2 === 0;
      const strandOffset = isSecondStrand ? Math.PI : 0;
      
      pos[i * 3] = Math.cos(angle + strandOffset) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle + strandOffset) * radius;
      
      const baseColor = isSecondStrand ? color1 : color2;
      col[i * 3] = baseColor.r;
      col[i * 3 + 1] = baseColor.g;
      col[i * 3 + 2] = baseColor.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    const velocity = Math.abs(smoothVelocity.get());
    const velocityFactor = Math.min(velocity / 1000, 1);

    if (pointsRef.current) {
      // Normal rotation + rapid tornado spin when scrolling
      pointsRef.current.rotation.y -= delta * (0.15 + velocityFactor * 3);
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;

      // Contract into a tighter spiral when scrolling
      const targetScaleX = 1 - velocityFactor * 0.6;
      const targetScaleY = 1 + velocityFactor * 0.4; // stretches vertically
      pointsRef.current.scale.lerp(new THREE.Vector3(targetScaleX, targetScaleY, targetScaleX), 0.1);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
      <points ref={pointsRef} position={[2.5, 0, -3]} rotation={[0.2, 0, -0.2]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.04} 
          vertexColors={true} 
          transparent 
          opacity={0.8} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </Float>
  );
}

function Particles() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#8A2BE2" transparent opacity={0.2} />
    </points>
  );
}

function Shooters() {
  const count = 20;
  const shooters = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 20,
      z: -10 - Math.random() * 15,
      length: 0.06 + Math.random() * 0.1, // Doubled length
      speed: 0.5 + Math.random() * 1.5,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.5 ? "#00F0FF" : "#8A2BE2",
      thickness: 0.02 + Math.random() * 0.04 // Doubled thickness
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const s = shooters[i];
        child.position.x += s.speed * s.direction * delta;
        
        // Wrap around bounds
        if (s.direction === 1 && child.position.x > 25) {
          child.position.x = -25;
          child.position.y = (Math.random() - 0.5) * 20;
        } else if (s.direction === -1 && child.position.x < -25) {
          child.position.x = 25;
          child.position.y = (Math.random() - 0.5) * 20;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shooters.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[s.length, s.thickness, s.thickness]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0A0A0A] overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00F0FF" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#8A2BE2" />
        
        <AbstractShape />
        <Particles />
        <Shooters />
        
        <Environment preset="city" />
      </Canvas>
      {/* Vignette overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0A_80%)]" />
    </div>
  );
}

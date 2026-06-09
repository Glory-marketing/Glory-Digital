"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function GoldBulb() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial
          color="#BF953F"
          emissive="#BF953F"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.9}
          distort={0.15}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function LightArrows() {
  const arrows = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8 - 2,
          (Math.random() - 0.5) * 6 - 3,
        ] as [number, number, number],
        rotation: Math.random() * Math.PI * 2,
        scale: 0.3 + Math.random() * 0.5,
        opacity: 0.3 + Math.random() * 0.3,
      })),
    []
  );

  return (
    <group>
      {arrows.map((arrow, i) => (
        <mesh
          key={i}
          position={arrow.position}
          rotation={[0, arrow.rotation, Math.PI / 2]}
          scale={arrow.scale}
        >
          <coneGeometry args={[0.08, 0.4, 4]} />
          <meshBasicMaterial
            color="#FCF6BA"
            transparent
            opacity={arrow.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#BF953F" />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#FCF6BA" />
      <GoldBulb />
      <LightArrows />
      <Sparkles
        count={100}
        scale={10}
        size={1.5}
        speed={0.3}
        color="#FCF6BA"
        opacity={0.4}
      />
    </>
  );
}

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  locale: string;
}

export function Hero({ headline, subheadline, ctaText, locale }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0B0B0B]">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl"
        >
          <span className="text-white">{headline.split(" ").slice(0, -1).join(" ")} </span>
          <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
            {headline.split(" ").pop()}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mb-8 max-w-2xl text-lg text-gray-400 md:text-xl"
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex gap-4"
        >
          <a
            href={`/${locale}#contact`}
            data-interactive
            className="rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-8 py-3 font-medium text-black transition-all hover:brightness-110"
          >
            {ctaText}
          </a>
          <a
            href={`/${locale}#portfolio`}
            data-interactive
            className="rounded-lg border border-[#BF953F]/30 px-8 py-3 font-medium text-[#FCF6BA] transition-all hover:bg-[#BF953F]/10"
          >
            View Our Work
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
    </section>
  );
}

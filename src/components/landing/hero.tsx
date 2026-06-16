"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import * as THREE from "three";

function Logo3D() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const textureRef = useRef<THREE.Texture | null>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.2;
    }
  });

  const texture = useMemo(() => {
    const img = new Image();
    img.src = "/logo.png";
    const tex = new THREE.Texture(img);
    img.onload = () => { tex.needsUpdate = true; };
    textureRef.current = tex;
    return tex;
  }, []);

  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.2}>
      <group position={[0, 0.5, 0]}>
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <planeGeometry args={[1.6, 1.6]} />
          <meshBasicMaterial
            map={texture}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0, -0.03]}>
          <ringGeometry args={[0.85, 0.95, 64]} />
          <meshBasicMaterial
            color="#BF953F"
            transparent
            opacity={hovered ? 0.6 : 0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
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
      <Logo3D />
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
  locale: string;
}

export function Hero({ locale }: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0B0B0B]">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
          <Scene />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl"
        >
          <span className="text-white">{t("headline_prefix")} </span>
          <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
            {t("headline_highlight")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mb-8 max-w-2xl text-lg text-gray-400 md:text-xl"
        >
          {t("subheadline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex gap-4"
        >
          <a
            href={`/${locale}/contact`}
            data-interactive
            className="group relative rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-8 py-3 font-medium text-black transition-all hover:brightness-110"
          >
            <span className="relative z-10">{t("cta")}</span>
            <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] opacity-0 blur-xl transition-opacity group-hover:opacity-60" />
          </a>
          <a
            href={`/${locale}/portfolio`}
            data-interactive
            className="group relative rounded-lg border border-[#BF953F]/30 px-8 py-3 font-medium text-[#FCF6BA] transition-all hover:bg-[#BF953F]/10"
          >
            <span className="relative z-10">{t("secondary")}</span>
            <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-[#BF953F]/20 to-transparent opacity-0 blur-lg transition-opacity group-hover:opacity-100" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest text-gray-600 uppercase">
              {locale === "ar" ? "اسحب للأسفل" : "Scroll"}
            </span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-[#BF953F] to-transparent" />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
    </section>
  );
}

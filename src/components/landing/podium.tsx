"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

interface PodiumTileProps {
  position: [number, number, number];
  color: string;
  label: string;
  index: number;
  onHover: (index: number | null) => void;
  isHovered: boolean;
}

function PodiumTile({ position, color, label, index, onHover, isHovered }: PodiumTileProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const targetScale = isHovered ? 1.15 : 1;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.05
      );
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(index)}
        onPointerLeave={() => onHover(null)}
      >
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={isHovered ? color : "#000000"}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />
      </mesh>
      <Center position={[0, -1.5, 0]}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.15}
          height={0.02}
        >
          {label}
          <meshBasicMaterial color="#FCF6BA" />
        </Text3D>
      </Center>
    </group>
  );
}

function PodiumScene() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tiles = [
    { position: [-2.5, 0, 0] as [number, number, number], color: "#BF953F", label: "Marketing" },
    { position: [0, 0, 0] as [number, number, number], color: "#FCF6BA", label: "Design" },
    { position: [2.5, 0, 0] as [number, number, number], color: "#B38728", label: "Coding" },
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#BF953F" />
      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#FCF6BA" />
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2}>
        {tiles.map((tile, i) => (
          <PodiumTile
            key={i}
            {...tile}
            index={i}
            onHover={setHoveredIndex}
            isHovered={hoveredIndex === i}
          />
        ))}
      </Float>
    </>
  );
}

export function ServicesPodium() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white">
            Our <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-gray-400">Premium solutions for premium brands</p>
        </motion.div>

        <div className="mx-auto h-[400px] w-full max-w-4xl">
          <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
            <PodiumScene />
          </Canvas>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { title: "Marketing", desc: "Data-driven strategies that amplify your brand's reach and ROI" },
            { title: "Design", desc: "Visual identities that captivate and communicate your brand story" },
            { title: "Development", desc: "Custom platforms built with cutting-edge technology" },
          ].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-white/5 bg-[#121212] p-6 text-center"
            >
              <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#BF953F] to-[#FCF6BA]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{service.title}</h3>
              <p className="text-sm text-gray-400">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

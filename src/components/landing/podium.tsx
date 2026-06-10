"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import * as THREE from "three";

interface ServiceItem {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  price: string;
  image_url: string;
}

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
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.12}
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

const iconMap: Record<string, string> = {
  print: "🖨", description: "📄", devices: "📱", palette: "🎨", share: "📤", trending_up: "📈",
};

export function ServicesPodium() {
  const t = useTranslations("services");
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then(d => setServices(d))
      .catch(() => {});
  }, []);

  const displayServices = services.length > 0 ? services : [
    { id: "1", name_en: "Marketing Campaigns", name_ar: "حملات تسويقية", description_en: "Data-driven strategies that amplify your brand", description_ar: "", icon: "trending_up", price: "", image_url: "" },
    { id: "2", name_en: "Printing Materials", name_ar: "مطبوعات", description_en: "High-quality printing for all your needs", description_ar: "", icon: "print", price: "", image_url: "" },
    { id: "3", name_en: "Digital Marketing", name_ar: "تسويق إلكتروني", description_en: "Full-service digital marketing", description_ar: "", icon: "devices", price: "", image_url: "" },
  ];

  return (
    <section className="relative py-24" id="services">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white">
            {t("title")}
          </h2>
          <p className="text-gray-400">Premium solutions for premium brands</p>
        </motion.div>

        <div className="mx-auto h-[400px] w-full max-w-4xl">
          <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
            <PodiumScene />
          </Canvas>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {displayServices.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-white/5 bg-[#121212] p-6 text-center hover:border-[#BF953F]/30 transition-all hover:shadow-lg hover:shadow-[#BF953F]/5"
            >
              <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 flex items-center justify-center text-xl">
                {iconMap[s.icon] || "✦"}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{s.name_en}</h3>
              <p className="text-sm text-gray-400">{s.description_en}</p>
              {s.price && (
                <p className="mt-2 text-sm font-medium text-[#FCF6BA]">{s.price}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

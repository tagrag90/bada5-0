"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

interface UserPlanetBoxProps {
  username: string;
  displayName: string;
  skills?: string[];
  subscribersCount?: number;
  color?: string;
}

// 위성 컴포넌트
function Satellite({ angle, distance }: { angle: number; distance: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const x = Math.cos(time * 0.5 + angle) * distance;
      const z = Math.sin(time * 0.5 + angle) * distance;
      meshRef.current.position.set(x, 0.3, z);
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="#60A5FA" emissive="#60A5FA" emissiveIntensity={0.3} />
    </mesh>
  );
}

// 행성 컴포넌트
function UserPlanet({ color, size, skills }: { color: string; size: number; skills: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.003;
    }
  });

  return (
    <group>
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.3, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 행성 */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* 스킬 위성들 */}
      {skills.slice(0, 3).map((_, index) => (
        <Satellite key={index} angle={(index / 3) * Math.PI * 2} distance={size * 2.5} />
      ))}

      <pointLight color={color} intensity={2} distance={10} decay={2} />
    </group>
  );
}

export default function UserPlanetBox({
  username,
  displayName,
  skills = [],
  subscribersCount = 0,
  color = "#8B5CF6",
}: UserPlanetBoxProps) {
  const size = Math.max(1, Math.min(Math.sqrt(subscribersCount / 100) + 0.5, 2.5));

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border shadow-lg bg-[#000510] relative">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <color attach="background" args={["#000510"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Stars radius={50} depth={30} count={1000} factor={3} fade speed={0.5} />
          <UserPlanet color={color} size={size} skills={skills} />
        </Suspense>
      </Canvas>

      {/* 정보 오버레이 */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-white/20">
        <h3 className="text-white font-bold mb-2">{displayName}의 행성</h3>
        <div className="flex gap-4 text-sm text-white/70">
          <div>
            <span className="text-white/50">팔로워</span>
            <p className="text-white font-semibold">{subscribersCount}</p>
          </div>
          <div>
            <span className="text-white/50">스킬</span>
            <p className="text-white font-semibold">{skills.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


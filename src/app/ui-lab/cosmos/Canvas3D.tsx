"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Studio, Connection } from "./types";

// 위성 (스킬) 컴포넌트 - GLB 모델 사용
function SkillSatellite({ project, planetSize, angle, distance }: any) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/satellite2.glb');
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const speed = 0.3;
      const x = Math.cos(time * speed + angle) * distance;
      const z = Math.sin(time * speed + angle) * distance;
      meshRef.current.position.set(x, 0.5, z);
      
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(time) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive 
        object={clonedScene} 
        scale={0.08}
      />
      <pointLight
        color={project.color}
        intensity={1.5}
        distance={1.5}
        decay={2}
      />
    </group>
  );
}

// 위성 (프로젝트) 컴포넌트 - 기존 박스 형태
function ProjectSatellite({ project, planetSize, angle, distance }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const speed = 0.5;
      const x = Math.cos(time * speed + angle) * distance;
      const z = Math.sin(time * speed + angle) * distance;
      meshRef.current.position.set(x, 0.5, z);
      
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial
        color={project.color}
        emissive={project.color}
        emissiveIntensity={0.3}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

// 3D 행성 컴포넌트
function StudioPlanet({ 
  studio, 
  isHovered, 
  isSelected,
  onPointerOver, 
  onPointerOut,
  onClick 
}: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const subscribers = studio.subscribers || studio.subscribersCount || 0;
  // 최소 크기 1, 최대 크기 제한하여 균형있게
  const size = Math.max(1, Math.min(Math.sqrt(subscribers / 100) + 0.5, 5));

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      
      if (isHovered || isSelected) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }

    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.003;
      const glowScale = isHovered || isSelected ? 1.5 : 1.2;
      glowRef.current.scale.lerp(new THREE.Vector3(glowScale, glowScale, glowScale), 0.1);
    }
  });

  return (
    <group position={studio.position3D}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.3, 32, 32]} />
        <meshBasicMaterial
          color={studio.color}
          transparent
          opacity={isHovered || isSelected ? 0.3 : 0.15}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh
        ref={meshRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={studio.color}
          emissive={studio.color}
          emissiveIntensity={isHovered || isSelected ? 0.8 : 0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {studio.projects && studio.projects.map((project: any, index: number) => {
        // 유저 행성이면 SkillSatellite (GLB 모델), 스튜디오면 ProjectSatellite (박스)
        const SatelliteComponent = studio.entityType === "user" ? SkillSatellite : ProjectSatellite;
        
        return (
          <SatelliteComponent
            key={project.id}
            project={project}
            planetSize={size}
            angle={(Math.PI * 2 * index) / studio.projects.length}
            distance={size * 2.5}
          />
        );
      })}

      <pointLight
        color={studio.color}
        intensity={isHovered || isSelected ? 3 : 1.5}
        distance={size * 8}
        decay={2}
      />

      {isHovered && !isSelected && (
        <Html position={[0, size + 2.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="bg-black/90 backdrop-blur-xl px-6 py-4 rounded-xl border border-white/20 shadow-2xl" style={{ width: '320px' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  {studio.name}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: studio.color, boxShadow: `0 0 10px ${studio.color}` }}
                  />
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  {studio.entityType === "user" 
                    ? "개인 프로필" 
                    : studio.type === "TEAM" ? "팀 스튜디오" : "개인 스튜디오"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/60">
                  {studio.entityType === "user" ? "팔로워" : "구독자"}
                </p>
                <p className="text-xl font-bold text-white">{(studio.subscribers || studio.subscribersCount || 0).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/60">타입</p>
                <p className="text-sm font-semibold text-white">{studio.type}</p>
              </div>
            </div>
          </div>
        </Html>
      )}

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 1.4, 64]} />
          <meshBasicMaterial
            color={studio.color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// 3D 연결선 컴포넌트
function ConnectionLine({ from, to, color1, isHighlighted }: any) {
  const lineRef = useRef<any>(null);

  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 1;
    
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);

  const points = useMemo(() => curve.getPoints(50), [curve]);
  const positions = useMemo(() => {
    return new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
  }, [points]);

  useFrame((state) => {
    if (lineRef.current && lineRef.current.material) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      if (isHighlighted) {
        mat.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      } else {
        mat.opacity = 0.3;
      }
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: isHighlighted ? color1 : "#4A5568",
      transparent: true,
      opacity: isHighlighted ? 0.8 : 0.3,
    });
  }, [isHighlighted, color1]);

  const line = useMemo(() => {
    return new THREE.Line(geometry, material);
  }, [geometry, material]);

  return <primitive ref={lineRef} object={line} />;
}

// 파티클 별 배경
function ParticleStars() {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 50 + Math.random() * 50;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.5, 0.8);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0001;
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
    return geom;
  }, [particles]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial size={0.1} vertexColors transparent opacity={0.6} />
    </points>
  );
}

// 카메라 컨트롤러
function CameraController({ 
  selectedId, 
  studios, 
  autoRotate 
}: { 
  selectedId: string | null; 
  studios: Studio[];
  autoRotate: boolean;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const initialPosition = useRef(new THREE.Vector3(30, 20, 30));
  const initialTarget = useRef(new THREE.Vector3(0, 0, 0));
  const previousSelectedId = useRef<string | null>(null);

  useFrame((state) => {
    const controls = controlsRef.current;

    if (selectedId) {
      // 선택 시: OrbitControls 비활성화
      if (controls) {
        controls.enabled = false;
      }

      // 선택이 바뀌었을 때만 목표 위치 계산
      if (previousSelectedId.current !== selectedId) {
        const studio = studios.find((s) => s.id === selectedId);
        if (studio) {
          const planetPos = new THREE.Vector3(...studio.position3D);
          
          // 행성을 정면에서 보는 위치로 이동
          const offset = new THREE.Vector3(0, 2, 6); // 약간 위에서 앞에서 봄
          const targetCameraPos = planetPos.clone().add(offset);
          
          // 부드러운 전환
          const t = 0.1;
          camera.position.lerp(targetCameraPos, t);
          
          // 카메라가 행성을 바라보도록
          const lookAtPos = planetPos.clone();
          camera.lookAt(lookAtPos);
          
          previousSelectedId.current = selectedId;
        }
      } else {
        // 이미 선택된 상태 유지
        const studio = studios.find((s) => s.id === selectedId);
        if (studio) {
          const planetPos = new THREE.Vector3(...studio.position3D);
          const offset = new THREE.Vector3(0, 2, 6);
          const targetCameraPos = planetPos.clone().add(offset);
          
          camera.position.lerp(targetCameraPos, 0.1);
          camera.lookAt(planetPos);
        }
      }
    } else {
      // 선택 해제: OrbitControls 활성화만 하고 위치는 유지
      if (controls) {
        controls.enabled = true;
        controls.autoRotate = autoRotate;
      }

      if (previousSelectedId.current !== null) {
        previousSelectedId.current = null;
      }
      
      // 복귀 애니메이션 제거 - 사용자가 드래그한 위치 유지
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      minDistance={10}
      maxDistance={80}
      makeDefault
    />
  );
}

// 메인 Scene
function Scene({ 
  studios,
  connections,
  hoveredId, 
  selectedId,
  setHoveredId,
  setSelectedId,
  autoRotate
}: {
  studios: Studio[];
  connections: Connection[];
  hoveredId: string | null;
  selectedId: string | null;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
  autoRotate: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      <ParticleStars />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={0.5} />

      {studios.map((studio: Studio) => (
        <StudioPlanet
          key={studio.id}
          studio={studio}
          isHovered={hoveredId === studio.id}
          isSelected={selectedId === studio.id}
          onPointerOver={() => setHoveredId(studio.id)}
          onPointerOut={() => setHoveredId(null)}
          onClick={() => setSelectedId(selectedId === studio.id ? null : studio.id)}
        />
      ))}

      {connections.map((conn: Connection, i: number) => {
        const fromStudio = studios.find((s: Studio) => s.id === conn.from);
        const toStudio = studios.find((s: Studio) => s.id === conn.to);
        if (!fromStudio || !toStudio) return null;

        const isHighlighted = 
          hoveredId === conn.from || 
          hoveredId === conn.to ||
          selectedId === conn.from ||
          selectedId === conn.to;

        return (
          <ConnectionLine
            key={i}
            from={fromStudio.position3D}
            to={toStudio.position3D}
            color1={fromStudio.color}
            isHighlighted={isHighlighted}
          />
        );
      })}

      <CameraController selectedId={selectedId} studios={studios} autoRotate={autoRotate} />
    </>
  );
}

// Canvas3D 메인 컴포넌트
export default function Canvas3D({ 
  studios,
  connections,
  hoveredId,
  selectedId,
  setHoveredId,
  setSelectedId,
  autoRotate
}: {
  studios: Studio[];
  connections: Connection[];
  hoveredId: string | null;
  selectedId: string | null;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
  autoRotate: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [30, 20, 30], fov: 60 }}
      gl={{ antialias: true, alpha: false }}
      className="absolute inset-0"
    >
      <color attach="background" args={["#0a0e27"]} />
      <fog attach="fog" args={["#0a0e27", 30, 100]} />
      
      <Suspense fallback={null}>
        <Scene
          studios={studios}
          connections={connections}
          hoveredId={hoveredId}
          selectedId={selectedId}
          setHoveredId={setHoveredId}
          setSelectedId={setSelectedId}
          autoRotate={autoRotate}
        />
      </Suspense>
    </Canvas>
  );
}

// GLB 모델 프리로드
useGLTF.preload('/models/satellite2.glb');


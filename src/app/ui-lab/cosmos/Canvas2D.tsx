"use client";

import { useEffect, useRef } from "react";
import { Studio, Connection } from "./types";

// 2D용 Studio 데이터 (x, y 좌표 추가)
interface Studio2D extends Studio {
  x: number;
  y: number;
}

export default function Canvas2D({ 
  studios,
  connections,
  zoom,
  offset,
  hoveredId,
  selectedId,
  setHoveredId,
  setSelectedId,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  setZoom,
  setOffset
}: {
  studios: Studio[];
  connections: Connection[];
  zoom: number;
  offset: { x: number; y: number };
  hoveredId: string | null;
  selectedId: string | null;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  dragStart: { x: number; y: number };
  setDragStart: (pos: { x: number; y: number }) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setOffset: (offset: { x: number; y: number }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const studios2DRef = useRef<Studio2D[]>([]);
  const animationFrameRef = useRef<number>();

  // 3D → 2D 좌표 변환 및 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 15; // 3D 좌표를 2D로 변환하는 스케일

    studios2DRef.current = studios.map((studio) => {
      // 3D position의 x, z를 2D x, y로 매핑
      const x = centerX + studio.position3D[0] * scale;
      const y = centerY + studio.position3D[2] * scale;
      
      return {
        ...studio,
        x,
        y,
      };
    });
  }, [studios]);

  // Canvas 렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationTime = 0;

    const render = () => {
      animationTime += 0.01;
      
      ctx.fillStyle = "#0a0e27";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 별 배경
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let i = 0; i < 150; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 73.3) % canvas.height;
        const twinkle = Math.sin(animationTime + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle * 0.3;
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2 + offset.x, -canvas.height / 2 + offset.y);

      // 연결선 그리기
      connections.forEach((conn) => {
        const from = studios2DRef.current.find((s) => s.id === conn.from);
        const to = studios2DRef.current.find((s) => s.id === conn.to);
        if (!from || !to) return;

        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, from.color + "60");
        gradient.addColorStop(1, to.color + "60");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -animationTime * 10;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const offsetY = -50;
        ctx.quadraticCurveTo(midX, midY + offsetY, to.x, to.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Studio 그리기
      studios2DRef.current.forEach((studio) => {
        const subscribers = studio.subscribers || studio.subscribersCount || 0;
        // 최소 크기 10, 최대 크기 제한
        const size = Math.max(10, Math.min(Math.sqrt(subscribers / 10) + 5, 40));
        const isHovered = hoveredId === studio.id;
        const pulse = Math.sin(animationTime * 2) * 0.2 + 1;

        // Glow 효과
        const glowSize = isHovered ? size * 2 * pulse : size * 1.5;
        const gradient = ctx.createRadialGradient(
          studio.x, studio.y, 0,
          studio.x, studio.y, glowSize
        );
        gradient.addColorStop(0, studio.color + "FF");
        gradient.addColorStop(0.5, studio.color + "60");
        gradient.addColorStop(1, studio.color + "00");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(studio.x, studio.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // 별 본체
        ctx.fillStyle = studio.color;
        ctx.beginPath();
        ctx.arc(studio.x, studio.y, size, 0, Math.PI * 2);
        ctx.fill();

        // 반짝임
        if (isHovered) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(studio.x, studio.y, size + 5 + pulse * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 프로젝트 위성 그리기 (정사각형)
        if (studio.projects) {
          studio.projects.forEach((project, index) => {
            const angle = (index / studio.projects!.length) * Math.PI * 2 + animationTime * 0.5;
            const distance = size * 2.5;
            const satX = studio.x + Math.cos(angle) * distance;
            const satY = studio.y + Math.sin(angle) * distance;
            const satSize = 3;

            // 위성 궤도선
            ctx.strokeStyle = studio.color + "20";
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.arc(studio.x, studio.y, distance, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // 위성 본체 (사각형)
            ctx.save();
            ctx.translate(satX, satY);
            ctx.rotate(animationTime * 2);
            ctx.fillStyle = project.color;
            ctx.fillRect(-satSize/2, -satSize/2, satSize, satSize);
            ctx.restore();
          });
        }

        // 이름 표시
        if (isHovered) {
          ctx.fillStyle = "white";
          ctx.font = "bold 16px Pretendard, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(studio.name, studio.x, studio.y - size - 20);
          
          ctx.font = "14px Pretendard, sans-serif";
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          const subscribers = studio.subscribers || studio.subscribersCount || 0;
          ctx.fillText(`${subscribers.toLocaleString()} 구독자`, studio.x, studio.y - size - 4);
        }
      });

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [zoom, offset, hoveredId, selectedId]);

  // 클릭 시 센터링 애니메이션
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (selectedId) {
      const selected = studios2DRef.current.find(s => s.id === selectedId);
      if (!selected) return;

      // 시작 값 저장
      const startOffsetX = offset.x;
      const startOffsetY = offset.y;
      const startZoom = zoom;

      // 목표 값 계산
      const targetOffsetX = canvas.width / 2 - selected.x;
      const targetOffsetY = canvas.height / 2 - selected.y;
      const targetZoom = 2;

      let frame = 0;
      const duration = 30;

      const animate = () => {
        frame++;
        const progress = Math.min(frame / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setOffset({
          x: startOffsetX + (targetOffsetX - startOffsetX) * eased,
          y: startOffsetY + (targetOffsetY - startOffsetY) * eased,
        });
        setZoom(startZoom + (targetZoom - startZoom) * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    } else {
      // 선택 해제 시 원래 뷰로 복귀
      const startOffsetX = offset.x;
      const startOffsetY = offset.y;
      const startZoom = zoom;
      const targetZoom = 1;

      let frame = 0;
      const duration = 30;

      const animate = () => {
        frame++;
        const progress = Math.min(frame / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setOffset({
          x: startOffsetX * (1 - eased),
          y: startOffsetY * (1 - eased),
        });
        setZoom(startZoom + (targetZoom - startZoom) * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [selectedId]);

  // 마우스 인터랙션
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / zoom - offset.x + canvas.width / 2;
    const y = (e.clientY - rect.top - canvas.height / 2) / zoom - offset.y + canvas.height / 2;

    const clicked = studios2DRef.current.find((studio) => {
      const subscribers = studio.subscribers || studio.subscribersCount || 0;
      const size = Math.max(10, Math.min(Math.sqrt(subscribers / 10) + 5, 40));
      const distance = Math.sqrt((x - studio.x) ** 2 + (y - studio.y) ** 2);
      return distance < size;
    });

    if (clicked) {
      setSelectedId(selectedId === clicked.id ? null : clicked.id);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvas.width / 2) / zoom - offset.x + canvas.width / 2;
      const y = (e.clientY - rect.top - canvas.height / 2) / zoom - offset.y + canvas.height / 2;

      const hovered = studios2DRef.current.find((studio) => {
        const subscribers = studio.subscribers || studio.subscribersCount || 0;
        const size = Math.max(10, Math.min(Math.sqrt(subscribers / 10) + 5, 40));
        const distance = Math.sqrt((x - studio.x) ** 2 + (y - studio.y) ** 2);
        return distance < size + 10;
      });

      setHoveredId(hovered?.id || null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev * delta)));
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}


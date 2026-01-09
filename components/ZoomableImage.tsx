"use client";

import Image from "next/image";
import { useState, MouseEvent } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
}

function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  return (
    <div
      className="relative h-64 sm:h-96 lg:h-[500px] w-full rounded-lg overflow-hidden bg-card cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain transition-transform duration-200 ease-out"
        style={{
          transform: isZoomed ? "scale(2)" : "scale(1)",
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
        }}
        priority
      />
    </div>
  );
}

export default ZoomableImage;

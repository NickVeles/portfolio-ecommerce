"use client";

import Image from "next/image";
import { useState, MouseEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ZoomableImageProps {
  src: string;
  alt: string;
}

function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  return (
    <>
      <div
        className="relative h-64 sm:h-96 lg:h-[500px] w-full rounded-lg overflow-hidden bg-card cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={openModal}
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

      {/* Full-screen modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Close button */}
          <Button
            onClick={closeModal}
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 z-50"
            aria-label="Close modal"
          >
            <X className="size-6" />
          </Button>

          {/* Image container */}
          <div
            className="relative w-full h-full p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ZoomableImage;

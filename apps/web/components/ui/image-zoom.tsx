'use client';

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ImageZoomProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  maxZoom?: number;
  className?: string;
  priority?: boolean;
}

/**
 * High-resolution image zoom component for artwork viewing
 * - Click to toggle between 1x and 3x zoom
 * - Mouse position controls pan when zoomed
 * - Smooth transitions for luxury feel
 */
export function ImageZoom({
  src,
  alt,
  width,
  height,
  maxZoom = 3,
  className,
  priority = false,
}: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current || e.touches.length !== 1) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    // Reset to center when zooming out
    if (isZoomed) {
      setPosition({ x: 50, y: 50 });
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-neutral-100 rounded-lg',
        isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in',
        className
      )}
      onClick={toggleZoom}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: isZoomed
            ? `scale(${maxZoom}) translate(${(50 - position.x) / maxZoom}%, ${(50 - position.y) / maxZoom}%)`
            : 'scale(1) translate(0, 0)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          className="object-contain"
          priority={priority}
          quality={95}
        />
      </div>

      {/* Zoom indicator */}
      <div
        className={cn(
          'absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity duration-200',
          isZoomed
            ? 'bg-neutral-900/90 text-white opacity-100'
            : 'bg-white/90 text-neutral-700 opacity-0 group-hover:opacity-100'
        )}
      >
        {isZoomed ? `${maxZoom}x zoom` : 'Click to zoom'}
      </div>
    </div>
  );
}

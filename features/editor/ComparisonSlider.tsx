'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface ComparisonSliderProps {
  originalUrl: string;
  processedUrl: string;
  width?: number;
  height?: number;
  className?: string;
  showCheckerboard?: boolean;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalUrl,
  processedUrl,
  className = '',
  showCheckerboard = true,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0..100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) updatePosition(e.touches[0].clientX);
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`relative select-none overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 cursor-ew-resize aspect-auto max-h-[600px] flex items-center justify-center ${className}`}
    >
      {/* Background layer (Processed Cutout) */}
      <div
        className={`w-full h-full flex items-center justify-center ${
          showCheckerboard ? 'bg-checkerboard-pattern dark:bg-checkerboard-pattern-dark bg-checkerboard' : ''
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={processedUrl}
          alt="Cutout background removed"
          className="max-h-[580px] w-auto max-w-full object-contain pointer-events-none"
        />
      </div>

      {/* Foreground layer (Original Image) clipped to slider position */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalUrl}
          alt="Original photo"
          className="max-h-[580px] w-auto max-w-full object-contain pointer-events-none"
        />
      </div>

      {/* Vertical divider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white dark:bg-gray-900 border-2 border-brand-500 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
          <ChevronsLeftRight className="w-4 h-4" />
        </div>
      </div>

      {/* Comparison Pill Badges */}
      <div className="absolute bottom-4 left-4 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-white text-[11px] font-semibold tracking-wide uppercase">
        Original
      </div>
      <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-md bg-brand-600/80 backdrop-blur text-white text-[11px] font-semibold tracking-wide uppercase">
        Cutout
      </div>
    </div>
  );
};

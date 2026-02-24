'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const dotRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);
  const requestRef = React.useRef<number>();
  const mousePos = React.useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  const updateCursor = () => {
    if (dotRef.current && ringRef.current) {
      const dotX = mousePos.current.x;
      const dotY = mousePos.current.y;

      dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ringRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    }
    requestRef.current = requestAnimationFrame(updateCursor);
  };

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer');
        setIsHovering(!!isClickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);

    requestRef.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={dotRef}
        className={cn(
          'hidden md:block fixed top-0 left-0 z-[9999] pointer-events-none transition-transform duration-200 ease-out',
          'w-3 h-3 rounded-full bg-primary',
          isHovering && 'scale-[2.5]',
          !isVisible && 'scale-0'
        )}
        style={{
          // Use translates for the offset instead of translate-x/y classes for rAF compatibility
          marginTop: '-6px',
          marginLeft: '-6px',
        }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={cn(
          'hidden md:block fixed top-0 left-0 z-[9999] pointer-events-none transition-all duration-300 ease-out',
          'w-10 h-10 rounded-full border-2 border-primary/50',
          isHovering && 'scale-150 opacity-0',
          !isVisible && 'scale-0'
        )}
        style={{
          marginTop: '-20px',
          marginLeft: '-20px',
        }}
        aria-hidden="true"
      />
    </>
  );
}

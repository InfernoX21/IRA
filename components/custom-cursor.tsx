'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const [position, setPosition] = React.useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          'hidden md:block fixed top-0 left-0 z-[9999] pointer-events-none transition-transform duration-200 ease-out',
          'w-3 h-3 rounded-full bg-primary',
          'transform -translate-x-1/2 -translate-y-1/2',
          isHovering && 'scale-[2.5]',
          !isVisible && 'scale-0'
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        aria-hidden="true"
      />
      <div
        className={cn(
          'hidden md:block fixed top-0 left-0 z-[9999] pointer-events-none transition-all duration-300 ease-out',
          'w-10 h-10 rounded-full border-2 border-primary/50',
          'transform -translate-x-1/2 -translate-y-1/2',
          isHovering && 'scale-150 opacity-0',
          !isVisible && 'scale-0'
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        aria-hidden="true"
      />
    </>
  );
}

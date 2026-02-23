'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  end,
  duration = 2000,
  className,
  prefix = '',
  suffix = '',
  decimals = 0
}: AnimatedCounterProps) {
  const [count, setCount] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = React.useState(false);
  const requestRef = React.useRef<number>();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!isInView || !mounted) return;

    const start = 0;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const current = easedProgress * (end - start) + start;
      setCount(current);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [end, duration, isInView, mounted]);

  const formattedValue = count.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  const staticValue = end.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  if (!mounted) {
    return (
      <span ref={ref} className={cn(className)}>
        {prefix}{staticValue}{suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

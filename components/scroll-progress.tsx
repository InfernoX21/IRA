'use client';

import * as React from 'react';

export default function ScrollProgress() {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight === clientHeight) {
        setWidth(0);
        return;
      }
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setWidth(scrollPercent);
    };

    handleScroll(); // Initialize on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[60] h-1 w-full bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))] transition-all duration-75 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Leaf, TrendingUp } from 'lucide-react';
import ScrollAnimationWrapper from '../scroll-animation-wrapper';
import AnimatedCounter from '../animated-counter';
import { cn } from '@/lib/utils';
import TerrainCanvas from '../terrain-canvas';

const floatingMetrics = [
  { icon: <TrendingUp className="h-6 w-6 text-primary" />, label: 'Urban Growth Score', value: 8.7, suffix: '/10', decimals: 1 },
  { icon: <BarChart className="h-6 w-6 text-primary" />, label: 'Real-time Climate Index', value: 72, suffix: '%' },
  { icon: <Leaf className="h-6 w-6 text-primary" />, label: 'Sustainability Rating', value: 92.5, suffix: '%', decimals: 1 },
];

export default function Hero() {
  const fullText = "Intelligent Resource\nArchitecture";
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-24 text-center">
      {/* Satellite Scan Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/30 blur-sm animate-scan z-0" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

      {/* Holographic Terrain Background */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <TerrainCanvas />
      </div>

      {/* Darkening Gradient for content focus */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background/60 z-[2]" />

      {/* Signal Status Indicator */}
      <div className="absolute top-32 right-6 md:right-12 z-20 flex items-center gap-2 text-[10px] font-mono text-primary/50 tracking-[0.2em] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span>Live_Satellite_Feed: Stable</span>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      <div className="container px-4 md:px-6 z-10">
        <div className="grid gap-6">
          <ScrollAnimationWrapper>
            <h1 className={cn(
              "font-headline text-3xl font-extrabold tracking-[-0.02em] uppercase sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300 min-h-[1.2em]",
              !isTypingComplete && "typing-cursor"
            )}>
              {displayText.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && displayText.includes('\n') && <br />}
                </span>
              ))}
            </h1>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper delay={200}>
            <p className="mx-auto max-w-[700px] text-neutral-300 md:text-xl uppercase tracking-[0.1em] font-medium text-sm">
              Advanced sustainability intelligence.
            </p>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Button size="lg" className="group animate-pulse-glow">
                Explore Platform <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://docs.google.com/document/d/1zlYiXDWz9S8YjM9Bmehbl4lEUQo3HUBiInyRYL26a4Q/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                  View Research
                </a>
              </Button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {floatingMetrics.map((metric, index) => (
              <ScrollAnimationWrapper key={index} delay={600 + index * 100}>
                <div className="glass-card p-4 flex items-center gap-4 animate-slow-float" style={{ animationDelay: `${index * 150}ms` }}>
                  {metric.icon}
                  <div>
                    <p className="text-sm text-neutral-400">{metric.label}</p>
                    <p className="text-2xl font-bold font-headline tabular-nums">
                      <AnimatedCounter end={metric.value} decimals={metric.decimals || 0} />
                      {metric.suffix}
                    </p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

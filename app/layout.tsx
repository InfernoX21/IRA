import * as React from 'react';
import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import CustomCursor from "@/components/custom-cursor";
import ScrollProgress from "@/components/scroll-progress";
import './globals.css';
import { cn } from '@/lib/utils';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IRA – Intelligent Resource Architecture',
  description: 'Reimagining Urban Sustainability with Intelligent Infrastructure',
  icons: {
    icon: "favicon.png",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

import VideoScrollCanvas from '@/components/video-scroll-canvas';
import IntelligenceOverlay from '@/components/intelligence-overlay';
import WeatherSystems from '@/components/weather-systems';

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={cn("dark", spaceGrotesk.variable, plusJakartaSans.variable)}>
      <body className="font-body bg-background text-foreground antialiased selection:bg-primary/40">
        <IntelligenceOverlay />
        <WeatherSystems />
        <VideoScrollCanvas
          frameCount={240}
          basePath="video-frames"
          pattern="ezgif-frame-%NUM%.jpg"
        />
        <div className="fixed inset-0 -z-20 h-full w-full bg-gradient-to-br from-background/30 via-black/60 to-background/30" />
        <div className="animated-grid" />

        <CustomCursor />
        <ScrollProgress />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

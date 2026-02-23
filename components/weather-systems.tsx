'use client';

import React from 'react';

export default function WeatherSystems() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
            {/* Wind Particle Drift */}
            <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-drift-long opacity-30"
                        style={{
                            top: `${Math.random() * 100}%`,
                            width: `${200 + Math.random() * 400}px`,
                            animationDuration: `${30 + Math.random() * 60}s`,
                            animationDelay: `${-Math.random() * 60}s`,
                        }}
                    />
                ))}
            </div>

            {/* Ambient Cloud Shadows */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute -top-[50%] -left-[50%] w-[200vw] h-[200vw] bg-radial-gradient from-black/20 via-transparent to-transparent animate-drift-cloud" />
                <div className="absolute -bottom-[30%] -right-[20%] w-[150vw] h-[150vw] bg-radial-gradient from-black/15 via-transparent to-transparent animate-drift-cloud" style={{ animationDelay: '-60s' }} />
            </div>

            {/* Temperature Gradient Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 mix-blend-overlay animate-pulse-slow" />

            {/* Atmospheric Data Indicators */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[8px] font-mono text-primary/40 tracking-tighter uppercase vertical-text">
                    <span>ATMOS_PRESSURE_MSL: 1013.2hPa</span>
                </div>
            </div>

            <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
      `}</style>
        </div>
    );
}

// Keyframe for wind drift is already in globals.css (animate-drift-long)

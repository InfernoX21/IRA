'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function IntelligenceOverlay() {
    const [coords, setCoords] = useState({ lat: '34.0522 N', long: '118.2437 W' });
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const html = document.documentElement;
            const progress = html.scrollTop / (html.scrollHeight - window.innerHeight);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);

        const interval = setInterval(() => {
            // Simulate slow coordinate shifts
            setCoords({
                lat: `${(34.0522 + Math.random() * 0.001).toFixed(4)} N`,
                long: `${(118.2437 + Math.random() * 0.001).toFixed(4)} W`,
            });
        }, 5000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden transition-opacity duration-700 bg-[#0B0F0D]"
            style={{ opacity: 0.12 + scrollProgress * 0.08 }}
        >
            {/* Dark Terrain / Noise Texture Layer */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
                style={{
                    backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
                    backgroundSize: '200px 200px'
                }}
            />

            {/* GIS Grid Layer - density increases on scroll */}
            <div
                className="absolute inset-0 gis-grid transition-all duration-700"
                style={{
                    backgroundSize: `${50 - scrollProgress * 15}px ${50 - scrollProgress * 15}px`,
                    transform: `scale(${1 + scrollProgress * 0.1})`
                }}
            />

            {/* Topographic Lines Layer */}
            <div className="absolute inset-0 topo-lines opacity-20" />

            {/* Heatmap Overlay Zones */}
            <div className="absolute inset-0 overflow-hidden opacity-40">
                <div
                    className="absolute top-[20%] left-[15%] w-[40vw] h-[40vw] bg-primary/20 blur-[100px] animate-morph animate-heatpulse"
                    style={{ animationDelay: '0s' }}
                />
                <div
                    className="absolute bottom-[10%] right-[20%] w-[35vw] h-[35vw] bg-accent/15 blur-[120px] animate-morph animate-heatpulse"
                    style={{ animationDelay: '-4s' }}
                />
                <div
                    className="absolute top-[40%] right-[10%] w-[30vw] h-[30vw] bg-primary/10 blur-[80px] animate-morph animate-heatpulse"
                    style={{ animationDelay: '-2s' }}
                />
            </div>

            {/* Satellite Scan Sweep */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/30 blur-sm animate-scan z-10" />

            {/* Data Node Connections (SVG) */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M 200 300 Q 400 100, 600 300 T 1000 300"
                    fill="none"
                    stroke="hsla(var(--primary), 0.4)"
                    strokeWidth="0.5"
                    strokeDasharray="2 4"
                    className="animate-dash"
                />
                <path
                    d="M 100 600 Q 300 800, 500 600 T 900 600"
                    fill="none"
                    stroke="hsla(var(--primary), 0.3)"
                    strokeWidth="0.5"
                    strokeDasharray="2 4"
                    className="animate-dash"
                    style={{ animationDelay: '-5s' }}
                />
            </svg>

            {/* Lat/Long Indicators */}

            {/* Lat/Long Indicators */}
            <div className="absolute top-24 left-6 md:left-12 flex flex-col gap-1 text-[10px] font-mono text-primary/60 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-data-pulse" />
                    <span>SYS_NODE_ALPHA: {coords.lat}</span>
                </div>
                <div className="animate-drift-lat opacity-40">
                    GRID_REF_X: 002.341.009
                </div>
            </div>

            <div className="absolute bottom-24 right-6 md:right-12 flex flex-col items-end gap-1 text-[10px] font-mono text-primary/60 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span>SEC_DATA_LINK: {coords.long}</span>
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-data-pulse" style={{ animationDelay: '1s' }} />
                </div>
                <div className="animate-drift-long opacity-40">
                    SIGNAL_LOCK: STABLE_V3
                </div>
            </div>

            {/* Random Pulse Nodes */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-primary/30 rounded-full blur-sm animate-data-pulse" />
            <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-primary/20 rounded-full blur-sm animate-data-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-primary/25 rounded-full blur-sm animate-data-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Corner Brackets */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-primary/20" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-primary/20" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-primary/20" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-primary/20" />
        </div>
    );
}

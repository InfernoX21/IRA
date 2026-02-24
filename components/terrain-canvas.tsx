'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function TerrainCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const ripplesRef = useRef<Array<{ x: number, y: number, time: number, maxAge: number }>>([]);

    useEffect(() => {
        const handleScroll = () => {
            const html = document.documentElement;
            setScrollProgress(html.scrollTop / (html.scrollHeight - window.innerHeight));
        };

        const handleClick = (e: MouseEvent) => {
            // Only add up to 3 simultaneous ripples for performance
            if (ripplesRef.current.length >= 3) {
                ripplesRef.current.shift();
            }

            ripplesRef.current.push({
                x: e.clientX,
                y: e.clientY,
                time: 0,
                maxAge: 1.2 // 1.2 seconds duration
            });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClick);
        };
    }, []);

    const isVisibleRef = useRef(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );

        if (canvasRef.current) {
            observer.observe(canvasRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2 for performance
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', resize);
        resize();

        const draw = () => {
            if (!isVisibleRef.current) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }

            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const width = window.innerWidth;
            const height = window.innerHeight;
            const spacing = 40;
            const lines = 15;

            // Update ripples
            ripplesRef.current = ripplesRef.current
                .map(r => ({ ...r, time: r.time + 0.016 })) // approx 60fps
                .filter(r => r.time < r.maxAge);

            // Draw Topographic Lines
            for (let i = 0; i < lines; i++) {
                ctx.beginPath();
                const yBase = (height * 0.5) + i * spacing + (Math.sin(time + i * 0.5) * 15);

                for (let x = 0; x <= width; x += 30) {
                    // Constant slow wave distortion
                    let distortion = Math.sin(x * 0.005 + time + i * 0.4) * 25;

                    // Apply interactive ripples
                    let rippleDistortion = 0;
                    ripplesRef.current.forEach(ripple => {
                        const dx = x - ripple.x;
                        const dy = yBase - ripple.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // Wave propagation logic
                        const rippleSpeed = 800; // pixels per second
                        const waveFront = ripple.time * rippleSpeed;
                        const distToWave = Math.abs(distance - waveFront);

                        if (distToWave < 150) { // Wave width
                            const ageFactor = 1 - (ripple.time / ripple.maxAge);
                            const proximity = 1 - (distToWave / 150);
                            rippleDistortion += Math.sin((distance - waveFront) * 0.05) * 40 * ageFactor * proximity;
                        }
                    });

                    const y = yBase + distortion + rippleDistortion;

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                // Dynamic glow effect during ripples
                const hasActiveRipple = ripplesRef.current.length > 0;
                ctx.strokeStyle = hasActiveRipple
                    ? `rgba(0, 200, 83, ${0.3 + ripplesRef.current.length * 0.1})`
                    : 'rgba(0, 200, 83, 0.3)';
                ctx.lineWidth = hasActiveRipple ? 2 : 1.5;
                ctx.stroke();
            }

            // Draw vertical "breathing" elevation nodes
            ctx.fillStyle = 'rgba(0, 200, 83, 0.4)';
            for (let j = 0; j < 8; j++) {
                const x = width * (0.1 + j * 0.12);
                let y = height * 0.6 + Math.sin(time * 2 + j) * 40;

                // Nodes also respond to ripples
                ripplesRef.current.forEach(ripple => {
                    const dx = x - ripple.x;
                    const dy = y - ripple.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const rippleSpeed = 800;
                    const waveFront = ripple.time * rippleSpeed;
                    if (Math.abs(distance - waveFront) < 100) {
                        y -= (1 - (Math.abs(distance - waveFront) / 100)) * 20;
                    }
                });

                ctx.beginPath();
                ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                ctx.fill();

                // Faint connection line
                ctx.beginPath();
                ctx.moveTo(x, height * 0.6);
                ctx.lineTo(x, y);
                ctx.strokeStyle = 'rgba(0, 200, 83, 0.1)';
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-transform duration-700 ease-out"
            style={{
                transform: `scale(${1 + scrollProgress * 0.1})`,
                opacity: 0.8
            }}
        />
    );
}

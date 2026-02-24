'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getAssetPath } from '@/lib/path-utils';

interface VideoScrollCanvasProps {
    frameCount: number;
    basePath: string;
    pattern: string; // e.g., "ezgif-frame-%NUM%.jpg"
}

export default function VideoScrollCanvas({ frameCount, basePath, pattern }: VideoScrollCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Preload images
    useEffect(() => {
        const preloadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                const frameNum = i.toString().padStart(3, '0');
                const path = `${basePath}/${pattern.replace('%NUM%', frameNum)}`;
                img.src = getAssetPath(path);

                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === frameCount) {
                        setImages(loadedImages);
                        setIsLoading(false);
                    }
                };
                loadedImages.push(img);
            }
        };

        preloadImages();
    }, [frameCount, basePath, pattern]);

    // Handle scroll and draw
    useEffect(() => {
        if (isLoading || images.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        let lastFrame = -1;
        const updateCanvas = () => {
            const html = document.documentElement;
            const scrollTop = window.pageYOffset || html.scrollTop;
            const maxScrollTop = html.scrollHeight - window.innerHeight;
            const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
            const frameIndex = Math.floor(scrollFraction * (frameCount - 1));

            if (frameIndex !== lastFrame) {
                lastFrame = frameIndex;
                requestAnimationFrame(() => drawFrame(frameIndex));
            }
        };

        let cachedDimensions = { width: 0, height: 0, x: 0, y: 0, newWidth: 0, newHeight: 0 };

        const drawFrame = (index: number) => {
            if (!images[index] || !canvas || !context) return;
            const img = images[index];

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, cachedDimensions.x, cachedDimensions.y, cachedDimensions.newWidth, cachedDimensions.newHeight);
        };

        const handleResize = () => {
            if (!canvas || images.length === 0) return;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = window.innerWidth;
            const h = window.innerHeight;

            canvas.width = w * dpr;
            canvas.height = h * dpr;

            const img = images[0];
            const zoomFactor = 1.3;
            const ratio = Math.max(canvas.width / img.width, canvas.height / img.height) * zoomFactor;

            cachedDimensions = {
                width: canvas.width,
                height: canvas.height,
                newWidth: img.width * ratio,
                newHeight: img.height * ratio,
                x: (canvas.width - img.width * ratio) / 2,
                y: (canvas.height - img.height * ratio) / 2
            };

            updateCanvas();
        };

        window.addEventListener('scroll', updateCanvas, { passive: true });
        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('scroll', updateCanvas);
            window.removeEventListener('resize', handleResize);
        };
    }, [isLoading, images, frameCount]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-30 w-full h-full object-cover"
            style={{ opacity: isLoading ? 0 : 0.6, transition: 'opacity 1s ease-in-out' }}
        />
    );
}

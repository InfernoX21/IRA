'use client';

import React, { useEffect, useRef, useState } from 'react';

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
                img.src = `${basePath}/${pattern.replace('%NUM%', frameNum)}`;

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

        const updateCanvas = () => {
            const html = document.documentElement;
            const scrollTop = html.scrollTop;
            const maxScrollTop = html.scrollHeight - window.innerHeight;
            const scrollFraction = scrollTop / maxScrollTop;
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollFraction * frameCount)
            );

            requestAnimationFrame(() => drawFrame(frameIndex));
        };

        const drawFrame = (index: number) => {
            if (!images[index] || !canvas || !context) return;

            const img = images[index];

            const dpr = window.devicePixelRatio || 1;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Use a higher zoom factor to ensure no black edges and satisfying "zoom a bit more" request
            const zoomFactor = 1.3;
            const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight) * zoomFactor;
            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;
            const x = (canvasWidth - newWidth) / 2;
            const y = (canvasHeight - newHeight) / 2;

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(img, x, y, newWidth, newHeight);
        };

        // Resize handler
        const handleResize = () => {
            if (canvas) {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                // No need to set CSS size here as it's handled by Tailwind classes (w-full h-full)
                updateCanvas();
            }
        };

        window.addEventListener('scroll', updateCanvas);
        window.addEventListener('resize', handleResize);

        // Initial draw
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

import { useState, useEffect, useRef } from 'react';
import type { CollisionSystem } from '../../types';
import { GAME_CONFIG, ASSET_PATHS } from '../../constants';

export const useCollisionSystem = (): CollisionSystem => {
  const collisionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const collisionContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const maskImageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const backgroundSizeRef = useRef({ width: 0, height: 0 });

  const checkCollision = (x: number, y: number): boolean => {
    if (!collisionContextRef.current || !isLoaded) {
      return false;
    }

    try {
      const maskWidth = collisionCanvasRef.current?.width || 0;
      const maskHeight = collisionCanvasRef.current?.height || 0;
      const bgWidth = backgroundSizeRef.current.width;
      const bgHeight = backgroundSizeRef.current.height;
      
      if (maskWidth === 0 || maskHeight === 0 || bgWidth === 0 || bgHeight === 0) {
        return false;
      }
      
      const shadowCenterWorldX = GAME_CONFIG.WIDTH / 2;
      const shadowCenterWorldY = GAME_CONFIG.HEIGHT / 2 + GAME_CONFIG.CHARACTER.HEIGHT / 2 - 10;
      const bgX = shadowCenterWorldX - x;
      const bgY = shadowCenterWorldY - y;
      const scaleX = maskWidth / bgWidth;
      const scaleY = maskHeight / bgHeight;
      const maskX = Math.floor(bgX * scaleX);
      const maskY = Math.floor(bgY * scaleY);
      
      if (maskX >= 0 && maskX < maskWidth && maskY >= 0 && maskY < maskHeight) {
        const pixelData = collisionContextRef.current.getImageData(maskX, maskY, 1, 1).data;
        const [r, g, b] = pixelData;
        const isWhite = r === 255 && g === 255 && b === 255;
        return !isWhite;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const loadMask = () => {
      const maskImage = new Image();
      maskImageRef.current = maskImage;
      maskImage.onload = () => {
        const maskWidth = maskImage.naturalWidth;
        const maskHeight = maskImage.naturalHeight;
        const canvas = document.createElement('canvas');
        canvas.width = maskWidth;
        canvas.height = maskHeight;
        collisionCanvasRef.current = canvas;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        collisionContextRef.current = context;
        collisionContextRef.current.drawImage(maskImage, 0, 0, maskWidth, maskHeight);
        setIsLoaded(true);
      };
      maskImage.src = ASSET_PATHS.BACKGROUND_MASK;
    };

    const bgImage = new Image();
    bgImage.onload = () => {
      backgroundSizeRef.current = {
        width: bgImage.naturalWidth,
        height: bgImage.naturalHeight
      };
      loadMask();
    };
    bgImage.src = ASSET_PATHS.BACKGROUND;
  }, []);

  return { checkCollision, isLoaded };
};
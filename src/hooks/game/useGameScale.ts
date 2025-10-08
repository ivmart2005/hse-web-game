import { useState, useEffect, useRef } from 'react';
import type { GameScale } from '../../types';
import { GAME_CONFIG } from '../../constants';

export const useGameScale = (): GameScale => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        if (containerWidth > 0 && containerHeight > 0) {
          const scaleX = containerWidth / GAME_CONFIG.WIDTH;
          const scaleY = containerHeight / GAME_CONFIG.HEIGHT;
          const newScale = Math.min(scaleX, scaleY);
          setScale(newScale);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return { scale, containerRef: containerRef as React.RefObject<HTMLDivElement> };
};
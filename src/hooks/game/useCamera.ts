import { useState, useEffect, useRef } from 'react';
import type { Velocity } from '../../types';
import { CAMERA_CONFIG, PHYSICS } from '../../constants';

export const useCamera = () => {
  const [zoom, setZoom] = useState<number>(CAMERA_CONFIG.BASE_ZOOM);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const updateCamera = (velocity: Velocity) => {
    const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    const targetZoom = CAMERA_CONFIG.BASE_ZOOM + 
      (currentSpeed / PHYSICS.MAX_SPEED) * (CAMERA_CONFIG.MAX_ZOOM - CAMERA_CONFIG.BASE_ZOOM);
    
    setZoom(prevZoom => {
      const zoomDiff = targetZoom - prevZoom;
      return prevZoom + zoomDiff * CAMERA_CONFIG.ZOOM_SPEED;
    });
  };

  return { zoom, updateCamera };
};
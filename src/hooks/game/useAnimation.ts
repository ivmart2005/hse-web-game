import { useState, useEffect, useRef } from 'react';
import { ANIMATION_CONFIG } from '../../constants';

export const useAnimation = (isWalking: boolean) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isWalking) {
      animationTimer.current = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % ANIMATION_CONFIG.WALK.FRAMES.length);
      }, ANIMATION_CONFIG.WALK.FRAME_DURATION);
    } else {
      setCurrentFrame(0);
    }

    return () => {
      if (animationTimer.current) {
        clearInterval(animationTimer.current);
        animationTimer.current = null;
      }
    };
  }, [isWalking]);

  const getCurrentFrame = () => {
    if (!isWalking) {
      return 0;
    }
    return ANIMATION_CONFIG.WALK.FRAMES[currentFrame];
  };

  return { currentFrame: getCurrentFrame() };
};
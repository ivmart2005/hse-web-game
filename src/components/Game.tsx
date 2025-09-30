import React, { useState, useEffect, useRef } from 'react';

interface Keys {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

const BASE_URL = '';

const useGameScale = (gameWidth: number, gameHeight: number) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const scaleX = containerWidth / gameWidth;
        const scaleY = containerHeight / gameHeight;
        const newScale = Math.min(scaleX, scaleY);
        
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    
    return () => window.removeEventListener('resize', updateScale);
  }, [gameWidth, gameHeight]);

  return { scale, containerRef };
};

const GameWorld: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [facingDirection, setFacingDirection] = useState<'right' | 'left'>('right');

  const moveSpeed = 3;
  const keys = useRef<Keys>({ w: false, a: false, s: false, d: false });
  const animationFrameId = useRef<number | null>(null);
  const walkAnimationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const frames = [1, 2, 3, 4, 5, 6, 10];
  const preloadedImages = useRef<Map<number, string>>(new Map());

  const GAME_WIDTH = 1600;
  const GAME_HEIGHT = 600;
  
  const characterWidth = 300;
  const characterHeight = 490;

  const { scale, containerRef } = useGameScale(GAME_WIDTH, GAME_HEIGHT);

  useEffect(() => {
    frames.forEach(frame => {
      const img = new Image();
      img.src = `${BASE_URL}/assets/images/walk_animation/${frame}.png`;
      preloadedImages.current.set(frame, img.src);
    });
    
    const staticImg = new Image();
    staticImg.src = `${BASE_URL}/assets/images/walk_animation/static.png`;
    preloadedImages.current.set(0, staticImg.src);
  }, []);

  useEffect(() => {
    if (isWalking) {
      walkAnimationTimer.current = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % frames.length);
      }, 210);
    } else {
      setCurrentFrame(0);
    }

    return () => {
      if (walkAnimationTimer.current) {
        clearInterval(walkAnimationTimer.current);
      }
    };
  }, [isWalking]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'arrowright':
        case 'd':
          keys.current.d = true;
          setIsWalking(true);
          setFacingDirection('right');
          break;
        case 'arrowleft':
        case 'a':
          keys.current.a = true;
          setIsWalking(true);
          setFacingDirection('left');
          break;
        case 'arrowdown':
        case 's':
          keys.current.s = true;
          setIsWalking(true);
          break;
        case 'arrowup':
        case 'w':
          keys.current.w = true;
          setIsWalking(true);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'arrowright':
        case 'd':
          keys.current.d = false;
          break;
        case 'arrowleft':
        case 'a':
          keys.current.a = false;
          break;
        case 'arrowdown':
        case 's':
          keys.current.s = false;
          break;
        case 'arrowup':
        case 'w':
          keys.current.w = false;
          break;
        default:
          break;
      }

      if (!keys.current.d && !keys.current.a && !keys.current.s && !keys.current.w) {
        setIsWalking(false);
      }
    };

    const gameLoop = () => {
      setPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (keys.current.d) newX -= moveSpeed;
        if (keys.current.a) newX += moveSpeed;
        if (keys.current.s) newY -= moveSpeed;
        if (keys.current.w) newY += moveSpeed;

        return { x: newX, y: newY };
      });

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (walkAnimationTimer.current) {
        clearInterval(walkAnimationTimer.current);
      }
    };
  }, []);

  const getCurrentImage = () => {
    if (!isWalking) {
      return `${BASE_URL}/assets/images/walk_animation/static.png`;
    }
    const frameIndex = frames[currentFrame];
    return `${BASE_URL}/assets/images/walk_animation/${frameIndex}.png`;
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000'
      }}
    >
      <div style={{
        width: `${GAME_WIDTH}px`,
        height: `${GAME_HEIGHT}px`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center center',
        overflow: 'hidden'
      }}>
        <img
          src={`${BASE_URL}/assets/images/background.png`}
          alt="game background"
          style={{
            position: 'absolute',
            top: position.y,
            left: position.x,
            width: 'auto',
            height: 'auto',
            minWidth: '100%',
            minHeight: '100%'
          }}
        />

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transformStyle: 'preserve-3d'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '210px',
            height: '80px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '50%',
            zIndex: 1
          }} />
          
          <img
            src={getCurrentImage()}
            alt="character"
            style={{
              width: `${characterWidth}px`,
              height: `${characterHeight}px`,
              transform: facingDirection === 'left' ? 'scaleX(-1)' : 'none',
              transition: 'transform 0.1s ease',
              position: 'relative',
              zIndex: 2
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameWorld;
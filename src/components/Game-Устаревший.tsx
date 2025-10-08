import React, { useState, useEffect, useRef } from 'react';
import './Game.css';

interface Keys {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

interface Velocity {
  x: number;
  y: number;
}

// хук для расчёта масштаба
const useGameScale = (gameWidth: number, gameHeight: number) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        if (containerWidth > 0 && containerHeight > 0 && gameWidth > 0 && gameHeight > 0) {
          const scaleX = containerWidth / gameWidth;
          const scaleY = containerHeight / gameHeight;
          const newScale = Math.min(scaleX, scaleY);
          
          setScale(newScale);
        }
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return { scale, containerRef };
};

const Game: React.FC = () => {
  const [position, setPosition] = useState({ x: -180, y: -250 });
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [facingDirection, setFacingDirection] = useState<'right' | 'left'>('right');
  const [cameraZoom, setCameraZoom] = useState(1);

  // Константы игры
  const acceleration = 0.15;
  const deceleration = 0.1;
  const maxSpeed = 5;
  const baseZoom = 1;
  const maxZoom = 1.2;
  const zoomSpeed = 0.002;
  const frames = [1, 2, 3, 4, 5, 6, 10];
  const GAME_WIDTH = 1600;
  const GAME_HEIGHT = 600;
  const characterWidth = 280;
  const characterHeight = 460;

  const keys = useRef<Keys>({ w: false, a: false, s: false, d: false });
  const velocity = useRef<Velocity>({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  const walkAnimationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameLoopRunning = useRef(false);

  // Маска коллизий
  const collisionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const collisionContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const maskImageRef = useRef<HTMLImageElement | null>(null);
  const maskLoadedRef = useRef(false);
  const backgroundSizeRef = useRef({ width: 0, height: 0 });

  const { scale, containerRef } = useGameScale(GAME_WIDTH, GAME_HEIGHT);

  // Проверка коллизий
  const checkCollision = (x: number, y: number): boolean => {
    if (!collisionContextRef.current || !maskLoadedRef.current) {
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
      
      const shadowCenterWorldX = GAME_WIDTH / 2;
      const shadowCenterWorldY = GAME_HEIGHT / 2 + characterHeight / 2 - 10;
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
        maskLoadedRef.current = true;
      };
      maskImage.src = '/assets/images/background_mask.png';
    };

    const bgImage = new Image();
    bgImage.onload = () => {
      backgroundSizeRef.current = {
        width: bgImage.naturalWidth,
        height: bgImage.naturalHeight
      };
      loadMask();
    };
    bgImage.src = '/assets/images/background.png';
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'd', 'a', 's', 'w', 'в', 'ы', 'ф', 'ц'].includes(event.key)) {
        event.preventDefault();
      }
      
      switch (event.key.toLowerCase()) {
        case 'arrowright':
        case 'd':
        case 'в':
          keys.current.d = true;
          setFacingDirection('right');
          break;
        case 'arrowleft':
        case 'a':
        case 'ф':
          keys.current.a = true;
          setFacingDirection('left');
          break;
        case 'arrowdown':
        case 's':
        case 'ы':
          keys.current.s = true;
          keys.current.w = false;
          break;
        case 'arrowup':
        case 'w':
        case 'ц':
          keys.current.w = true;
          keys.current.s = false;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'arrowright':
        case 'd':
        case 'в':
          keys.current.d = false;
          break;
        case 'arrowleft':
        case 'a':
        case 'ф':
          keys.current.a = false;
          break;
        case 'arrowdown':
        case 's':
        case 'ы':
          keys.current.s = false;
          break;
        case 'arrowup':
        case 'w':
        case 'ц':
          keys.current.w = false;
          break;
        default:
          break;
      }
    };

    const gameLoop = () => {
      if (!gameLoopRunning.current) return;
      
      setPosition(prev => {
        let targetVelocityX = 0;
        let targetVelocityY = 0;
        
        if (keys.current.d) targetVelocityX = -maxSpeed;
        if (keys.current.a) targetVelocityX = maxSpeed;
        if (keys.current.s) targetVelocityY = -maxSpeed;
        if (keys.current.w) targetVelocityY = maxSpeed;

        // Плавное ускорение по горизонтали
        if (targetVelocityX !== 0) {
          if (Math.abs(velocity.current.x) < Math.abs(targetVelocityX)) {
            velocity.current.x += Math.sign(targetVelocityX) * acceleration;
          }
        } else {
          if (velocity.current.x > 0) {
            velocity.current.x = Math.max(0, velocity.current.x - deceleration);
          } else if (velocity.current.x < 0) {
            velocity.current.x = Math.min(0, velocity.current.x + deceleration);
          }
        }

        // Плавное ускорение по вертикали
        if (targetVelocityY !== 0) {
          if (Math.abs(velocity.current.y) < Math.abs(targetVelocityY)) {
            velocity.current.y += Math.sign(targetVelocityY) * acceleration;
          }
        } else {
          if (velocity.current.y > 0) {
            velocity.current.y = Math.max(0, velocity.current.y - deceleration);
          } else if (velocity.current.y < 0) {
            velocity.current.y = Math.min(0, velocity.current.y + deceleration);
          }
        }
        
        velocity.current.x = Math.max(-maxSpeed, Math.min(maxSpeed, velocity.current.x));
        velocity.current.y = Math.max(-maxSpeed, Math.min(maxSpeed, velocity.current.y));

        let newX = prev.x;
        let newY = prev.y;

        // Проверка коллизий по горизонтали
        if (velocity.current.x !== 0) {
          const step = Math.sign(velocity.current.x);
          let testX = prev.x;
          for (let i = 0; i < Math.abs(velocity.current.x); i++) {
            testX += step;
            if (checkCollision(testX, prev.y)) {
              testX -= step;
              velocity.current.x = 0;
              break;
            }
          }
          newX = testX;
        }

        // Проверка коллизий по вертикали
        if (velocity.current.y !== 0) {
          const step = Math.sign(velocity.current.y);
          let testY = prev.y;
          for (let i = 0; i < Math.abs(velocity.current.y); i++) {
            testY += step;
            if (checkCollision(newX, testY)) {
              testY -= step;
              velocity.current.y = 0;
              break;
            }
          }
          newY = testY;
        }

        const currentSpeed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
        const targetZoom = baseZoom + (currentSpeed / maxSpeed) * (maxZoom - baseZoom);        
        setCameraZoom(prevZoom => {
          const zoomDiff = targetZoom - prevZoom;
          return prevZoom + zoomDiff * zoomSpeed;
        });
        
        const isMoving = Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1;
        setIsWalking(isMoving);
        
        return { x: newX, y: newY };
      });
      
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRunning.current = true;
    animationFrameId.current = requestAnimationFrame(gameLoop);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      gameLoopRunning.current = false;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      
      if (walkAnimationTimer.current) {
        clearInterval(walkAnimationTimer.current);
        walkAnimationTimer.current = null;
      }
    };
  }, []);

  // Анимация ходьбы
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
        walkAnimationTimer.current = null;
      }
    };
  }, [isWalking]);

  const getCurrentImage = () => {
    if (!isWalking) {
      return `/assets/images/walk_animation/static.png`;
    }
    const frameIndex = frames[currentFrame];
    return `/assets/images/walk_animation/${frameIndex}.png`;
  };

  const combinedScale = scale * cameraZoom;

  return (
    <div ref={containerRef} className="game-container">
      <div 
        className="game-world"
        style={{
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
          transform: `scale(${combinedScale})`
        }}
      >
        <img
          src="/assets/images/background.png"
          alt="game background"
          className="background-image"
          style={{
            top: position.y,
            left: position.x
          }}
        />

        <div className="character-container">
          <div className="character-shadow" />
          <img
            src={getCurrentImage()}
            alt="character"
            className={`character ${facingDirection === 'left' ? 'character-facing-left' : 'character-facing-right'}`}
            style={{
              width: `${characterWidth}px`,
              height: `${characterHeight}px`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
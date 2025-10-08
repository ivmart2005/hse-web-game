import { useEffect, useRef } from 'react';
import type { Position, Velocity, Keys } from '../../types';
import { PHYSICS, GAME_CONFIG } from '../../constants';

interface GameLoopProps {
  keys: Keys;
  onUpdate: (position: Position, velocity: Velocity, isMoving: boolean) => void;
  checkCollision: (x: number, y: number) => boolean;
}

export const useGameLoop = ({ keys, onUpdate, checkCollision }: GameLoopProps) => {
  const animationFrameId = useRef<number | null>(null);
  const gameLoopRunning = useRef(false);
  const velocity = useRef<Velocity>({ x: 0, y: 0 });
  const position = useRef<Position>({ 
    x: GAME_CONFIG.BACKGROUND.INITIAL_X, 
    y: GAME_CONFIG.BACKGROUND.INITIAL_Y 
  });

  useEffect(() => {
    const gameLoop = () => {
      if (!gameLoopRunning.current) return;

      let targetVelocityX = 0;
      let targetVelocityY = 0;
      
      if (keys.d) targetVelocityX = -PHYSICS.MAX_SPEED;
      if (keys.a) targetVelocityX = PHYSICS.MAX_SPEED;
      if (keys.s) targetVelocityY = -PHYSICS.MAX_SPEED;
      if (keys.w) targetVelocityY = PHYSICS.MAX_SPEED;

      if (targetVelocityX !== 0) {
        if (Math.abs(velocity.current.x) < Math.abs(targetVelocityX)) {
          velocity.current.x += Math.sign(targetVelocityX) * PHYSICS.ACCELERATION;
        }
      } else {
        if (velocity.current.x > 0) {
          velocity.current.x = Math.max(0, velocity.current.x - PHYSICS.DECELERATION);
        } else if (velocity.current.x < 0) {
          velocity.current.x = Math.min(0, velocity.current.x + PHYSICS.DECELERATION);
        }
      }

      if (targetVelocityY !== 0) {
        if (Math.abs(velocity.current.y) < Math.abs(targetVelocityY)) {
          velocity.current.y += Math.sign(targetVelocityY) * PHYSICS.ACCELERATION;
        }
      } else {
        if (velocity.current.y > 0) {
          velocity.current.y = Math.max(0, velocity.current.y - PHYSICS.DECELERATION);
        } else if (velocity.current.y < 0) {
          velocity.current.y = Math.min(0, velocity.current.y + PHYSICS.DECELERATION);
        }
      }
      
      velocity.current.x = Math.max(-PHYSICS.MAX_SPEED, Math.min(PHYSICS.MAX_SPEED, velocity.current.x));
      velocity.current.y = Math.max(-PHYSICS.MAX_SPEED, Math.min(PHYSICS.MAX_SPEED, velocity.current.y));

      let newX = position.current.x;
      let newY = position.current.y;

      if (velocity.current.x !== 0) {
        const step = Math.sign(velocity.current.x);
        let testX = position.current.x;
        for (let i = 0; i < Math.abs(velocity.current.x); i++) {
          testX += step;
          if (checkCollision(testX, position.current.y)) {
            testX -= step;
            velocity.current.x = 0;
            break;
          }
        }
        newX = testX;
      }

      if (velocity.current.y !== 0) {
        const step = Math.sign(velocity.current.y);
        let testY = position.current.y;
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

      position.current = { x: newX, y: newY };
      const isMoving = Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1;
      
      onUpdate({ x: newX, y: newY }, velocity.current, isMoving);

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRunning.current = true;
    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      gameLoopRunning.current = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [keys, onUpdate, checkCollision]);

  return { velocity: velocity.current };
};
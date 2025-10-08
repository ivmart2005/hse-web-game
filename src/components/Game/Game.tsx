import React, { useState } from 'react';
import { useGameScale, useKeyboardControls, useCollisionSystem, useAnimation, useCamera, useGameLoop } from '../../hooks';
import { GAME_CONFIG, ASSET_PATHS } from '../../constants';
import type { Position } from '../../types';
import './Game.css';

const Game: React.FC = () => {
  const [position, setPosition] = useState<Position>({
    x: GAME_CONFIG.BACKGROUND.INITIAL_X,
    y: GAME_CONFIG.BACKGROUND.INITIAL_Y
  });
  const [isWalking, setIsWalking] = useState(false);

  const { scale, containerRef } = useGameScale();
  const { keys, direction } = useKeyboardControls();
  const { checkCollision, isLoaded } = useCollisionSystem();
  const { currentFrame } = useAnimation(isWalking);
  const { zoom, updateCamera } = useCamera();

  const handleGameUpdate = (newPosition: Position, velocity: { x: number; y: number }, isMoving: boolean) => {
    setPosition(newPosition);
    setIsWalking(isMoving);
    updateCamera(velocity);
  };

  useGameLoop({
    keys,
    onUpdate: handleGameUpdate,
    checkCollision: isLoaded ? checkCollision : () => false
  });

  const getCurrentImage = () => {
    if (!isWalking) {
      return ASSET_PATHS.CHARACTER.STATIC;
    }
    return ASSET_PATHS.CHARACTER.FRAME(currentFrame);
  };

  const combinedScale = scale * zoom;

  return (
    <div ref={containerRef} className="game-container">
      <div 
        className="game-world"
        style={{
          width: `${GAME_CONFIG.WIDTH}px`,
          height: `${GAME_CONFIG.HEIGHT}px`,
          transform: `scale(${combinedScale})`
        }}
      >
        {/* фон */}
        <img
          src={ASSET_PATHS.BACKGROUND}
          alt="game background"
          className="background-image"
          style={{
            top: position.y,
            left: position.x
          }}
        />
        {/* персонаж с анимацией и тенью */}
        <div className="character-container">
          {/* тень */}
          <div className="character-shadow" />
          {/* персонаж */}
          <img
            src={getCurrentImage()}
            alt="character"
            className={`character ${direction === 'left' ? 'character-facing-left' : 'character-facing-right'}`}
            style={{
              width: `${GAME_CONFIG.CHARACTER.WIDTH}px`,
              height: `${GAME_CONFIG.CHARACTER.HEIGHT}px`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
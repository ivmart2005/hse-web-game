// components/Character/Character.tsx
import React, { useRef, useEffect } from 'react'; // ← ДОБАВЬ ЭТУ СТРОКУ
import { useKeyboardControls } from '../../hooks';
import { useGame } from '../../contexts/GameContext';
import { useSpriteManager } from '../../hooks/useSpriteManager';
import { useAnimation } from '../../hooks';
import { GAME_CONFIG } from '../../constants';
import './Character.css';

const Character: React.FC = () => {
  const { direction } = useKeyboardControls();
  const { gameState } = useGame();
  const { currentFrame } = useAnimation(gameState.isWalking);
  const { loaded, loadingProgress, getStaticSprite, getWalkSprite } = useSpriteManager();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!loaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const sprite = gameState.isWalking 
      ? getWalkSprite(currentFrame)
      : getStaticSprite();

    if (sprite) {
      ctx.drawImage(sprite, 0, 0, canvas.width, canvas.height);
    }
  }, [loaded, gameState.isWalking, currentFrame, getStaticSprite, getWalkSprite]);

  if (!loaded) {
    return (
      <div className="character-loading">
        Loading sprites: {Math.round(loadingProgress)}%
      </div>
    );
  }

  return (
    <div className="character-container">
      <div className="character-shadow" />
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CHARACTER.WIDTH}
        height={GAME_CONFIG.CHARACTER.HEIGHT}
        className={`character ${direction === 'left' ? 'character-facing-left' : 'character-facing-right'}`}
      />
    </div>
  );
};

export default Character;
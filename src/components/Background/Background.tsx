import { useCollisionSystem, useGameLoop } from '../../hooks';
import { useGame } from '../../contexts/GameContext';
import { ASSET_PATHS } from '../../constants';
import type { Position } from '../../types';
import './Background.css';

const Background: React.FC = () => {
  const { gameState, setGameState } = useGame();
  const { checkCollision, isLoaded } = useCollisionSystem();

  const handleGameUpdate = (newPosition: Position, _velocity: { x: number; y: number }, isMoving: boolean) => {
    setGameState(prev => ({
      ...prev,
      position: newPosition,
      isWalking: isMoving
    }));
  };

  useGameLoop({
    keys: gameState.keys,
    onUpdate: handleGameUpdate,
    checkCollision: isLoaded ? checkCollision : () => false
  });

  return (
    <img
      src={ASSET_PATHS.BACKGROUND}
      alt="game background"
      className="background-image"
      style={{
        top: gameState.position.y,
        left: gameState.position.x
      }}
    />
  );
};

export default Background;
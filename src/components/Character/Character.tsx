import { useKeyboardControls, useAnimation } from '../../hooks';
import { useGame } from '../../contexts/GameContext';
import { GAME_CONFIG, ASSET_PATHS } from '../../constants';
import './Character.css';

const Character: React.FC = () => {
  const { direction } = useKeyboardControls();
  const { gameState } = useGame();
  const { currentFrame } = useAnimation(gameState.isWalking);

  const getCurrentImage = () => {
    if (!gameState.isWalking) {
      return ASSET_PATHS.CHARACTER.STATIC;
    }
    return ASSET_PATHS.CHARACTER.FRAME(currentFrame);
  };

  return (
    <div className="character-container">
      <div className="character-shadow" />
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
  );
};

export default Character;